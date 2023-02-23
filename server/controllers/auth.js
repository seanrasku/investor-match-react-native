import User from "../models/user";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  console.log(req.body);
  const { name, email, password, userType } = req.body;
  // validation
  if (!name) return res.status(400).send("Name is required");
  if (!userType) return res.status(400).send("UserType is required");
  if (userType !== "Investor" && userType !== "SocialVenture")
    res.status(400).send("UserType is not a valid option");
  if (!password || password.length < 6)
    return res
      .status(400)
      .send("Password is required and should be min 6 characters long");
  let userExist = await User.findOne({ email }).exec();
  if (userExist) return res.status(400).send("Email is taken");
  // register

  const user = new User(req.body);
  try {
    await user.save();
    console.log("USER CREATED", user);
    return res.json({
      user: {
        _id: user._id,
      },
    });
  } catch (err) {
    console.log("CREATE USER FAILED", err);
    return res.status(400).send("Error. Try again.");
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // check if user with that email exist
    let user = await User.findOne({ email }).exec();
    // console.log("USER EXIST", user);
    if (!user) res.status(400).send("User with that email not found");
    // compare password
    user.comparePassword(password, (err, match) => {
      console.log("COMPARE PASSWORD IN LOGIN ERR", err);
      if (!match || err) return res.status(400).send("Wrong password");
      // GENERATE A TOKEN THEN SEND AS RESPONSE TO CLIENT
      console.log(process.env);
      let token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.json({
        token,
        userInfo: {
          _id: user._id,
          name: user.name,
          email: user.email,
          userType: user.userType,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          phone: user.phone,
          tags: user.tags,
          connections: user.connections,
          location: user.location,
          bio: user.bio,
          links: user.links,
        },
      });
    });
  } catch (err) {
    console.log("LOGIN ERROR", err);
    res.status(400).send("Signin failed");
  }
};
