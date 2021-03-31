import { CampaignManagementModel } from './../models/campaignMgtModel';
import { AddressBookModel } from './../models/addressBookModel';
import * as express from "express";
import { __BIZZ_REST_REDIS_PUB } from "../globals/__biZZCMiddleWare";
import { EmailOwnerModel } from '../models/emailOwnerModel';
import { SessionManager } from '../globals/server/sessionsManager';
import { VisitorSessionSchema } from '../schemas/VisitorSessionSchema';
import { __biZZC_SQS } from '../actions/aws/aws-sqs';

let router = express.Router();

router.use(async (req, res, next) => {
  if (req.headers.referer && req.headers.referer.indexOf(((process.env.NODE_ENV == 'production') || (process.env.NODE_ENV == 'development')) ? 'beelinks.solutions' : 'localhost') != -1) {
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

  } else {


    res.status(401).send({ err: 'unauthorized' });
  }
})

router.post('/getAddressBooks', async (req, res) => {
  try {
    let data = req.body;
    let session;
    if (data.sessionId) session = await SessionManager.GetAgentByID(data.sessionId);;
    if (session) {
      let addBooks = await AddressBookModel.getAddressBooks(session.nsp);
      if (addBooks && addBooks.length) {
        res.send({ status: 'ok', addressBooks: addBooks });
      } else {
        res.send({ status: 'ok', addressBooks: [] });
      }
    }
    else res.status(401).send({ status: 'Unauthorized' })
  } catch (error) {
    console.log(error);
    console.log('Error in getAddressBooks');
    res.status(401).send("Invalid Request!");
  }
});

router.post('/toggleAddressBookActivation', async (req, res) => {
  try {
    let data = req.body;
    let session;
    if (data.sessionId) session = await SessionManager.GetAgentByID(data.sessionId);;
    if (session) {
      let addressBook = await AddressBookModel.ToggleActivation(session.nsp, data.activation, data.id, session.email);
      if (addressBook && addressBook.value) {
        // socket.to(Agents.NotifyAll()).emit('groupChanges', {status: 'ok'});
        res.send({ status: 'ok', addressBook: addressBook.value });
      } else {
        res.send({ status: 'error', msg: 'Not activated!' });
      }
    }
    else res.status(401).send({ status: 'Unauthorized' })
  } catch (error) {
    console.log(error);
    console.log('Error in toggleAddressBookActivation');
    res.status(401).send("Invalid Request!");
  }
});



router.post('/insertAddressBook', async (req, res) => {
  try {
    let data = req.body;
    let session;
    if (data.sessionId) session = await SessionManager.GetAgentByID(data.sessionId);;
    if (session) {
      data.addressBook.nsp = session.nsp;
      data.addressBook.customers = [];
      let addressBook = await AddressBookModel.insertAddressBook(data.addressBook);
      if (addressBook && addressBook.insertedCount > 0) {
        res.send({ status: 'ok', addressBook: addressBook.ops[0] });
      } else {
        res.status(401).send({ status: 'error' });
      }
    }
    else res.status(401).send({ status: 'Unauthorized' })
  } catch (error) {
    console.log(error);
    console.log('Error in insertAddressBook');
    res.status(401).send("Invalid Request!");
  }
});



router.post('/deleteAddressBook', async (req, res) => {
  try {
    let data = req.body;
    let session;
    if (data.sessionId) session = await SessionManager.GetAgentByID(data.sessionId);;
    if (session) {
      let addressBook = await AddressBookModel.deleteAddressBook(data.id, session.nsp);
      if (addressBook) {
        res.send({ status: 'ok', addressBook: addressBook });
      }
    }
    else res.status(401).send({ status: 'Unauthorized' })
  } catch (error) {
    console.log(error);
    console.log('Error in deleteAddressBook');
    res.status(401).send("Invalid Request!");
  }
});



router.post('/updateAddressBook', async (req, res) => {
  try {
    let data = req.body;
    let session;
    if (data.sessionId) session = await SessionManager.GetAgentByID(data.sessionId);;
    if (session) {
      let addressBook = await AddressBookModel.updateAddressBook(data._id, data.addressBook);
      if (addressBook && addressBook.value) {
        res.send({ status: 'ok', addressBook: addressBook.value });
      } else {
        res.status(401).send({ status: 'error' });
      }
    }
    else res.status(401).send({ status: 'Unauthorized' })
  } catch (error) {
    console.log(error);
    console.log('Error in updateAddressBook');
    res.status(401).send("Invalid Request!");
  }
});


