import express from "express";
import {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUserById,
  getUserById,
  updateUserById,
} from "../controllers/userController.js";
import { authToken, authAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(registerUser).get(authToken, authAdmin, getUsers);
router.post("/login", authUser);
router
  .route("/profile")
  .get(authToken, getUserProfile)
  .put(authToken, updateUserProfile);
router
  .route("/:userId")
  .delete(authToken, authAdmin, deleteUserById)
  .get(authToken, authAdmin, getUserById)
  .put(authToken, authAdmin, updateUserById);

export default router;
