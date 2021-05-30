import { NextApiHandler } from 'next'
import NextAuth, {NextAuthOptions, User} from 'next-auth'
import Providers from 'next-auth/providers'
import Adapters from 'next-auth/adapters'
import prisma from '../../../lib/prisma'

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options)
export default authHandler

const options: NextAuthOptions = {
  providers: [
    Providers.Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
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
  pages: {
  },
  adapter: Adapters.Prisma.Adapter({ prisma }),
  secret: process.env.SECRET,
}