router.post('/addCustomersforAddressBook', async (req, res) => {
  try {
    let data = req.body;
    let session;
    if (data.sessionId) session = await SessionManager.GetAgentByID(data.sessionId);;
    if (session) {
      let addressBook = await AddressBookModel.addCustomers(data.id, data.customers);
      if (addressBook && addressBook.value) {
        res.send({ status: 'ok', customers: addressBook.value.customers });
      } else {
        res.status(401).send({ status: 'error' });
      }
    }
    else res.status(401).send({ status: 'Unauthorized' })
  } catch (error) {
    console.log(error);
    console.log('Error in addCustomersforAddressBook');
    res.status(401).send("Invalid Request!");
  }
});



router.post('/removeCustomersFromAddressBook', async (req, res) => {
  try {
    let data = req.body;
    let session;
    if (data.sessionId) session = await SessionManager.GetAgentByID(data.sessionId);;
    if (session) {
      let addBooks = await AddressBookModel.removeCustomer(data.id, data.customers);
      if (addBooks && addBooks.value) {
        res.send({ status: 'ok', customers: addBooks.value.customers });
      } else {
        res.status(401).send({ status: 'error' });
      }
    }
    else res.status(401).send({ status: 'Unauthorized' })
  } catch (error) {
    console.log(error);
    console.log('Error in removeCustomersFromAddressBook');
    res.status(401).send("Invalid Request!");
  }
});



router.post('/toggleExcludeForAddressBook', async (req, res) => {
  try {
    let data = req.body;
    let session;
    if (data.sessionId) session = await SessionManager.GetAgentByID(data.sessionId);;
    if (session) {
      let addressBook = await AddressBookModel.toggleExclude(session.nsp, data.addressBook_name, data.customer, data.value);
      if (addressBook) {
        res.send({ status: 'ok', addressBook: addressBook });
      } else {
        res.status(401).send({ status: 'error', msg: 'Toggle exclude error', data: data });
      }
    }
    else res.status(401).send({ status: 'Unauthorized' })
  } catch (error) {
    console.log(error);
    console.log('Error in toggleExcludeForAddressBook');
    res.status(401).send("Invalid Request!");
  }
});

//previous Fahad Routes
// router.post('/addAddressList', async (req, res) => {
//     try {
//         let data = req.body;
//         let result = await AddressBookModel.addAddressList(data.formValues);
//         if (result) {
//             res.send({ status: "ok", list: result.ops[0] })
//         } else {
//             res.send({ status: 'error' });
//         }
//     } catch (error) {
//         console.log(error);
//         console.log('Error in getting agents against role');
//         res.status(401).send("Invalid Request!");
//     }
// });

// router.post('/updateAddressList', async (req, res) => {
//     try {
//         let data = req.body;
//         let result = await AddressBookModel.updateAddressList(data.formValues, data.id, data.nsp);
//         if (result && result.value) {
//             res.send({ status: "ok", list: result.value })
//         } else {
//             res.send({ status: 'error' });
//         }
//     } catch (error) {
//         console.log(error);
//         console.log('Error in getting agents against role');
//         res.status(401).send("Invalid Request!");
//     }
// });

// router.post('/toggleActivation', async (req, res) => {
//     try {
//         let data = req.body;
//         let result = await AddressBookModel.toggleActivation(data.flag, data.id, data.nsp);
//         if (result && result.value) {
//             res.send({ status: "ok", list: result.value })
//         } else {
//             res.send({ status: 'error' });
//         }
//     } catch (error) {
//         console.log(error);
//         console.log('Error in getting agents against role');
//         res.status(401).send("Invalid Request!");
//     }
// });


// router.post('/getAddressList', async (req, res) => {
//     try {
//         let data = req.body;
//         let result = await AddressBookModel.getAddressList(data.nsp);
//         if (result && result.length) {
//             res.send({ status: "ok", allAdresses: result })
//         } else {
//             res.send({ status: 'error' });
//         }
//     } catch (error) {
//         console.log(error);
//         console.log('Error in getting agents against role');
//         res.status(401).send("Invalid Request!");
//     }
// });


/** EMAIL OWNER CRUD AND ACTIVATION */
router.post('/addEmailOwner', async (req, res) => {
  try {
    let data = req.body;
    data.formValues['createdDate'] = new Date().toISOString();
    let result = await EmailOwnerModel.insertEmailOwner(data.formValues);
    if (result) {
      res.send({ status: "ok", result: result.ops[0] })
    } else {
      res.send({ status: 'error' });
    }
  } catch (error) {
    console.log(error);
    console.log('Error in adding email owner');
    res.status(401).send("Invalid Request!");
  }
});

