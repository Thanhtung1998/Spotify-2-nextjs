import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import spotifyApi, { LOGIN_URL } from '../../../lib/spotify'

async function refreshAccessToken(token) {

    try {

        spotifyApi.setAccessToken(token.accessToken)
        spotifyApi.setRefreshToken(token.refreshToken)

        const { body: refreshedToken } = await spotifyApi.refreshAccessToken();

        console.log("Refresh token is", refreshedToken)

        return {
            ...token,
            accessToken: refreshedToken.access_token,
            accessTokenExpired: Date.now() + refreshedToken.expires_in * 1000, // 1 hour as 3600 return form spotify API
            refreshToken: refreshedToken.refresh_token ?? token.refreshToken
            // Replace if new one came back elese fall back to old refresh token
        }

    } catch (error) {
        console.log(error)

        return {
            ...token,
            error: "RefreshAccessTokenError"
        }

    }

}

export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        SpotifyProvider({
            clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
            clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
            authorization: LOGIN_URL
        }),
        // ...add more providers here
    ],
    secret: process.env.JWT_SECRET,
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, account, user }) {

            if (account && user) {
                return {
                    ...token,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    username: account.providerAccountId,
                    accessTokenExpired: account.expires_at * 1000, // we are handling expiry times in Milliseconds hence * 1000
                }
            }
            // Return previous token if the access has not expired yet
            if (Date.now() < token.accessTokenExpired) {
                return token;
            }

            // Access token has expired, so we need to refresh it ...

            console.log("Access token has expired. refresh ...")

            return await refreshAccessToken(token)

        },

        async session({ session, token }) {
            session.user.accessToken = token.accessToken;
            session.user.refreshToken = token.refreshToken;
            session.user.username = token.username;

            return session
        }
    },
});