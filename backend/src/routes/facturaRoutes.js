import express from "express";
import { crearFactura, listarDetalles } from "../controllers/facturaController.js";

const router = express.Router();

router.post("/finalizar", crearFactura);
router.get('/historial', listarDetalles);

export default router;