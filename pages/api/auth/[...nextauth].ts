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
    signingKey: JSON.stringify({
      kty: 'oct',
      kid: 'cf_nboSy_GtPJTrd3SmbomMI5bxRXirYF3MMwvHhr-0',
      alg: 'HS512',
      k: 'gt3zE3JqG9Jy1pPdC8fofOp2Mhfzi8u586Jp1Zqq15AHhVRwJd9-ZFOgHDQtMJkMP3Jl79zRp-vgg_uuGxUMHA'
    }),
    verificationOptions: {
      algorithms: ["HS512"]
    }
  },
  secret: process.env.SECRET,
}

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options)
export default authHandler
