import React from 'react'
import './SearchEpisode.css'

const SearchEpisode = ({episode}) => {
    if(!episode.icon || !episode.name){
        return (<></>)
    }

    else return (
        <div className = 'searchEpisode'>
            <div className = 'searchEpisode_container'>
                <div className = 'searchEpisode_cover'></div>
                <img src={episode?.icon} alt="" />
                <div className = 'searchEpisode_name'>{episode?.name?.length > 25 ? episode?.name.substr(0,25) + '...' : episode?.name}</div>
            </div>
        </div>
    )
}

export default SearchEpisode
