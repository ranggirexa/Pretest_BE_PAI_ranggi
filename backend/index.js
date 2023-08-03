import express from "express";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import cors from "cors"
import db from "./config/Database.js";
import helmet from "helmet";
import morgan from "morgan";
import Users from "./models/userModel.js";
import Fields from "./models/fieldModel.js";
import Plants from "./models/plantModel.js";
import City from "./models/cityModel.js";
// import Products from "./models/productModel.js";
import router from "./routes/index.js";
dotenv.config()
const app = express()

try {
	await db.authenticate()
	console.log('database connected...');
	// await City.sync()
	// await Users.sync()
	// await Fields.sync()
	// await Plants.sync()
	// await Products.sync()
} catch (error) {
	console.log('error', error);
}
// app.use(helmet());
// app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// app.use(morgan("common"));
// app.use(cors({creddentials:false, origin:'http://localhost:3000'}))
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(cookieParser())
app.use(express.json())
app.use(router)

app.listen(5000, () => console.log(`sever running at port 5000`))