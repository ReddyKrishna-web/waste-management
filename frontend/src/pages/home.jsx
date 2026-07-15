import { useState } from "react";
import api from "../services/api";

function Home() {

    const [item,setItem]=useState("");

    const [loading,setLoading]=useState(false);

    const [result,setResult]=useState(null);

    const analyze=async()=>{

        if(item==="") return;

        setLoading(true);

        const res=await api.post("/api/analyze",{

            item

        });

        setResult(res.data);

        setLoading(false);

    }

    return(

<div className="min-h-screen bg-green-50">

<div className="bg-green-700 text-white p-6 shadow-lg">

<h1 className="text-4xl font-bold">

🌱 WasteGuide AI

</h1>

<p>

AI Powered Sustainable Waste Management

</p>

</div>

<div className="max-w-4xl mx-auto mt-10">

<div className="bg-white rounded-xl shadow-xl p-8">

<input

className="border w-full p-4 rounded-lg"

placeholder="Enter Waste Item"

value={item}

onChange={(e)=>setItem(e.target.value)}

/>

<button

onClick={analyze}

className="bg-green-700 text-white mt-5 p-4 rounded-lg w-full"

>

{loading ? "Analyzing..." : "Analyze"}

</button>

</div>

{
result &&

<div className="bg-white rounded-xl shadow-xl mt-8 p-8">

<h2 className="text-3xl font-bold">

{result.category}

</h2>

<div className="grid grid-cols-2 gap-4 mt-6">

<div>

<h3 className="font-bold">

Recyclable

</h3>

<p>

{result.recyclable}

</p>

</div>

<div>

<h3 className="font-bold">

Hazard

</h3>

<p>

{result.hazard}

</p>

</div>

</div>

<div className="mt-6">

<h3 className="font-bold">

Eco Suggestion

</h3>

<p>

{result.ecoSuggestion}

</p>

</div>

<div className="mt-6">

<h3 className="font-bold">

Disposal Instructions

</h3>

<ul className="list-disc ml-6">

{

result.instructions.map((step,index)=>

<li key={index}>

{step}

</li>

)

}

</ul>

</div>

</div>

}

</div>

</div>

)

}

export default Home;