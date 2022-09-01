/** @format */

import { faBars, faBookOpen, faDoorOpen, faHome, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios"
import gsap from "gsap/gsap-core"
import { Expo } from "gsap/gsap-core"
import React, { useEffect, useRef, useState } from "react"
import SpotifyWebApi from "spotify-web-api-node"
import Artist from "../../components/Artist/Artist.js"
import Loading from "../../components/Loading/Loading.js"
import SearchAlbum from "../../components/SearchAlbum/SearchAlbum.js"
import SearchEpisode from "../../components/SearchEpisode/SearchEpisode.js"
import SearchPlaylists from "../../components/SearchPlaylists/SearchPlaylists.js"
import SearchShows from "../../components/SearchShows/SearchShows.js"
import SearchSong from "../../components/SearchSong/SearchSong.js"
import { useStateValue } from "../../StateProvider.js"
import "./Search.css"

const spotifyApi = new SpotifyWebApi({
	clientId: "39c8b3f6751d4bc2a052c0f7309949a4",
})

const Search = () => {
	let sideMenu = useRef(null)

	const [state, dispatch] = useStateValue()
	const [search, setSearch] = useState("")
	const [searchResult, setSearchResult] = useState([])
	const [searchAlbums, setSearchAlbums] = useState([])
	const [searchArtists, setSearchArtists] = useState([])
	const [searchEpisodes, setSearchEpisodes] = useState([])
	const [searchShows, setSearchShows] = useState([])
	const [searchPlaylists, setSearchPlaylists] = useState([])
	const [fetch, setFetch] = useState(false)
	const [myPlaylists, setMyPlaylists] = useState([])
	const [show, setShow] = useState(false)
	const [fetchUserPlaylist, setFetchUserPlaylist] = useState(false)
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
		if (search.trim() === "") return setSearchResult([])
		let cancel = false

		spotifyApi
			.searchTracks(search)
			.then((res) => {
				if (cancel) return
				setSearchResult(
					res.body.tracks.items.map((track) => {
						return {
							album: {
								id: track.album.id,
								name: track.album.name,
							},
							artist: track?.artists[0]?.name,
							name: track?.name,
							uri: track?.uri,
							icon: track?.album?.images[1]?.url,
							id: track?.id,
							preview_url: track?.preview_url,
							duration: track?.duration_ms,
						}
					})
				)
			})
			.catch((err) => {
				console.log(err.message)
				setSearchResult([]);
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
			.searchAlbums(search)
			.then((res) => {
				if (cancel) return
				setSearchAlbums(
					res.body.albums.items.map((album) => {
						return {
							artist: album?.artists[0]?.name,
							name: album?.name,
							icon: album?.images[0]?.url,
							id: album?.id,
						}
					})
				)
			})
			.catch((err) => {
				console.log(err.message)
				setSearchAlbums([])
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
			.searchArtists(search)
			.then((res) => {
				if (cancel) return
				setSearchArtists(
					res.body.artists.items.map((artist) => {
						console.log(artist)
						return {
							name: artist?.name,
							icon: artist?.images[0]?.url,
							type: artist?.type,
							id: artist?.id,
						}
					})
				)
			})
			.catch((err) => {
				console.log(err.message)
				setSearchArtists([]);
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
			.searchEpisodes(search)
			.then((res) => {
				if (cancel) return
				setSearchEpisodes(
					res.body.episodes.items.map((episode) => {
						return {
							name: episode?.name,
							icon: episode?.images[0]?.url,
							preview_url: episode?.audio_preview_url,
							id: episode?.id,
							description: episode?.description,
						}
					})
				)
			})
			.catch((err) => {
				console.log(err.message)
				setSearchEpisodes([])
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
			.searchPlaylists(search)
			.then((res) => {
				if (cancel) return
				console.log(res.body)
				setSearchPlaylists(
					res.body.playlists.items.map((playlist) => {
						return {
							name: playlist?.name,
							description: playlist?.description,
							id: playlist?.id,
							icon: playlist?.images[0]?.url,
							owner: playlist?.owner?.display_name,
						}
					})
				)
			})
			.catch((err) => {
				console.log(err.message)
				setSearchPlaylists([])
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
			.searchShows(search)
			.then((res) => {
				if (cancel) return
				setSearchShows(
					res.body.shows.items.map((show) => {
						return {
							name: show?.name,
							id: show?.id,
							icon: show?.images[0]?.url,
							description: show?.description,
						}
					})
				)
			})
			.catch((err) => {
				console.log(err.message)
				setSearchShows([])
				const sentence = ["Invalid access token","The access token expired"];
					for(let i = 0 ; i < sentence.length ; i++){
						if(err.message.includes(sentence[i])){
							localStorage.removeItem("accessToken")
							window.location.replace("/login")	
							break;
						}
					}
			})

		return () => (cancel = true)
	}, [search])

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
		}
	}, [fetch])

	useEffect(() => {
		const refreshToken = localStorage.getItem("refreshToken")
		const expiresIn = localStorage.getItem("expiresIn")

		if (!refreshToken || !expiresIn) {
			localStorage.removeItem("accessToken")
			window.location = "/login"
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
					localStorage.setItem("refreshToken", refreshToken)
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
		if (fetchUserPlaylist) {
			spotifyApi
				.getUserPlaylists(state.user.id)
				.then((res) => {
					console.log("res", res.body.items)
					setMyPlaylists(
						res.body.items.map((playlist) => {
							return {
								id: playlist?.id,
								name: playlist?.name,
								icon: playlist?.images[0]?.url,
								total: playlist?.tracks?.total,
							}
						})
					)
					setLoading(false)
				})
				.catch((err) => {
					console.log(err.message)
					setMyPlaylists([])
					setLoading(false)
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
		<div style={{ paddingBottom: "100px" }}>
			{loading ? (
				<Loading />
			) : (
				<div className='search'>
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
								<button className='sidebar_option active' onClick={(e) => window.location.replace("/search")}>
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
									<div className='sidebar_option' onClick={(event) => (window.location = `/playlist/${playlist.id}`)}>
										<div className='sidebar_img' style={{ margin: "0px" }}>
											<img src={playlist.icon} />
										</div>
										<div>{playlist?.name?.length > 10 ? playlist?.name?.substr(0, 9) + "..." : playlist?.name}</div>
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
					<div className='search_container'>
						<div className={`search_user ${show ? "background" : "transparent"}`}>
							<div className='searchBox'>
								<input type='text' placeholder='Search songs/artists' onChange={(e) => setSearch(e.target.value)} />
							</div>
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
						{search.trim() === "" ? (
							<div
								style={{
									position: "relative",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									height: "100%",
									width: "100%",
								}}>
								<div class='now playing' id='music'>
									<span className='bar n8'>A</span>
									<span className='bar n4'>B</span>
									<span className='bar n5'>E</span>
									<span className='bar n1'>H</span>
									<span className='bar n7'>c</span>
									<span className='bar n2'>D</span>
									<span className='bar n6'>F</span>
									<span className='bar n3'>G</span>
									<span className='bar n1'>G</span>
									<span className='bar n8'>H</span>
								</div>
								<div className='noterm'>Search your songs</div>
							</div>
						) : (
							<div className='search_mainBox'>
								<div className='search_rowContent'>
									<div className='p_content'>
										<div className='p_title'>Top Result</div>
										<div className='p_contentcards'>
											<div className='top_result'>
												<div className='top_result_container'>
													<div className='top_result_info'>
														<div className='top_result_image'>
															<img src={searchArtists[0]?.icon} alt='' />
														</div>
														<div className='top_result_name'>{searchArtists[0]?.name}</div>
														<div className='top_result_type'>{searchArtists[0]?.type}</div>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className='p_content'>
										<div className='p_title'>Songs</div>
										<div
											className='p_contentcards favSong'
											style={{
												height: "300px",
												overflow: "auto",
											}}>
											{searchResult !== [] && searchResult?.map((song) => <SearchSong song={song} key={song?.id} />)}
										</div>
									</div>
								</div>
								<div className='p_content'>
									<div className='p_title'>Artists</div>
									<div className='p_contentcards'>{searchArtists !== [] && searchArtists?.map((artist) => <Artist artist={artist} key={artist?.id} />)}</div>
								</div>
								<div className='p_content'>
									<div className='p_title'>Episodes</div>
									<div className='p_contentcards'>{searchEpisodes !== [] && searchEpisodes?.map((episode) => <SearchEpisode episode={episode} key={episode?.id || Math.random()} />)}</div>
								</div>
								<div className='p_content'>
									<div className='p_title'>Albums</div>
									<div className='p_contentcards'>{searchAlbums !== [] && searchAlbums?.map((album) => <SearchAlbum album={album} key={album?.id} />)}</div>
								</div>
								<div className='p_content'>
									<div className='p_title'>Shows</div>
									<div className='p_contentcards'>
										{searchShows?.map((show) => (
											<SearchShows shows={show} key={show?.id} />
										))}
									</div>
								</div>
								<div className='p_content'>
									<div className='p_title'>Playlists</div>
									<div className='p_contentcards'>{searchPlaylists !== [] && searchPlaylists?.map((playlist) => <SearchPlaylists playlist={playlist} key={playlist?.id} />)}</div>
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	)
}

export default Search
