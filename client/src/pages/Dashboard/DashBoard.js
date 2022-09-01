/** @format */

import React, { useEffect, useRef, useState } from "react"
import spotifyApi from "../../Spotify/spotify-api.js"
import axios from "axios"
import "./DashBoard.css"
import { useStateValue } from "../../StateProvider"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faBookOpen, faDoorOpen, faHome, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons"
import Category from "../../components/Category/Category.js"
import Song from "../../components/Song/Song.js"
import Loading from "../../components/Loading/Loading.js"
import gsap from "gsap/gsap-core"
import { Expo } from "gsap/dist/gsap"

const DashBoard = () => {
	const [state, dispatch] = useStateValue()
	let sideMenu = useRef(null)

	const [fetchUser, setFetchUser] = useState(false)
	const [fetchUserPlaylist, setFetchUserPlaylist] = useState(false)
	const [accessToken, setAccessToken] = useState(null)
	const [refreshToken, setRefreshToken] = useState(null)
	const [expiresIn, setExpiresIn] = useState(null)
	const [loading, setLoading] = useState(true)
	const [categories, setCategories] = useState([])
	const [recentlyPlayed, setRecentlyPlayed] = useState([])
	const [favSongs, setFavSongs] = useState([])
	const [myPlaylists, setMyPlaylists] = useState([])
	const [show, setShow] = useState(false)

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
		const code = new URLSearchParams(window.location.search).get("code")

		if(!code && !localStorage.getItem("accessToken")){
			window.location.replace('/login')
		}

		if (!localStorage.getItem("accessToken")) {
			axios
				.post("https://spotify-serve.herokuapp.com/login", { code })
				.then((res) => {
					localStorage.setItem("accessToken", res.data.accessToken)
					localStorage.setItem("refreshToken", res.data.refreshToken)
					localStorage.setItem("expiresIn", res.data.expiresIn)
					window.history.pushState({}, null, "/")
				})
				.then(() => {
					spotifyApi.setAccessToken(localStorage.getItem("accessToken"))
					setFetchUser(true)
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
		} else {
			spotifyApi.setAccessToken(localStorage.getItem("accessToken"))
			window.history.pushState({}, null, "/")
			setFetchUser(true)
		}

		setAccessToken(localStorage.getItem("accessToken"))
		setRefreshToken(localStorage.getItem("refreshToken"))
		setExpiresIn(localStorage.getItem("expiresIn"))
	}, [])

	useEffect(() => {
		
		if (fetchUser) {
			
			spotifyApi
				.getMyTopTracks()
				.then((res) => {
					console.log(res.body)
					setFavSongs(
						res.body.items.map((song) => {
							return {
								artist: song.artists[0].name,
								icon: song.album.images[0].url,
								id: song.id,
								name: song.name,
								preview_url: song.preview_url,
								uri: song.uri,
							}
						})
					)
				})
				.catch((err) => {
					console.log("Lol", err.message)
					setFavSongs([]);
					if(["Invalid access token", "The access token expired"].includes(err.message)){
						localStorage.removeItem("accessToken")
						window.location.replace("/login")	
					}
				})

			spotifyApi
				.getCategories({ country: "IN" })
				.then((res) => {
					setCategories(
						res.body.categories.items.map((category) => {
							return { id: category.id, name: category.name, icon: category.icons[0].url }
						})
					)
				})
				.catch((err) => {
					console.log(err.message)
					setCategories([]);
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
				.getMyRecentlyPlayedTracks({ after: 15002342 })
				.then((res) => {
					console.log(res.body.items)
					setRecentlyPlayed(
						res.body.items.map((rc) => {
							return {
								preview_url: rc.track.preview_url,
								uri: rc.track.uri,
								name: rc.track.name,
								icon: rc.track.album.images[0].url,
								id: rc.track.id,
								artist: rc.track.album.artists[0].name,
							}
						})
					)
				})
				.catch((err) => {
					console.log(err.message)
					setRecentlyPlayed([])
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
		}

	}, [fetchUser])

	useEffect(() => {
		if (fetchUserPlaylist) {
			spotifyApi
				.getUserPlaylists(state.user.id)
				.then((res) => {
					setMyPlaylists(
						res.body.items.map((playlist) => {
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
					console.log(err.message)
					setLoading(false)
					setMyPlaylists([]);
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
					setFetchUser(true)
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

	const handleLogout = () => {
		localStorage.removeItem("accessToken")
		dispatch({ type: "SET_USER", item: null })
		window.location = "/login"
	}

	return (
		<div className='db'>
			{loading ? (
				<Loading />
			) : (
				<div className='db_container'>
					<div className='sidebar' ref={(el) => (sideMenu = el)}>
						<div className='sidebarContainer'>
							<div className='cross'>
								<FontAwesomeIcon icon={faTimes} onClick={(e) => handleClose()} />
							</div>
							<div className='sidebar_options'>
								<button className='sidebar_option active' onClick={(e) => window.location.replace("/")}>
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
									<div className='sidebar_option' key={playlist?.id} onClick={(event) => (window.location = `/playlist/${playlist.id}`)}>
										<div className='sidebar_img' style={{ margin: "0px" }}>
											<img src={playlist?.icon} />
										</div>
										<div>{playlist?.name.length > 10 ? playlist?.name.substr(0, 9) + "..." : playlist?.name}</div>
									</div>
								))}
							</div>

							<div className='sidebar_options'>
								<div className='line'></div>
								<div className='sidebar_option' onClick={(e) => handleLogout()}>
									<FontAwesomeIcon icon={faDoorOpen} />
									<div>Logout</div>
								</div>
							</div>
						</div>
					</div>
					<div className='main'>
						<div className='main_container'>
							<div className={`user ${show ? "background" : "transparent"}`}>
								<div
									className='user_info'
									onClick={(e) => {
										window.location.replace("/profile")
									}}>
									<div className='user_img'>
										<img src={state.user?.images[0]?.url || `https://cdn3.iconfinder.com/data/icons/avatars-round-flat/33/avat-01-512.png`} alt='user_img' />
									</div>
									<div className='user_username'>{state.user?.display_name}</div>
								</div>
								<div className='hamburger' onClick={(e) => handleShow()}>
									<FontAwesomeIcon icon={faBars} />
								</div>
							</div>
							<div className='show'>
								<div className='content' style={{ marginTop: "70px" }}>
									<div className='content_title'>Recently Played</div>
									<div className='content_content'>
										{recentlyPlayed.map((recently) => (
											<Song song={recently} key={recently?.id + `$${Math.random()}`} />
										))}
									</div>
								</div>
								<div className='content'>
									<div className='content_title'>Your top picks</div>
									<div className='content_content'>
										{favSongs.map((fav) => (
											<Song song={fav} key={fav?.id} />
										))}
									</div>
								</div>
								<div className='content'>
									<div className='content_title'>Categories for you</div>
									<div className='content_content'>
										{categories.map((category) => (
											<Category category={category} key={category?.id} />
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default DashBoard
