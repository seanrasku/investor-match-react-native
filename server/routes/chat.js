import express from "express";
import { isSignedIn } from "../middlewares";
import { createChat, getChats, deleteChat, getUserChats} from "../controllers/chat";

const router = express.Router();

//routes
router.post("/chat", isSignedIn, createChat);
router.get("/chat/:userId", isSignedIn, getChats);
router.get("/chat/:userId/:connectionId", isSignedIn, getUserChats);
router.patch("/chat/:userId/:chatId", isSignedIn, deleteChat);


module.exports = router;