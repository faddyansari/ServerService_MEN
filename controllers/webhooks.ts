
// Created By Saad Ismail Shaikh
// Date : 22-1-18

import * as express from "express";
import { Webhooks } from "../models/webhooksModel"
import { Contacts } from "../models/contactModel"
import { CustomError } from '../helpers/customError';

let router = express.Router();

router.get('/verifyAppToken', async (req, res) => {
    try {
        if (req.query.token && req.query.nsp) {
            await Webhooks.GETValidateAppToken(req.query.token, req.query.nsp);
            res.send({
                status: "ok",
                message: "Your webhook has been validated."
            });
        }
        else {
            throw new CustomError("IncorrectVerificationAppTokenParams", 11, "The GET parameters passed into /webhook/verifyAppToken are incorrect");
        }
    }
    catch (err) {
        // console.log("In error")
        if (err.name == "IncorrectVerificationAppTokenParams" ||
            err.name == "IncorrectVerificationAppTokenValues" ||
            err.name == "InvalidStateInAppToken") {
            res.send({
                status: "err",
                message: err.message
            });
        }
        else {
            res.send({
                status: "err",
            });
        }

        console.log(`Error: ${err.name}, Message: ${err.message}`)
    }
});

// Body must contain fields 'token', 'nsp', 'contacts'
// The field 'token' will cointain the validated UUID
// The 'nsp' field will hold the namespace of the company - used to uniquely identify company
// The 'contacts' will be a list that contains all the fields to be uploaded
// In 'contacts' list items must have at least have the 'email' field
// Additional fields that can be added are:  phone_no, name   
router.post('/uploadContacts', async (req, res) => {
    // console.log('req.body')
    // console.log(req.body)
    try {
        // success
        if(req.body.token && req.body.contacts && req.body.nsp) {
            let token: string = req.body.token;
            let contactsArray: Array<any> = req.body.contacts;
            let nsp: string = req.body.nsp;

            await Webhooks.isGETValidatedAppToken(token, nsp);
            let err = await Contacts.createContacts(contactsArray, nsp);

            res.send({
                status: "ok",
                message: "Contacts have been uploaded."
            });
        }
        else {
            throw new CustomError("IncorrectJSONFormatOnUploadContacts", 13, "The format of the JSON body passed into /webhook/uploadContacts is incorrect"); 
        }
    }
    catch (err) {
        res.send({
            status: "err", message: err.message
        });

        console.log(`Error: ${err.name}, Message: ${err.message}`)
    }
});

export const webhookRoutes: express.Router = router;