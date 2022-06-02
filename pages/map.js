import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import Map from "../components/Map";
import Menu from '../components/Menu';
import SearchModal from "../components/SearchModal";
import { FiExternalLink } from "react-icons/fi";
import { useRouter } from "next/router";
export default function MapLocation () {
    const [showLoading, setShowLoading] = useState(true);
    const [searchModal, setSearchModal] = useState(false);
    const [coordinates, setCoordinates] = useState({
        latitude: 0,
        longitude: 0,
    });
    const headers = {
        'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com',
        'X-RapidAPI-Key': process.env.NEXT_PUBLIC_WEATHER_API_KEY
    }
    const [marker, setMarker] = useState(null)
    const router = useRouter();
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCoordinates({ latitude, longitude });
            }
        );
        setTimeout(() => {
            setShowLoading(false);
        }, 1000);
    },[])

    function toggleSearch () {
        setSearchModal(!searchModal)
    }

    async function handleSelection(event) {
        try {
            const response = await axios.get(`https://weatherapi-com.p.rapidapi.com/current.json?q=${event.latitude},${event.longitude}`, {headers})
            if(response.data) {
                setMarker(response.data)
            }
        } catch (error) {
            console.log(error);
            setMarker(null)
        }  
    }
    return(
        <>
            {showLoading ? <Loading/> : <>
            <main className="w-[100vw] h-[100vh] relative"> 
                {marker && 
                    <div className="w-[100vw] absolute top-0 left-0 z-10 p-5">
                        <div className="w-full h-full bg-[#16182a] text-white p-4 rounded-md flex flex-col items-center relative">
                            <h2 className="text-xl font-semibold">{marker.location.name}, {marker.location.country}</h2>
                            <p>Time: {marker.location.localtime}</p>
                            <div className="flex w-full items-center justify-around mt-5">
                                <div className="flex flex-col items-center font-semibold gap-2">
                                    <img src={marker.current.condition.icon} alt="weather icon" className='object-contain w-[40px] h-[40px]'/>
                                    <p>{marker.current.condition.text}</p>
                                </div>
                                <div className="flex flex-col items-center font-semibold gap-2">
                                    <img src='/humidity.png' alt='humidity' className='object-contain w-[40px] h-[40px]'/>
                                    <p>{marker.current.humidity}%</p>
                                </div>
                                <div className="flex flex-col items-center font-semibold gap-2">
                                    <img src='/wind.png' alt='wind' className='object-contain w-[40px] h-[40px]'/>
                                    <p>{marker.current.wind_kph}km/h</p>
                                </div>
                                <h2 className="text-5xl font-semibold">{parseInt(marker.current.temp_c)}°C</h2>
                            </div>
                            <button onClick={() => {
                                router.push(`/country/${marker.location.country}?lat=${marker.location.lat}&lon=${marker.location.lon}`)
                            }} className="absolute right-5 top-5 text-2xl hover:text-sky-500">
                                <FiExternalLink/>
                            </button>
                        </div>
                        
                    </div>}
                <Map coordinates={coordinates} onSelection={handleSelection}/>
                <div className="absolute p-5 z-10 w-[100vw] bottom-0 left-0 text-white">
                    <Menu toggleSearch={toggleSearch}/>
                </div>
                {searchModal && <SearchModal onClose={ () => setSearchModal(false) }/>}
            </main>
            </>}
        </>
        
    )
}