import { Router } from "express";

import authenticateToken from "../../middlewares/authUser/authenticateToken.js";
import userController from "../../controllers/authUsers/auth_controller.js";
import usersController from "../../controllers/authUsers/user_controller.js";
import isAdmin from "../../middlewares/admin/isAdmin.js";

const userRouter = Router();

userRouter.get("/me", authenticateToken, userController.me);
userRouter.post("/registrar", userController.registrar);
userRouter.post("/login", userController.login);
userRouter.get(
  "/usuarios",
  authenticateToken,
  isAdmin,
  usersController.usuarios
);

export default userRouter;
