import axios from 'axios'
import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'

const Add_product = () => {
    const [username, setUsername]=useState("")
    const [password, setPassword]=useState("")
    const [role, setRole]=useState("")
    const navigate =useNavigate()

    const saveProduct = async (e) => {
        e.preventDefault()
        try {
            await axios.post('http://localhost:5000/users',{
                username,password,role
            })
            navigate("/dashboard")
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <div className="columns mt-5 is-centered">
        <div className="column is-half">
            <form onSubmit={saveProduct}>
                <div className="field">
                    <label className="label">Name</label>
                    <div className="control">
                        <input type="text" className="input" value={username} onChange={(e)=>setUsername(e.target.value)} placeholder='username'/>
                    </div>
                </div>
                <div className="field">
                    <label className="label">Password</label>
                    <div className="control">
                        <input type="text" className="input" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='password'/>
                    </div>
                </div>
                <div className="field">
                    <label className="label">Role</label>
                    <div className="control">
                        <input type="text" className="input" value={role} onChange={(e)=>setRole(e.target.value)} placeholder='role'/>
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

export default Add_product