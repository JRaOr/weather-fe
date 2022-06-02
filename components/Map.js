import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import {useState} from 'react'
import getCenter from 'geolib/es/getCenter'
function Map({ coordinates, onSelection}) {
    const center = getCenter(coordinates);
    const [marker, setMarker] = useState(null);
    const [viewport, setViewport] = useState({
        width: '100%',
        height: '100%',
        latitude: center.latitude,
        longitude: center.longitude,
        zoom: 2,
    })

    function handleClick (e) {
        e.preventDefault();
        setViewport({
            ...viewport,
            latitude: e.lngLat[1],
            longitude: e.lngLat[0]
        })
        setMarker({
            latitude: e.lngLat[1],
            longitude: e.lngLat[0],
        });
        onSelection({
            latitude: e.lngLat[1],
            longitude: e.lngLat[0],
        });
    }
    return (
        <ReactMapGL
            mapStyle='mapbox://styles/gerardoraor/cksmg7omf16ek18rwi76p8l1t'
            mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
            {...viewport}
            onViewportChange={(nextViewPort)=> setViewport(nextViewPort)}
            onClick={handleClick}
        >
            {marker && <>
                <Marker 
                    longitude={marker.longitude}
                    latitude={marker.latitude}
                    offsetLeft={-20}
                    offsetTop={-40}
                >
                    <div className='w-[40px] h-[40px]'>
                        <img src='/location.png' alt='location' className=' object-contain w-[40px] h-[40px]'/>
                    </div>
                </Marker>
            </>}
        </ReactMapGL>
    )
}

export default Map
