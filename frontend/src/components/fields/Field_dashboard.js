import axios from 'axios';
import jwt_decode from 'jwt-decode';
import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';

const Field_dashboard = () => {
	const [name, setName] = useState('')
	const [token, setToken] = useState('')
	const [expire, setExpire] = useState('')
	const [field, set_field] = useState([])
	const navigate = useNavigate();

	useEffect(() => {
		refreshToken()
		get_field()
	}, [])

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

	const get_field = async() => {
		const response = await axiosJWT.get('http://localhost:5000/field',{
			headers:{
				Authorization: `Bearer ${token}`
			}
		})
		set_field(response.data)
	}

	const delete_field = async (fieldId) => {
		try {
			await axiosJWT.delete(`http://localhost:5000/field/${fieldId}`,{
				headers:{
					Authorization: `Bearer ${token}`
				}
			})
			get_field()
		} catch (error) {
			console.log(error);
		}
	}


  return (
	<div className="container mt-5" >
		<h1> Lahan Milik: {name}</h1>
		<Link to={'add'} className="button is-info">Tambah Lahan</Link>
		<button onClick={get_field} className='button is-info mx-2'> Refresh </button>

		<table className='table is-triped is-fullwidth'>
			<thead>
				<tr>
					<th>No</th>
					<th>Kode</th>
					<th>Luas (ha)</th>
					<th>Lokasi</th>
					<th>Suhu</th>
					<th>...</th>
				</tr>
			</thead>
			<tbody>
				{field.map((field, index) => (
					<tr key = {field.id}>
						<td> {index  + 1} </td>
						<td> {field.field_code}</td>
						<td> {field.field_area} </td>
						<td> {field.field_location} </td>
						<td> {field.weather_location} </td>
						<td> 
							<Link to={`edit/${field.id}`}> Edit </Link> || 
							<a onClick={() => delete_field(field.id)}> Delete </a>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	</div>
  )
}

export default Field_dashboard