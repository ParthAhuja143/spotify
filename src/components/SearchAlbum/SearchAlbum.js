import React from 'react'
import './SearchAlbum.css'

const SearchAlbum = ({album}) => {
    if(!album.icon || !album.name || !album.artist){
        return (<></>)
    }
    else return (
        <div className = 'searchAlbum'>
        <div className = 'searchAlbum_container'>
            <div className = 'searchAlbum_cover'></div>
            <img src={album?.icon} alt="" />
            <div className = 'searchAlbum_name'>{album?.name.length > 25 ? album?.name.substr(0,25) + '...' : album?.name}</div>
            <div className = 'searchAlbum_artist'>{album?.artist}</div>
        </div>
    </div>
    )
}

export default SearchAlbum
