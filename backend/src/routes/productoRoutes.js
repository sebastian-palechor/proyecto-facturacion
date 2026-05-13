import express from "express";
import { 
    listarProductos, 
    guardarProducto, 
    actualizarProducto, 
    eliminarProducto 
} from "../controllers/productoController.js";

const router = express.Router();

router.get("/", listarProductos);
router.post("/", guardarProducto);
router.put("/:id", actualizarProducto);
router.delete("/:id", eliminarProducto);

export default router;