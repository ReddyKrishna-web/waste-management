import {

BrowserRouter,

Routes,

Route,

Link

} from "react-router-dom";

import Home from "./pages/Home";

import Dashboard from "./pages/Dashboard";

import History from "./pages/History";

import MapPage from "./pages/MapPage";

function App(){

return(

<BrowserRouter>

<nav className="bg-green-700 text-white p-4 flex gap-6">

<Link to="/">Home</Link>

<Link to="/dashboard">Dashboard</Link>

<Link to="/history">History</Link>

<Link to="/map">Map</Link>

</nav>

<Routes>

<Route path="/" element={<Home/>}/>

<Route path="/dashboard" element={<Dashboard/>}/>

<Route path="/history" element={<History/>}/>

<Route path="/map" element={<MapPage/>}/>

</Routes>

</BrowserRouter>

)

}

export default App