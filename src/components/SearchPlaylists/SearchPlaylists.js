/** @format */

import React from "react"
import "./SearchPlaylists.css"
const SearchPlaylists = ({ playlist }) => {
	if(!playlist.id || !playlist.name || !playlist.icon || !playlist.owner){
		return (<></>)
	}
	else return (
		<div className='searchPlaylists' onClick={(event) => (window.location = `/playlist/${playlist.id}`)}>
			<div className='searchPlaylists_container'>
				<div className='searchPlaylists_cover'></div>
				<img src={playlist?.icon} alt='' />
				<div className='searchPlaylists_name'>{playlist?.name?.length > 25 ? playlist?.name.substr(0, 25) + "..." : playlist?.name}</div>
				<div className='searchPlaylists_artist'>{playlist?.owner}</div>
			</div>
		</div>
	)
}

export default SearchPlaylists
