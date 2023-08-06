import engine from './module/engine';

class control extends engine {
  constructor() {
    delete this.helper.config;
  }
}
export default control;
