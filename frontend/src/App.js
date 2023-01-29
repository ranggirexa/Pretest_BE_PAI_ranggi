import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Add_product from "./components/Add_product";
import Dashboard from "./components/Dashboard";
import Field_add from "./components/fields/Field_add";
import Field_dashboard from "./components/fields/Field_dashboard";
import Field_edit from "./components/fields/Field_edit";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Plant_add from "./components/plant/Plant_add";
import Plant_dashboard from "./components/plant/Plant_dashboard";
import Plant_edit from "./components/plant/Plant_edit";
import Register from "./components/Register";

function App() {
  return (
    <Router>
		<Routes>
			<Route exact path="/" element= {<Login/>} />
			<Route path="/register" element= { <Register/>} />
			<Route path="/dashboard/add_product" element= { <Add_product/>} />
			<Route exact path="/dashboard" element={<><Navbar/><Dashboard/></>}/>
			<Route path="/dashboard/fields" element= { <><Navbar/><Field_dashboard/></>} />
			<Route path="/dashboard/fields/add" element= { <><Navbar/><Field_add/></>} />
			<Route path="/dashboard/fields/edit/:id" element= { <><Navbar/><Field_edit/></>} />
			<Route path="/dashboard/plants" element= { <><Navbar/><Plant_dashboard/></>} />
			<Route path="/dashboard/plants/add" element= { <><Navbar/><Plant_add/></>} />
			<Route path="/dashboard/plants/edit/:id" element= { <><Navbar/><Plant_edit/></>} />

		</Routes>
    </Router>
  );
}

export default App;
