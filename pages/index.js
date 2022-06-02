import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import Menu from '../components/Menu';
import Topbar from '../components/Topbar';
import GetStarted from '../components/GetStarted';
import Loading from '../components/Loading';
import { BsInfoCircle } from 'react-icons/bs';
import SearchModal from '../components/SearchModal';
import { useSwipeable } from 'react-swipeable';

export default function Home () {
    const [showBg, setShowBg] = useState(true);
    const [location, setLocation] = useState(null);
    const [showLoading, setShowLoading] = useState(true);
    const [myPlaceData, setMyPlaceData] = useState(null);
    const [atractions, setAtractions] = useState([]);
    const [weather, setWeather] = useState(null);
    const [selectedAtraction, setSelectedAtraction] = useState(0);
    const [showAtractionInfo, setShowAtractionInfo] = useState(false);
    const [searchModal, setSearchModal] = useState(false);
    const _movement = useRef(null)

    const headers = {
        'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com',
        'X-RapidAPI-Key': process.env.NEXT_PUBLIC_WEATHER_API_KEY
    }
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
            });
        } else {
            console.log('Geolocation is not supported by this browser.');
        }
        setTimeout(() => {
            setShowLoading(false);
        }, 1500)
    },[])

    useEffect(() => {
        if(location) {
            getData()
        }
    },[location])

    useEffect(() => {
        console.log(weather)
    },[weather])

    function goRigth(){
        if(atractions.length > 0 && selectedAtraction + 1 < atractions.length)
            setSelectedAtraction(selectedAtraction + 1)
    }
    
    function goLeft(){
        if(atractions.length > 0 && selectedAtraction - 1 >= 0)
            setSelectedAtraction(selectedAtraction - 1)
    }

    const handlers = useSwipeable({
        onSwipedLeft: () => goRigth(),
        onSwipedRight: () => goLeft(),
        preventDefaultTouchmoveEvent: true,
        trackMouse: true
    });

    async function getData() {
        const response = await axios.get(`https://weatherapi-com.p.rapidapi.com/current.json?q=${location.latitude},${location.longitude}`, {headers})
        setWeather(response.data)
        if(response.data) {
            setMyPlaceData(response.data)
            // const country = 'japan'
            const country = response.data.location.country
            // const country_response = await axios.get(`https://restcountries.com/v3.1/name/${country}`)
            const atractions_response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_API}/atractions/${country.toLowerCase()}`)
            setAtractions(atractions_response.data.atractions)
            setShowLoading(false)
        }
    }

    function bgClick (){
        setShowBg(!showBg)
    }

    function toggleSearch () {
        setSearchModal(!searchModal)
    }

    return (
        <>
            {showLoading ? <Loading/>:
            <>
                <main {...handlers} className={`w-[100vw] h-[100vh] overflow-hidden p-5 flex flex-col text-[#e0dddd] z-10 relative ${!location ? 'bg-[#0b1b25] items-center justify-center':''}`}>
                    {location ? 
                        <>
                            <Topbar bgClick={bgClick} showBg={showBg} data={myPlaceData}/>
                            {showBg &&
                                <>
                                    <section ref={_movement} className='grow overflow-hidden py-5 relative flex items-center justify-center flex-col z-0'>
                                        <div className='flex justify-between items-center flex-col'>
                                            <div className='flex items-center flex-col'>
                                                <img src={weather?.current.condition.icon} alt='weather' className='w-[200px] h-[200px] object-contain'/>
                                            </div>
                                            <h2 className='text-8xl'>
                                                {parseInt(weather?.current.temp_c)}<span className='text-sky-500'>°C</span>
                                            </h2>
                                            <p className='mt-5 font-semibold text-xl'>{weather?.current.condition.text}</p>
                                        </div>
                                        <div className='flex justify-around mt-5 w-full'>
                                            <div className="flex flex-col items-center font-semibold">
                                                <img src='/rain.svg' alt='humidity' className='object-contain w-[40px] h-[40px]'/>
                                                <p>{weather?.current.humidity}%</p>
                                                <p>Humidity</p>
                                            </div>
                                            <div className="flex flex-col items-center font-semibold">
                                                <img src='/cloud.svg' alt='wind' className='object-contain w-[40px] h-[40px]'/>
                                                <p>{weather?.current.cloud}%</p>
                                                <p>Cloud</p>
                                            </div>
                                            <div className="flex flex-col items-center font-semibold">
                                                <img src='/wind.png' alt='wind' className='object-contain w-[40px] h-[40px]'/>
                                                <p>{weather?.current.wind_kph} km/h</p>
                                                <p>Wind speed</p>
                                            </div>
                                        </div>
                                        {showAtractionInfo && 
                                            <div className='my-5 absolute bottom-0 left-0  z-10 bg-[#000000c9] p-4 rounded-md fade-animation'>
                                                <h3 className='font-bold text-lg flex gap-2'>{atractions[selectedAtraction].name} 
                                                    <button className='text-sky-400 cursor-pointer' onClick={bgClick}>
                                                        (picture)
                                                    </button>
                                                </h3>
                                                <p className='mt-5'>{atractions[selectedAtraction].description}</p>
                                                
                                            </div>}
                                    </section>
                                    <div className=' flex w-full items-center justify-center gap-2 py-2 flex-col'>
                                        <div className='flex w-full flex-col items-end'>
                                            <button onClick={()=>{
                                                setShowAtractionInfo(!showAtractionInfo)
                                            }} className={` text-2xl hover:text-sky-600 cursor-pointer transition-all ease-in-out duration-300 ${showAtractionInfo ? 'text-sky-400':'text-white'}`}>
                                                <BsInfoCircle/>
                                            </button>
                                        </div>
                                        
                                        <div className='flex gap-2'>
                                            {atractions.map((atraction, index) => (
                                                <div onClick={()=>{
                                                    setSelectedAtraction(index)
                                                }} key={`selector-${index}`} className={`cursor-pointer h-[10px] w-[10px] rounded-full transition-all ease-in-out duration-300 ${selectedAtraction === index ? 'bg-pink-700' :'bg-slate-100' }`}/>))}
                                        </div>
                                    </div>
                                    <Menu toggleSearch={toggleSearch}/>
                                </>}
                        </> :
                        <>
                            <GetStarted/>
                        </>}
                    {searchModal && <SearchModal onClose={ () => setSearchModal(false) }/>}
                </main>
                <div className=' absolute left-0 top-0 h-[100vh] w-[100vw] z-0'>
                    <img className='h-full w-full object-cover' src={atractions.length > 0 ? `https://weather-app-midu.s3.amazonaws.com/places/${atractions[selectedAtraction].file}` :'/default.jpg'}/>
                    <div className={`bg-[#000000c5] h-full w-full absolute top-0 left-0 z-0 transition-all ease-out duration-500 ${showBg ? ' opacity-100':' opacity-0'}`} />
                </div>
            </>
            }
        </>
    )
}