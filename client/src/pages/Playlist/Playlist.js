/** @format */

import axios from "axios"
import React, { useEffect, useRef, useState } from "react"
import "./Playlist.css"
import spotifyApi from "../../Spotify/spotify-api.js"
import { useStateValue } from "../../StateProvider"
import Loading from "../../components/Loading/Loading"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faBookOpen, faDoorOpen, faHome, faLongArrowAltLeft, faPlay, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons"
import FavouriteSong from "../../components/FavouriteSong/FavouriteSong"
import gsap from "gsap/gsap-core"
import { Expo } from "gsap/gsap-core"

const Playlist = (props) => {
	const playlistId = props.match.params.playlistId
	let sideMenu = useRef(null)
	let play = useRef(null)

	const [state, dispatch] = useStateValue()
	console.log(state)
	const [show, setShow] = useState(false)
	const [fetchUserPlaylist, setFetchUserPlaylist] = useState(false)
	const [myPlaylists, setMyPlaylists] = useState(false)
	const [fetch, setFetch] = useState(false)
	const [accessToken, setAccessToken] = useState(null)
	const [refreshToken, setRefreshToken] = useState(null)
	const [expiresIn, setExpiresIn] = useState(null)
	const [loading, setLoading] = useState(true)
	const [playlistMetaData, setPlaylistMetaData] = useState({
		playlistImage: null,
		playlistName: null,
		playlistOwner: null,
		playlistFollowers: null,
		playlistDescription: null,
		playlistType: null,
	})
	const [playlistSongData, setPlaylistSongData] = useState([])

	useEffect(() => {
		window.addEventListener("scroll", () => {
			if (window.scrollY > 20) {
				setShow(true)
			} else {
				setShow(false)
			}
		})

		return () => {
			window.removeEventListener("scroll", () => () => {
				if (window.scrollY > 20) {
					setShow(true)
				} else {
					setShow(false)
				}
			})
		}
	}, [])

	useEffect(() => {
		if (localStorage.getItem("accessToken")) {
			spotifyApi.setAccessToken(localStorage.getItem("accessToken"))
			setFetch(true)
		}

		if (fetch) {
			spotifyApi
				.getMe()
				.then((res) => {
					dispatch({ type: "SET_USER", item: res.body })
					setFetchUserPlaylist(true)
				})
				.catch((err) => {
					console.log(err.message)
					const sentence = ["Invalid access token","The access token expired"];
					for(let i = 0 ; i < sentence.length ; i++){
						if(err.message.includes(sentence[i])){
							localStorage.removeItem("accessToken")
							window.location.replace("/login")	
							break;
						}
					}
				})

			spotifyApi.getPlaylist(playlistId).then((res) => {
				console.log(res)
				setPlaylistMetaData({
					playlistImage: res.body.images[0].url,
					playlistName: res.body.name,
					playlistOwner: res.body.owner.display_name,
					playlistFollowers: res.body.followers.total,
					playlistDescription: res.body.description,
					playlistType: res.body.type,
					playlistTotal: res.body.tracks.total,
				})

				setPlaylistSongData(
					res.body.tracks.items.map((track) => {
						return {
							album: {
								id: track?.track?.id,
								name: track?.track?.album?.name,
							},
							artist: track?.track?.artists[0]?.name,
							name: track?.track?.name,
							uri: track?.track?.uri,
							icon: track?.track?.album?.images[1]?.url,
							id: track?.track?.id,
							preview_url: track?.track?.preview_url,
							duration: track?.track?.duration_ms,
						}
					})
				)
			})
		}
	}, [fetch])

	useEffect(() => {
		if (fetchUserPlaylist) {
			spotifyApi
				.getUserPlaylists(state.user.id)
				.then((res) => {
					setMyPlaylists(
						res.body.items.map((playlist) => {
							return {
								name: playlist?.name,
								icon: playlist?.images[0]?.url,
								total: playlist?.tracks?.total,
								id: playlist?.id,
							}
						})
					)
					setLoading(false)
				})
				.catch((err) => {
					console.log(err.message)
					const sentence = ["Invalid access token","The access token expired"];
					for(let i = 0 ; i < sentence.length ; i++){
						if(err.message.includes(sentence[i])){
							localStorage.removeItem("accessToken")
							window.location.replace("/login")	
							break;
						}
					}
				})
		}
	}, [fetchUserPlaylist])

	useEffect(() => {
		const refreshToken = localStorage.getItem("refreshToken")
		//console.log("State", state)

		const interval = setInterval(() => {
			axios
				.post("https://spotify-serve.herokuapp.com/refresh", {
					refreshToken,
				})
				.then((res) => {
					//console.log(res.data)
					setAccessToken(res.data.accessToken)
					setExpiresIn(res.data.expiresIn)
					localStorage.setItem("accessToken", res.data.accessToken)
					localStorage.setItem("expiresIn", res.data.expiresIn)
					localStorage.setItem("refreshToken", refreshToken)
				})
				.then(() => {
					spotifyApi.setAccessToken(localStorage.getItem("accessToken"))
					setFetch(true)
				})
				.catch((err) => {
					console.log(err.message)
					const sentence = ["Invalid access token","The access token expired"];
					for(let i = 0 ; i < sentence.length ; i++){
						if(err.message.includes(sentence[i])){
							localStorage.removeItem("accessToken")
							window.location.replace("/login")	
							break;
						}
					}
				})
		}, 100 * 1600)

		return () => clearInterval(interval)
	}, [])

	const handleShow = () => {
		gsap.to(sideMenu, 0.25, {
			top: 0,
			opacity: 1,
			visibility: "visible",
			ease: Expo.easeInOut,
		})
	}
	const handleClose = () => {
		gsap.to(sideMenu, 0.25, {
			top: -100,
			opacity: 0,
			visibility: "hidden",
			ease: Expo.easeInOut,
		})
	}

	const handleHover = () => {
		gsap.to(play, 0.5, {
			opacity: 1,
			ease: Expo.easeInOut,
		})
	}
	const handleLeave = () => {
		gsap.to(play, 0.5, {
			opacity: 0.8,
			ease: Expo.easeInOut,
		})
	}

	const handleClick = () => {
		const songstoplay = playlistSongData.map((song) => {
			return song.uri
		})

		console.log(songstoplay)

		dispatch({ type: "SET_PLAYING_SONG", item: songstoplay })
	}

	const handleLogout = () => {
		localStorage.removeItem("accessToken")
		dispatch({ type: "SET_USER", item: null })
		window.location = "/login"
	}

	return (
		<div className='pl'>
			{loading ? (
				<Loading />
			) : (
				<div className='pl_container'>
					<div className='sidebar' ref={(el) => (sideMenu = el)}>
						<div className='sidebarContainer'>
							<div className='cross'>
								<FontAwesomeIcon icon={faTimes} onClick={(e) => handleClose()} />
							</div>
							<div className='sidebar_options'>
								<button className='sidebar_option' onClick={(e) => window.location.replace("/")}>
									<FontAwesomeIcon icon={faHome} />
									<div>Home</div>
								</button>
								<button className='sidebar_option' onClick={(e) => window.location.replace("/search")}>
									<FontAwesomeIcon icon={faSearch} />
									<div>Search</div>
								</button>
								<button className='sidebar_option' onClick={(e) => window.location.replace("/profile")}>
									<FontAwesomeIcon icon={faBookOpen} />
									<div>Your Library</div>
								</button>
							</div>
							<div className='sidebar_options' style={{ marginTop: "30px" }}>
								<div className='line'></div>
								{myPlaylists.map((playlist) => (
									<div className={`sidebar_option ${playlistId === playlist.id && "active"} `} key={playlist.id} onClick={(event) => (window.location = `/playlist/${playlist.id}`)}>
										<div className='sidebar_img' style={{ margin: "0px" }}>
											<img src={playlist.icon} />
										</div>
										<div>{playlist.name?.length > 10 ? playlist.name.substr(0, 9) + "..." : playlist.name}</div>
									</div>
								))}
							</div>

							<div className='sidebar_options'>
								<div className='line'></div>{" "}
								<div className='sidebar_option' onClick={(e) => handleLogout()}>
									<FontAwesomeIcon icon={faDoorOpen} />
									<div>Logout</div>
								</div>
							</div>
						</div>
					</div>
					<div className='main'>
						<div className='main_container'>
							<div className='p_back' onClick={(e) => (window.location = "/")}>
								<FontAwesomeIcon icon={faLongArrowAltLeft} />
							</div>
							<div className={`user ${show ? "background" : "transparent"}`}>
								<div
									className='user_info'
									onClick={(e) => {
										window.location.replace("/profile")
									}}>
									<div className='user_img'>
										<img src={state?.user?.images[0].url} alt='user_img' />
									</div>
									<div className='user_username'>{state.user?.display_name}</div>
								</div>
								<div className='hamburger' onClick={(e) => handleShow()}>
									<FontAwesomeIcon icon={faBars} />
								</div>
							</div>
							<div className='pl_content'>
								<div className='pl_header'>
									<div className='pl_headerContainer'>
										<div className='pl_image' onMouseOver={(e) => handleHover()} onMouseLeave={(e) => handleLeave()}>
											<div className='playList_play' ref={(el) => (play = el)} onClick={(e) => handleClick()}>
												<FontAwesomeIcon icon={faPlay} />
											</div>
											<img src={playlistMetaData.playlistImage} alt='' />
										</div>
										<div className='pl_info'>
											<div className='pl_infoType'>{playlistMetaData.playlistType}</div>
											<div className='pl_infoName'>{playlistMetaData.playlistName}</div>
											<div className='pl_infoOwner'>
												Created by <span>{playlistMetaData.playlistOwner}</span> • {playlistMetaData.playlistFollowers} Followers • {playlistMetaData.playlistTotal} Songs
											</div>
											<div className='pl_infoDescription'>{playlistMetaData.playlistDescription}</div>
										</div>
									</div>
								</div>
								<div className='pl_tracks'>
									{playlistSongData.map((song) => {
										return <FavouriteSong song={song} key={song.id} />
									})}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default Playlist
