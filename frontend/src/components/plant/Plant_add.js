import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, } from 'react-router-dom'
import jwt_decode from 'jwt-decode';

const Plant_add = () => {
	const [field_code, set_Field_code]=useState("")
	const [plant_name, set_Plant_name]=useState("")
	const [plant_condition, set_Plant_condition]=useState("")
	const [plant_quantity, set_Plant_quantity]=useState("")
	const [field, set_field] = useState([])
    const [user_id, set_user_id]=useState("")
	const [token, setToken] = useState('')
	const [expire, setExpire] = useState('')
    const navigate =useNavigate()

	useEffect(() => {
		refreshToken()
		get_field()
	}, [])


	const refreshToken = async() => {
		try {
			const response = await axios.get('http://localhost:5000/token')
			setToken(response.data.accessToken)
			const decode = jwt_decode(response.data.accessToken)
			set_user_id(decode.userId)
			setExpire(decode.exp)
			console.log('firt', decode);
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
			set_user_id(decode.userId)
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
		// console.log('plant ', plant);
	}


    const saveField = async (e) => {
        e.preventDefault()
		const formData = new FormData()
		formData.append("id_user", user_id)
		formData.append("id_field", field_code)
		formData.append("plant_name", plant_name)
		formData.append("plant_condition", plant_condition)
		formData.append("plant_quantity", plant_quantity)

        try {
            await axiosJWT.post('http://localhost:5000/plant', formData,{
				
				headers:{
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
            })
            navigate("/dashboard/plants")
        } catch (error) {
            console.log(error);
        }
    }

	return (
		<div className="columns mt-5 is-centered">
			<div className="column is-half">
				<form onSubmit={saveField}>
					<input type="hidden"className="input"  value={user_id} />

					<div className="field">
						<label className="label">Nama Tanaman</label>
						<div className="control">
							<input type="text" className="input" value={plant_name} onChange={(e)=>set_Plant_name(e.target.value)} placeholder='nama tanaman'/>
						</div>
					</div>
					<div className="field">
						<label className="label">Jumlah Tanaman</label>
						<div className="control">
							<input type="text" className="input" value={plant_quantity} onChange={(e)=>set_Plant_quantity(e.target.value)} placeholder='Jumlah tanaman'/>
						</div>
					</div>
					<div className="field">
						<label className="label">Kondisi Tanaman</label>
						<div className="control select is-primary">
						<select value={plant_condition} onChange={(e)=>set_Plant_condition(e.target.value)}>
							<option value='0' >--pilih--</option>
							<option value='normal' >Normal</option>
							<option value='tidak normal' >Tidak Normal</option>
						</select>
						</div>
					</div>

					<div className="field">
						<label className="label">Kode Lahan</label>
						<div className="control select is-primary">
						<select value={field_code} onChange={(e)=>set_Field_code(e.target.value)}>
							<option value='0' >--pilih--</option>
							{field.map((field) => {
								return(
									<option key={field.id} value={field.id}>
										{field.field_code} - {field.field_location}
									</option>
								)
							})}
						</select>
						</div>
					</div>
					<div className="field">
						<button type='submit' className='button is-success' >submit</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default Plant_add