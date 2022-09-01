/** @format */

import React, { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBookOpen, faClipboard, faHome, faMoneyBill, faSearch } from "@fortawesome/free-solid-svg-icons"
import SpotifyWebApi from "spotify-web-api-node"
import "./RightPanel.css"
import { useStateValue } from "../../StateProvider"

const spotifyApi = new SpotifyWebApi({
	clientId: "39c8b3f6751d4bc2a052c0f7309949a4",
})

const RightPanel = () => {
	const [myPlaylists, setMyPlaylists] = useState([])
	const [state, dispatch] = useStateValue()

	useEffect(() => {
		spotifyApi.getUserPlaylists(state.user.id).then((res) =>
			setMyPlaylists(
				res.body.items.map((item) => {
					return { name: item.name, icon: item.images[0].url, id: item.id, total: item.tracks.total }
				})
			)
		)
	}, [])

	return (
		<div className='sidebar'>
			<div className='sidebarContainer'>
				<div className='sidebar_options'>
					<div className='sidebar_option'>
						<FontAwesomeIcon icon={faHome} />
						<div>Home</div>
					</div>
					<div className='sidebar_option'>
						<FontAwesomeIcon icon={faSearch} />
						<div>Search</div>
					</div>
					<div className='sidebar_option'>
						<FontAwesomeIcon icon={faBookOpen} />
						<div>Your Library</div>
					</div>
				</div>
				<div className='sidebar_options' style={{ marginTop: "30px" }}>
					{myPlaylists.map((playlist) => {
						if(!playlist.name || !playlist.icon){
							return (<></>)
						}
						return (
						<div className='sidebar_option'>
							<div className='sidebar_img' style={{ margin: "0px" }}>
								<img src={playlist.icon} />
							</div>
							<div>{playlist.name.length > 10 ? playlist.name.substr(0, 9) + "..." : playlist.name}</div>
						</div>
					)})}
				</div>
			</div>
		</div>
	)
}

export default RightPanel
