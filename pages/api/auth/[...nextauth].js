import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import BattleNetProvider from "next-auth/providers/battlenet"
export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        BattleNetProvider({
            clientId: process.env.BATTLE_NET_CLIENT_ID,
            clientSecret: process.env.BATTLE_NET_CLIENT_SECRET,
            issuer: "https://us.battle.net/oauth",
        }),
    ],
    pages:{
        signIn: "/interactions",
    },
    secret: process.env.SECRET_KEY,
})
