import Plants from "../models/plantModel.js"
import Fields from "../models/fieldModel.js"
import { Sequelize } from "sequelize";

export const get_data_for_graph = async(req, res) => {
	try {
		const plants = await Plants.findAll({
			attributes: [[Sequelize.fn('SUM', Sequelize.col('plant_quantity')), 'plantCount'], ],
			where:{
				id_user:req.user_id
			},
			include:[{
				model:Fields, 
				as:'field',
				required: true, 
				duplicating: false,
				attributes:['field_location'],
				// group: ['id']

			}],
			group: ['field.id']
		})
		res.json({
			plants: plants
		});
	} catch (error) {
		console.log(error);
	}
}
