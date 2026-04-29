import express from "express";
import { listarClientes, guardarCliente } from "../controllers/clienteController.js";

const router = express.Router();

router.get("/", listarClientes);
router.post("/", guardarCliente);

export default router;