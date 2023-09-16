/** @format */

import React from "react"
import { useStateValue } from "../../StateProvider"
import "./FavouriteSong.css"

const FavouriteSong = ({ song }) => {
	const [state, dispatch] = useStateValue()

	const time = Math.floor(song.duration / 1000)
	const minutes = Math.floor(time / 60)
	let seconds = time - minutes * 60

	if (seconds < 10) {
		seconds = "0" + String(seconds)
	}

	const handleClick = () => {
		dispatch({ type: "SET_PLAYING_SONG", item: [song.uri] })
	}

	if(!song.uri || !song.icon || !song.album.name || !song.name || !song.duration) return (<></>);

	else return (
		<div className={`f ${state.playingSong !== null && state.playingSong[0] === song.uri && "active"}`} onClick={(e) => handleClick()}>
			<div className='f_name'>
				<div className='f_image'>
					<img src={song.icon} alt='' />
				</div>
				<div className='f_info'>
					<div className='f_fname'>{song.name?.length > 25 ? song.name.substr(0, 25) + "..." : song.name}</div>
					<div className='f_artist'>{song.artist}</div>
				</div>
			</div>
			<div className='f_album'>{song.album.name?.length > 15 ? song.album.name.substr(0, 15) + "..." : song.album.name}</div>
			<div className='f_duration'>
				{minutes}:{seconds}
			</div>
		</div>
	)
}

export default FavouriteSong
