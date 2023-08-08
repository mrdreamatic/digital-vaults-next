import helper from '../helper';


export default class engine {
  constructor(server = false) {
    this.server = server;
    this.helper = helper;
  }

  start() {
    //console.log(this.helper)
    //this.helper.config = this.server ? this.helper.config.server : this.helper.config.client;
    return this.helper;
  }
}
