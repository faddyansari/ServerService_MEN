 
// Created By Saad Ismail Shaikh
// Date : 30-4-18

import * as express from "express";

let router = express.Router();


router.get('/recieved', (req, res) => {
    // console.log('Email Recieved');
    // console.log(req.headers);
    // console.log(req.body);
    res.send({email : 'recieved'});
    // var visitor = new Visitor();
    // visitor.insertVisitors();
    // res.send("Record Inserted");
});




export const emailRoutes: express.Router = router;