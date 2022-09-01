/** @format */

import "./App.css"
import DashBoard from "./pages/Dashboard/DashBoard"
import { BrowserRouter as Router, Route } from "react-router-dom"
import Login from "./pages/Login/Login"
import Profile from "./pages/Profile/Profile"
import Search from "./pages/Search/Search"
import Playlist from "./pages/Playlist/Playlist"
import SongPlayer from "./components/SongPlayer/SongPlayer"
import { useStateValue } from "./StateProvider"
import Album from "./pages/Album/Album"
import Episode from "./pages/Episode/Episode"
import Show from "./pages/Show/Show"
import Artist from "./pages/Artist/Artist"

function App() {
	const [state, dispatch] = useStateValue()

	return (
		<Router>
			<Route exact path='/profile' component={Profile} />
			<Route exact path='/' component={DashBoard} />
			<Route exact path='/login' component={Login} />
			<Route exact path='/search' component={Search} />
			<Route exact path='/playlist/:playlistId' component={Playlist} />
			<Route exact path='/album/:albumId' component={Album} />
			<Route exact path='/episode/:episodeId' component={Episode} />
			<Route exact path='/show/:showId' component={Show} />
			<Route exact path='/artist/:artistId' component={Artist} />
			{localStorage.getItem("accessToken") && <SongPlayer trackUri={state.playingSong?.uri} />}
		</Router>
	)
}

export default App
