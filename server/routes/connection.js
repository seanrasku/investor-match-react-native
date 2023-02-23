import express from "express";

import { isSignedIn, isInvestor } from "../middlewares";

const router = express.Router();

import {
  createConnection,
  deleteConnection,
  updateConnection,
  getUserConnections,
} from "../controllers/connection";

//routes
router.post("/connection/:userId/:connectionId", isSignedIn, createConnection);
router.delete(
  "/connection/delete/:userId/:connectedUserId/:connectionId",
  isSignedIn,
  deleteConnection
);
router.patch(
  "/connection/update/:userId/:connectionId",
  isSignedIn,
  isInvestor,
  updateConnection
);
router.get("/connection/:userId", isSignedIn, getUserConnections);

module.exports = router;
