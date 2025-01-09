import NextAuth from "next-auth";
import { authOptions } from "./authOptions";

/*
Exports the handler constant as both GET and POST handlers. This means that the same handler will be used to process both GET and POST requests to this API route.
This code sets up an API route for handling authentication using NextAuth, with the configuration specified in authOptions.
*/

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
