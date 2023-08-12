import engine from "./module/engine";
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, getRedirectResult, isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailAndPassword, signInWithEmailLink, signInWithPopup, signOut } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import helper from "./helper";

class client {
  
  init = async (req, window = undefined) => {
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

  request = async (req, attr = {}) => {
    const method = attr.method === undefined ? 'GET' : attr.method.toUpperCase();
    const type = attr.type === undefined ? 'public' : attr.type.toLowerCase();
    const host = attr.host === undefined ? helper.getSiteUrl(window) + '/api' : attr.host;
    const headers = attr.headers !== undefined ? attr.headers : {};
    let user = attr.user === undefined ? this.helper.firebase.auth.currentUser : attr.user;
    console.log(user);
    if (user !== null) {
      headers.authtoken = user.accessToken;
    }
    const body = attr.body === undefined ? JSON.stringify({}) : JSON.stringify(attr.body);
    const query = attr.query === undefined ? new URLSearchParams({}).toString() : new URLSearchParams(attr.query).toString();
    let response;
    switch(method){
      case 'POST':
        response = await fetch(`${host}/${type}/${req}`, {
            method: "POST",
            headers: headers,
            body: body
          });
      break;
      default:
        response = await fetch(`${host}/${type}/${req}?${query}`, {
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
      console.log(method, response);
      
      return response;
    }
    ////console.log(headers);
    
  }

  dbset = async (req, col, data, qry = '', params = {}) => {
    /* 
    'createCollection',dropCollection,insertone,insertmany 
    updateone updatemany deleteone 'deletemany': */
    
    if(data !== undefined){
      if(data._id !== undefined){
        data.updated = new Date();
        if(this.helper.user !== null){
          data.updatedBy = this.helper.user.uid;
        }
      }else{
        data.created = new Date();
        if(this.helper.user !== null){
          data.createdBy = this.helper.user.uid;
        }
      }
    }
    
    return await this.request(req, {
      type: "private",
      method: "POST",
      body: {
        col: (col),
        qry: qry,
        data: data,
        ...params
      }
    });
  }

  db = async (type = 'GET', req, col, qry, params = {order: {}, limit: 10, skip: 0}) => {
    /*
    sortFind,joinfind,find,findone
    */
   params.order = JSON.stringify(params.order);
    return type.toLowerCase() === 'get' ? 
    await this.request(req, {
      query: {
        col: (col),
        qry: JSON.stringify(qry),
        ...params
      }
    }) : 
    await this.request(req, {
      type: type,
      body: {
        col: (col),
        qry: qry,
        ...params
      }
    });

  }

  signUp = async () => {
    return await createUserWithEmailAndPassword(this.helper.firebase.auth, email, password);
  }

  signOut = async () => {
    return await signOut(this.helper.firebase.auth);
  }

  VerifyPasswordLess = async(user) => {
    ////console.log(uid);
    user = user === null || user === undefined ? false : user.uid;

    if (!user && isSignInWithEmailLink(this.helper.firebase.auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt('Please provide your email for confirmation');
      }

      return signInWithEmailLink(this.helper.firebase.auth, email, window.location.href)
    }
  }

  _helper = () => {
    return helper;
  }

  signIn = async (attr = {}, using = 'password') => {
    switch(using){
      case 'google':
        
          let provider = new GoogleAuthProvider();
          provider.addScope('https://www.googleapis.com/auth/userinfo.email');
          provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
          return signInWithPopup(this.helper.firebase.auth, provider)
          .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            console.log(user);
            window.location.reload();
            return user;
            // IdP data available using getAdditionalUserInfo(result)
            // ...
          }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            return errorMessage;
            // ...
          });
        
      case 'passwordless':
        return sendSignInLinkToEmail(this.helper.firebase.auth, attr.email, this.helper.firebaseAuthorize(window))
      default:
        return await signInWithEmailAndPassword(this.helper.firebase.auth, attr.email, attr.password);
      
    }
  }

