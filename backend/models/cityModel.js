import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const City = db.define('cities', {
	city_name:{
		type: DataTypes.STRING
	},
	prov_id:{
		type: DataTypes.INTEGER
	},

},{
	freezeTableName: true
})

export default City