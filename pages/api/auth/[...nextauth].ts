import {NextApiHandler} from 'next'
import NextAuth, {NextAuthOptions, User} from 'next-auth'
import Providers from 'next-auth/providers'
import { dbConnect } from 'src/utils';
import { UserModel } from 'src/models';

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options)
export default authHandler

const options: NextAuthOptions = {
  providers: [
    Providers.Credentials({
      name: 'Credentials',
      credentials: {
        email: {label: "Email", type: "email"},
        password: {label: "Password", type: "password"}
      },
      async authorize(credentials: Record<'email' | 'password', string>, req) {
        await dbConnect();
        let x = UserModel.findOne({email: credentials.email});
        console.log(x);
        const user: User = {
          name: "Nauman Umer",
          email: "nmanumr@gmail.com",
          image: "https://avatars.githubusercontent.com/u/19629102?v=4"
        }
        if (user) {
          // Any user object returned here will be saved in the JSON Web Token
          return user
        } else {
          return null
        }
      }
    })
  ],
  session: {
    jwt: true,
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
