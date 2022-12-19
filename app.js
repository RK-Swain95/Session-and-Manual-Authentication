const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const morgan = require("morgan");
const cookieparser = require("cookie-parser");

const session = require("express-session");
const mysqlStore = require("express-mysql-session")(session);

const userData = {
  Name: "Radhakanta Swain",
  Email: "tata.swain@gmail.com",
  Password: "12345",
};
// const db = require("./config/database");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());
require("dotenv").config();
app.use(morgan("dev"));

var sessionStore = new mysqlStore({
  port: 3306,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  connectionLimit: 10,
  expiration: 108000,
  createDatabaseTable: true,
  schema: {
    tableName: "sessioontbl",
    columnNames: {
      session_id: "session_id",
      expires: "expires",
      data: "data",
    },
  },
});

app.use(
  session({
    key: "GT",
    secret: "session_cookie_secret",
    store: sessionStore,
    resave: false,
    saveUninitialized: true,
  })
);

app.listen(port, function (err) {
  if (err) {
    console.log("error in starting server");
    return;
  }
  console.log("server is running on port: ", port);
});

app.use("/", require("./routers"));

module.exports = app;
