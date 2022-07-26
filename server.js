const http = require("http");
// const path = require("path");
const { Server } = require("socket.io");
const express = require("express");
const app = express();
const sentMessage = require("./Allroutes/SendMessage");
const sentLogin = require("./Allroutes/Login");
const textContent = require("./Allroutes/TextContent");
const imagesUpload = require("./Allroutes/ImagesUpload");
const prolang = require("./Allroutes/ProLang");
const projupload = require("./Allroutes/UploadProject");
const profileUpload = require("./Allroutes/ProfileUpload");
const postabout = require("./Allroutes/PostAbout");
const clientlogin = require("./Allroutes/ClientLogin");
const blogcomment = require("./Allroutes/BlogComment");

const httpServer = http.Server(app);
global.io = new Server(httpServer, { cors: { origin: "*" } });
// app.set('socketio', io);
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
app.use(cors());

//MongoDB
mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    })
    .then(() => console.log("Osk's MongoDB database Connected"))
    .catch((err) => console.log(err));

//rate limiters
const limiter = rateLimit({
    windowMs: 120 * 60 * 1000, // 15 minutes
    max: 3,
    message: "Too many requests, please try again later", // limit each IP to 100 requests per windowMs
});

app.use("/api/messages/post-messages", limiter);
app.use(helmet());
app.disable("x-powered-by");

//
//  apply to all requests
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));



app.use("/api/messages/post-messages", limiter);
app.use("/api/messages", sentMessage);
app.use("/api/users", sentLogin);
app.use("/api/content", textContent);
app.use("/api/images-upload", imagesUpload);
app.use("/api/profile-image", profileUpload);
app.use("/api/prog-lang", prolang);
app.use("/api/projects", projupload);
app.use("/api/about", postabout);
app.use("/api/clients-user", clientlogin);
app.use("/api/clients-user", clientlogin);
app.use("/api/b-com", blogcomment);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`OSK's App is running at:${PORT}`);
});

//WebSockects for comments and likes
io.on("connection", (socket) => {
    console.log("Hey Osk socket connected by:" + socket.id);
});

