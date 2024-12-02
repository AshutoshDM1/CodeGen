import { User } from "@prisma/client";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user?: {
      id: number;
      email: string;
      name: string;
      password: string;
      createdAt: Date;
    };
  }
}
