import Unsplash from 'unsplash-js';

// const Unsplash = require('unsplash-js')

const client = {
  getInstance() {
    if(this._instance) return this._instance;
    return this._instance = new Unsplash({
      //TODO: Put it in environment vars.
      applicationId: "1eccca646ffdcffd33a902794c5086f1701713c20b2eb943a458880100bb677d",
      secret: "891c91a86a0842e6648925e8048cc35ede9986969db514e4e0ae6d8d811f1130",
      callbackUrl: `${process.env.IP}/auth`
    });
  }
};

// module.exports = client.getInstance();
export default client.getInstance();
