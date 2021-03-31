// Created By Saad Ismail Shaikh
// Date : 22-1-18

import * as express from "express";
import { Contacts } from "../models/contactModel";

let router = express.Router();

router.post('/searchContact/', async (req, res) => {
    try {
        let contacts = await Contacts.searchContacts(req.body.nsp,req.body.keyword, req.body.chunk);
        // console.log(contacts);
        if (contacts.length) res.status(200).send({ contactList: contacts });
        else res.status(200).send({ contactList: [] });
    } catch (error) {
        console.log('Error in Search Contacts');
        console.log(error);
        res.status(401).send();
    }
})

export const contactRoutes: express.Router = router;