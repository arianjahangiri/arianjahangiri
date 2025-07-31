import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import Otp from "@/app/modls/Otp/Otp";
import users from "@/app/modls/User/users";
import connect from "@/app/utils/db";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { label: "Phone", type: "text" },
        code: { label: "OTP", type: "text" },
        // اگر بخوای میتونی اینجا ایمیل هم اضافه کنی اما ورود با ایمیل و OTP باید سمت کلاینت باشه
        // email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        await connect();
        const { phone, code } = credentials;

        const otp = await Otp.findOne({ phone, code });
        if (!otp || otp.expiresAt < new Date()) {
          throw new Error("کد نا معتبر است یا منقضی شده است");
          
        }

        const user = await users.findOne({ phone });
        if (!user) {
          throw new Error("کاربر یافت نشد");
        }

        await Otp.deleteOne({ _id: otp._id });

        return {
          id: user._id.toString(),
          phone: user.phone,
          email: user.email,           // اضافه شده
          name: user.name,
          Image_profile: user.Image_profile,
          isAdmin: user.isAdmin,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.phone = user.phone;
        token.email = user.email;               // اضافه شده
        token.isAdmin = user.isAdmin;
        token.Image_profile = user.Image_profile;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id,
        name: token.name,
        phone: token.phone,
        email: token.email,                   // اضافه شده
        isAdmin: token.isAdmin,
        Image_profile: token.Image_profile,
      };
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
