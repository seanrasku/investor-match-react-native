import User from '../models/user'
import Tag from '../models/tag'

//Check for Admin priveleges done in middlewares
export const createTag = async(req, res) => {
    try{
    const {name, community} = req.body
    console.log("NAME: ", name);
    // if(dup) return res.status(400).send("Duplicate Tag Name Not Allowed")
    // console.log("GOTHERE")
    if(name === "" || name === undefined || community === "" || community === undefined) return res.status(400).send("Invalid Tag Name or Community")
    const newTag = new Tag({
        name: name,
        community: community,
    });
    await newTag.save();
    res.send(newTag)
    //return res.json({ok: true})
    }catch(err){
        console.log(err);
        res.status(400).send("Unable to Create Tag", err);
    }
}

export const updateTag = async(req, res) => {
    try{
    const {name, community} = req.body
    if(name === "" || name === undefined || community === "" || community === undefined) return res.status(400).send("Invalid Tag Name or Community")
    const tagId = req.params.tagId;
    let updatedTag = await Tag.findByIdAndUpdate(tagId, {name: name, community: community}, {new: true});
    if(!updatedTag) return res.status(400).send("No Tag Found")
    res.send(updatedTag);
    }catch(err){
        console.log(err);
        res.status(400).send("Unable to update tag", err);
    }
}

export const deleteTag = async(req, res) => {
    try{
        
        let deletedTag = await Tag.findByIdAndDelete(req.params.tagId);
        if(!deletedTag) return res.status(400).send("No Tag Found")
        res.status(200).send(deletedTag);
    }catch(err){
        console.log(err);
        res.status(400).send("Unable to delete tag", err);
    }
}

export const getAllTags = async(req, res) => {
    try{
        let allTags = await Tag.find({}).populate(req.params.id).exec();
        res.send(allTags)
    }catch(err){
        console.log(err);
        res.status(400).send("Unable to delete tag", err);
    }
}
export const getTag = async(req, res) => {
    try{
        console.log("TAG ID: ", req.params.tagId)
        let tag = await Tag.findById(req.params.tagId).exec();
        console.log(tag)
        res.send(tag)
    }catch(err){
        console.log(err);
        res.status(400).send("Unable to delete tag", err);
    }
}
