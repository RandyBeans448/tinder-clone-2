require("dotenv").config();

const express = require("express");
const router = express.Router({ mergeParams: true });
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const cookieParser = require('cookie-parser'); 
const { check, validationResult } = require("express-validator");

const multer = require('multer');

const User = require("../models/userSchema");
const Conversation = require("../models/conversationsSchema");
const Message = require("../models/messageSchema");

const ObjectID = require('mongodb').ObjectID;
const { json } = require("body-parser");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.jpg')
  }
})

const upload = multer({ storage: storage }) 

function asyncHandler(callback) {
  return async (req, res, next) => {
    try {
      await callback(req, res, next);
    } catch (error) {
      next(error);
      console.log(error);
    }
  };
}


const recursive = async (match, user, req, res, error, next) => {

  const newUser = {
    _id: user._id,
    firstName: user.firstName,
    path: user.path
  }

  const newMatch = {
    _id: match._id,
    firstName: match.firstName,
    path: match.path
  }

  try {
    for (const like of match.likes) {

      console.log(like, 'like._id');
      
      if ( user._id.equals(like) ) {
  
        await User.findOneAndUpdate({ _id: user._id }, { $push: { matches: newMatch } });
    
        await User.findOneAndUpdate({ _id: match._id }, { $push: { matches: newUser } });

        const newConversation = new Conversation({
          members: [user._id, match._id],
        });

        console.log(newConversation, "New conversation");
      
        if (error) {
          
          res.status(500).json(err);

        } else {
          const savedConversation = await newConversation.save();
          console.log(savedConversation);
          res.status(200).json(savedConversation, { message: 'Its a match' }).end();

        }
      } else {
        res.json({ message: 'Liked' })
      }
    };
  } catch(error) {
    res.status(500).json(error);
  }
}; 

// const filter = async (currentUser, users, req, res, error) => {

//   userResults = users;

//   console.log("start");

//   try {

//     for (let i = 0; i < userResults.length; i++) {
//       if ( currentUser.likes.map((like) => { like !== userResults[i]._id })) {
//         usersArray.push(userResults[i]);
//       };
  
//       if (currentUser.dislikes.length > 0) {
//         if ( currentUser.dislikes.map((dislike) => { dislike !== userResults[i]._id })) {
//           usersArray.push(userResults[i]);
//         };
//       };
  
//       console.log("before array");

//       if (usersArray) {
//         console.log(usersArray, "usersArray");
//         return res.json({ usersArray });
//       } else {
//         return res.json({ users });
//       };
//     };
//   } catch(error) {
//     // return res.status(500).json(error);
//   };
// };

/*
Login account
*/

router.post( "/login", asyncHandler(async (req, res, error) => {

    const userBody = req.body;

    const user = await User.findOne({ emailAddress: req.body.emailAddress });

    if (!user) {
        console.log("There is no account with that email")
        res.status(403).send({ error: "There is no account with that email address" }).end();
    } else {
      const authenticated = await bcryptjs.compare(userBody.password, user.password);

      if (userBody && user) {
  
        if (authenticated) {
  
          console.log("match");
          const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN_SECRET, { expiresIn: 86400 });
        
          res.cookie("token", accessToken, { httpOnly: false, maxAge: 86400 });
  
          res.setHeader('Authorization', 'Bearer '+ accessToken); 
  
          res.json({ 
            user: user,
            accessToken: accessToken,
            })
            .send()
          } else {
          console.log("Password does not match")
          res.status(403).send({ error: "That password is not valid" }).end();
        }
      } 
    }
  })
);

/*
Create user account
*/

router.post( "/user/create-account", upload.single("file"), [
    check("firstName")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "first name"'),
    check("lastName")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "last name"'),
    check("emailAddress")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "emailAddress"'),
    check("password")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "password"'),
    check("gender")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "gender"'),
    check("sexualPreference")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "sexualPreference"'),
    check("age")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "age"'),
    check("description")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "description"'),
  ],
  asyncHandler(async (req, res, next) => {
    // Attempt to get the validation result from the Request object.
    const errors = validationResult(req);

    // If there are validation errors...
    if (!errors.isEmpty()) {
      // Use the Array `map()` method to get a list of error messages.
      const errorMessages = errors.array().map((error) => error.msg);
      console.log(errorMessages);
      // Return the validation errors to the client.
      return res.status(400).json({ error: errorMessages });
    }

    const {file, body: { firstName, lastName, emailAddress, password, gender, sexualPreference, age, description}} = req;

    console.log(firstName, lastName, emailAddress, password, gender, sexualPreference, age, description, file);
    
    //new user request body using mongo model from schema
    const postUser = new User({
      firstName: firstName,
      lastName: lastName,
      emailAddress: emailAddress,
      password: password,
      gender: gender,
      sexualPreference: sexualPreference,
      age: age,
      description: description,
      file: file,
      path: req.file.path
    });

    const userEmail = await User.findOne({
      emailAddress: postUser.emailAddress,
    });

    if (postUser.emailAddress === userEmail) {
      console.log("User with this email already exists");

      return res.status(500).end();

    } else if (postUser) {
      //if true salts the password with bcryptjs
      const hash = await bcryptjs.hash(postUser.password, 10);
      postUser.password = hash;
      postUser.save();
      res.json({ postUser });
      return res.status(201).end();
    } else {
      res.status(400).send({ error: "Error: Account not created" }).end();
    }
  })
);

