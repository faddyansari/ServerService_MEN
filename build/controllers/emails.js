"use strict";
// Created By Saad Ismail Shaikh
// Date : 30-4-18
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailRoutes = void 0;
var express = require("express");
var router = express.Router();
router.get('/recieved', function (req, res) {
    // console.log('Email Recieved');
    // console.log(req.headers);
    // console.log(req.body);
    res.send({ email: 'recieved' });
    // var visitor = new Visitor();
    // visitor.insertVisitors();
    // res.send("Record Inserted");
});
exports.emailRoutes = router;
//# sourceMappingURL=emails.js.map