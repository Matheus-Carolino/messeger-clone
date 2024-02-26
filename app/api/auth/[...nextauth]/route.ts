import NextAuth from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }