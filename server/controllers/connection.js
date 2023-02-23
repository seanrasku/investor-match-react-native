import Connection from "../models/connection";
import User from "../models/user";

//function to create connection between two users given a request in html from routes
export const createConnection = async (req, res) => {
  try {
    //Get user type
    let user = await User.findById(req.params.userId).exec();
    if (!user)
      return res
        .status(400)
        .send("Unable to Create Connection, User Does Not Exist");
    let userType = user.userType;

    //Get user type
    let connectionUser = await User.findById(req.params.connectionId).exec();
    if (!connectionUser)
      return res
        .status(400)
        .send("Unable to Create Connection, Connectee Does Not Exist");
    if (userType === connectionUser.userType)
      return res
        .status(400)
        .send(
          `Unable to Create Connection, ${userType}s cannot connect with other ${connectionUser.userType}s`
        );

    if (userType === "Investor") {
      const connection = new Connection({
        investor: req.params.userId,
        socialVenture: req.params.connectionId,
        initiatedBy: userType,
        status: "Pending",
      });
      await connection.save();
      const connectToConnection = {
        connection: connection,
        connectedUser: req.params.connectionId,
        connectedUserType: "SocialVenture",
      };
      await User.findByIdAndUpdate(
        req.params.userId,
        {
          $push: {
            connections: connectToConnection,
          },
        },
        { new: true }
      );
      const connectToUser = {
        connection: connection,
        connectedUser: req.params.userId,
        connectedUserType: "Investor",
      };
      await User.findByIdAndUpdate(
        req.params.connectionId,
        {
          $push: {
            connections: connectToUser,
          },
        },
        { new: true }
      );

      return res.json(connection);
    } else if (userType === "SocialVenture") {
      const connection = new Connection({
        investor: req.params.connectionId,
        socialVenture: req.params.userId,
        initiatedBy: userType,
        status: "Pending",
      });
      const toConnection = {
        connection: connection,
        connectedUser: req.params.connectionId,
        connectedUserType: "Investor",
      };
      await User.findByIdAndUpdate(
        req.params.userId,
        {
          $push: {
            connections: toConnection,
          },
        },
        { new: true }
      );

      const toUser = {
        connection: connection,
        connectedUser: req.params.userId,
        connectedUserType: "SocialVenture",
      };
      await User.findByIdAndUpdate(
        req.params.connectionId,
        {
          $push: {
            connections: toUser,
          },
        },
        { new: true }
      );

      await connection.save();
      return res.json(connection);
    } else
      return res
        .status(400)
        .send("Unable to Create Connection, Invalid User Type");
  } catch (err) {
    console.log(err);
    res.status(400).json({
      err: err.message,
    });
  }
};
//function to get all connection from a given user in html string
export const getAllConnections = async (req, res) => {
  let user = await User.findById(req.params.userId).exec();
  if (!user)
    return res
      .status(400)
      .send("Unable to Get Connections, User Does Not Exist");
  let userType = user.userType;
  if (userType == "Investor") {
    const allConnections = await Connection.find({ investor: user._id }).exec();
    res.json(allConnections);
  } else if (userType == "SocialVenture") {
    const allConnections = await Connection.find({
      socialVenture: user._id,
    }).exec();
    res.json(allConnections);
  } else return res.status(400).send("Invalid user type");
};

export const getUserConnections = async (req, res) => {
  let user = await User.findById(req.params.userId).exec();
  if (user.equals(undefined)) {
    return res
      .status(400)
      .send("Unable to Find Connections, User Does Not Exist");
  } else {
    res.status(200).json({ ok: true, connections: user.connections });
  }
};

//Updates connection between SV and investor, does not need to check for investor
//status because middleware already accomplishes this
export const updateConnection = async (req, res) => {
  try {
    const connectionId = req.params.id;
    let updatedConnection = await Connection.findByIdAndUpdate(
      connectionId,
      { status: "Connected" },
      { new: true }
    );
    res.json(updatedConnection);
  } catch (err) {
    console.log(err);
    res.status(400).send("Unable to update connection", err);
  }
};

export const deleteConnection = async (req, res) => {
  try {
    await Connection.findByIdAndDelete(req.params.connectionId).exec();
    console.log(req);
    await User.findByIdAndUpdate(
      req.params.userId,
      { connections: req.body.userRemaining },
      { new: true }
    );
    await User.findByIdAndUpdate(
      req.params.connectionId,
      { connections: req.body.connectionRemaining },
      { new: true }
    );
    //let user = await User.findById(req.params.userId).exec();
    //console.log(user)

    res.status(200).json({
      ok: true,
      msg: "connection deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).send("Unable to delete connection", err);
  }
};
