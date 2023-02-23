import Connection from "../models/connection";
import User from "../models/user";
import Chat from "../models/chat";
import chat from "../models/chat";

export const createChat = async(req, res) => {
    
    try{
        const {from, to, message} = req.body;
        if(message === ""|| message === undefined) return res.status(400).send("Empty/Undefined Messages Cannot Be Sent");
        await Connection.find({ $or: [{ investor: from, socialVenture: to }, { investor: to, socialVenture: from  }] },
             function(err, result) {
                if (err)
                  return res.status(400).send("No Connection Found, Only Connections May Chat Together");
                else {
                    console.log("In function");
                    if(result[0] === undefined) return res.status(400).send("No Connection Found, Only Connections May Chat Together");
                    else{
                        const {investor, socialVenture, initiatedBy, status} = result[0];
                        if(status !== "Connected") return res.status(400).send("Connection must be Connected to send message");
                    }
                }
              }
        );
        let pastChats = await Chat.find({$or: [{from: from, to: to}, {from: to, to: from}]}, 
            function(err) {
                if (err)
                    return res.send(err);
            }
        );
        let user = await User.findById(from).exec();
        if(!user) return res.status(400).send("No User Exists");
        if(user.userType !== "Investor" && !pastChats[0]) return res.status(400).send("Only Investors may initialize contact");

        

        const newChat = new Chat({
            from: from,
            to: to,
            message: message,
        });
        await newChat.save();
        return res.json({ok: true});

    }catch (err){
        console.log(err);
        res.status(400).json({
            err: err.message,
        });
    }

};

export const getChats = async(req, res) => {

    try{
        let chats = await Chat.find({$or: [{from: req.params.userId}, {to: req.params.userId}]}).exec();
        if(!chats) return res.status(400).send("No Chats Found");
        return res.json(chats);

    }catch (err){
        console.log(err);
        res.status(400).json({
            err: err.message,
        });
    };
}

export const getUserChats = async(req, res) => {
    try{
        const {from, to} = req.body;

        let chats = await Chat.find({$or: [{from: req.params.userId, to: req.params.connectionId}, {from: req.params.connectionId, to: req.params.userId}]}).exec();
        if(!chats) return res.status(400).send("No Chats Found");

        //Make all chats previously unread marked as read
        //must be active chat, not marked for delete - Not done yet
        await(Chat.updateMany({from: to, to: from, viewed: false, deleteStatus: "Neither"}, {viewed: true}));

        return res.json(chats);
    }catch(err){
        console.log(err);
        res.status(400).json({
            err: err.message,
        });
    }
}

export const deleteChat = async(req, res) => {

    try{
        let chatToDelete = await Chat.findById(req.params.chatId).exec();
        //res.send(chatToDelete)
        let user = await User.findById(req.params.userId).exec();
        if(!chatToDelete || !user) return res.status(400).send("Chat or User Does Not Exist");
        //res.send(chatToDelete.from);
        if(chatToDelete.deleteStatus === "Both") return res.status(400).send("Chat is Already Deleted On Both Ends");
        else{
            if (chatToDelete.deleteStatus === "Neither"){
                if (user.userType === "Investor"){
                    await Chat.findByIdAndUpdate(req.params.chatId, {deleteStatus: "Investor"}, {new: true}, function(err, result){
                        if(err) return res.status(400).send(err);
                        else return res.json(result);
                    });
                }
                else if (user.userType === "SocialVenture"){
                    console.log(user.userType);
                    await Chat.findByIdAndUpdate(req.params.chatId, {deleteStatus: "SocialVenture"}, {new: true}, function(err, result){
                        if(err) return res.status(400).send(err);
                        else return res.json(result);
                    });
                }
                else return res.status(400).send("User Type Invalid");
            }
            else if (chatToDelete.deleteStatus === "Investor"){
                if(user.userType !== "SocialVenture") return res.status(400).send("Chat Already Deleted By User");
                await Chat.findByIdAndUpdate(req.params.chatId, {deleteStatus: "Both"}, {new: true}, function(err, result){
                    if(err) return res.status(400).send(err);
                    else return res.json(result);
                });
            }
            else if (chatToDelete.deleteStatus === "SocialVenture"){
                if(user.userType !== "Investor") return res.status(400).send("Chat Already Deleted By User");
                await Chat.findByIdAndUpdate(req.params.chatId, {deleteStatus: "Both"}, {new: true}, function(err, result){
                    if(err) return res.status(400).send(err);
                    else return res.json(result);
                });
            }    
            else return res.status(400).send("Unknown Error Occured, deleteStatus May Be Invalid");
        }

    }catch (err){
        console.log(err);
        res.status(400).json({
            err: err.message,
        });
    }
}