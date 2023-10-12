import App from 'next/app'
import { useEffect, useState } from 'react'
import '../styles/globals.css';
import '../styles/globals.scss';
import client from '../inc/client';
import loaderImg from './assets/loader.gif';
import Image from 'next/image';

function MyApp({ Component, pageProps, request }) {
  const loader = <div className='pre-loader d-flex ' style={{position: "fixed", zIndex: "99", left:"0", top:"0", height:"100vh",width:"100vw", justifyContent:"center", alignItems:"center"}}>
    <Image src={loaderImg} alt='loader' />
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
