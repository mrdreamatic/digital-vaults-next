import server from '../../../inc/server';
import fs from 'fs';
const path = '/inc/controller/public';
//console.log(config)

async function handler(req, res) {
  //console.log('METHOD >> ', req.method)
  
  if(fs.existsSync(`.${path}/${req.method}/${req.query.request}.js`)){
    const { default: method } = await import(`../../../inc/controller/public/${req.method}/${req.query.request}`);
    const app = server.init(req)
    //console.log(`${app.request.protocol}//${app.request.host}`);
    let response  = await method(req, app);
    if(response.type === undefined && response.code === undefined){
      res.status(200).send(response)
    }else{
      res.status(response.code).send(response)
    }
    

  }else{
    res.status(404).json({error: "404", message: "Request not found"})
  }
}

export default handler;
