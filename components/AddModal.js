import { AiOutlineClose } from 'react-icons/ai';
import { useState, useEffect } from 'react';
import { IoMdAddCircleOutline } from 'react-icons/io';
import axios from 'axios';
export default function AddModal ({ onClose, country, user, onSuccess }) { 
    const [image, setImage] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    async function submit() {
        if(image && name && description){
            try {                
                const body = new FormData();
                body.append('file', image);
                const image_response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_API}/upload`, body)
                if(image_response.data.success){
                    const data = {
                        atraction : {
                            name,
                            description,
                            file: image_response.data.filename,
                            country: country.toLowerCase(),
                            user: user
                        }
                    }
                    const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_API}/update`, data);
                    if(response.data.success){
                        onSuccess();
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
    }
    return (
        <div className="modal-container">
            <div className='modal-content text-white fade-animation max-h-[700px]'>
                <div className='flex w-full justify-between items-center'>
                    <p>Add atraction to: {country}</p>
                    <button onClick={onClose}>
                        <AiOutlineClose/>
                    </button>
                </div>
                <div className='h-[200px] w-[200px] my-5'>
                    <img className='w-full h-full object-contain' src={image ? URL.createObjectURL(image) : '/default.jpg'} alt={country}/>
                </div>
                <input className='w-full shadow-lg' type='file' onChange={(e) => {
                    setImage(e.target.files[0]);
                }} />
                <input value={name} onChange={(e) => setName(e.target.value)} className='w-full my-2 p-2 outline-none rounded-md bg-transparent border-2 focus:border-sky-400' type={'text'} placeholder='Atraction name ex: Bellas Artes...' />
                <textarea value={description} onChange={(e)=> setDescription(e.target.value)} className='w-full  outline-none rounded-md bg-transparent border-2 focus:border-sky-400 p-2 min-h-[200px]' placeholder='Description...' />
                <button onClick={() => {
                    submit()
                }} className='py-2 px-5 bg-sky-700 rounded-md mt-4 flex items-center gap-2 hover:bg-sky-600 transition-all ease-in-out duration-300'>
                    Add <IoMdAddCircleOutline/>
                </button>
            </div>
        </div>
    )
}