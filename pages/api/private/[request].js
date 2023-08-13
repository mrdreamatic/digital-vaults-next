import server from '../../../inc/server';
import fs from 'fs';
const path = '/inc/controller/private';
//console.log(config)

async function handler(req, res) {
  //console.log('METHOD >> ', req.method)
  
  if(fs.existsSync(`.${path}/${req.method}/${req.query.request}.js`)){
    const { default: method } = await import(`../../../inc/controller/private/${req.method}/${req.query.request}`);
    //console.log(method);
    const app = server.init(req);
    //console.log(app);
    if (req.headers !== undefined && req.headers.authtoken !== undefined) {
      try{

        app.user = await app.firebase.auth.verifyIdToken(req.headers.authtoken);
      //  console.log("UR >>>> ", app.user)
        let response  = app.user !== null && app.user !== undefined ? await method(req, app) : {code: 401, msg: "Unauthorized Access"};
        if(response.type === undefined && response.code === undefined){
          res.status(200).send(response)
        }else{
          res.status(response.code).send(response)
        }
      }catch(ex){
        res.status(500).send({code: ex.code, msg: ex.message})
      }
      
    
    }else{
      res.status(403).json({error: "403", message: "Bad Request"})
    }
  }else{
    res.status(404).json({error: "404", message: "Request not found"})
  }
}

export default handler;
