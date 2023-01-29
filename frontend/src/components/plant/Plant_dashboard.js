import axios from 'axios';
import jwt_decode from 'jwt-decode';
import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import ReactPaginate from "react-paginate";


const Plant_dashboard = () => {
	const [name, setName] = useState('')
	const [token, setToken] = useState('')
	const [expire, setExpire] = useState('')
	const [plant, set_plant] = useState([])
	const [page, setPage] = useState(0);
	const [pages, setPages] = useState(0);
	const [rows, setRows] = useState(0);
	const [keyword, setKeyword] = useState("");
	const [query, setQuery] = useState("");
	const [msg, setMsg] = useState("");
	const [limit, setLimit] = useState(10);

	const navigate = useNavigate();

	useEffect(() => {
		refreshToken()
		get_plant()
	}, [page, keyword])

	const refreshToken = async() => {
		try {
			const response = await axios.get('http://localhost:5000/token')
			setToken(response.data.accessToken)
			const decode = jwt_decode(response.data.accessToken)
			setName(decode.name)
			setExpire(decode.exp)
		} catch (error) {
			if(error.response){
				navigate('/')
			}
		}
	}

	const axiosJWT = axios.create()

	axiosJWT.interceptors.request.use(async(config) => {
		const currentDate = new Date()
		if(expire * 1000 < currentDate.getTime()){
			const response = await axios.get('http://localhost:5000/token')
			config.headers.Authorization = `Bearer ${response.data.accessToken}`
			setToken(response.data.accessToken)
			const decode = jwt_decode(response.data.accessToken)
			setName(decode.name)
			setExpire(decode.exp)
		}
		return config;
	}, (error) => {
		return Promise.reject(error)
	})

	const get_plant = async() => {
		const response = await axiosJWT.get(
			`http://localhost:5000/plant?search_query=${keyword}&page=${page}&limit=${limit}`,{
			headers:{
				Authorization: `Bearer ${token}`
			}
		})
		set_plant(response.data.plants)
		setPage(response.data.page);
		setPages(response.data.totalPage);
		setRows(response.data.totalRows);
	}

	const delete_plant = async (fieldId) => {
		try {
			await axiosJWT.delete(`http://localhost:5000/plant/${fieldId}`,{
				headers:{
					Authorization: `Bearer ${token}`
				}
			})
			get_plant()
		} catch (error) {
			console.log(error);
		}
	}
	const searchData = (e) => {
		e.preventDefault();
		setPage(0);
		setMsg("");
		setKeyword(query);
	  };

	  const changePage = ({ selected }) => {
		setPage(selected);
		if (selected === 9) {
		  setMsg(
			"Jika tidak menemukan data yang Anda cari, silahkan cari data dengan kata kunci spesifik!"
		  );
		} else {
		  setMsg("");
		}
	  };
	  
return (
    <div className="container mt-5">
      <div className="columns">
        <div className="column is-centered">
	  	<Link to={'add'} className="button is-info mx-2">Tambah Tanaman</Link>
 		<button onClick={get_plant} className='button is-info mb-2'> Refresh </button>
          <form onSubmit={searchData}>
            <div className="field has-addons">
              <div className="control is-expanded">
                <input
                  type="text"
                  className="input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Find something here..."
                />
              </div>
              <div className="control">
                <button type="submit" className="button is-info">
                  Search
                </button>
              </div>
            </div>
          </form>
          <table className="table is-striped is-bordered is-fullwidth mt-2">
            <thead>
              <tr>
			  	<th>No</th>
				<th>Nama Tanaman</th>
				<th>Kondisi Tanaman</th>
				<th>Jumlah Tanaman</th>
				<th>Kode Lahan</th>
				<th>Lokasi Lahan</th>
				<th>Temperatur Lahan</th>
				<th>...</th>
              </tr>
            </thead>
            <tbody>
				{plant.map((plant, index) => (
					<tr key = {plant.id}>
						<td> {index  + 1} </td>
						<td> {plant.plant_name}</td>
						<td> {plant.plant_condition}</td>
						<td> {plant.plant_quantity}</td>
						<td> {plant.field.field_code} </td>
						<td> {plant.field.field_location} </td>
						<td> {plant.field.weather_location} </td>
						<td> 
							<Link to={`edit/${plant.id}`}> Edit </Link> || 
							<a onClick={() => delete_plant(plant.id)}> Delete </a>
						</td>
					</tr>
				))}
			</tbody>
          </table>
          <p>
            Total Rows: {rows} Page: {rows ? page + 1 : 0} of {pages}
          </p>
          <p className="has-text-centered has-text-danger">{msg}</p>
          <nav
            className="pagination is-centered"
            key={rows}
            role="navigation"
            aria-label="pagination"
          >
            <ReactPaginate
              previousLabel={"< Prev"}
              nextLabel={"Next >"}
              pageCount={Math.min(10, pages)}
              onPageChange={changePage}
              containerClassName={"pagination-list"}
              pageLinkClassName={"pagination-link"}
              previousLinkClassName={"pagination-previous"}
              nextLinkClassName={"pagination-next"}
              activeLinkClassName={"pagination-link is-current"}
              disabledLinkClassName={"pagination-link is-disabled"}
            />
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Plant_dashboard