import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import userModel from "./models/user.js";
import jwt from 'jsonwebtoken'


const __filename = fileURLToPath(import.meta.url);
// Get the directory name of the current file
const __dirname = path.dirname(__filename);

const app = express();
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/create", (req, res) => {
  let { username, email, password } = req.body;
  // console.log(req.body);
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, async function (err, hash) {
      // Store hash in your password DB.

      let createdUser = await userModel.create({
        username: username,
        email: email,
        password: hash,
      });
        
        const token = jwt.sign({ email: email }, "secretkey");
        res.cookie("token", token);
        // console.log(token);
        
    //   res.send(createdUser);
      res.redirect("/");
    });
  });
});


app.get('/logout', (req, res) => {
    res.cookie("token", "");
    res.redirect('/');

});

app.get('/login', (req, res) => {
    res.render('login');

});
app.post('/login', async (req, res) => {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email: email });
    if (!user) {
        return res.send("Something went wrong");
    } else { 
        bcrypt.compare(password, user.password, function (err, result) { 
            if (result) {
                let token = jwt.sign({email : email}, 'secretkey' )
                res.cookie("token", token);
                res.send("yes you can login");
            }
                
            else  res.send("Something went wrong");
        })
    }
    
});


app.listen(3000);
