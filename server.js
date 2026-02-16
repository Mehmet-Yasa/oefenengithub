require("dotenv").config();
 
const express = require("express");
const app = express();
 
const { MongoClient, ObjectId } = require("mongodb");
 
const uri = process.env.URI;
const client = new MongoClient(uri);
 
let usersCollection;
 
// Middleware
app.use(express.static("static"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 
app.set("view engine", "ejs");
 
// Routes
app.get("/", home);
app.get("/detail", toonDetail);
 
app.get("/register", showRegister);
app.post("/register", handleRegister);
 
app.get("/login", showLogin);
app.post("/login", handleLogin);
 
app.get("/dashboard", dashboard);
 
// DB connect + start server
async function startServer() {
  try {
    await client.connect();
    console.log("✅ Verbonden met MongoDB");
 
    const db = client.db("project-test"); // <-- pas aan als jouw db anders heet
    usersCollection = db.collection("users");
 
    app.listen(3000, () => {
      console.log("server is running on http://localhost:3000");
    });
  } catch (error) {
    console.error("❌ Database connectie mislukt:", error);
  }
}
 
startServer();
 
// Controllers
function home(req, res) {
  res.send("Hello world");
}
 
function toonDetail(req, res) {
  let movie = {
    title: "Shawshank!!!!!!!!",
    description: "Dit is een film. Hallo",
  };
 
  res.render("detail", { data: movie });
}
 
function showRegister(req, res) {
  res.render("pages/register");
}
 
async function handleRegister(req, res) {
  const { username, password } = req.body;
 
  // Check of gebruiker al bestaat
  const existingUser = await usersCollection.findOne({ username });
  if (existingUser) {
    return res.send("Gebruikersnaam bestaat al");
  }
 
  // Opslaan in MongoDB
  await usersCollection.insertOne({ username, password });
 
  res.redirect("/login");
}
 
function showLogin(req, res) {
  res.render("pages/login");
}
 
async function handleLogin(req, res) {
  const { username, password } = req.body;
 
  const user = await usersCollection.findOne({ username });
 
  if (user && user.password === password) {
    res.redirect("/dashboard");
  } else {
    res.send("Login mislukt");
  }
}
 
function dashboard(req, res) {
  res.send("Welkom op je dashboard");
}
 