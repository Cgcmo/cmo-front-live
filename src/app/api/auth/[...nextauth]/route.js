// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";

// console.log("✅ Loaded NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
// console.log("✅ Loaded NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET);

// const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//   ],
//   secret: process.env.NEXTAUTH_SECRET,
//   callbacks: {
//     async session({ session, token }) {
//       // ✅ Attach user info to session (optional)
//       session.user.id = token.sub;
//       return session;
//     },
//     async redirect({ url, baseUrl }) {
//       return "/dashboard"; // ✅ Always redirect to Dashboard after login
//     },
//   },
//   debug: true, // ✅ Enable debug mode for better error logs

// };

// export const GET = async (req, ctx) => NextAuth(authOptions)(req, ctx);
// export const POST = async (req, ctx) => NextAuth(authOptions)(req, ctx);


import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/", // ✅ Redirects users to Home if login fails
    signOut: "/", // ✅ Redirects users to Home after logout
    error: "/", // ✅ Redirects users to Home on error
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return "/dashboard"; // ✅ Always redirect to dashboard after login
    },
  },
  debug: true, // ✅ Enable debug mode for better error logs
};

export const GET = async (req, ctx) => NextAuth(authOptions)(req, ctx);
export const POST = async (req, ctx) => NextAuth(authOptions)(req, ctx);
