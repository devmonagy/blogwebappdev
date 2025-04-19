// types/express/index.d.ts

import { User as AppUser } from "../../server/models/User"; // Adjust if needed

declare global {
  namespace Express {
    interface User {
      _id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
      profilePicture?: string;
    }

    interface Request {
      user?: User;
    }
  }
}
