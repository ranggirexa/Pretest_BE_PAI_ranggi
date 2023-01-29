import axios from 'axios';
import jwt_decode from 'jwt-decode';
import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import {Line} from 'react-chartjs-2'
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(
	LineElement,
	CategoryScale,
	LinearScale,
	PointElement
)

const Dashboard = () => {
	const [name, setName] = useState('')
	const [token, setToken] = useState('')
	const [expire, setExpire] = useState('')
	const [fields, set_field] = useState([])
	const [plants, set_plant] = useState([])
	const navigate = useNavigate();

	useEffect(() => {
		refreshToken()
		// getUsers()
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
		const response = await axiosJWT.get('http://localhost:5000/dashboard',{
			headers:{
				Authorization: `Bearer ${token}`
			}
		})
		const plant = response.data.plants
		set_plant(plant.map((plant) => (
			parseInt(plant.plantCount, 10 )
		)))
		set_field(plant.map((field) => (
			field.field.field_location
		)))
		console.log('plant ', plants );
	}

	const data = {
		labels:fields,
		datasets: [{
			data: plants,
			backgroundColor: 'transparent',
			borderColor: '#f26c6d',
			pointBorderColor: 'transparent',
			pointBorderWidth: 4,
			tension: 0.5,
		}]
	}
	const options={
		plugins:{
			legend: false
		},
		scales:{
			x: {
				grid:{
					borderDash: [10]
				}
			},
			y:{
				min:0,
				max: 500,
				ticks:{
					stepSize: 1,
					// callback:(value) => value + "K"
				},
				grid :{
					borderDash: [10]
				}
			}
		}
	}

	return (
		<div className="container mt-5" >
			<h1> Wellcome Back: {name}</h1>
			<div  className='mb-2'>
				<Line data = {data} options={options}>  </Line>
			</div>
		</div>
	)
}

export default Dashboard