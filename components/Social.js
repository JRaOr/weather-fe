import { AiFillGithub, AiFillLinkedin, AiFillInstagram, AiFillFacebook } from 'react-icons/ai';
export default function Social() {
    const social = [
        { link: 'https://github.com/JRaOR', icon : <AiFillGithub/>, color: 'github'},
        { link: 'https://www.linkedin.com/in/gerardo-ramirez-ortega-a2239b133/', icon : <AiFillLinkedin/>, color: 'linkedin'},
        { link: 'https://www.instagram.com/gerardo.raor/', icon : <AiFillInstagram/>, color: 'instagram'},
        { link: 'https://www.facebook.com/gerardo.ramirezortega.5', icon : <AiFillFacebook/>, color: 'facebook'},
    ]
    return(
        <div className='flex mt-10 gap-5 text-3xl'>
            {social.map((item, index)=>(
                <a href={item.link} target='_blank' rel='noopener noreferrer' key={index} className={`text-white ${item.color} transition-all ease-in-out duration-300`}>
                    {item.icon}
                </a>
            ))}
        </div>
    )
}