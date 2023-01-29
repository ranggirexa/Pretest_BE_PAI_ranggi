import { Sequelize } from "sequelize";

const db = new Sequelize('pandawa_field', 'postgres', 'postgres',{
	host: "localhost",
	dialect: "postgres"
})

export default db