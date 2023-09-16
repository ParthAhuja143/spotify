/** @format */

import React from "react"
import { useStateValue } from "../../StateProvider"
import "./SearchSong.css"

const SearchSong = ({ song }) => {
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

	if(!song.icon || !song.name || !song.artist){
		return (<></>)
	}

	else return (
		<div className='searchSong' onClick={(e) => handleClick()}>
			<div className='searchSong_name'>
				<div className='searchSong_image'>
					<img src={song.icon} alt='' />
				</div>
				<div className='searchSong_info'>
					<div className='searchSong_fname'>{song.name.length > 25 ? song.name.substr(0, 25) + "..." : song.name}</div>
					<div className='searchSong_artist'>{song.artist}</div>
				</div>
			</div>
			<div className='searchSong_duration'>
				{minutes}:{seconds}
			</div>
		</div>
	)
}

export default SearchSong
