import DS from "ember-data";

var ErrorModel = DS.Model.extend({
  time: DS.attr('date'),
  description: DS.attr('string')
});

ErrorModel.reopenClass({
  FIXTURES: [
    {
      id: 1,
      time: new Date('2014-01-20T12:47:07+00:00'),
      description: "Failed to open stream file"
    },
    {
      id: 2,
      time: new Date('2014-01-20T13:00:00+00:00'),
      description: "Failed to initialize blur operator"
    }
  ]
});

export default ErrorModel;
