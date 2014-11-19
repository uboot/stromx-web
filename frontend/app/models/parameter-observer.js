import DS from "ember-data";

import Observer from 'stromx-web/models/observer';

export default Observer.extend({
  parameter: DS.belongsTo('parameter', {async: true})
});
