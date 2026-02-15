import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import CryptAdapter from "@/infra/cryptography/bcrypt";
import { UsersMongoRepository } from "@/infra/db/repositories/mongo/users";

const userMongoRepository = new UsersMongoRepository();
const cripto = new CryptAdapter();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Email e Senha",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Passsword", type: "password" },
      },
      async authorize(credentials): Promise<any> {
        if (!credentials?.email) return null;
        const userDb = await userMongoRepository.getByEmail(credentials.email);
        if (userDb) {
          const isValidPass = cripto.compare(credentials?.password || "", userDb.password);
          if (!isValidPass) return null;
        }
        return userDb;
      },
    }),
    CredentialsProvider({
      id: "webauthn",
      name: "Biometria",
      credentials: {
        email: { label: "Email", type: "email" },
        webauthn: { label: "WebAuthn", type: "text" },
      },
      async authorize(credentials): Promise<any> {
        // WebAuthn verification is handled in the API route
        // This just validates that the user exists and returns it
        if (!credentials?.email || !credentials?.webauthn) return null;
        
        const userDb = await userMongoRepository.getByEmail(credentials.email);
        if (!userDb) return null;
        
        // The webauthn field contains "verified" if authentication was successful
        if (credentials.webauthn === "verified") {
          return userDb;
        }
        
        return null;
      },
    }),
  ],
  session: {
    maxAge: 1 * 60 * 60, // 1 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      user && (token.user = user);
      return token;
    },

    async session({ session, token, trigger, newSession }) {
      session.user = token.user as any;
      if (trigger === "update" && newSession?.name) {
        const userDb = await userMongoRepository.getByEmail(token.email || "");

        return userDb;
      }
      return session;
    },

    async signIn({ user, account, profile, email, credentials }) {
      const isAllowedToSignIn = true;
      if (isAllowedToSignIn) {
        return true;
      } else {
        return false;
      }
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};
export default NextAuth(authOptions);
