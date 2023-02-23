import express from "express";
const router = express.Router();
import { isSignedIn, isAdmin } from "../middlewares";
// controllers
import { createTag, updateTag, deleteTag, getAllTags, getTag} from "../controllers/tag";

router.post("/tag/:userId", isSignedIn, createTag);
router.patch("/tag/:userId/:tagId", isSignedIn, isAdmin, updateTag);
router.delete("/tag/:userId/:tagId", isSignedIn, isAdmin, deleteTag);
router.get("/tags", isSignedIn, getAllTags);
router.get("/tag/:tagId", isSignedIn, getTag);



module.exports = router;