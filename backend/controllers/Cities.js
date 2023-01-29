import City from "../models/cityModel.js";

export const get_city = async(req, res) => {
	try {
		const cities = await City.findAll({})
		res.json(cities)
	} catch (error) {
		console.log(error);
	}
}

export const get_city_by_id = async(req, res) => {
	try {
		const cities = await City.findOne({
			where:{
				id:req.params.id
			}
		})
		res.json(cities)
	} catch (error) {
		console.log(error);
	}
}