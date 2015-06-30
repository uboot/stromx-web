import DS from "ember-data";

import ENV from '../config/environment';

export default DS.RESTAdapter.extend({
  host: ENV.APP.API_HOST,
  namespace: 'api',
  
  // FIXME: introduced because of deprecation warning
  shouldBackgroundReloadRecord: function() {
    return false;
  },
  
  // FIXME: introduced because of deprecation warning
  shouldReloadAll: function() {
    return true;
  }
});
