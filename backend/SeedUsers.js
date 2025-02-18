const mongoose = require("mongoose");
const User = require("./models/user"); // Import User model

// MongoDB Connection
mongoose.connect("mongodb+srv://sid25jun03:UvFoMYmugN3bRZ2e@cluster0.7byov.mongodb.net/Socia_lMedia?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const dummyUsers = [
  {
    fullName: "John Doe",
    username: "johndoe",
    email: "john@example.com",
    password: "hashedpassword1", // Hash the password in production
    profilePicture: "https://via.placeholder.com/150",
    bio: "Just a tech enthusiast!",
    followers: [],
    following: [],
    posts: [],
  },
  {
    fullName: "Jane Smith",
    username: "janesmith",
    email: "jane@example.com",
    password: "hashedpassword2",
    profilePicture: "https://via.placeholder.com/150",
    bio: "Love traveling and coding!",
    followers: [],
    following: [],
    posts: [],
  },
  {
    fullName: "Alice Johnson",
    username: "alicejohnson",
    email: "alice@example.com",
    password: "hashedpassword3",
    profilePicture: "https://via.placeholder.com/150",
    bio: "Photographer & Developer",
    followers: [],
    following: [],
    posts: [],
  },
];

// Insert Dummy Users
const seedUsers = async () => {
  try {
    await User.deleteMany(); // Optional: Clear existing users
    const createdUsers = await User.insertMany(dummyUsers);
    console.log("Dummy users inserted successfully:", createdUsers);
    mongoose.connection.close();
  } catch (error) {
    console.error("Error inserting users:", error);
    mongoose.connection.close();
  }
};

seedUsers();
