import engine from './module/engine';
import * as fAdmin from 'firebase-admin';
import { initializeApp, getApp, getApps } from 'firebase-admin/app';
import Database from './module/database';
const { getStorage } = require('firebase-admin/storage');

class server extends engine {
  
  static init = (req) => {
    let  helper = new engine().start();
    delete (helper.config.client);
    const serviceAccount = helper.config.server.firebase;
    
    const app = !getApps().length ? initializeApp({
        credential: fAdmin.credential.cert(serviceAccount),
        databaseURL: serviceAccount.databaseURL,
        storageBucket: serviceAccount.storageBucket,
        projectId: serviceAccount.projectId,
    }) : getApp();
        
    helper.firebase = {
        app: app,
        db: fAdmin.firestore(),
        rdb: fAdmin.database(),
        auth: app.auth(),
        storage: getStorage(app)
    }
    helper.db = new Database(helper.config.server.mongo);
    helper.request = {
        host: req !== undefined ? req.headers.host : '',
        ref: req !== undefined ? req.headers.referer : '',
        protocol: req !==undefined && req.headers.referer !== undefined ? req.headers.referer.split("//")[0] : '',
        url: req !==undefined ? req.url : '',
        query: req.query,
        body: req.body,
        headers: req.headers,
        on: req.on
    }
    return helper;
  }
  
}
export default server;
