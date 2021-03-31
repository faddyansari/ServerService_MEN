
// Created By Saad Ismail Shaikh
// Date : 22-1-18

import * as express from "express";

import { SessionManager } from '../globals/server/sessionsManager';
import { Pricing, encrypt, GenerateOrderID, subscriptionURL, packageCodesCard, packageCodesDirect, subscriptionURLDirect, subscriptionSuccessPath, subscriptionThankYouPath } from '../globals/config/constants';
import { __biZZC_SQS } from "../actions/aws/aws-sqs";
import { __BizzC_S3 } from "../actions/aws/aws-s3";
import { __biZZC_Core, __BIZZC_REDIS, __BIZZ_REST_REDIS_PUB } from "../globals/__biZZCMiddleWare";
import { Orders } from "../models/orders";
import { Company } from "../models/companyModel";
import { Agents } from "../models/agentModel";
import * as request from 'request-promise';
import * as retry from 'async-retry';
import { isArray } from "util";
import { PackagesModel } from "../models/packagesModel";


let router = express.Router();

router.use('/', async (req, res, next) => {

  try {
    if (req.path.indexOf(subscriptionSuccessPath) != -1 || req.path.indexOf(subscriptionThankYouPath) != -1) {

      next();

    } else {
      // console.log(req.query)
      // console.log(req.params)
      if (!req.body.sid) { res.status(401).send({ status: 'err', msg: 'sid not present' }); return; }
      // console.log('SID : ', decodeURIComponent(req.body.sid));
      let agent = await SessionManager.GetAgentByID(decodeURIComponent(req.body.sid));
      // console.log('Agent :', agent.role);
      if (agent && agent.role == 'superadmin') {
        next();
      } else {
        res.status(401).send({ status: 'err', msg: 'unauthorized' });
      }
    }

  } catch (error) {
    console.log(error);
    console.log('error in Orders Middleware')
  }

});


/**
 * @TODO
 * 1. Create Thank you page design
 * 2. Respond with HTML from Following Route
 */
router.get('/thank_you', (req, res) => {
  console.log('Ok Thank YOu');
  res.status(200).send({ status: 'Ok Thank You' });
  return;
});

router.post('/payment_complete', async (req, res) => {

  try {
    // console.log(req.body);
    if (req.body.ResponseObject.Packages && isArray(req.body.ResponseObject.Packages)) {
      let company = await Company.getCompanyByOrderID(req.body.ResponseObject.OrderKey);
      let invoice: Orders;
      if (company && company.length) {

        let promises = await Promise.all(req.body.ResponseObject.Packages.map(async pkg => {
          try {
            // console.log(pkg);
            switch (pkg.PackageId) {
              case packageCodesDirect.agent:
              case packageCodesCard.agent:
                /**
                 * @Case Handle Agents Buying
                 * 1. Increase Limit
                 * 2. Insert Invoice
                 */
                invoice = {
                  nsp: company[0].name,
                  date: new Date().toISOString(),
                  items: (pkg.Quantity > 1) ? [`${pkg.Quantity} Agents`] : [`${pkg.Quantity} Agent`],
                  status: 'completed',
                  amount: req.body.ResponseObject.Amount,
                  invoiceID: req.body.ResponseObject.ChargeId,
                  submittedBy: ''
                };

                await Orders.InsertInvoice(invoice);
                await Company.updateAgentLimit(company[0].name, pkg.Quantity)

                // await Promise.all([
                //     await Orders.InsertInvoice(invoice),
                //     await Company.updateAgentLimit(company[0].name, pkg.Quantity)
                // ]);
                return;
              case packageCodesDirect['honey-comb']:
              case packageCodesCard['honey-comb']:
                let pack = await PackagesModel.GetPackageByName(pkg.PackageCode);
                if (pack && pack.length) {

                  pack[0].details.agents.limit = company[0].package.agents.limit;

                  await Company.updateCompanyPackage(company[0].name, pack[0].details);
                }

                invoice = {
                  nsp: company[0].name,
                  date: new Date().toISOString(),
                  items: [`${pkg.PackageName}`],
                  status: 'completed',
                  amount: req.body.ResponseObject.Amount,
                  invoiceID: req.body.ResponseObject.ChargeId,
                  submittedBy: ''
                };

                await Orders.InsertInvoice(invoice);
                // await Company.updateAgentLimit(company[0].name, pkg.Quantity)
                return;

            }

          } catch (error) {
            console.log(error);
            console.log('error in Processing Packages');
          }
        }));
        await promises;
        res.status(200).send({ status: 'ok', data: req.body });
      } else {
        console.log({ status: 'err', msg: 'order_id not exist' });
        res.status(401).send({ status: 'err', msg: 'order_id not exist' });
      }
    } else {
      console.log({ status: 'err', msg: 'invalid obj' });
      res.status(401).send({ status: 'err', msg: 'invalid obj' });
    }
  } catch (error) {
    console.log(error);
    console.log('error in payment complete');
    res.status(500).send({ status: 'err', msg: 'internal server error' });

  }

});

