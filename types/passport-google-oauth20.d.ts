declare module "passport-google-oauth20" {
  import { Request } from "express";
  import passport = require("passport");

  export interface Profile {
    id: string;
    displayName: string;
    name?: {
      familyName: string;
      givenName: string;
    };
    emails?: Array<{ value: string }>;
    photos?: Array<{ value: string }>;
    provider: string;
    _json?: any;
  }

  export interface StrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
  }

  export interface VerifyCallback {
    (error: any, user?: any, info?: any): void;
  }

  export class Strategy extends passport.Strategy {
    constructor(
      options: StrategyOptions,
      verify: (
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback
      ) => void
    );
  }
}
