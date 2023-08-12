import App from 'next/app'
import { useEffect, useState } from 'react'
import '../styles/globals.css';
import '../styles/globals.scss';
import client from '../inc/client'

function MyApp({ Component, pageProps, request }) {
  const loader = <div className='preloader'>
    <div className="pencil">
    <div className="pencil__ball-point"></div>
    <div className="pencil__cap"></div>
    <div className="pencil__cap-base"></div>
    <div className="pencil__middle"></div>
    <div className="pencil__eraser"></div>
  </div>
  <div className="line"></div>
  </div>
  const [app, setApp] = useState(null);
 // console.log("8.)",_client);
  useEffect(()=>{
    let _app = (new client());
    _app.init(request, window).then((res)=>{
      
      _app.helper = res;
      setApp(_app);
    })
    
  },[app])
  
  
  return <>
  {
    app === null ? 
    <>
    {loader}
    </> :
    <Component {...{attr: pageProps, app: app, loader: loader}} /> 
  }
  </>
}

MyApp.getInitialProps = async (context) => {
  const ctx = await App.getInitialProps(context);
 let req = context.ctx.req;
  return { ...ctx, request: {
      host: req !== undefined ? req.headers.host : '',
      ref: req !== undefined ? req.headers.referer : '',
      protocol: req !==undefined && req.headers.referer !== undefined ? req.headers.referer.split("//")[0] : '',
      url: req !==undefined ? req.url : '',
      query: context.router.query,
      asPath: context.router.asPath,
      path: context.router.path,
      base: context.router.basePath,
      route: context.router.route
  } }
}

export default MyApp
