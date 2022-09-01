/** @format */

import React, { useRef } from "react"
import { useStateValue } from "../../StateProvider"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlay } from "@fortawesome/free-solid-svg-icons"
import "./Song.css"
import { gsap } from "gsap"
import { Expo } from "gsap/dist/gsap"

const Song = ({ song }) => {
	const [state, dispatch] = useStateValue()
	let play = useRef(null)

	const handleClick = () => {
		dispatch({ type: "SET_PLAYING_SONG", item: [song.uri] })
	}

	const handleHover = () => {
		gsap.to(play, 0.2, {
			opacity: 1,
			ease: Expo.easeInOut,
		})
	}
	const handleLeave = () => {
		gsap.to(play, 0.2, {
			opacity: 0,
			ease: Expo.easeInOut,
		})
	}
	if(!song.icon || !song.name || !song.artist || !song.uri){
		return (<></>)
	}
	else return (
		<div className='s  ' onMouseLeave={(e) => handleLeave()} onMouseOver={(e) => handleHover()} onClick={(e) => handleClick()}>
			<div className='play' ref={(el) => (play = el)}>
				<FontAwesomeIcon icon={faPlay} />
			</div>
			<div className={`s_container ${state.playingSong !== null && state.playingSong[0] === song.uri && "active"}`}>
				<div className='s_cover'></div>
				<img src={song.icon} alt='' />

				<div className='s_name'>{song.name.length > 25 ? song.name.substr(0, 25) + "..." : song.name}</div>
				<div className='s_artist'>{song.artist}</div>
			</div>
		</div>
	)
}

export default Song