/*
Authenticate user
*/

function authenticateUser(req, res, next) {

  req.header("Access-Control-Allow-Origin", "*");
  req.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Authorization, Content-Type, Accept"
  );

  let token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.headers["Authorization"] ||
    req.headers["authorization"] ||
    req.cookies.token;

  console.log(token);

  if (!token) {
    return res.status(403).send({ auth: false, message: "No token provided." });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (error, user) {
    if (error) {
      return res.status(500).send({ auth: false, message: error });
    } else {
      next();
    }
  });
};

/*
Gets user account
*/

router.get("/user/account/:id", authenticateUser, asyncHandler(async (req, res, next, error) => {

  const user = await User.findOne({_id: req.params.id})
  const conversation = await Conversation.find({ "members": new ObjectID(req.params.id)});

  if (error) {
    res.status(500).json(error);
  } else {
    console.log(conversation, "Geezer");
    res.json({
      user: user,
      conversation: conversation
    });
  }
})
);

/*
Gets other users for swiping
*/

router.get( "/user/match/:id", authenticateUser, asyncHandler( async (req, res, error) => {

    const currentUser = await User.findOne({ _id: req.params.id });

    let userResults = [];

    let usersArray = [];

    if ( currentUser.gender === "Male" && currentUser.sexualPreference === "Straight") {
 
      const users = await User.find({ gender: "Female", sexualPreference: "Straight" });

      userResults = users;

      // filter(currentUser, users);

      for (let i = 0; i < userResults.length; i++) {

        if ( currentUser.likes.map((like) => { like !== userResults[i]._id })) {
          usersArray.push(userResults[i]);
        };

        if (currentUser.dislikes.length > 0) {
          if ( currentUser.dislikes.map((dislike) => { dislike !== userResults[i]._id })) {
            usersArray.push(userResults[i]);
          };
        }

        if (usersArray) {
          console.log(usersArray, "usersArray");
          return res.json({ usersArray });
        } else {
          return res.json({ users });
        };
      };
    };

    if ( currentUser.gender === "Male" && currentUser.sexualPreference === "Gay") {

      const users = await User.find({ gender: "Male", sexualPreference: "Gay" });

      userResults = users;

      for (let i = 0; i < userResults.length; i++) {

        if ( currentUser.likes.map((like) => { like !== userResults[i]._id; })) {
          usersArray.push(userResults[i]);
        };

           if (currentUser.dislikes.length > 0) {
          if ( currentUser.dislikes.map((dislike) => { dislike !== userResults[i]._id })) {
            usersArray.push(userResults[i]);
          };
        }

        if (usersArray) {
          console.log(usersArray, "usersArray");
          return res.json({ usersArray });
        } else {
          return res.json({ users });
        };
      };
    };

    if ( currentUser.gender === "Female" && currentUser.sexualPreference === "Straight") {

      const users = await User.find({ gender: "Male", sexualPreference: "Straight" });

      userResults = users;

      for (let i = 0; i < userResults.length; i++) {

        if ( currentUser.likes.map((like) => { like !== userResults[i]._id })) {
          usersArray.push(userResults[i]);
        };

        if (currentUser.dislikes.length > 0) {
          if ( currentUser.dislikes.map((dislike) => { dislike !== userResults[i]._id })) {
            usersArray.push(userResults[i]);
          };
        }

        if (usersArray) {
          console.log(usersArray, "usersArray");
          return res.json({ usersArray });
        } else {
          return res.json({ users });
        };
      };
    };

    if ( currentUser.gender === "Female" && currentUser.sexualPreference === "Lesbian" ) {

      const users = await User.find({ gender: "Female", sexualPreference: "Lesbian" });

      userResults = users;

      for (let i = 0; i < userResults.length; i++) {

        if ( currentUser.likes.map((like) => {like !== userResults[i]._id })) {
          usersArray.push(userResults[i]);
        };

        if (currentUser.dislikes.length > 0) {
          if ( currentUser.dislikes.map((dislike) => { dislike !== userResults[i]._id })) {
            usersArray.push(userResults[i]);
          };
        }


        if (usersArray) {
          console.log(usersArray, "usersArray");
          return res.json({ usersArray });
        } else {
          return res.json({ users });
        };
      };
    };

    if (currentUser.sexualPreference === "Bisexual") {

      const users = await User.find();

      userResults = users;

      for (let i = 0; i < userResults.length; i++) {

       if (currentUser._id === userResults[i]._id ) {
        usersResults[i].slice();
       };

        if ( currentUser.likes.map((like) => {like !== userResults[i]._id })) {
          usersArray.push(userResults[i]);
        };

        if (currentUser.dislikes.length > 0) {
          if ( currentUser.dislikes.map((dislike) => { dislike !== userResults[i]._id })) {
            usersArray.push(userResults[i]);
          };
        }

        if (usersArray) {
          console.log(usersArray, "usersArray");
          return res.json({ usersArray });
        } else {
          return res.json({ users });
        };
      };
    };
  })
);

