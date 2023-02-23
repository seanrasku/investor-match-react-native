import express from "express";
import mongoose from "mongoose";
const router = express.Router();
import { isSignedIn, NoAdmin } from "../middlewares";
// controllers
import { getUser, uploadPic, allUsers, updateProfile, addTag, deleteTag, getUserTags} from "../controllers/user";
router.get("/user/:id", getUser);
router.patch("/user/pic/:id", isSignedIn, uploadPic);
router.get("/user", allUsers);
router.patch("/user/:id", updateProfile);
router.post("/user/:userId/:tagId", isSignedIn, addTag);
router.delete("/user/:userId/:tagId", isSignedIn, deleteTag);
router.get("/user/:userId", isSignedIn, getUserTags);

module.exports = router;