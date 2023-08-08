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
    console.log(app);
    if (headers !== undefined && headers.authtoken !== undefined) {
      let response  = await method(req, app);
      res.status(200).send(response);
    
    }else{
      res.status(404).json({error: "403", message: "Bad Request"})
    }
  }else{
    res.status(404).json({error: "404", message: "Request not found"})
  }
}

export default handler;
