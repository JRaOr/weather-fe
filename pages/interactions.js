import Loading from "../components/Loading";
import Menu from "../components/Menu";
import SearchModal from "../components/SearchModal";
import { useState, useEffect } from "react";
import { getProviders, signIn, signOut, useSession } from "next-auth/react"
import { FcGoogle } from "react-icons/fc"
import { SiBattledotnet } from "react-icons/si"
import { useRouter } from "next/router";
import Social from "../components/Social";
import { IoMdExit } from "react-icons/io";
import countries from "../public/countries.json";
import axios from "axios";
import { IoMdAddCircleOutline } from "react-icons/io";
import AddModal from "../components/AddModal";
import Link from "next/link";
export async function getServerSideProps(){
    const providers = await getProviders();
    return {
        props: {
            providers
        }
    }
}
export default function Interactions ({ providers }) {
    const [showLoading, setShowLoading] = useState(true);
    const [searchModal, setSearchModal] = useState(false);
    const session = useSession()
    const [selectedCountry, setSelectedCountry] = useState('Spain');
    const router = useRouter()
    const [atractions, setAtractions] = useState([]);
    const [normalCountries, setNormalCountries] = useState([]);
    const [addModal, setAddModal] = useState(false);
    const logos = {
        'Google': <FcGoogle className='' />,
        'Battle.net': <SiBattledotnet className='' />
    }

    function toggleSearch () {
        setSearchModal(!searchModal)
    }

    useEffect(() => {
        let countries_list = [];
        Object.keys(countries).map(key => {
            countries_list.push({
                name: countries[key],
                key: countries[key].toLowerCase()
            });
        });
        setNormalCountries(countries_list);
    },[])

    useEffect(() => {
        console.log(session)
        if(session.status !== 'loading'){
            setShowLoading(false)
        }
    },[session])

    useEffect(() => {
        getData();
    }, [selectedCountry])

    async function getData () {
        if(selectedCountry){
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_API}/atractions/${selectedCountry.toLowerCase()}`);
            console.log(response.data)
            setAtractions(response.data.atractions);
        }
    }

    function handleAddModal() {
        setAddModal(!addModal)
    }

    function handleSuccess() {
        getData();
        setAddModal(false)
    }

    return (
        <>
            {showLoading ? <Loading/> : 
            <main className="w-[100vw] h-[100vh] relative bg-[#0f101a] p-5 flex flex-col text-white">
                {session.status === 'authenticated' ?
                <section className="grow flex flex-col items-center w-full overflow-auto py-10">
                    <div className="flex items-center flex-col w-full">
                        <div className="relative">
                            <img src={session.data.user.image} alt="" className="w-32 h-32 object-contain rounded-full overflow-hidden"/>
                            <button className="text-red-500 absolute right-0 bottom-0 rounded-full bg-white h-8 w-8 flex items-center justify-center text-xl" onClick={()=> signOut()}>
                                <IoMdExit/>
                            </button>
                        </div>
                        <p className="my-4 font-semibold  text-xl">{session.data.user.name}</p>
                        <div className="border-b-[1px] w-full" />
                        <select value={selectedCountry} onChange={(e)=>{
                            setSelectedCountry(e.target.value)
                        }} className="w-full my-4 bg-transparent border-2 py-2 rounded-md focus:border-sky-400">
                            {normalCountries.map((country, index) => (
                                <option selected={selectedCountry === country.name}  className="bg-[#292626] py-2 px-5" key={index} value={country.name}>{country.name}</option>
                            ))}
                        </select>
                        {selectedCountry && 
                        <Link href={`/country/${selectedCountry.toLowerCase()}`}>
                            <p className="text-sky-400">Visit country</p>
                        </Link>}
                        <div>
                            {atractions.map((atraction, index) => (
                                <div key={index} className="flex items-center my-4 w-full p-2 bg-[#11182e] rounded-md">
                                    <img src={`https://weather-app-midu.s3.amazonaws.com/places/${atraction.file}`} alt="" className="image-add"/>
                                    <div className="px-2 text-left">
                                        <p className="font-semibold text-xl">{atraction.name}</p>
                                        <p>{atraction.description}</p>
                                    </div>
                                </div>
                            ))}
                            
                        </div>
                        {selectedCountry && 
                            <button onClick={() => {
                                setAddModal(true)
                            }} className="text-2xl text-white hover:text-sky-600 transition-all ease-in-out duration-300">
                                <IoMdAddCircleOutline/>
                            </button>}
                    </div>
                </section>:
                <section className="grow flex flex-col items-center justify-center">
                    <img src='/rainthunder.svg'/>
                    <h1 className='text-2xl mt-2'>Weather App</h1>
                    <p className="my-5 text-lg">
                        Do you want to add your country?
                    </p>
                    {Object.values(providers).map((provider) => (
                        <div className="w-full flex items-center justify-center" key={provider.name}>
                            <button className="px-4 py-2 bg-sky-700 rounded-md flex gap-2 items-center hover:bg-sky-500 transition-all ease-in-out duration-300 mb-5" onClick={() => signIn(provider.id, {callbackUrl: '/interactions'})}>
                                Sign in with {logos[provider.name]}
                            </button>
                        </div>
                    ))}
                    <div className="border-b-[1px] w-full max-w-[300px] mb-5"/>
                    <Social/>
                </section>}
                {addModal && <AddModal onSuccess={handleSuccess} onClose={handleAddModal} country={selectedCountry} user={session.data.user}/>}
                <Menu toggleSearch={toggleSearch}/>
                {searchModal && <SearchModal onClose={ () => setSearchModal(false) }/>}
            </main>}
        </>
    )
}