import Social from "./Social";
import { useState } from "react";
export default function GetStarted() {
    const [showWarningMessage, setShowWarningMessage] = useState(false);
    return(
        <>
            <img src='/rainthunder.svg'/>
            <h1 className='text-2xl mt-2'>Weather App</h1>
            <p className='text-lg text-center mt-5'>
                App created for the <a href='https://github.com/midudev/midu-weather' target='_blank' rel='noopener noreferrer' className='text-sky-600 cursor-pointer hover:text-sky-400'>Rapid API hackathon</a> by my uncle <a href='https://www.twitch.tv/midudev' target='_blank' rel='noopener noreferrer' className='text-sky-600 cursor-pointer hover:text-sky-400'>midudev</a>. Here you&apos;ll discover your local information and for many iconic cities around the world.
            </p>
            <button onClick={()=> setShowWarningMessage(true)} className='bg-sky-500 text-xl px-5 py-2 rounded-md mt-5 hover:bg-sky-600 hover:scale-105 transition-all ease-in-out duration-300'>
                Get Started
            </button>
            {showWarningMessage && <p className='text-center mt-5'>You have to allow geolocation in order to use this app. Don&apos;t worry, we don&apos;t save your data. 😜</p>}
            <Social/>
        </>
    )
}