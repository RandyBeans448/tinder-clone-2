const io = require("socket.io")(7000, {
    cors: {
        origin:"http://localhost:3000"
    }
});

let users = [];

const addUser = (userId, socketId) => {
    !users.some(user => user.userId === userId) && 
        users.push({ userId, socketId });
};

const removeUser = (socketId) => {
    for (let i = 0; i < users.length; i ++) {
        console.log(users.socketId);
    }
    return users = users.filter(user => user.socketId !== socketId);
};

const getUser = (userId) => {
    console.log(users, "users");
    return users.find(user => user.userId === userId);
}

io.on("connection", (socket) => {

    //When a user connects to server
    console.log("A user is connected");
    socket.on("addUser", userId => {
        addUser(userId, socket.id);
        io.emit("getUsers", users);
    });

    //Send and get message
    socket.on("sendMessage", ({senderId, receiverId, message}) => {
        const user = getUser(receiverId);
        console.log(senderId, receiverId, message);
        console.log(user,"user");
        console.log(user.socketId);
        io.to(user.socketId).emit("getMessage", {
            senderId,
            message,
        });

    })

    //When a user disconnects from server
    socket.on("disconnect", () => {
        removeUser(socket.id);
        io.emit("getUsers", users);
    });

});