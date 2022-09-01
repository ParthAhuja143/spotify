import React from 'react'
import './SearchShows.css'

const SearchShows = ({shows}) => {
    if(!shows.icon || !shows.name){
        return (<></>)
    }
    else return (
        <div className = 'searchShows'>
            <div className = 'searchShows_container'>
                <div className = 'searchShows_cover'></div>
                <img src={shows?.icon} alt="" />
                <div className = 'searchShows_name'>{shows?.name?.length > 25 ? shows.name.substr(0,25) + '...' : shows?.name}</div>
            </div>
        </div>
    )
}

export default SearchShows
