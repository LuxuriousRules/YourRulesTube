"use client"

import {useState,useEffect} from "react";

function Test () {

    const[value,setValue]=useState<string>("");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    }

    return (
        <>
        <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="введи текс"
        />
        <p>{value}</p>
        </>
    )
}

export default Test;