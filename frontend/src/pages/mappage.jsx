import {

MapContainer,

TileLayer,

Marker,

Popup

} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import {useEffect,useState} from "react";

import api from "../services/api";

function MapPage(){

const [centers,setCenters]=useState([]);

useEffect(()=>{

api.get("/api/centers").then(res=>{

setCenters(res.data)

})

},[])

return(

<div>

<h1 className="text-3xl font-bold p-6">

Collection Centers

</h1>

<MapContainer

center={[13.6288,79.4192]}

zoom={13}

style={{

height:"600px"

}}

>

<TileLayer

url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

/>

{

centers.map((c,index)=>

<Marker

key={index}

position={[c.lat,c.lng]}

>

<Popup>

{c.name}

</Popup>

</Marker>

)

}

</MapContainer>

</div>

)

}

export default MapPage