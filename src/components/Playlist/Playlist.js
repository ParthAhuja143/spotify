/** @format */

import React from "react"
import "./Playlist.css"

const Playlist = ({ playlist }) => {
	if(!playlist.name || !playlist.icon || !playlist.id){
		return (<></>)
	}
	else return (
		<div className='playlist' onClick={(event) => (window.location = `/playlist/${playlist.id}`)}>
			<div className='playlist_container'>
				<img src={playlist.icon} alt='' />
				<div className='playlist_name'>{playlist.name.length > 25 ? playlist.name.substr(0, 25) + "..." : playlist.name}</div>
			</div>
		</div>
	)
}

export default Playlist
