import { Player } from '@lottiefiles/react-lottie-player';
import { useRef } from 'react';
export default function Loading() {
    const _player = useRef(null);
    return (
        <div className="w-[100vw] h-[100vh] bg-[#0b1b25] flex items-center justify-center">
            <Player
                ref={_player} // set the ref to your class instance
                autoplay={true}
                loop={true}
                controls={true}
                src="/night-moon.json"
                style={{ height: '300px', width: '300px' }}
            ></Player>
        </div>
    )
}