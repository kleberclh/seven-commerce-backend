import { Router } from "express";
import products_controller from "../../controllers/products/products_controller.js";

const productRouter = Router();

productRouter.post("/produto", products_controller.create);
productRouter.get("/produtos", products_controller.list);
productRouter.get("/produto/:uuid", products_controller.getByUuid);
productRouter.put("/produto/:uuid", products_controller.update);
productRouter.delete("/produto/:uuid", products_controller.remove);

export default productRouter;