router.post('/getPricing', async (req, res) => {
  try {

    // console.log('Params : ', req.body);
    let pricing = await Orders.GetPricing();
    if (pricing && pricing.length) res.status(200).send({ status: 'ok', agentPrice: pricing[0].agentPrice });
    else res.status(200).send({ status: 'ok', agentPrice: Pricing.agentPrice });

  } catch (error) {
    console.log(error);
    console.log('Error in Getting Pricing');
    res.status(500).send({ status: 'internal server error' });
  }
})


/**
 * @params
 * 1. sid : string
 * 2. nsp : string
 * 3. email : string
 */
router.post('/getInvoices', async (req, res) => {
  try {

    let orders = await Orders.GetOrders(decodeURIComponent(req.body.nsp));
    res.status(200).send({ status: 'ok', invoices: orders, synced: (orders && orders.length < 20) });

  } catch (error) {
    console.log(error);
    console.log('Error in Getting Invoices');
    res.status(500).send({ status: 'internal server error' });
  }
})

/**
 * @params
 * 1. sid : string
 * 2. nsp : string
 * 3. lastInvDate : string,
 * 4. email : string
 */
router.post('/getMoreInvoices', async (req, res) => {
  try {

    // console.log('Params : ', req.body);
    let orders = await Orders.GetMoreOrders(decodeURIComponent(req.body.nsp), req.body.lastInvDate);
    res.status(200).send({ status: 'ok', invoices: orders, synced: (orders && orders.length < 20) });

  } catch (error) {
    console.log(error);
    console.log('Error in Getting More Invoices');
    res.status(500).send({ status: 'internal server error' });
  }
})


router.post('/createInvoice', async (req, res) => {
  try {

    let orders = await Orders.GetOrders(req.body.nsp);
    res.status(200).send({ status: 'ok', invoices: orders, synced: (orders && orders.length < 20) });

  } catch (error) {
    console.log(error);
    console.log('Error in Creating Invoices');
    res.status(500).send({ status: 'internal server error' });
  }
})


router.post('/verifyAgentBuyLimit', async (req, res) => {
  try {

    if (!req.body.count || req.body.count < 0) { res.status(401).send({ status: 'err', msg: 'Invalid Request' }); return; }
    let company = await Company.getCompany(req.body.nsp);
    // console.log('Verifying Agent BUy LImit : ', pkg[0]);
    if (company && company.length && company[0].package.agents.limit) {
      // console.log(company[0].package.agents.limit);
      // console.log(company[0].package.agents.quota)
      // console.log(company[0].package.agents.limit + parseInt(req.body.count))
      if (((company[0].package.agents.limit + parseInt(req.body.count)) > company[0].package.agents.quota)) {
        res.status(400).send({ status: 'err', msg: 'Agents Limit Exceeded' });
        return;
      } else if (((company[0].package.agents.limit + parseInt(req.body.count)) <= company[0].package.agents.quota)) {

        /**
         * @cases
         * 1. If there is order ID send the Direct Package Link
         * 2. If there is not any Order ID send the Card Package Link
         */

        let UpdateOrderID = !(company[0].orderID);
        let orderID = (company[0].orderID) ? company[0].orderID : GenerateOrderID();
        let result = await retry(async async => {
          // console.log('Retrying', {
          //     OrderKey: orderID,
          //     Packages: {
          //         PackageId: ((UpdateOrderID) ? packageCodesCard['agent'] : packageCodesDirect['agent']),
          //         Quantity: req.body.count
          //     }
          // });
          try {

            if (UpdateOrderID) {

              let response = await request.post(subscriptionURL + packageCodesCard['agent'], {
                body: {
                  OrderKey: orderID,
                  Packages: {
                    PackageId: packageCodesCard['agent'],
                    Quantity: req.body.count
                  }
                },
                json: true,
                timeout: 30000
              });
              // console.log('response : ', response);
              //if resultcode == 401 then retry
              if (response && (response.ResultCode == 200)) return response
              else return undefined;

            } else {

              // console.log(subscriptionURLDirect + packageCodesDirect['agent']);
              let response = await request.post(subscriptionURLDirect + packageCodesDirect['agent'], {
                body: {
                  OrderKey: orderID,
                  Packages: {
                    PackageId: packageCodesDirect['agent'],
                    Quantity: req.body.count
                  }
                },
                json: true,
                timeout: 30000
              });
              // console.log('response : ', response);
              //if resultcode == 401 then retry
              /**
               * @Cases
               * 1. If result code is 200 then return success true for better user experience because payment will be recieved later via Webhook
               * 2. If result code is not 200 then regenerate OrderID and follow the above process.
               */
              if (response && (response.ResultCode == 200)) {
                response.success = true;
                return response
              } else if (response && (response.ResultCode == 401 || (response.ResultText as string).toLowerCase() == 'subscription not found')) {
                orderID = GenerateOrderID();
                UpdateOrderID = true;
                let response = await request.post(subscriptionURL + packageCodesCard['agent'], {
                  body: {
                    OrderKey: orderID,
                    Packages: {
                      PackageId: packageCodesCard['agent'],
                      Quantity: req.body.count
                    }
                  },
                  json: true,
                  timeout: 30000
                });
                // console.log('response : ', response);

                if (response && (response.ResultCode == 200)) return response
                else return undefined;
              } else return undefined;

            }
            // console.log(subscriptionURL + ((UpdateOrderID) ? packageCodesCard['agent'] : packageCodesDirect['agent']));


          } catch (error) {
            console.log(error);
            console.log('error in submitting Orderid');
          }


        }, { retries: 5, factor: 3, randomize: true });
        // console.log(result);
        if (UpdateOrderID && result) await Company.InsertOrderID(req.body.nsp, orderID);
        if (result) {
          if (result.success) res.status(200).send({ status: 'ok', result: { PaymentURL: '', success: true } });
          else res.status(200).send({ status: 'ok', result: { PaymentURL: result.ResponseObject.PaymentURL, success: false } });
        } else {
          res.status(500).send({ status: 'err', result: result });
        }


      }
    } else {
      res.status(401).send({ status: 'Limit Not Found' });
    }

    // res.status(200).send({ status: 'ok', invoices: orders, synced: (orders && orders.length < 20) });

  } catch (error) {
    console.log(error);
    console.log('Error in Verifying Agents Limit');
    res.status(500).send({ status: 'internal server error' });
  }
})

