import express from "express";

import workHistoryController from "./workHistory.controller.js";

const router = express.Router();

router.route("/").get(workHistoryController.getAllWorkHistory);
router.route("/:id").get(workHistoryController.getWorkHistory);

export default router;
