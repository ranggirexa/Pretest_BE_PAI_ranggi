import express from "express";
import { getUsers, Register, Login, Logout } from "../controllers/Users.js";
import {add_field, get_field, update_field, delete_field, get_field_by_id} from "../controllers/Fields.js"
import { add_plant, delete_plant, get_plant_by_field, get_plant_by_id, get_plant_by_user, update_plant } from "../controllers/Plants.js";
import { get_city, get_city_by_id } from "../controllers/Cities.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";

const router = express.Router()

router.get('/users', verifyToken, getUsers)
router.post('/users',Register)
router.post('/login',Login)
router.get('/token',refreshToken)
router.delete('/logout',Logout)

router.get('/field/:id', verifyToken, get_field_by_id)
router.get('/field', verifyToken, get_field)
router.post('/field',verifyToken, add_field)
router.patch('/field/:id',verifyToken, update_field)
router.delete('/field/:id',verifyToken, delete_field)

router.get('/plant/:id', verifyToken, get_plant_by_id)
router.get('/field_plant/:id_field', verifyToken, get_plant_by_field)
router.get('/plant', verifyToken, get_plant_by_user)
router.post('/plant',verifyToken, add_plant)
router.patch('/plant/:id',verifyToken, update_plant)
router.delete('/plant/:id',verifyToken, delete_plant)


router.get('/city/:id', verifyToken, get_city_by_id)
router.get('/city', verifyToken, get_city)


export default router
