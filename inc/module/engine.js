import helper from '../helper';
import Database from './database';

class engine {
  constructor() {
    this.helper = helper;
  }

  start() {
    this.db = {
      mongo: new Database(helper.config),
    };
  }
}
