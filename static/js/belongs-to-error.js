window.App = Ember.Application.create();

App.ApplicationAdapter = DS.FixtureAdapter.extend();

App.Pet = DS.Model.extend({
  name: DS.attr('string'),
  owner: DS.belongsTo('student')
});

App.Student = DS.Model.extend({
  name: DS.attr('string'),
  pets: DS.hasMany('pet', {async: true})
});

App.Student.FIXTURES = [
  {
    id: 1,
    name: 'Bob',
    pets: [1, 2]
  },
  {
    id: 2,
    name: 'Alice',
    pets: []
  },
  {
    id: 3,
    name: 'Tom',
    pets: []
  }
];

App.Pet.FIXTURES = [
  {
    id: 1,
    name: 'Cat',
    owner: 1
  },
  {
    id: 2,
    name: 'Dog',
    owner: 1
  }
];

App.Router.map(function () {
  this.resource('students', { path: '/'});
});

App.StudentsRoute = Ember.Route.extend({
  model: function () {
    return this.store.find('student');
  }
});

App.StudentController = Ember.ObjectController.extend({
  actions: {
    save: function () {
        this.set('name', 'Alex')
        var student = this.get('model')
        student.save()
    }
  }
});

// cf. http://discuss.emberjs.com/t/ember-data-fixture-adapter-saving-record-loses-has-many-relationships/2821/6
DS.JSONSerializer.reopen({
    serializeHasMany : function(record, json, relationship) {
        var key = relationship.key;

        var relationshipType = DS.RelationshipChange.determineRelationshipType(
                record.constructor, relationship);

        if (relationshipType === 'manyToNone'
                || relationshipType === 'manyToMany'
                || relationshipType === 'manyToOne') {
            json[key] = Ember.get(record, key).mapBy('id');
            // TODO support for polymorphic manyToNone and manyToMany
            // relationships
        }
    }
});