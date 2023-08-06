const crypto = require('crypto');
const fs = require('fs');

const algorithm = 'aes-256-cbc';

const unreal = (vars) => {
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

const config = () => {
  try {
    const isDev = !get('NODE_ENV', 'production');
    return require(`../${isDev ? 'dev' : 'production'}.json`);
  } catch (ex) {
    console.log(ex);
    return process.env;
  }
};

const get = (k, val = undefined) => {
  if (val === undefined) {
    return process.env[k];
  } else {
    return process.env[k] === val;
  }
};

const data = !get('NODE_ENV', 'production')
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
  unreal: unreal,
  isDev: !get('NODE_ENV', 'production'),
  env: process.env['NODE_ENV'],
  fileExists: fileExists,
  config: config(),
  get: get,
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
