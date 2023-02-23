import mongoose from "mongoose";
import bcrypt from "bcrypt";
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

//schema for each user, this is how a user and their data is stored in database

const userSchema = new Schema(
  {
    userType: {
      type: String,
      enum: ["Investor", "SocialVenture", "Admin"],
      required: "User Type is Required",
    },
    name: {
      type: String,
      trim: true,
      required: "Name is Required",
    },

    email: {
      type: String,
      trim: true,
      required: "Email is Required",
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 64,
    },
    fullName: {
      type: String,
      trim: true,
    },
    phone: {
      type: Number,
      trim: true,
    },
    bio: {
      type: String,
    },
    links: {
      type: String,
    },
    location: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      enum: ["United States", "Canada", "Mexio", "France", "Colombia"],
    },
    tags: [
      {
        id: { type: String },
        name: { type: String },
        community: { type: String },
      },
    ],
    connections: [
      {
        connection: { type: ObjectId },
        connectedUser: { type: ObjectId },
        connectedUserType: { type: String },
      },
    ],

    //following is for social ventures only-----------------------

    orgName: {
      type: String,
    },
    projectName: {
      type: String,
    },
    projectDes: {
      type: String,
    },
    amount: {
      type: String,
      trim: true,
    },
    securityType: {
      type: String,
      trim: true,
    },
    stories: {
      type: String,
    },
    storiesImg: {
      Data: Buffer,
      ContentType: String,
    },
    website: {
      type: String,
    },
    legalStructure: {
      type: String,
    },
    yearOfInc: {
      type: String,
    },
    companySize: {
      type: String,
    },
    numEmployees: {
      type: String,
    },
    taxId: {
      type: String,
    },
    raisingWhat: {
      type: String,
    },
    equityTerms: {
      type: String,
    },
    intrestRate: {
      type: String,
    },
  },
  { timestamps: true }
);

function arrayLimit(val) {
  return val.length <= 25;
}
/**
 * While saving user, we need to make sure the password is hashed, not plain password
 * hashing should be done only in 2 situations
 * 1. if it is the first time a user is being saved/created
 * 2. user have updated/modified the existing password
 * for handling such requirements, we can use 'pre' middleware in our schema
 * this middleware/function will run each time user is saved/created
 * and/or password is modified/updated
 */

userSchema.pre("save", function (next) {
  let user = this;
  // hash password only if user is changing the password or registering for the first time
  // make sure to use this otherwise each time user.save() is executed, password
  // will get auto updated and you can't login with original password
  if (user.isModified("password")) {
    return bcrypt.hash(user.password, 12, function (err, hash) {
      if (err) {
        console.log("BCRYPT HASH ERR ", err);
        return next(err);
      }
      user.password = hash;
      return next();
    });
  } else {
    return next();
  }
});

userSchema.methods.comparePassword = function (password, next) {
  bcrypt.compare(password, this.password, function (err, match) {
    if (err) {
      console.log("COMPARE PASSWORD ERR", err);
      return next(err, false);
    }
    // if no err, we get null
    console.log("MATCH PASSWORD", match);
    return next(null, match); // true
  });
};

export default mongoose.model("User", userSchema);
