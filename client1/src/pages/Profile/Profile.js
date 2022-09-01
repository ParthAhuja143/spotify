/** @format */

import React, { useEffect, useRef, useState } from "react"
import SpotifyWebApi from "spotify-web-api-node"
import Artist from "../../components/Artist/Artist.js"
import "./Profile.css"
import axios from "axios"
import { useStateValue } from "../../StateProvider"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faBookOpen, faDoorOpen, faHome, faLongArrowAltLeft, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons"
import FavouriteSong from "../../components/FavouriteSong/FavouriteSong"
import Playlist from "../../components/Playlist/Playlist"
import Loading from "../../components/Loading/Loading.js"
import gsap from "gsap"
import { Expo } from "gsap/dist/gsap"

const spotifyApi = new SpotifyWebApi({
	clientId: "39c8b3f6751d4bc2a052c0f7309949a4",
})

const Profile = () => {
	const [state, dispatch] = useStateValue()
	let sideMenu = useRef(null)

	const [fetch, setFetch] = useState(false)
	const [favArtists, setFavArtists] = useState([])
	const [myPlaylists, setMyPlaylists] = useState([])
	const [fetchplaylist, setfetchplaylist] = useState(false)
	const [show, setShow] = useState(false)
	const [myFavSongs, setMyFavSongs] = useState([])
	const [followedArtists, setFollowedArtists] = useState([])
	const [loading, setLoading] = useState(true)

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
		const refreshToken = localStorage.getItem("refreshToken")
		const expiresIn = localStorage.getItem("expiresIn")

		if (!refreshToken && !expiresIn) {
			localStorage.removeItem("accessToken")
			window.location.replace("/login")
		}

		const interval = setInterval(() => {
			axios
				.post("https://spotify-serve.herokuapp.com/refresh", {
					refreshToken,
				})
				.then((res) => {
					//console.log(res.data)
					localStorage.setItem("accessToken", res.data.accessToken)
					localStorage.setItem("expiresIn", res.data.expiresIn)
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
		}, 100 * (expiresIn - 60))

		return () => clearInterval(interval)
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
					setfetchplaylist(true)
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

			spotifyApi
				.getMyTopArtists({})
				.then((res) => {
					setFavArtists(
						res.body.items.map((artist) => {
							return {
								name: artist.name,
								icon: artist.images[0].url,
								id: artist.id,
								type: artist.type,
							}
						})
					)
				})
				.catch((err) => {
					console.log(err.message)
					setFavArtists([]);
					const sentence = ["Invalid access token","The access token expired"];
					for(let i = 0 ; i < sentence.length ; i++){
						if(err.message.includes(sentence[i])){
							localStorage.removeItem("accessToken")
							window.location.replace("/login")	
							break;
						}
					}
				})

			spotifyApi
				.getMyTopTracks({})
				.then((res) => {
					setMyFavSongs(
						res.body.items.map((song) => {
							return {
								album: { id: song.album.id, name: song.album.name },
								icon: song.album.images[0].url,
								preview_url: song.preview_url,
								uri: song.uri,
								artist: song.artists[0].name,
								name: song.name,
								id: song.id,
								duration: song.duration_ms,
							}
						})
					)
				})
				.catch((err) => {
					console.log(err.message)
					setMyFavSongs([])
					const sentence = ["Invalid access token","The access token expired"];
					for(let i = 0 ; i < sentence.length ; i++){
						if(err.message.includes(sentence[i])){
							localStorage.removeItem("accessToken")
							window.location.replace("/login")	
							break;
						}
					}
				})

			spotifyApi
				.getFollowedArtists()
				.then((res) => {
					setFollowedArtists(
						res.body.artists.items.map((artist) => {
							return {
								id: artist.id,
								icon: artist.images[0].url,
								name: artist.name,
								type: artist.type,
							}
						})
					)
				})
				.catch((err) => {
					console.log(err.message)
					setFollowedArtists([])
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
	}, [fetch])

	useEffect(() => {
		if (fetchplaylist) {
			spotifyApi
				.getUserPlaylists(state.user.id)
				.then((res) => {
					console.log(res.body)
					setMyPlaylists(
						res.body.items.map((playlist) => {
							console.log(playlist)
							return {
								name: playlist.name,
								icon: playlist.images[0].url,
								total: playlist.tracks.total,
								id: playlist.id,
							}
						})
					)
					setLoading(false)
				})
				.catch((err) => {
					setLoading(false)
					console.log(err.message)
					setMyPlaylists([])
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
	}, [fetchplaylist])

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

	const handleLogout = () => {
		localStorage.removeItem("accessToken")
		dispatch({ type: "SET_USER", item: null })
		window.location = "/login"
	}
	return (
		<div>
			{loading ? (
				<Loading />
			) : (
				<div className='p'>
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
								<button className='sidebar_option  active' onClick={(e) => window.location.replace("/profile")}>
									<FontAwesomeIcon icon={faBookOpen} />
									<div>Your Library</div>
								</button>
							</div>
							<div className='sidebar_options' style={{ marginTop: "30px" }}>
								<div className='sidebar_title'>Your Playlists</div>
								{myPlaylists.map((playlist) => (
									<div className='sidebar_option' key={playlist.id} onClick={(event) => (window.location = `/playlist/${playlist.id}`)}>
										<div className='sidebar_img' style={{ margin: "0px" }}>
											<img src={playlist.icon} />
										</div>
										<div>{playlist.name.length > 10 ? playlist.name.substr(0, 9) + "..." : playlist.name}</div>
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
					<div className='p_container'>
						<div className='p_back' onClick={(e) => (window.location = "/")}>
							<FontAwesomeIcon icon={faLongArrowAltLeft} />
						</div>
						<div className={`p_user ${show ? "background" : "transparent"}`}>
							<div
								className='p_user_info'
								onClick={(e) => {
									window.location.replace("/profile")
								}}>
								<div className='p_user_img'>
									<img src={state.user?.images[0]?.url || `https://cdn3.iconfinder.com/data/icons/avatars-round-flat/33/avat-01-512.png`} alt='user_img' />
								</div>
								<div className='p_user_username'>{state.user?.display_name}</div>
							</div>
							<div className='hamburger' onClick={(e) => handleShow()}>
								<FontAwesomeIcon icon={faBars} />
							</div>
						</div>
						<div className='p_main'>
							<div className='p_mainImg'>
								<img src={state.user?.images[0]?.url || `https://cdn3.iconfinder.com/data/icons/avatars-round-flat/33/avat-01-512.png`} />
							</div>
							<div className='p_mainName'>
								<div className='p_subtitle'>PROFILE</div>
								<div className='p_name'>{state.user?.display_name}</div>
								<div className='line'></div>
							</div>
						</div>
						<div className='p_content'>
							<div className='p_title'>Top Artists this month</div>
							<div className='p_contentcards'>
								{favArtists.map((artist) => (
									<Artist artist={artist} key={artist.id} />
								))}
							</div>
							<div className='p_title'>Your top picks</div>
							<div className='p_contentcards favSong'>
								{myFavSongs.map((song) => (
									<FavouriteSong song={song} key={song.id} />
								))}
							</div>
							<div className='p_title'>Public Playlists</div>
							<div className='p_contentcards'>
								{myPlaylists.map((playlist) => (
									<Playlist playlist={playlist} key={playlist.id} />
								))}
							</div>
							<div className='p_title'>Artists you Follow</div>
							<div className='p_contentcards'>
								{followedArtists.map((artist) => (
									<Artist artist={artist} key={artist.id} />
								))}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default Profile
