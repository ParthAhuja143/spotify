import React from 'react'
import './Artist.css'

const Artist = ({artist}) => {
    if(!artist.name || !artist.icon || !artist.type){
        return (<></>)
    }
    else {return (
        <div className = 'a'>
            <div className = 'a_container'>
                <img src={artist.icon ? artist.icon : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZNrcmMSnac0Cgfpp_VL4_TSadJPn0vQYiqg&usqp=CAU'} alt="" />
                <div className = 'a_name'>{artist.name.length > 30 ? artist.name.substr(0,29) + '...' : artist.name}</div>
                <div className = 'a_type'>{artist.type}</div>
            </div>
        </div>
    )}
}

export default Artist
