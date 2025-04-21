import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile as GoogleProfile,
} from "passport-google-oauth20";
import {
  Strategy as FacebookStrategy,
  Profile as FacebookProfile,
} from "passport-facebook";
import User from "../models/User";

// =======================
// Google OAuth Strategy
// =======================
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!, // ✅ updated here
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: GoogleProfile,
      done: Function
    ) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("No email found in Google profile"));

        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return done(null, existingUser);
        }

        const googlePhoto = profile.photos?.[0]?.value;
        const isValidPhoto = googlePhoto && googlePhoto.startsWith("http");

        const newUser = new User({
          email,
          firstName: profile.name?.givenName || "",
          lastName: profile.name?.familyName || "",
          profilePicture: isValidPhoto
            ? googlePhoto
            : "https://res.cloudinary.com/dqdix32m5/image/upload/v1744499838/user_v0drnu.png",
          role: "user",
          password: "", // Social login
        });

        await newUser.save();
        done(null, newUser);
      } catch (err) {
        console.error("Google OAuth error:", err);
        done(err, undefined);
      }
    }
  )
);

// =======================
// Facebook OAuth Strategy
// =======================
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      callbackURL: "/auth/facebook/callback",
      profileFields: ["id", "emails", "name", "picture.type(large)"], // ✅ ask for email
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: FacebookProfile,
      done: Function
    ) => {
      try {
        const email = profile.emails?.[0]?.value;
        const fallbackEmail = `fb_${profile.id}@noemail.local`;
        const userEmail = email || fallbackEmail;

        let user = await User.findOne({ email: userEmail });
        if (user) {
          return done(null, user);
        }

        const fbPhoto = profile.photos?.[0]?.value;
        const isValidPhoto = fbPhoto && fbPhoto.startsWith("http");

        user = new User({
          email: userEmail,
          firstName: profile.name?.givenName || "User",
          lastName: profile.name?.familyName || "",
          profilePicture: isValidPhoto
            ? fbPhoto
            : "https://res.cloudinary.com/dqdix32m5/image/upload/v1744499838/user_v0drnu.png",
          role: "user",
          password: "", // Social login
        });

        await user.save();
        done(null, user);
      } catch (err) {
        console.error("Facebook OAuth error:", err);
        done(err, undefined);
      }
    }
  )
);
