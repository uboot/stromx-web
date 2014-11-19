import DS from "ember-data";

import Observer from 'stromx-web/models/observer';

export default Observer.extend({
  input: DS.belongsTo('input', {async: true}),
  value: DS.belongsTo('connector-value', {async: true}),
});
