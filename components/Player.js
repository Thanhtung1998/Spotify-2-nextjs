import { useSession } from 'next-auth/react'
import useSpotify from '../hooks/useSpotify'
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom'
import { useRecoilState } from 'recoil'
import useSongInfo from '../hooks/useSongInfo'
import { useState, useEffect, useCallback } from 'react'
import { HeartIcon, VolumeUpIcon as VolumeDownIcon, } from '@heroicons/react/outline'
import { PauseIcon, PlayIcon, ReplyIcon, VolumeUpIcon, FastForwardIcon, RewindIcon, SwitchHorizontalIcon } from "@heroicons/react/solid"
import { debounce } from 'lodash'

function Player() {

    const spotifyApi = useSpotify();
    const { data: session, status } = useSession();
    // const currentTrackId = useRecoilValue(currentTrackIdState)

    // const isPlaying = useRecoilValue(isPlayingState)
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);

    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

    const [volume, setVolume] = useState(50);

    const songInfo = useSongInfo();

    const fetchCurrentSong = () => {
        if (!songInfo) {
            spotifyApi.getMyCurrentPlayingTrack().then((data) => {
                console.log("Now playing: ", data.body?.item);
                setCurrentTrackId(data.body?.item?.id)
                spotifyApi.getMyCurrentPlaybackState().then((data) => {
                    setIsPlaying(data.body?.is_playing);
                })
            });
        }
    }

    const handlePlayPause = () => {
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
            if (data.body.is_playing) {
                spotifyApi.pause();
                setIsPlaying(false);
            } else {
                spotifyApi.play();
                setIsPlaying(true)
            }
        })
    }

    useEffect(() => {

        if (spotifyApi.getAccessToken() && !currentTrackId) {
            // fetch the song info
            fetchCurrentSong();
            setVolume(50);
        }

    }, [currentTrackId, spotifyApi, session])

    useEffect(() => {
        if (volume > 0 && volume < 100) {
            debounceAdjustVolume(volume)
        }
    }, [volume])

    const debounceAdjustVolume = useCallback(
        debounce((volume) => {
            spotifyApi.setVolume(volume).catch((err) => { });;
        }, 500)
        , [])

    return (
        <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
            {/* Left */}
            <div className="flex items-center space-x-4">
                <img className="w-10 h-10 hidden md:inline" src={songInfo?.album?.images?.[0]?.url} alt="" />
                <h3>{songInfo?.name}</h3>
                <p>{songInfo?.artists?.[0]?.name}</p>
            </div>
            {/* Center */}

            <div className="flex items-center justify-evenly">
                <SwitchHorizontalIcon className="button" />
                <RewindIcon className="button"
                // onClick={() => } 
                />

                {
                    isPlaying ? (
                        <PauseIcon
                            onClick={handlePlayPause} className="button w-10 h-10"></PauseIcon>
                    ) : (
                        <PlayIcon
                            onClick={handlePlayPause} className="button w-10 h-10"></PlayIcon>
                    )
                }

                <FastForwardIcon className="button" />

                <ReplyIcon className="button" />
            </div>

            {/* Right */}

            <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
                <VolumeDownIcon className="button" onClick={() => volume > 0 && setVolume(volume - 10)} />
                <input className="w-14 md:w-28" onChange={e => setVolume(Number(e.target.value))} type="range" value={volume} min={0} max={100} />
                <VolumeUpIcon className="button" onClick={() => volume < 100 && setVolume(volume + 10)} />
            </div>

        </div>
    )
}

export default Player
