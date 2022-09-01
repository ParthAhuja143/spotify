/** @format */

import React, { useEffect, useState } from "react"
import "./SongPlayer.css"
import SpotifyPlayer from "react-spotify-web-playback"
import { useStateValue } from "../../StateProvider"

const SongPlayer = (props) => {
	const [state, dispatch] = useStateValue()
	const [playSong, setPlaySong] = useState(false)

	useEffect(() => {
		if (!localStorage.getItem("accessToken")) {
			return
		}
		console.log("trackUri", state.playingSong)
		setPlaySong(true)
	}, [props.trackUri, state])

	return (
		<div className='spotifyPlayer'>
			{localStorage.getItem("accessToken") && (
				<SpotifyPlayer
					offset={0}
					callback={(state) => {
						if (!state.isPlaying) {
							setPlaySong(false)
						}
					}}
					play={playSong}
					token={localStorage.getItem("accessToken")}
					showSaveIcon
					styles={{
						sliderTrackBorderRadius: "10px",
						sliderHandleColor: "purple",
						sliderHeight: "5px",
						sliderHandleBorderRadius: "10px",
						activeColor: "orangered",
						sliderColor: "orangered",
						color: "white",
						bgColor: "black",
						trackNameColor: "white",
						loaderColor: "purple",
						loaderSize: "40px",
						errorColor: "red",
						altColor: "purple",
						height: "50px",
					}}
					uris={state.playingSong ? state.playingSong : []}
				/>
			)}
		</div>
	)
}

export default SongPlayer
