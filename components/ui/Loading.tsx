"use client"

import ClipLoader from "react-spinners/ClipLoader";

function Loading ({size= 50, color="blue"}) {

    return <ClipLoader size={size} color={color}/>
}

export default Loading;