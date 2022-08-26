const Mongoose = require("mongoose");

const username = encodeURIComponent("chat");
const password = process.env.PASSWORD;
const cluster = "cluster0.gqpayy9.mongodb.net";
const databaseUrl = `mongodb+srv://${username}:${password}@${cluster}/?retryWrites=true&w=majority`;

const connectDB = async () => {
  await Mongoose.connect(databaseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = connectDB;