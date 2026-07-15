import { useEffect, useState } from "react";
import api from "../services/api";

import {

Chart as ChartJS,

ArcElement,

Tooltip,

Legend

} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(

ArcElement,

Tooltip,

Legend

);

function Dashboard(){

const [stats,setStats]=useState(null);

useEffect(()=>{

api.get("/api/dashboard").then(res=>{

setStats(res.data)

})

},[])

if(!stats) return <h2>Loading...</h2>

const data={

labels:["Recyclable","Hazardous"],

datasets:[{

data:[

stats.recyclable,

stats.hazardous

]

}]

}

return(

<div className="p-10">

<h1 className="text-4xl font-bold">

Dashboard

</h1>

<div className="grid grid-cols-3 gap-5 mt-8">

<div className="bg-green-200 p-6 rounded">

<h2>Total Scans</h2>

<h1>{stats.total}</h1>

</div>

<div className="bg-blue-200 p-6 rounded">

<h2>Recyclable</h2>

<h1>{stats.recyclable}</h1>

</div>

<div className="bg-red-200 p-6 rounded">

<h2>Hazardous</h2>

<h1>{stats.hazardous}</h1>

</div>

</div>

<div className="mt-10 w-96">

<Pie data={data}/>

</div>

</div>

)

}

export default Dashboard