import { useRouter } from 'next/router';
import { AiOutlineHome, AiOutlineSearch } from 'react-icons/ai';
import { BiMapPin } from 'react-icons/bi';
import { HiOutlineUser } from 'react-icons/hi';
export default function Menu( { toggleSearch }) {
    const router = useRouter();
    return(
        <div className="w-full h-12 bg-[#16182a] rounded-lg flex items-center justify-around">
            <button onClick={() => {
                if(router.pathname !== '/'){
                    router.push('/')
                }
            }} className={`menu-button ${window.location.pathname === '/' ? 'text-sky-400':'text-white'}`}>
                <AiOutlineHome/>
            </button>
            <button onClick={toggleSearch} className='menu-button'>
                <AiOutlineSearch/>
            </button>
            <button className='menu-button'>
                <HiOutlineUser/>
            </button>
            <button onClick={()=>{
                if(router.pathname !== '/map'){
                    router.push('/map')
                }
            }} className={`menu-button ${window.location.pathname === '/map' ? 'text-sky-400':'text-white'}`}>
                <BiMapPin/>
            </button>
        </div>
    )
}