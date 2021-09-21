const io = require("socket.io")(7000, {
    cors: {
      origin: "http://localhost:3000",
    },
  });
  
  let users = [];
  
  const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });
  };
  
  const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
  };
  
  const removeUser = (socketId) => {
    for (let i = 0; i < users.length; i++) {
      console.log(users.socketId);
    }
    return (users = users.filter((user) => user.socketId !== socketId));
  };
  
  io.on("connection", (socket) => {
    //When a user connects to server
    console.log("A user is connected");
    socket.on("addUser", async (userId) => {
      try {
        addUser(userId, socket.id);
        io.emit("getUsers", users);
      } catch (error) {
        console.log(error);
      }
    });
  
    //Send and get message
    socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
      const user = getUser(receiverId);
      try {
        io.to(user.socketId).emit("getMessage", {
          senderId,
          message,
        });
      } catch (error) {
        console.log(error);
      }
    });
  
    //When a user disconnects from server
    socket.on("disconnect", async () => {
      removeUser(socket.id);
      try {
        io.emit("getUsers", users);
      } catch {
        console.log(error);
      }
    });
  });
  

