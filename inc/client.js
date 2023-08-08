import engine from "./module/engine";
import { initializeApp } from "firebase/app";
import { getAuth, getRedirectResult } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import helper from "./helper";

class client {
  
  static init = async (req, window = undefined) => {
    let  helper = new engine().start();
    delete (helper.config.server);
    //helper.firebase = false;
    //console.log(req)
    if(window !== undefined){
      helper.siteUrl = window.location.protocol + '//' + window.location.hostname + (window.location.port === '' || window.location.port === '80' || window.location.port === '443' ? '' : ':' + window.location.port);
      const fapp = initializeApp(helper.config.client.firebase);
      const fAuth = getAuth(fapp);
      helper.firebase = { 
          app: fapp,
          db: getFirestore(fapp),
          rdb: getDatabase(fapp),
          auth: fAuth,
          storage: getStorage(fapp)
      }
      helper.user = await getRedirectResult(fAuth).then((r)=>{
        return fAuth.currentUser;
      }).catch(e => {return e}).finally(()=>{
        return fAuth.currentUser;
      });
    }else{
      helper.siteUrl = req.protocol + '//' + req.host
    }
    return helper;
  }

  static request = async (req, attr = {}) => {
    const type = attr.type === undefined ? 'GET' : attr.type.toUpperCase();
    const host = attr.host === undefined ? helper.getSiteUrl(window) + '/api' : attr.host;
    const headers = attr.headers !== undefined ? attr.headers : {};
    const user = attr.user === null ? helper.firebase.auth.currentUser : attr.user;
    if (user !== null) {
      headers.authtoken = user.accessToken;
    }
    const body = attr.body === undefined ? JSON.stringify({}) : JSON.stringify(attr.body);
    const query = attr.query === undefined ? new URLSearchParams({}).toString() : new URLSearchParams(attr.query).toString();
    let response;
    switch(type){
      case 'POST':
        response = async () => {
          return await fetch(`${host}/${req}`, {
            method: "POST",
            headers: headers,
            body: body
          });
        }
      break;
      default:
        response = await fetch(`${host}/${req}?${query}`, {
          method: "GET",
          headers: headers
        });
      break;
    }
    
    if (response.ok) {
      try{
        return await response.json();
      }catch(ex){
        alert('Error: ' + ex.message);
      }
    } else {
      if(response.status === 500){
        alert('Error: Server is too busy! Be patient, for a few moments.');
      }else{
        alert('Error: ' + response.status + "\n" + JSON.stringify(response));
      }
      console.log(response);
      
      return response.json();
    }
    ////console.log(headers);
    
  }

  _set = async (req, col, data, qry = '', params = {}) => {
    /* 
    'createCollection',dropCollection,insertone,insertmany 
    updateone updatemany deleteone 'deletemany': */
    
    if(data !== undefined){
      if(data._id !== undefined){
        data.updated = Timestamp.now();
        if(this.auth.currentUser !== null){
          data.updatedBy = this.auth.currentUser.uid;
        }
      }else{
        data.created = Timestamp.now();
        if(this.auth.currentUser !== null){
          data.createdBy = this.auth.currentUser.uid;
        }
      }
    }
    
    return await client.request(req, {
      body: {
        collection: (col),
        qry: qry,
        data: data,
        ...params
      }
    });
  }

  _get = async (req, col, qry, type = 'GET', params = {order: false, limit: false}) => {
    /*
    sortFind,joinfind,find,findone
    */
    return type.toLowerCase() === 'get' ? 
    await client.request(req, {
      query: {
        collection: (col),
        qry: JSON.stringify(qry),
        ...params
      }
    }) : 
    await client.request(req, {
      type: type,
      body: {
        collection: (col),
        qry: qry,
        ...params
      }
    });

  }

}
export default client;
