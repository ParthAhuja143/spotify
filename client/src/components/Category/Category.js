import React from 'react'
import './Category.css'

const Category = ({category}) => {
    if(!category.icon || !category.name){
        return (<></>)
    }
    else {return (
        <div className = 'c'>
            <div className = 'c_container'>
                <div className = 'c_cover'></div>
                <img src={category.icon} alt="" />
                <div className = 'c_name'>{category.name}</div>
            </div>
        </div>
    )}
}

export default Category
