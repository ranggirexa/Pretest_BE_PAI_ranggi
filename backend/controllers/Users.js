import Users from "../models/userModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import fetch from "node-fetch"

export const getUsers = async(req, res) => {
	try {
		const users = await Users.findAll({
			attributes:[ 'id', 'name', 'email', 'city']
		})
		res.json(users)
	} catch (error) {
		console.log(error);
	}
}

export const Register = async (req, res) => {
	const {name, email, city ,password, confPassword} = req.body
	
	const user = await Users.findAll({
		where:{
			email: email
		}
	})
	if(user[0]) return res.status(400).json({msg: "email has used"})

	if(password !== confPassword) return res.status(400).json({msg: "Password harus sama dengan konfirmasi password"})
	const salt  =  await bcrypt.genSalt()
	const hashPassword = await bcrypt.hash(password, salt)

	const apiKey = '0e7fe0142af0cbca332e5211b4a78f12'
	const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&APPID=${apiKey}`);
	const body = await response.json();
	if(body.cod != 200) return res.status(400).json({msg: "Kota Tidak Ditemukan"})
	
	try {
		await Users.create({
			name: name,
			email: email,
			city: city,
			password: hashPassword
		})
		res.json({msg: "Register Berhasil"})
	} catch (error) {
		console.log(error);
	}

}

export const Login = async(req, res) => {
	try {
		const user = await Users.findAll({
			where: {
				email: req.body.email
			}
		})
		const match = await bcrypt.compare(req.body.password, user[0].password)
		if(!match) return res.status(400).json({msg: "wrong password"})
		const userId = user[0].id
		const name = user[0].name
		const email = user[0].email

		const accessToken = jwt.sign({userId, name, email}, process.env.ACCESS_TOKEN_SECRET, {
			expiresIn: '20s'
		})
		const refreshToken = jwt.sign({userId, name, email}, process.env.REFRESH_TOKEN_SECRET, {
			expiresIn: '1d'
		})

		await Users.update({refresh_token:refreshToken},{
			where: {
				id: userId
			}
		})

		res.cookie('refreshToken', refreshToken,{
			httpOnly: true,
			maxAge: 24 * 60 * 60 * 1000,
		})

		res.json({ accessToken })

	} catch (error) {
		res.status(404).json({msg: "email tidak ditemukan"})
	}
}

export const Logout = async(req, res) => {
	const refreshToken = req.cookies.refreshToken
	if(!refreshToken) return res.sendStatus(204)

	const user = await Users.findAll({
		where:{
			refresh_token: refreshToken
		}
	})

	if(!user[0]) return res.sendStatus(204)

	const userid = user[0].id
	await Users.update({refresh_token: null}, {
		where:{
			id:userid
		}
	})
	res.clearCookie('refreshToken')
	return res.sendStatus(200)
}