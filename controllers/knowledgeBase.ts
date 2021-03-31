
// Created By Saad Ismail Shaikh
// Date : 30-4-18

import * as express from "express";

import { KnowledgeBaseModel } from "../models/knowledgeBaseModel";
import { SessionManager } from "../globals/server/sessionsManager";
import { VisitorSessionSchema } from "../schemas/VisitorSessionSchema";


let router = express.Router();

router.use(async (req, res, next) => {
  // if (req.headers.referer && req.headers.referer.indexOf(((process.env.NODE_ENV == 'production') || (process.env.NODE_ENV == 'development')) ? 'beelinks.solutions' : 'localhost') != -1) {
  // console.log('refferer', req.headers.referer);
  // console.log('req URL', req.url);

  let type = ''
  let id = ''
  if (req.headers.authorization) {
    type = req.headers.authorization.split('-')[0]
    id = req.headers.authorization.split('-')[1]
    let session: any = ''
    if (type == 'Agent') session = await SessionManager.GetAgentByID(id)
    else session = (await SessionManager.GetVisitorByID(id) as VisitorSessionSchema)
    if (session) {

      if (req.body.nsp && req.body.nsp != session.nsp) res.status(401).send({ err: 'unauthorized' });

      next();
    }
    else res.status(401).send({ err: 'unauthorized' });
  }
  else res.status(401).send({ err: 'unauthorized' });
  // next();
  // } else {
  //     // console.log('refferer', req.headers.referer);
  //     // console.log('req URL', req.url);

  //     res.status(401).send({ err: 'unauthorized' });
  // }
})

//let visitor = new Visitor();

// router.get('/', (req, res) => {
//     console.log('email recieved');
//     res.send({email : 'recieved'});
//     // var visitor = new Visitor();
//     // visitor.insertVisitors();
//     // res.send("Record Inserted");
// });

router.use((req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
});
router.get('/:type?/:nsp?', async (req, res) => {
  // console.log('Knowledgebase Controller');
  // console.log(req.params);
  try {
    if (!req.params.type || !req.params.nsp) res.status(400).send();
    switch (req.params.type.toString().toLowerCase()) {
      case 'kpi':
      case 'sla':
      case 'news':
      case 'itp':
        let kpi = await KnowledgeBaseModel.GetKnowledgeBase(req.params.type, '/' + req.params.nsp);
        res.status(200).send(kpi);
        break;
      case 'faq':
        let faq = await KnowledgeBaseModel.GetKnowledgeBase(req.params.type, '/' + req.params.nsp);
        res.status(200).send(faq);
        break;
      default:
        res.status(400).send()
        break;
    }
  } catch (error) {
    console.log(error);
    console.log('Error in getting KnowledgeBase');
    res.status(400).send()

  }

  // var visitor = new Visitor();
  // visitor.insertVisitors();
  // res.send("Record Inserted");
});





export const KnowledgeBase: express.Router = router;