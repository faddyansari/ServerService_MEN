import { WidgetMarketingModel } from './../models/widgetMarketingModel';
import * as express from "express";
import { __BIZZ_REST_REDIS_PUB } from "../globals/__biZZCMiddleWare";
import * as request from 'request-promise';
import { SessionManager } from "../globals/server/sessionsManager";
import { VisitorSessionSchema } from "../schemas/VisitorSessionSchema";

let router = express.Router();
router.use(async (req, res, next) => {
  // if (req.headers.referer && req.headers.referer.indexOf((process.env.NODE_ENV == 'production') ? 'app.beelinks.solutions' : (process.env.NODE_ENV == 'development') ? 'dev.beelinks.solutions' : 'localhost') != -1) {
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
  //     // console.log('headers', req.headers);
  //     // console.log('refferer', req.headers.referer);
  //     // console.log('req URL', req.url);

  //     res.status(401).send({ err: 'unauthorized' });
  // }
})

router.post('/MasterData', async (req, res) => {
  try {
    if (req.headers.origin) {
      res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
      res.header("Access-Control-Allow-Headers", "content-type");
      res.header('Access-Control-Allow-Methods', 'GET');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Vary', 'Origin, Access-Control-Request-Headers');
    }
    let data = req.body
    // let masterDataDevelopmentURL = "https://iconnapifunc00-common-development.iconn-asestaging01.p.azurewebsites.net/api/GetMasterData?code=2oemNvWziDt2XxZXfL6jSJBFj8NbH8SoycTgyDKYaJ9/iALDs1ap7Q==";
    // let masterDataStagingURL = "http://iconnapifunc00-common-staging.iconn-asestaging01.p.azurewebsites.net/api/GetMasterData?code=o9mhVZ8tAmTagZHYXFLTx6BzyqtUtCHahZqnp7S7ovZJqQ2kPRjBMQ==";
    let masterDataProductionURL = "https://iconnapifunc00-common.iconn-asestaging01.p.azurewebsites.net/api/GetMasterData?code=Bg5TFyJnSpRJ7s5ecl0Rfv8Y/HK7yIYuKLmdMQOUCum0ygEywNHK1Q==";
    let masterData = {
      "MasterDataTypeId": data.ID
    }
    let response = await request.post({
      uri: masterDataProductionURL,
      body: masterData,
      json: true,
      timeout: 60000
    });
    if (response) {
      res.send({ status: 'ok', response: response });
    }
    else res.status(401).send({ error: 'error' });

  } catch (error) {
    // console.log(error);
    console.log('error in Master Data');
    res.status(401).send({ error: 'error' });
  }

});

router.post('/GetOtherPorts', async (req, res) => {
  try {
    if (req.headers.origin) {
      res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
      res.header("Access-Control-Allow-Headers", "content-type");
      res.header('Access-Control-Allow-Methods', 'GET');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Vary', 'Origin, Access-Control-Request-Headers');
    }
    let result = await WidgetMarketingModel.getOtherPorts();
    if (result && result.length) {
      res.send({ status: "ok", ports: result })
    } else {
      res.send({ status: "error", result: [] })
    }

  } catch (error) {
    console.log(error);
    console.log('error in Master Data');
    res.status(401).send({ error: 'error' });
  }

});


