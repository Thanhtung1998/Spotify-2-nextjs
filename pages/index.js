import Head from 'next/head'
import Sidebar from '../components/SideBar'
import Center from '../components/Center'
import { getSession } from 'next-auth/react'
import Player from '../components/Player'

export default function Home() {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <Head>
        <title>Spotify 2</title>
      </Head>

      <main className="flex">
        {/* Sidebar */}
        <Sidebar></Sidebar>
        {/* Center */}
        <Center></Center>
      </main>

      <div className="sticky bottom-0">
        {/* Player */}
        <Player></Player>
      </div>

    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)

  return {
    props: {
      session,
    }
  }

}