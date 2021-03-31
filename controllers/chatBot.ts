import * as express from "express";

import { SessionManager } from '../globals/server/sessionsManager';
import { __BIZZ_REST_REDIS_PUB } from "../globals/__biZZCMiddleWare";
const requestIp = require('request-ip');

let router = express.Router();

router.post('/connectAgent', async (req, res, next) => {

    // console.log("post");

    // console.log("ChatBotRoutes");
    // console.log("ChatBotRoutes");
    // console.log('connectAgent');
    // console.log(req.body);
    // console.log(req.params);
    let clientIp = requestIp.getClientIp(req);
    // console.log(clientIp);


    let session: any = await SessionManager.GetVisitorByID((req.params.id) ? req.params.id : '');
    if (session) {
        await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'chatBotToAgent', nsp: session.nsp, roomName: [session.id || session._id], data: { _id: (session._id) ? session._id : '' } });

    }




})


router.get('/connectAgent/:id', async (req, res, next) => {

    // console.log("get");
    // console.log("ChatBotRoutes");
    // console.log('connectAgent');
    // console.log(req.body);
    // console.log(req.params);
    let clientIp = requestIp.getClientIp(req);
    // console.log(clientIp);

    if (!req.params.id) res.status(401).send({ status: 'Unauthorized' }).end();

    let session: any = await SessionManager.GetVisitorByID((req.params.id) ? req.params.id : '');
    let socket;
    if (session) {
        await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'chatBotToAgent', nsp: session.nsp, roomName: [session.id || session._id], data: { _id: session.id || session._id } });

    }

    if (session) res.status(200).send();

})

router.get('/cannedForm/:id', async (req, res, next) => {

    // console.log("get");
    // console.log("ChatBotRoutes");
    // console.log('connectAgent');
    // console.log(req.body);
    // console.log(req.params);
    let clientIp = requestIp.getClientIp(req);
    // console.log(clientIp);

    if (!req.params.id) res.status(401).send({ status: 'Unauthorized' }).end();

    let session: any = await SessionManager.GetVisitorByID((req.params.id) ? req.params.id : '');
    let socket;
    if (session) {
        await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'chatBotToAgent', nsp: session.nsp, roomName: [session.id || session._id], data: { _id: session.id || session._id } });
    }
    if (session) res.status(200).send()

})




export const chatBotRoutes: express.Router = router;