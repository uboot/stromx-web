import DS from "ember-data";
import Connector from 'stromx-web/models/connector';

export default Connector.extend({
  operator: DS.belongsTo('operator', {async: true}),
  connections: DS.hasMany('connection', {async: true}),
  observers: DS.hasMany('output-observer', {async: true})
});
