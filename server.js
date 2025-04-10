// server.js
const express = require("express");
const session = require("express-session");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const { profileValidationRules } = require("./middlewares/validation");
const { encrypt } = require("./utils/encryption");
const { validationResult } = require("express-validator");
const escapeHtml = require("escape-html");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "super-secret-session-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    },
  })
);

// login page
app.get("/login", (req, res) => {
  res.send(`
    <h2>Login</h2>
    <form action="/login" method="POST">
      <input name="email" placeholder="email" required/>
      <button type="submit">Login</button>
    </form>
  `);
});

// 📌 登录逻辑
app.post("/login", (req, res) => {
  const { email } = req.body;
  const users = JSON.parse(fs.readFileSync("./data/users.json"));

  const user = users.find((u) =>
    typeof u.email === "string" ? u.email === email : false
  );

  if (user) {
    req.session.user = user;
    req.session.userId = user.id;
    res.redirect("/dashboard");
  } else {
    res.send("Login failed. Try again.");
  }
});

// dashboard page
app.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const userId = req.session.userId;
  const users = JSON.parse(fs.readFileSync("./data/users.json"));
  const currentUser = users.find((u) => u.id === userId);

  res.render("dashboard", {
    user: currentUser,
    errorMessage: null,
  });
});

// update profile page
app.post(
  "/update-profile",
  profileValidationRules,
  (req, res) => {
    const errors = validationResult(req);
    const userId = req.session.userId;

    if (!req.session.user) return res.redirect("/login");

    if (!errors.isEmpty()) {
     
      const users = JSON.parse(fs.readFileSync("./data/users.json"));
      const currentUser = users.find((u) => u.id === userId);
      return res.render("dashboard", {
        user: currentUser,
        errorMessage: errors.array().map((e) => e.msg).join(" | "),
      });
    }

    let { name, email, bio } = req.body;

    // XSS
    name = escapeHtml(name);
    bio = escapeHtml(bio);

    const encryptedEmail = encrypt(email);
    const encryptedBio = encrypt(bio);

    const users = JSON.parse(fs.readFileSync("./data/users.json"));
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex !== -1) {
      users[userIndex].name = name;
      users[userIndex].email = encryptedEmail;
      users[userIndex].bio = encryptedBio;

      fs.writeFileSync("./data/users.json", JSON.stringify(users, null, 2));
    }

    res.redirect("/dashboard");
  }
);

// logout
app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
