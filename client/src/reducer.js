/** @format */

export const initialState = {
	user: null,
	favSongs: null,
	playingSong: null,
}

//Selector

const reducer = (state, action) => {
	switch (action.type) {
		case "SET_USER":
			console.log(action.item)
			return { ...state, user: action.item }

		case "SET_FAV_SNGS":
			return { ...state, favSongs: action.item }

		case "SET_PLAYING_SONG":
			console.log(action.item)
			return { ...state, playingSong: action.item }

		default:
			return state
	}
}

export default reducer
