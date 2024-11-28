import { Router } from "express";
import order_controller from "../../controllers/orders/order_controller.js";
import authenticateToken from "../../middlewares/authUser/authenticateToken.js";

const orderRouter = Router();

orderRouter.post('/order',authenticateToken,order_controller.create)
orderRouter.get('/order',authenticateToken,order_controller.list)


export default orderRouter;