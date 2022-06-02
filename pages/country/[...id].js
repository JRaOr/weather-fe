import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import Menu from "../../components/Menu";
import SearchModal from "../../components/SearchModal";
import Topbar from "../../components/Topbar";
import { BsInfoCircle } from 'react-icons/bs';

//Get server side props
export async function getServerSideProps(context) {
    const { id } = context.query;
    let formed_data = {};
    const params = new URLSearchParams(context.req.url);
    const lat = params.get("lat");
    const long = params.get("lon");
    try {
        const response = await axios.get(`https://restcountries.com/v3.1/name/${id}`);
        formed_data = {
            country_data : response.data[0],
        }
        const capital = response.data[0].capital;
        const weather_response = await axios.get(`https://weatherapi-com.p.rapidapi.com/current.json?q=${(lat && long) ? `${lat},${long}`:capital[0]}`, {
            headers: {
                'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com',
                'X-RapidAPI-Key': process.env.NEXT_PUBLIC_WEATHER_API_KEY
            }
        })
        formed_data = {
            ...formed_data,
            weather: weather_response.data
        }
        const atractions_response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_API}/atractions/${id}`);
        formed_data = {
            ...formed_data,
            atractions: atractions_response.data.atractions ? atractions_response.data.atractions : []
        }
    } catch (error) {
        console.log(error)
    }
    return {
        props: {
            id : id,
            ...formed_data
        }
    }
}

export default function Country ( { id, weather, country_data, atractions } ) {
    const router = useRouter();
    const [showBg, setShowBg] = useState(true);
    const [showLoading, setShowLoading] = useState(true);
    const [showAtractionInfo, setShowAtractionInfo] = useState(false);
    const [searchModal, setSearchModal] = useState(false);
    const [selectedAtraction, setSelectedAtraction] = useState(0);
    useEffect(() => { 
        if(!weather || !country_data) {
            router.push('/')
        }
        setTimeout(() => {
            setShowLoading(false)
        }, 1000);
    },[])

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
                <main className={`w-[100vw] h-[100vh] overflow-hidden p-5 flex flex-col text-[#e0dddd] z-10 relative ${!location && 'bg-[#0b1b25] items-center justify-center'}`}>
                    <Topbar bgClick={bgClick} showBg={showBg} data={weather}/>
                    {showBg &&
                        <>
                            <section className='grow overflow-hidden py-5'>
                                <div className='flex justify-between items-center'>
                                    <div className='flex items-center flex-col '>
                                        <img src={weather.current.condition.icon} alt='weather'/>
                                        <p>{weather.current.condition.text}</p>
                                    </div>
                                    <h2 className='text-7xl'>
                                        {parseInt(weather.current.temp_c)}°C
                                    </h2>
                                </div>
                                {(showAtractionInfo && atractions.length > 0) && 
                                    <div className='my-5'>
                                        <h3 className='font-bold text-lg'>{atractions[selectedAtraction].name}</h3>
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