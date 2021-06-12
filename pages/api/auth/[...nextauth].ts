import {NextApiHandler} from 'next'
import NextAuth, {NextAuthOptions} from 'next-auth'
import Providers from 'next-auth/providers'
import {dbConnect} from 'src/utils';
import {UserModel} from 'models';

const options: NextAuthOptions = {
  providers: [
    Providers.Credentials({
      name: 'Credentials',
      credentials: {
        email: {label: "Email", type: "email"},
        password: {label: "Password", type: "password"}
      },
      async authorize(credentials: Record<'username' | 'password', string>, req) {
        await dbConnect();
        let user = await UserModel.findOne({email: credentials.username});
        if (user && await user.validatePassword(credentials.password)) {
          return user.getExposable();
        }

        return null;
      }
    })
  ],
  session: {
    jwt: true,
  },
  pages: {
    signIn: '/auth/signin',
    newUser: '/auth/signup',
  },
  jwt: {
    signingKey: JSON.stringify({}),
    verificationOptions: {
      algorithms: ["HS512"]
    }
  },
  secret: process.env.SECRET,
}

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options)
export default authHandler
