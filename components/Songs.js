import React from 'react'
import { useRecoilValue } from 'recoil'
import { playlistState } from '../atoms/playlistAtom'
import Song from './Song'

function Songs() {
    const playlist = useRecoilValue(playlistState)

    return (
        <div className="text-white flex flex-col px-8 space-y-1 pb-28">
            {playlist?.tracks.items.map((track, i) => (
                <Song key={track.track.id} track={track} order={i} />

            ))}
            <p></p>
        </div>
    )
}

export default Songs
