import { Sequelize } from "sequelize";
import db from "../config/Database.js";
// import Plants from "./plantModel.js";

const {DataTypes} = Sequelize;

const Fields = db.define('fields', {
	id_user: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
	},
	field_code:{
		type: DataTypes.STRING,
		allowNull: false,
	},
	field_area:{
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	field_location:{
		type: DataTypes.STRING,
		allowNull: false,
	},
	weather_location:{
		type: DataTypes.FLOAT,
		allowNull: false,
	}
},{
	freezeTableName: true
})

// Plants.hasMany(Fields, { as: 'field', foreignKey: 'id', targetKey: 'id_field'});


export default Fields