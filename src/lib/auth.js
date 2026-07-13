import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { openAPI } from "better-auth/plugins"
import mongoose from "mongoose";

export const auth = betterAuth({
  database: mongodbAdapter(mongoose.connection),

  emailAndPassword: {
    enabled: true,
    // requireEmailVerification: false, // set true in production
    password: {
			hash: async (password) => {
				// Custom password hashing not implemented, returning password as is for demonstration purposes
				return password;
			},
			verify: async ({ hash, password }) => {
				// Custom password verification via 
				return hash === password;
			}
		}
  },

  user:{
    additionalFields:{
      role:{
        type: "string",
        required: true,
        defaultValue:"user"
      },
      address:{
        type: "string",
        defaultValue:""
      },
      phone:{
        type: "string",
        defaultValue:""
      },
    }
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,       // 7 days
    updateAge: 60 * 60 * 24,            // refresh if older than 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,                   // cache for 5 minutes
    },
  },

  trustedOrigins: [process.env.FRONTEND_URL],

  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [
        openAPI(), 
    ],
});