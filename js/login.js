"use strict";

const usersDb = require("../models/users");
const bcrypt  = require("bcrypt-nodejs");

let checkUser = function(username, password, callback){
    usersDb.findOne({username: username}, function(err, user){
        if (user) {
            bcrypt.compare(password, user.password, function(err, res) {
                if (res) {
                    callback(err, user);
                }
            });
        } else {
            callback(err, null);
        }
    });
};


let checkLogin = function(req, res, next){
  if (req.session.username) {
    usersDb.findOne({username: req.session.username}, function(err, user){
      if (user) {
        req.user = user;
        res.locals.user = user;
      }
      next();
    });
  } else {
    next();
  }
};


let requireUser = function(req, res, next){
    if (!req.user) {
        res.status(401).render("error/401");
    } else {
        next();
    }
};

let noUser = function(req, res, next){
    if (req.user) {
        res.status(403).render("error/403");
    } else {
        next();
    }
};



module.exports = {
    checkUser: checkUser,
    checkLogin: checkLogin,
    requireUser: requireUser,
    noUser: noUser
};
