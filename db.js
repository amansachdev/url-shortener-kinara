const Mongoose = require("mongoose");

const localDB = `mongodb+srv://chat:7T0suyy3YPwjKBbV@cluster0.gqpayy9.mongodb.net/?retryWrites=true&w=majority`;

const connectDB = async () => {
  await Mongoose.connect(localDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log("MongoDB Connected");
};

module.exports = connectDB;
