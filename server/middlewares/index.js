import expressJwt from "express-jwt";
import User from "../models/user";

// req.user
export const isSignedIn = expressJwt({
  // secret, expiryDate
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

export const isInvestor = async (req, res, next) => {
  try{
    let user = await User.findById(req.user._id).exec();
    if(!user) return res.status(400).send("User does not exist");
    if(user.userType !== "Investor") return res.status(403).send("User is Unauthorized, User Type must be Investor");
  next();
  }catch(err){
    console.log(err);
    res.status(400).send("Error occured")
  }
};

export const isAdmin = async (req, res, next) => {
  try{
    let user = await User.findById(req.user._id).exec();
    if(!user) return res.status(400).send("User does not exist");
    if(user.userType !== "Admin") return res.status(403).send("User is Unauthorized, User Type must be Admin");
    next();
  }catch(err){
    console.log(err);
    res.status(400).send("Error occured")
  }
};

export const NoAdmin = async (req, res, next) => {
  try{
    let user = await User.findById(req.user._id).exec();
    if(!user) return res.status(400).send("User does not exist");
    if(user.userType !== "SocialVenture" && user.userType !== "Investor") return res.status(403).send("User is Unauthorized");
    next();
  }catch(err){
    console.log(err);
    res.status(400).send("Error occured")
  }
};

export const isConnection = async(req, res, next) => {
  try{
    let user = await User.findById(req.params.user).exec();
    if(!user) return res.status(400).send("User does not exist");
    next();
  }catch(err){
    console.log(err);
    res.status(400).send("Error occured")
  }

}