import DS from "ember-data";

import ENV from '../config/environment';

export default DS.RESTAdapter.extend({
  // host: "http://localhost:8888",
  host: ENV.APP.API_HOST,
  namespace: 'api'
});