  form = (x, option = [], key) => {
    let type = x.type === undefined ? '' : x.type;
    let country;
    if(x.rel !== undefined){
      
      try{
        country = JSON.parse(x.rel);
      }catch(ex){
        console.log(ex);
        country = x.rel
      }
    }
    
    //console.log(country);
    switch(type){
        case 'image':
        return <div className="form-group text-end" key={key}>
            <img alt={x.title} {...x.attr} />
        </div>
        case 'checkbox-section':
        return <>
        {option.length > 0 && <div className="form-group" key={key}>
            <h4 className='m-0'>{x.title}</h4>
            <ul className='list-group'>
            {
                option.map((v,i)=>{
                    return v.map((w,j)=>{
                        return <li className='list-group-item'>
                            <h6 className='m-0 mb-1 text-dark' key={j}>{w.title}</h6>
                            {
                                w.option.map((z,k)=>{
                                    return <div key={k} className="form-check form-check-inline">
                                        <input type="checkbox"  {...x.attr} id={x.name + `_${i}_${j}_${k}` } name={x.name} className="form-check-input" checked={x.dataChecked.includes(z.text)} defaultValue={z.text} /> <label className="form-check-label" htmlFor={x.name + `_${i}_${j}_${k}` }>{z.text}</label>
                                    </div>
                                })
                            }
                        </li>
                    });
                    
                })
            }
            </ul>
            
            <div className="p-2"></div>
        </div>}
        </>;
        case 'checkbox':
         // console.log(x);
        let checked = x.checked === undefined ? [] : x.checked;
        return <div className="form-group" key={key}>
            <h6>{x.title}</h6>
            {
                option.map((v,i)=>{
                  
                // console.log(checked, v);
                    return <div key={i} className="form-check form-check-inline">
                        <input type="checkbox"  {...x.attr} id={x.name + '_' + i } name={x.name} className="form-check-input" checked={v.defaultChecked} defaultValue={v.val} /> <label className="form-check-label" htmlFor={x.name + '_' + i }>{v.text}</label>
                    </div>
                })
            }
            
            <div className="p-2"></div>
        </div>;
        case 'radio':
        
        return <div className="form-group" key={key}>
            <h6>{x.title}</h6>
            
            {
                option.map((v,i)=>{
                    return <div key={i} className="form-check form-check-inline">
                     <input type="radio" {...x.attr} id={x.name + v.val} name={x.name} checked={v.defaultChecked} className="form-check-input" defaultValue={v.val} /> <label className="form-check-label" htmlFor={x.name + v.val}>{v.text}</label>
                    </div>
                })
            }
            
            <div className="p-2"></div>
        </div>;
        case 'date':
        return <div className="form-group" key={key}>
            <label>{x.title}</label>
            <input type="date" name={x.name} className="form-control" {...x.attr} />
            <div className="p-2"></div>
        </div>;
        case 'select':
            //console.log(x.selected);
            
        return <div className="form-group" key={key}>
            <h6>{x.title}</h6>
            <select id={x.name} name={x.name} {...x.attr} className="form-control">
            <option value={''}>Select your {x.name}</option>
            {
                option.map((v, i)=>{
                    return <option key={i} value={v.val} selected={x.attr.multiple !== undefined && x.attr.multiple && Array.isArray(x.selected) ? x.selected.includes(v.val) : x.selected === v.val}>{v.text}</option>
                })
            }
            </select>
            <div className="p-2"></div>
        </div>;
        
        case 'mobile':
        return <>
        <h6>{x.title}</h6>
        <div className="input-group mb-2" key={key}>
            <span className="input-group-text" id="basic-addon1">{country !== null ? `${country.flag} +${country.phonecode}` : ""}</span>
            <input type="text" className="form-control" name={x.name} {...x.attr} aria-label={x.name} aria-describedby="basic-addon1" />
            <input type="hidden" className="form-control" name={`phoneCode`} value={country !== null ? `${country.phonecode}` : ""}  />
        </div>
        </>
        case 'textarea':
        return <div className="form-group" key={key}>
            <label>{x.title}</label>
            <textarea className="form-control"  name={x.name} {...x.attr}  ></textarea>
            <div className="p-2"></div>
        </div>
        case 'sep':
        return <div {...x.attr}>{x.content}</div>
        default: 
        return <div className="form-group" key={key}>
            <label>{x.title}</label>
            <input type={x.type} className="form-control"  name={x.name} {...x.attr}  />
            <div className="p-2"></div>
        </div>
    }
}

}
export default client;
