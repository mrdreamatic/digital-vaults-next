const crypto = require('crypto');
const fs = require('fs');

const algorithm = 'aes-256-cbc';

const empty = (vars) => {
  if (typeof vars === 'object') {
    if (Array.isArray(vars) && vars.length < 1) {
      return false;
    } else {
      return Object.keys(vars).length < 1;
    }
  }
  return vars === undefined || vars === null || vars === '';
};

let path = `..`;
const fileExists = (file, common = path) => {
  try {
    return fs.exist(common + '/' + file);
  } catch (err) {
    console.error(err);
    return err;
  }
};


const _get = (k, val = undefined) => {
  if (val === undefined) {
    return process.env[k];
  } else {
    return process.env[k] === val;
  }
};


const config = () => {
  try {
    const isDev = !_get('NODE_ENV', 'production');
    if(_get('IS') === undefined){
      return require(`../${isDev ? 'dev' : 'production'}.json`);
    }
    return require(`../${_get('IS')}.json`);
  } catch (ex) {
    console.log(ex);
    return process.env;
  }
};

const data = !_get('NODE_ENV', 'production')
  ? {
      b16: 'r3v7i0sz93zrrf9b',
      b32: '6e20522bac1b5358b8e1cb12b1d4fb94',
    }
  : {
      b16: 'r3v79b1b5358b8e1',
      b32: '6e20522baci0sz93zrrfcb12b1d4fb94',
    };
let _iv = Buffer.from(data.b16, 'utf8'); // crypto.randomBytes(16);
let _key = Buffer.from(data.b32, 'utf8'); // crypto.randomBytes(16);

const helper = {
  empty: empty,
  isDev: !_get('NODE_ENV', 'production'),
    _query: (qry = '') => {
      const params = new URLSearchParams(window.location.search);
      if (qry === '') {
        const result = {}
        for (const [key, value] of params.entries()) { // each 'entry' is a [key, value] tupple
          result[key] = value;
        }
        return result;
      } else {
        return params.get(qry);
      }
    
  },
  formObject: (target) => {
      let form = {};
      for (let i = 0; i < target.length; i++) {
          if(target.elements[i].getAttribute("name") !== null){
            if(target.elements[i].tagName.toLowerCase() === 'select' && target.elements[i].multiple){
              var result = [];
              var options = target.elements[i].options;
              var opt;
            
              for (let j=0, iLen=options.length; j<iLen; j++) {
                opt = options[j];
            
                if (opt.selected) {
                  result.push(opt.value || opt.text);
                }
              }
              form[target.elements[i].getAttribute("name")] = result;
            }else if(target.elements[i].getAttribute("type") !== null && ['radio','checkbox'].includes(target.elements[i].getAttribute("type"))){
              if(target.elements[i].getAttribute("type") === 'radio'){
                if(target.elements[i].checked){
                  form[target.elements[i].getAttribute("name")] = (target.elements[i].value)
                }
              }else{
                if(form[target.elements[i].getAttribute("name")] === undefined){
                  form[target.elements[i].getAttribute("name")] = []
                }
                if(target.elements[i].checked){
                  form[target.elements[i].getAttribute("name")].push(target.elements[i].value)
                }
              }
            }else{
              form[target.elements[i].getAttribute("name")] = target.elements[i].value; 
            }
              
          }
      }
      return form;
  },
  env: process.env['IS'],
  firebaseAuthorize: (window, attr = {
    package: 'org.digitalvaults',
    domain: 'firenext.page.link'
  })=>{
    return {
        url: window.location.href,
        handleCodeInApp: true,
        iOS: {
            bundleId: `${attr.package}.ios`
        },
        android: {
            packageName: `${attr.package}.android`,
            installApp: true,
            minimumVersion: '12'
        },
        dynamicLinkDomain: `${attr.domain}`
    }
  },
  fileExists: fileExists,
  getSiteUrl: (window) => {
    return window !== undefined ? window.location.protocol + '//' + window.location.hostname + (window.location.port === '' || window.location.port === '80' || window.location.port === '443' ? '' : ':' + window.location.port) : ''
  },
  config: config(),
  _get: _get,
  encrypt: (str, key = _key, iv = _iv) => {
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(str);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
  },
  decrypt: (str, key = _key) => {
    let iv = Buffer.from(str.iv, 'hex');
    let encryptedText = Buffer.from(str.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  },
};

export default helper;
