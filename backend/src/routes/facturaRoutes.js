import express from "express";
import { crearFactura } from "../controllers/facturaController.js";

const router = express.Router();

router.post("/finalizar", crearFactura);

export default router;