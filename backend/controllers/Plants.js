import Plants from "../models/plantModel.js"
import Fields from "../models/fieldModel.js"
import {Op} from "sequelize";

export const add_plant = async (req, res) => {
	const {plant_name, plant_condition, id_field} = req.body

	const fields = await Fields.findOne({
		where:{
			id : id_field,
			id_user:req.user_id,
		}
	})
	
	if(!fields) return res.status(404).json({msg: "Data Field Not Found"})

	try {
		await Plants.create({
			id_user:req.user_id,
			id_field: id_field,
			plant_name: plant_name,
			plant_condition: plant_condition,
		})
		res.json({msg: "tambah Tanaman Berhasil"})
	} catch (error) {
		console.log(error);
	}
}

export const get_plant_by_user = async(req, res) => {
	const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search_query || "";
    const offset = limit * page;
	const totalRows = await Plants.count({
        where:{
            [Op.or]: [{plant_name:{
                [Op.like]: '%'+search+'%'
            }}, 
			{plant_condition:{
                [Op.like]: '%'+search+'%'
            }}]
        },
		include:[{
			model:Fields, as:'field',
		}]
    }); 
    const totalPage = Math.ceil(totalRows / limit);

	try {
		const plants = await Plants.findAll({
			// where:{
			// 	[Op.or]: [{plant_name:{
			// 		[Op.like]: '%'+search+'%'
			// 	}}, 
			// 	{plant_condition:{
			// 		[Op.like]: '%'+search+'%'
			// 	}},
			// 	{'$Plants.Fields.field_code$':{
			// 		[Op.like]: '%'+search+'%'
			// 	}}, 
			// 	{'$Plants.Fields.field_location$':{
			// 		[Op.like]: '%'+search+'%'
			// 	}}],
			// 	id_user:req.user_id
			// },
			include:[{
				model:Fields, as:'field',required: true, 
				duplicating: false,
				where:{
					[Op.or]: [
					{'$plants.plant_name$':{
					[Op.like]: '%'+search+'%'
					}}, 
					{'$plants.plant_condition$':{
						[Op.like]: '%'+search+'%'
					}},
					{field_code:{
						[Op.like]: '%'+search+'%'
					}}, 
					{field_location:{
						[Op.like]: '%'+search+'%'
					}}],
					id_user:req.user_id
				},
				// where:{
				// 	[Op.or]: [{field_code:{
				// 		[Op.like]: '%'+search+'%'
				// 	}}, 
				// 	{field_location:{
				// 		[Op.like]: '%'+search+'%'
				// 	}}]
				// },
			}],
			offset: offset,
       	 	limit: limit,
			order:[
				['id', 'DESC']
			]
		})
		res.json({
			plants: plants,
			page: page,
			limit: limit,
			totalRows: totalRows,
			totalPage: totalPage
		});
	} catch (error) {
		console.log(error);
	}
}

export const get_plant_by_field = async(req, res) => {
	try {
		const plants = await Plants.findAll({
			where:{
				id_field:req.params.id_field
			}
		})
		res.json(plants)
	} catch (error) {
		console.log(error);
	}
}

export const get_plant_by_id = async(req, res) => {
	try {
		const plants = await Plants.findOne({
			where:{
				id:req.params.id,
				id_user:req.user_id,
			}
		})
		res.json(plants)
	} catch (error) {
		console.log(error);
	}
}

export const update_plant = async(req, res) => {
	const {plant_name, plant_condition, id_field} = req.body

	const plants = await Plants.findOne({
		where:{
			id : req.params.id
		}
	})
	
	if(!plants) return res.status(404).json({msg: "No Data Found"})

	try {
		await Plants.update({
			id_user:req.user_id,
			plant_name: plant_name,
			plant_condition: plant_condition,
			id_field: id_field
		},{
			where:{
				id: req.params.id
			}
		})
		res.status(200).json({msg: "plants updated successfully"})
	} catch (error) {
		console.log(error.message);
	}
}

export const delete_plant = async(req, res) => {

	const plants = await Plants.findOne({
		where:{
			id : req.params.id
		}
	})
	if(!plants) return res.status(404).json({msg: "No Data Found"})

	try {
		await Plants.destroy({
			where:{
				id : req.params.id
			}
		})
		res.status(200).json({msg: "plant Deleted Successfuly"})
	} catch (error) {
		console.log(error.message);
	}
	
}