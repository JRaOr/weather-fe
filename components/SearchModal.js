import { AiOutlineClose } from 'react-icons/ai';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { FiExternalLink } from 'react-icons/fi';
import countries_data from '../public/countries.json';
export default function SearchModal({ onClose }) {
    const [search, setSearch] = useState('');
    const [countries, setCountries] = useState([]);
    const [normalCountries, setNormalCountries] = useState([]);
    const [alreadyListed, setAlreadyListed] = useState([]);
    useEffect(() =>{
        if(search !== ''){
            getExistingCountries();
            let countries_list = [];
            Object.keys(countries_data).map(key => {
                if(countries_data[key].toLowerCase().includes(search.toLowerCase())){
                    countries_list.push({
                        name: countries_data[key],
                        key: countries_data[key].toLowerCase()
                    });
                }
            });
            setNormalCountries(countries_list);
        } else {
            setCountries([]);
            setNormalCountries([]);
        }
    }, [search])

    async function getExistingCountries() {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_API}/countries/${search}`);
        setCountries(response.data.countries);
    }

    useEffect(() => {
        const alreadyListedCountries = [];
        countries.map(country => {
            alreadyListedCountries.push(country.key);
        });
        setAlreadyListed(alreadyListedCountries);
    },[countries])

    return (
        <div className="modal-container">
            <div className='modal-content text-white'>
                <div className='w-full sticky top-0 bg-[#16182a]'>
                    <div className='flex justify-between w-full text-xl mb-5'>
                        <p className='font-semibold'>Search for country</p>
                        <button onClick={onClose}>
                            <AiOutlineClose/>
                        </button>
                    </div>
                    <input onChange={(e)=>{ setSearch(e.target.value) }} value={search} className='w-full mb-5 h-10 text-xl px-3 py-2 outline-none text-white bg-transparent border-[1px] rounded-md focus:border-2 focus:border-sky-600'  type={'text'} placeholder='Type a country...' />
                </div>
                <section className='w-full grow overflow-auto'>
                    {countries.length > 0 && <h2 className='text-xl mb-4'>Our Iconic Countries</h2>}
                    <ul>
                        {countries.map((country, index) => {
                            return (
                                <Link key={`country-${index}`} href={`/country/${country.key}`}>
                                    <li onClick={onClose} className='flex justify-between items-center p-2 text-lg bg-[#0d0e18] rounded-md mb-2 cursor-pointer hover:text-sky-600 transition-all ease-in-out duration-300'>
                                        <div>
                                            <p className='font-semibold'>{country.name}</p>
                                        </div>
                                        <button>
                                            <FiExternalLink/>
                                        </button>
                                    </li>
                                </Link>
                            )
                        })}
                    </ul>
                    {normalCountries.length > 0 && <h2 className='text-xl mb-4'>Other countries</h2>}
                    <ul>
                        {normalCountries.map((country, index) => {
                            if(alreadyListed.includes(country.key)){
                                return null;
                            }
                            return (
                                <Link key={`country-${index}`} href={`/country/${country.key}`}>
                                    <li onClick={onClose} className='flex justify-between items-center p-2 text-lg bg-[#0d0e18] rounded-md mb-2 cursor-pointer hover:text-sky-600 transition-all ease-in-out duration-300'>
                                        <div>
                                            <p className='font-semibold'>{country.name}</p>
                                        </div>
                                        <button>
                                            <FiExternalLink/>
                                        </button>
                                    </li>
                                </Link>
                            )
                        })}
                    </ul>
                </section>
            </div>
            
        </div>
    )
}