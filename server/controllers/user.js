import User from "../models/user";
import Tag from "../models/tag";

//uploading the profile picture to the database
export const uploadPic = async (req, res) => {
  console.log(req.body);

  try {
    const data1 = req.files.file.data;
    const mimetype = req.files.file.mimetype;

    //push this to user.profilepic
    let profilePic1 = { Data: data1, ContentType: mimetype };

    let updated = await User.findByIdAndUpdate(
      req.params.id,
      { profilePic: profilePic1 },
      {
        new: true,
      }
    );

    await updated.save();
    res.send(updated);
  } catch (err) {
    console.log(err);
    res.status(400).send("Picture upload failed, Try Again");
  }
};

//retirive all users
export const allUsers = async (req, res) => {
  let all = await User.find({}).populate(req.params.id).exec();
  res.json(all);
};

// Retrieve user by id, except for password used for authentication.
export const getUser = async (req, res) => {
  let user = await User.findById(req.params.id).exec();
  res.json(user);
};

// Update user data, except for email and password used in authentiction.
export const updateProfile = async (req, res) => {
  console.log(req.body);
  try {
    let data = { ...req.body };
    let updated = await User.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });

    res.send(updated);
  } catch (err) {
    console.log(err);
    res.status(400).send("User update failed, Try Again");
  }
};

export const addTag = async (req, res) => {
  try {
    let tag = await Tag.findById(req.params.tagId);
    if (!tag) return res.status(400).send("Tag Does Not Exist");
    const t = { id: tag.id, name: tag.name, community: tag.community };
    let user = await User.findByIdAndUpdate(
      req.params.userId,
      { $push: { tags: t } },
      { new: true }
    );
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(400).send("Tag could not be added");
  }
};

export const getUserTags = async (req, res) => {
  try {
    const user = await User.find(req.params.userId).exec();
    res.send(user.tags);
  } catch (err) {
    console.log(err);
    res.status(400).send("Tag could not be added");
  }
};

export const deleteTag = async (req, res) => {
  try {
    let tag = await Tag.findById(req.params.tagId);

    const t = { id: tag.id, name: tag.name, community: tag.community };

    let user = await User.findByIdAndUpdate(
      req.params.userId,
      { $pull: { tags: t } },
      { new: true }
    );

    //res.json(user);
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(400).send("Tag could not be deleted");
  }
};
