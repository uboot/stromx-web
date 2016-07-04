import DS from "ember-data";
import Connector from 'stromx-web/models/connector';

export default Connector.extend({
  operator: DS.belongsTo('operator', {async: true}),
  connection: DS.belongsTo('connection', {async: true}),
  observers: DS.hasMany('input-observer', {async: true})
});
