import express from "express";
import authController from "../controllers/auth.controller.js";
const router = express.Router();

router.route("/").get(authController.getProfile);
router.route("/sign-in").post(authController.signIn);
router.route("/sign-out").post(authController.signOut);

export default router;