router.post('/SalesAgent', async (req, res) => {
  try {
    // if (!req.body.sessionid) res.status(401).send('Invalid Request!');
    // else {
    if (req.headers.origin) {
      res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
      res.header("Access-Control-Allow-Headers", "content-type");
      res.header('Access-Control-Allow-Methods', 'GET');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Vary', 'Origin, Access-Control-Request-Headers');
    }
    let data = req.body
    let SalesAgentDevelopmentURL = "https://iconnapifunc00-common-development.iconn-asestaging01.p.azurewebsites.net/api/GetSalesAgentMasterData?code=XJRNKdOqz0wVZ70OS1PnyKENagzTTBDqPUKraprB/2DAgEJY431lEw==";
    let SalesAgentStagingURL = "http://iconnapifunc00-common-staging.iconn-asestaging01.p.azurewebsites.net/api/GetSalesAgentMasterData?code=8y95oYD4MKeY2lNa0N5wzufLfv1ZJKOklBG47x1FHaBemCJTFbooHQ==";
    //console.log(data)
    let agentsList = {
      "CountryId": data.ID,
      "IncOrganizerFlg": "1",
      "IncDivisionManagerFlg": "1",
      "IncGeneralManagerFlg": "1",
      "IncLocalManagerFlg": "1",
      "IncRegularEmplyeeFlg": "1",
      "IncMarketingFlg": "1"
    }
    // console.log(customerData)
    let response = await request.post({
      uri: SalesAgentStagingURL,
      body: agentsList,
      json: true,
      timeout: 50000
    });
    if (response) {
      //  console.log(response)
      res.send({ status: 'ok', response: response });
    }
    else res.status(401).send({ error: 'error' });

  } catch (error) {
    console.log(error);
    console.log('error in Sales Agents Data');
    res.status(401).send({ error: 'error' });
  }

});
router.post('/CarNameMasterData', async (req, res) => {
  try {
    // if (!req.body.sessionid) res.status(401).send('Invalid Request!');
    // else {
    if (req.headers.origin) {
      res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
      res.header("Access-Control-Allow-Headers", "content-type");
      res.header('Access-Control-Allow-Methods', 'GET');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Vary', 'Origin, Access-Control-Request-Headers');
    }
    let data = req.body
    let carNameDevelopmentURL = "http://iconnapifunc00-common-development.iconn-asestaging01.p.azurewebsites.net/api/GetCarNameMasterData?code=l1mciaC5LY2fiTnoiZvOt4JbRxmC5UFqLeziJlKrMuss4NcdBrJFSA==";
    let carNameStagingURL = "";
    let carNameProductionURL = "https://iconnapifunc00-common.iconn-asestaging01.p.azurewebsites.net//api/GetCarNameMasterData?code=GoXj3gRhXvdaSmy/Uxx2dunpamAUx7somiibev46CGYB51q1/4kCEg==";
    //console.log(data)
    let carName = {
      "CarMakerId": data.ID
    }
    // console.log(customerData)
    let response = await request.post({
      uri: carNameProductionURL,
      body: carName,
      json: true,
      timeout: 50000
    });
    if (response) {
      //console.log(JSON.parse(JSON.stringify(response)))
      res.send({ status: 'ok', response: response });
    }
    else res.status(401).send({ error: 'error' });

  } catch (error) {
    // console.log(error);
    console.log('error in Master Data');
    res.status(401).send({ error: 'error' });
  }

});
router.post('/CarModelMasterData', async (req, res) => {
  try {
    // if (!req.body.sessionid) res.status(401).send('Invalid Request!');
    // else {
    if (req.headers.origin) {
      res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
      res.header("Access-Control-Allow-Headers", "content-type");
      res.header('Access-Control-Allow-Methods', 'GET');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Vary', 'Origin, Access-Control-Request-Headers');
    }
    let data = req.body
    let carModelDevelopmentURL = "http://iconnapifunc00-common-development.iconn-asestaging01.p.azurewebsites.net/api/GetModelCodeMasterData?code=WV3zhkC31HFA3ujdfFUuu8lsXILXK6gjoMhdDuHFq3X/Zg1HQDfPXg==";
    let carModelStagingURL = "";
    let carModelProductionURL = "https://iconnapifunc00-common.iconn-asestaging01.p.azurewebsites.net/api/GetModelCodeMasterData?code=/UT70VoszwZEHV70Fwfco2UTdLXvq/yG4Um9X/kUNS/0QNcEuo7HDA==";
    //console.log(data)
    let carModel = {
      "CarMakerId": data.makerID,
      "CarName": data.nameID
    }
    // console.log(customerData)
    let response = await request.post({
      uri: carModelProductionURL,
      body: carModel,
      json: true,
      timeout: 50000
    });
    if (response) {
      //console.log(JSON.parse(JSON.stringify(response)))
      res.send({ status: 'ok', response: response });
    }
    else res.status(401).send({ error: 'error' });

  } catch (error) {
    // console.log(error);
    console.log('error in Master Data');
    res.status(401).send({ error: 'error' });
  }

});

export const iconIntegrationRoutes: express.Router = router;