/*
updates user account
*/

router.patch("/user/settings/:id",[
    check("firstName")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "firstName"'),
    check("lastName")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "lastName"'),
    check("description")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "description"'),
  ],
  asyncHandler(async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ errors: errorMessages });
    }

    const updateObject = req.body;

    console.log(updateObject)

    await User.findOneAndUpdate({ _id: new ObjectID(req.params.id) }, updateObject , { new: true }, function(error, doc) {

      if(error) {
          return res.json({success: false, message: error.message});
      }

      res.json({ updateObject });

      return res.status(204).end();
    });

  })
);

/*
Adds matches to the user 
*/

router.patch( "/user/match/:id", authenticateUser, asyncHandler(async (req, res, next, error) => {

  const errors = validationResult(req);

  const user = await User.findOne({ _id: req.params.id });

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({ error: errorMessages });
  }

  const updateObject = req.body.likes;
  console.log(updateObject)

  const likedUser = await User.findOne({ _id: updateObject });


  if (req.body.likes) {

    await User.findOneAndUpdate( { _id: req.params.id }, { $push: { likes: updateObject._id } });
    recursive(likedUser, user)

  } else if (req.body.dislikes) {

    await User.findOneAndUpdate({ _id: req.params.id }, { $push: { dislikes: req.body.dislikes._id } },

      function (error, doc) {
        if (error) {
          return res.json({ success: false, message: err.message });
        }

        res.json({ message: "Nope" });

        return res.status(204).end();

      }
    );
  }

})
);

/*
Unmatch from user
*/

router.patch("/user/messenger/:id/:receiverId/:conversationId", authenticateUser, asyncHandler(async (req, res, next, err) => {


  if (error) {
    res.status(500).json(error);
  } else {

    
    const user = await User.findOne({ _id: req.params.id });

    await User.findOneAndUpdate( { _id: req.params.id }, { $pull: { matches: { _id: new ObjectID(req.body.removeMatch) } } }, function(error, data) {
      console.log(error, data);
    });
  
    await User.findOneAndUpdate( { _id: new ObjectID(req.body.removeMatch) }, { $pull: { matches: { _id: new Object(user._id) } } }, function(error, data) {
      console.log(error, data);
    });
  
    res.json({message: "Unmatched"})
  }
}));

/*
Conversation routes
*/

router.get("/user/conversation/:id/:receiverId/:conversationId", authenticateUser, asyncHandler(async (req, res, next, error) => {
  const conversation = await Conversation.find();
  console.log(conversation , "Conversation");
  if (error) {
    res.status(500).json(error);
  } else {
    res.status(200).json(conversation);
  }
}));

/*
Messenger routers
*/

router.post("/user/messenger/:id/:receiverId/:conversationId", asyncHandler(async (req, res, next, error) => {
  console.log(req.body, "req.body")
  const newMessage = new Message(req.body);
  console.log(newMessage, "new message")
  if (error) {
    res.status(500).json(error);
  } else {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  }
}));

router.get("/user/messenger/:id/:receiverId/:conversationId", asyncHandler(async (req, res, next, error) => {
  const messages = await Message.find({
    conversationId: req.params.conversationId,
  });
  if (error) {
    res.status(500).json(error);
  } else {
    res.status(200).json(messages).end();
  }
}));

/*
Delete user account
*/

router.delete("/user/delete/:id", authenticateUser, asyncHandler(async (req, res, next, error) => {
    User.findOneAndDelete({ _id: new ObjectID(req.params.id) },
      (err, User) => {
        if (!error) {
          res.json({ msg: "customer deleted", deleted: User });
        } else {
          console.log("Error removing :" + error);
        }
      }
    );
  })
);




module.exports = router;
