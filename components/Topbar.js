import { AiOutlineMenu } from 'react-icons/ai';
import { MdOutlineShareLocation } from 'react-icons/md';
import { BiPhotoAlbum } from 'react-icons/bi';
export default function Topbar ({ menuClick, bgClick, showBg, data }) {
    return(
        <header className='flex w-full h-10 items-center justify-between text-lg'>
            {showBg &&
            <>
                <p className='flex items-center gap-2'>
                    <span className='text-sky-400'>
                        <MdOutlineShareLocation/>
                    </span>
                    {data?.location.name}, {data?.location.country}
                </p>
            </>}
            <div className={!showBg ? 'ml-auto text-white bg-[#000A] rounded-full items-center justify-center flex w-10 h-10':''}>
                <button onClick={bgClick} className='text-xl'>
                    <BiPhotoAlbum/>
                </button>
            </div>
        </header>
    )
}