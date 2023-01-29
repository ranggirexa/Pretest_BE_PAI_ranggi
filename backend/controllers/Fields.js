import Fields from "../models/fieldModel.js"
import fetch from "node-fetch"

export const add_field = async (req, res) => {
	const {field_code, field_area, field_location} = req.body

	const apiKey = '0e7fe0142af0cbca332e5211b4a78f12'
	const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${field_location}&units=metric&APPID=${apiKey}`);
	const body = await response.json();
	// console.log(body.main.temp);
	if(body.cod != 200) return res.status(400).json({msg: "kota lokasi lahan tidak ditemukan"})

	try {
		await Fields.create({
			id_user:req.user_id,
			field_code: field_code,
			field_area: field_area,
			field_location: field_location,
			weather_location: body.main.temp
		})
		res.json({msg: "tambah lahan Berhasil"})
	} catch (error) {
		console.log(error);
	}
}

export const get_field = async(req, res) => {
	try {
		const fields = await Fields.findAll({
			where:{
				id_user:req.user_id
			}
		})
		res.json(fields)
	} catch (error) {
		console.log(error);
	}
}

export const get_field_by_id = async(req, res) => {
	try {
		const fields = await Fields.findOne({
			where:{
				id:req.params.id,
				id_user:req.user_id,
			}
		})
		res.json(fields)
	} catch (error) {
		console.log(error);
	}
}

export const update_field = async(req, res) => {
	const {field_code, field_area, field_location} = req.body


	const apiKey = '0e7fe0142af0cbca332e5211b4a78f12'
	const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${field_location}&units=metric&APPID=${apiKey}`);
	const body = await response.json();
	// console.log(body.main.temp);
	if(body.cod != 200) return res.status(400).json({msg: "kota lokasi lahan tidak ditemukan"})


	const fields = await Fields.findOne({
		where:{
			id : req.params.id
		}
	})
	
	if(!fields) return res.status(404).json({msg: "No Data Found"})

	try {
		await Fields.update({
			id_user:req.user_id,
			field_code: field_code,
			field_area: field_area,
			field_location: field_location
		},{
			where:{
				id: req.params.id
			}
		})
		res.status(200).json({msg: "Fields updated successfully"})
	} catch (error) {
		console.log(error.message);
	}
}

export const delete_field = async(req, res) => {

	const fields = await Fields.findOne({
		where:{
			id : req.params.id
		}
	})
	if(!fields) return res.status(404).json({msg: "No Data Found"})

	try {
		await Fields.destroy({
			where:{
				id : req.params.id
			}
		})
		res.status(200).json({msg: "Field Deleted Successfuly"})
	} catch (error) {
		console.log(error.message);
	}
	
}