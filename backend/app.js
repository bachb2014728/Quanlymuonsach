require('dotenv').config()
const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json())
app.use(cors({ origin: "*" }));

app.use("/api/v1/auth", require("./app/routes/auth.route"));

app.use("/api/v1/books", require("./app/routes/book.route"));

app.use("/api/v1/authors", require("./app/routes/author.route"));

app.use("/api/v1/publishing", require("./app/routes/publishing.route"));

app.use("/api/v1/details", require("./app/routes/detail.route"));

app.use("/api/v1/images", require("./app/routes/image.router"));

module.exports = app;