import Loading from "../components/Loading";
import Menu from "../components/Menu";
import SearchModal from "../components/SearchModal";
import { useState, useEffect } from "react";
import { getProviders, signIn, signOut, useSession } from "next-auth/react"
import { FcGoogle } from "react-icons/fc"
import { SiBattledotnet } from "react-icons/si"
import { useRouter } from "next/router";
import Social from "../components/Social";

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
    const router = useRouter()

    const logos = {
        'Google': <FcGoogle className='' />,
        'Battle.net': <SiBattledotnet className='' />
    }

    function toggleSearch () {
        setSearchModal(!searchModal)
    }

    useEffect(() => {

    },[])

    useEffect(() => {
        if(session.status !== 'loading'){
            setShowLoading(false)
        }
    },[session])

    return (
        <>
            {showLoading ? <Loading/> : 
            <main className="w-[100vw] h-[100vh] relative bg-[#0b0c1e] p-5 flex flex-col text-white">
                {session.status === 'authenticated' ?
                <section className="grow">
                        <button onClick={()=> signOut()}>
                            Sign Out
                        </button>
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
                <Menu toggleSearch={toggleSearch}/>
                {searchModal && <SearchModal onClose={ () => setSearchModal(false) }/>}
            </main>}
        </>
    )
}