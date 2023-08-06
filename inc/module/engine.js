import __ from "../helper";

const __ = __;

class engine {
  constructor(isDev = true) {
    //const data = require(`../../../${isDev ? 'key' : 'pro-key'}.json`);

    const dev = require(`../../../${isDev ? 'dev' : 'production'}.json`);
    ////console.log(data);
    //Using AES encryption
    this.start = {
      decode: (k = false, c = data.data) => {
        if (!k) {
          return dev;
        }
        return dev[k] !== undefined ? dev[k] : null;
        /*const json = JSON.parse(this.decrypt(c));
            //console.log(json);
            if(!k){
               return json;
            }
            return json[k] !== undefined ? json[k] : null;*/
      },
      encode: (k = false, c = dev) => {
        const json = this.encrypt(JSON.stringify(c));
        //console.log(json)
        if (!k) {
          return json;
        }
        return json[k] !== undefined ? json[k] : null;
      },
    };
    this.start.encode();
  }
}

export default engine;
