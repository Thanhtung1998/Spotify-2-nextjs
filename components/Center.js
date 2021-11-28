import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { shuffle } from 'lodash'
import { useRecoilValue, useRecoilState } from 'recoil'
import { playlistIdState, playlistState } from '../atoms/playlistAtom'
import useSpotify from "../hooks/useSpotify"
import Songs from './Songs'
import { signOut } from 'next-auth/react'

const colors = [
    "from-indigo-500",
    "from-blue-500",
    "from-green-500",
    "from-red-500",
    "from-yellow-500",
    "from-pink-500",
    "from-purple-500",
]

function Center() {
    const spotifyApi = useSpotify();
    const { data: session } = useSession()
    const [color, setColor] = useState(null)
    const playlistId = useRecoilValue(playlistIdState)

    const [playlist, setPlaylist] = useRecoilState(playlistState)
    // console.log(session?.user.image)
    useEffect(() => {
        setColor(shuffle(colors).pop());
    }, [playlistId])

    // console.log(playlistId)

    useEffect(() => {
        spotifyApi.getPlaylist(playlistId).then((data) => {
            setPlaylist(data.body)
        }).catch(error => console.log("Some Thing went wrong!", error))
    }, [spotifyApi, playlistId])

    // console.log(playlist)

    return (
        <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
            <header className="absolute top-5 right-8">
                <div className="flex bg-back text-white items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2" onClick={() => signOut()}>
                    <img className="rounded-full object-cover w-10 h-10" src={session?.user.image} alt="Avatar" />
                    <h2>{session?.user.name}</h2>
                    <ChevronDownIcon className="w-5 h-5"></ChevronDownIcon>
                </div>
            </header>
            <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 p-8 text-white`}>

                <img className="w-44 h-44 shadow-2xl" src={playlist?.images[0]?.url} alt="" />
                <div>
                    <p>PLAYLIST</p>
                    <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">
                        {playlist?.name}
                    </h1>
                </div>
            </section>

            <Songs></Songs>

        </div>
    )
}

export default Center
