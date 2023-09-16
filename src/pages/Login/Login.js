/** @format */

import React, { useEffect, useState } from "react"
import Loading from "../../components/Loading/Loading"
import "./Login.css"

const AUTH_URL =
	"https://accounts.spotify.com/authorize?client_id=39c8b3f6751d4bc2a052c0f7309949a4&response_type=code&redirect_uri=https://spotifybyparth.netlify.app&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20user-read-recently-played%20user-top-read%20user-follow-read%20playlist-read-private"

const Login = () => {
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		setLoading(false)
	})

	return (
		<div style={{ display: "flex", alignContent: "center", justifyContent: "center", alignItems: "center", position: "relative" }}>
			{loading ? (
				<Loading />
			) : (
				<div className='login_container'>
					<div className='login'> </div>
					<div className='hanger'></div>
					<div className='discoball'>
						<img src='https://drive.google.com/uc?id=0B7QrEBMF4GTGQ3lfRzV0cU5rNHM' alt='' />
					</div>
					<div className='hanger1'></div>
					<div className='discoball1'>
						<img src='https://drive.google.com/uc?id=0B7QrEBMF4GTGQ3lfRzV0cU5rNHM' alt='' />
					</div>
					<div className='hanger2'></div>
					<div className='discoball2'>
						<img src='https://drive.google.com/uc?id=0B7QrEBMF4GTGQ3lfRzV0cU5rNHM' alt='' />
					</div>
					<div className='ag-ray_light ag-ray_light__top-left'></div>
					<div className='ag-ray_light ag-ray_light__bottom-left'></div>
					<div className='ag-ray_light ag-ray_light__top-right'></div>
					<div className='ag-ray_light ag-ray_light__bottom-right'></div>
					<a href={AUTH_URL}>Login with Spotify</a>
				</div>
			)}
		</div>
	)
}

export default Login