router.post('/UpdateEmailOwner', async (req, res) => {
  try {
    let data = req.body;
    data.formValues['lastModifiedDate'] = new Date().toISOString();
    let result = await EmailOwnerModel.updateEmailOwner(data.id, data.nsp, data.formValues);
    if (result) {
      res.send({ status: "ok", result: result.value })
    } else {
      res.send({ status: 'error' });
    }
  } catch (error) {
    console.log(error);
    console.log('Error in adding email owner');
    res.status(401).send("Invalid Request!");
  }
});

router.post('/getOwnersList', async (req, res) => {
  try {
    let data = req.body;
    let result = await EmailOwnerModel.getOwnersList(data.nsp);
    if (result && result.length) {
      res.send({ status: "ok", allOwners: result })
    } else {
      res.send({ status: 'error' });
    }
  } catch (error) {
    console.log(error);
    console.log('Error in getting owner list');
    res.status(401).send("Invalid Request!");
  }
});

router.post('/deleteEmailOwner', async (req, res) => {
  try {
    let data = req.body;
    let result = await EmailOwnerModel.deleteEmailOwner(data.id, data.nsp);
    if (result) {
      res.send({ status: "ok" })
    } else {
      res.send({ status: 'error' });
    }
  } catch (error) {
    console.log(error);
    console.log('Error in deleting email owner');
    res.status(401).send("Invalid Request!");
  }
});

router.post('/toggleActivation', async (req, res) => {
  try {
    let data = req.body;
    let result = await EmailOwnerModel.toggleActivation(data.flag, data.id, data.nsp, data.email);
    if (result && result.value) {
      res.send({ status: "ok", result: result.value })
    } else {
      res.send({ status: 'error' });
    }
  } catch (error) {
    console.log(error);
    console.log('Error in getting agents against role');
    res.status(401).send("Invalid Request!");
  }
});

/**CAMPAIGN MANAGEMENT */

router.post('/insertCampaign', async (req, res) => {
  try {
    let data = req.body;
    data.formValues.created.at = new Date().toISOString();
    let result = await CampaignManagementModel.insertCampaign(data.formValues);
    if (result) {
      res.send({ status: "ok", result: result.ops[0] })
    } else {
      res.send({ status: 'error' });
    }
  } catch (error) {
    console.log(error);
    console.log('Error in inserting campaign');
    res.status(401).send("Invalid Request!");
  }
});

router.post('/getCampaigns', async (req, res) => {
  try {
    let data = req.body;
    let result = await CampaignManagementModel.getCampaigns(data.nsp);
    if (result && result.length) {
      res.send({ status: "ok", allCampaigns: result })
    } else {
      res.send({ status: 'error' });
    }
  } catch (error) {
    console.log(error);
    console.log('Error in getting campaigns');
    res.status(401).send("Invalid Request!");
  }
});

router.post('/deleteCampaign', async (req, res) => {
  try {
    let data = req.body;
    let result = await CampaignManagementModel.deleteCampaign(data.id, data.nsp);
    if (result) {
      res.send({ status: "ok" })
    } else {
      res.send({ status: 'error' });
    }
  } catch (error) {
    console.log(error);
    console.log('Error in deleting campaign');
    res.status(401).send("Invalid Request!");
  }
});


router.post('/UpdateCampaign', async (req, res) => {
  try {
    let data = req.body;
    data.obj.lastModified.at = new Date().toISOString();
    let result = await CampaignManagementModel.updateCampaign(data.id, data.nsp, data.formValues);
    if (result) {
      res.send({ status: "ok", result: result.value })
    } else {
      res.send({ status: 'error' });
    }
  } catch (error) {
    console.log(error);
    console.log('Error in adding email owner');
    res.status(401).send("Invalid Request!");
  }
});
router.post('/toggleCampaign', async (req, res) => {
  try {
    let data = req.body;
    let result = await CampaignManagementModel.toggleCampaign(data.flag, data.id, data.nsp, data.email, data.type);
    if (result && result.value) {
      res.send({ status: "ok", result: result.value })
    } else {
      res.send({ status: 'error' });
    }
  } catch (error) {
    console.log(error);
    console.log('Error in getting agents against role');
    res.status(401).send("Invalid Request!");
  }
});

router.post('/sendPreviewEmail', async (req, res) => {
  try {
    let data = req.body;
    let response = await __biZZC_SQS.SendMessage({ action: 'sendPreviewEmail', data: data });
    if (response) {
      res.send({ status: "ok" })
    } else {
      res.send({ status: 'error' });
    }
  } catch (error) {
    console.log(error);
    console.log('Error in sending preview campaign');
    res.status(401).send("Invalid Request!");
  }
});


export const bulkManagementRoutes: express.Router = router;