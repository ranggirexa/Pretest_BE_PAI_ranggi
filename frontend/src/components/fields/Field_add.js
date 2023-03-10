import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, } from 'react-router-dom'
import jwt_decode from 'jwt-decode';


const Field_add = () => {
	const [field_code, set_Field_code]=useState("")
    const [field_area, set_Field_area]=useState("")
    const [field_location, set_Field_location]=useState("")
    const [user_id, set_user_id]=useState("")
	const [token, setToken] = useState('')
	const [expire, setExpire] = useState('')
	const [msg, setMsg] = useState('')
    const navigate =useNavigate()

	useEffect(() => {
		refreshToken()
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

    const saveField = async (e) => {
        e.preventDefault()
		const formData = new FormData()
		formData.append("id_user", user_id)
		formData.append("field_code", field_code)
		formData.append("field_area", field_area)
		formData.append("field_location", field_location)

        try {
            await axiosJWT.post('http://localhost:5000/field', formData,{
				
				headers:{
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
            })
            navigate("/dashboard/fields")
        } catch (error) {
            if(error.response){
				setMsg(error.response.data.msg)
			}
        }
    }

	return (
		<div className="columns mt-5 is-centered">
			<div className="column is-half">
				<form onSubmit={saveField}>
					<p className='has-text-centered'>{msg}</p>

					<input type="hidden"className="input"  value={user_id} />

					<div className="field">
						<label className="label">Kode Lahan</label>
						<div className="control">
							<input type="text" className="input" value={field_code} onChange={(e)=>set_Field_code(e.target.value)} placeholder='field_code'/>
						</div>
					</div>
					<div className="field">
						<label className="label">Luas Lahan</label>
						<div className="control">
							<input type="text" className="input" value={field_area} onChange={(e)=>set_Field_area(e.target.value)} placeholder='field_area'/>
						</div>
					</div>
					<div className="field">
						<label className="label">Lokasi Lahan</label>
						<div className="control">
							<input type="text" className="input" value={field_location} onChange={(e)=>set_Field_location(e.target.value)} placeholder='field_location'/>
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

export default Field_add