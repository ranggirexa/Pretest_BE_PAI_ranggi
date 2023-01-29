import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Fields from "./fieldModel.js";

const {DataTypes} = Sequelize;

const Plants = db.define('plants', {
	id_field: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'fields',
          key: 'id'
        }
	},
	id_user: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
	},
	plant_name:{
		type: DataTypes.STRING,
		allowNull: false,
	},
	plant_condition:{
		type: DataTypes.STRING,
		allowNull: false,
	},
	plant_quantity:{
		type: DataTypes.INTEGER,
		allowNull: false,
	},
},{
	freezeTableName: true,
})

Plants.belongsTo(Fields, { as: 'field', foreignKey: 'id_field'});

export default Plants