router.post('/upgradePackage', async (req, res) => {
  try {

    if (!req.body.nsp || req.body.name < 0) { res.status(401).send({ status: 'err', msg: 'Invalid Request' }); return; }
    if (!packageCodesCard[req.body.name]) {
      res.status(401).send({ status: 'err', msg: 'Package Not Found' });
      return;
    }
    let company = await Company.getCompany(req.body.nsp);
    // console.log('Verifying Agent BUy LImit : ', pkg[0]);
    /**
            * @cases
            * 1. If there is order ID send the Direct Package Link
            * 2. If there is not any Order ID send the Card Package Link
            */

    let UpdateOrderID = !(company[0].orderID);
    let orderID = (company[0].orderID) ? company[0].orderID : GenerateOrderID();
    let result = await retry(async async => {

      try {

        if (UpdateOrderID) {

          let response = await request.post(subscriptionURL + packageCodesCard[req.body.name], {
            body: {
              OrderKey: orderID,
              Packages: {
                PackageId: packageCodesCard[req.body.name],
                PackageName: req.body.name
              }
            },
            json: true,
            timeout: 30000
          });
          // console.log('response : ', response);
          //if resultcode == 401 then retry
          if (response && (response.ResultCode == 200)) return response
          else return undefined;

        } else {

          console.log(subscriptionURLDirect + packageCodesDirect[req.body.name]);
          let response = await request.post(subscriptionURLDirect + packageCodesDirect[req.body.name], {
            body: {
              OrderKey: orderID,
              Packages: {
                PackageId: packageCodesDirect[req.body.name],
                PackageName: req.body.name
              }
            },
            json: true,
            timeout: 30000
          });
          console.log('response : ', response);
          //if resultcode == 401 then retry
          /**
           * @Cases
           * 1. If result code is 200 then return success true for better user experience because payment will be recieved later via Webhook
           * 2. If result code is not 200 then regenerate OrderID and follow the above process.
           */
          if (response && (response.ResultCode == 200)) {
            response.success = true;
            return response
          } else if (response && (response.ResultCode == 401 || (response.ResultText as string).toLowerCase() == 'subscription not found')) {
            orderID = GenerateOrderID();
            UpdateOrderID = true;
            let response = await request.post(subscriptionURL + packageCodesCard[req.body.name], {
              body: {
                OrderKey: orderID,
                Packages: {
                  PackageId: packageCodesCard[req.body.name],
                  PackageName: req.body.name
                }
              },
              json: true,
              timeout: 30000
            });
            // console.log('response : ', response);

            if (response && (response.ResultCode == 200)) return response
            else return undefined;
          } else return undefined;

        }
        // console.log(subscriptionURL + ((UpdateOrderID) ? packageCodesCard['agent'] : packageCodesDirect['agent']));


      } catch (error) {
        console.log(error);
        console.log('error in submitting Orderid');
      }


    }, { retries: 5, factor: 3, randomize: true });
    // console.log(result);
    if (UpdateOrderID && result) await Company.InsertOrderID(req.body.nsp, orderID);
    if (result) {
      if (result.success) res.status(200).send({ status: 'ok', result: { PaymentURL: '', success: true } });
      else res.status(200).send({ status: 'ok', result: { PaymentURL: result.ResponseObject.PaymentURL, success: false } });
    } else {
      res.status(500).send({ status: 'err', result: result });
    }

    // res.status(200).send({ status: 'ok', invoices: orders, synced: (orders && orders.length < 20) });

  } catch (error) {
    console.log(error);
    console.log('Error in Verifying Agents Limit');
    res.status(500).send({ status: 'internal server error' });
  }
})



/* #endregion */
export const ordersRoutes: express.Router = router;