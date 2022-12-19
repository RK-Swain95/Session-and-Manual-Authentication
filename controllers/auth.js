const pool = require("../config/database");
const util = require("util");
//util.promisify return the promise instead of call back.
const query = util.promisify(pool.query).bind(pool);
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  get: async (req, res) => {
    try {
      const body = req.body;
      const salt = genSaltSync(10);
      body.Password = hashSync(body.Password, salt);
      let user = await query(
        `insert into Users (Email,Password) values (?,?)`,
        [body.Email, body.Password]
      );

      return res.status(200).json({
        SUCCESS: true,
        MESSAGE: "data fetched",
        DATA: user,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        SUCCESS: true,
        MESSAGE: "error",
      });
    }
  },
  check: async (req, res) => {
    try {
      let user = await query(`Select * from Users where Email=?`, [
        req.body.Email,
      ]);
      user = user[0];

      if (user) {
        var token = jwt.sign({ user }, "GT", { expiresIn: "1000000" });
        res.setHeader("Authorization", token);
      }
      res.cookie("jwt", token);
      req.session.token = token;
      console.log(req.cookies);

      return res.status(200).json({
        SUCCESS: true,
        MESSAGE: "data fetched",
        DATA: token,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        SUCCESS: true,
        MESSAGE: "error",
      });
    }
  },
  profile: async (req, res) => {
    try {
      //console.log(req.headers);
      //   req.session.token = req.cookies.jwt;
      console.log("id", req.session.id);

      if (req.session.token) {
        let token = req.session.token;
        const verifyuser = jwt.verify(token, "GT");
        if (verifyuser) {
          return res.status(200).json({
            SUCCESS: true,
            MESSAGE: "login successfully",
            DATA: verifyuser,
          });
        } else {
          return res.status(200).json({
            SUCCESS: true,
            MESSAGE: "login Failed",
          });
        }
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        SUCCESS: true,
        MESSAGE: "error",
      });
    }
  },
};
