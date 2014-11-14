import Ember from "ember";

export default Ember.ObjectController.extend({
  isEditing: false,

  isEnum: function() {
    return this.get('variant') === 'enum';
  }.property('variant'),

  isString: function() {
    return this.get('variant') === 'string';
  }.property('variant'),

  isInt: function() {
    return this.get('variant') === 'int';
  }.property('variant'),

  isFloat: function() {
    return this.get('variant') === 'float';
  }.property('variant'),

  isBool: function() {
    return this.get('variant') === 'bool';
  }.property('variant'),

  isTrigger: function() {
    return this.get('variant') === 'trigger';
  }.property('variant'),

  timedOut: function() {
    return this.get('state') === 'timedOut';
  }.property('state'),

  current: function() {
    return this.get('state') === 'current';
  }.property('state'),

  editable: function() {
    var typeIsKnown = (this.get('isString') ||
                       this.get('isEnum') ||
                       this.get('isInt') ||
                       this.get('isFloat'));
    return this.get('writable') && this.get('current') && typeIsKnown;
  }.property('writable', 'isString', 'isInt', 'isFloat', 'state'),

  writeOnly: Ember.computed.not('writable'),

  accessFailed: function() {
    return this.get('state') === 'accessFailed';
  }.property('state'),

  editValue:  function(key, value) {
    if (value === undefined) {
      if (this.get('isInt') || this.get('isFloat'))
        return this.get('value');
      else if (this.get('isString'))
        return this.get('value');
      else
        return '';
    }
    else {
      var v;
      if (this.get('isInt')) {
        v = parseInt(value, 10);
        this.set('value', v);
        return v;
      }
      else if (this.get('isFloat')) {
        v = parseFloat(value);
        this.set('value', v);
        return v;
      }
      else if (this.get('isString')) {
        this.set('value', value);
        return value;
      }
    }
  }.property('value', 'variant'),

  boolValue:  function(key, value) {
    if (value === undefined) {
      return this.get('value');
    }
    else {
      this.set('value', value);
      var model = this.get('model');
      model.save();
      return value;
    }
  }.property('value'),

  displayValue: function(key, value) {
    if (value !== undefined)
      return value;

    if (! this.get('current'))
      return '';

    if (this.get('isEditing'))
      return '';

    if (this.get('isInt'))
      return this.get('value');
    else if (this.get('isFloat'))
      return this.get('value');
    else if (this.get('isEnum'))
      return this.updateEnumTitle(this.get('value'));
    else if (this.get('isBool'))
      return "";
    else
      return this.get('value');
  }.property('value', 'variant', 'isEditing'),

  // cf. http://stackoverflow.com/q/20623027
  updateEnumTitle: function(enumValue) {
    var value = enumValue;
    var title = this.get('descriptions').then( function(value){
      return value.find( function(item, index, enumerable) {
         return item.get('value') === enumValue;
      });
    }).then( function(obj) {
      return obj.get('title');
    });

    var _this = this;
    title.then( function(title) {
      _this.set('displayValue', title);
      value = title;
    });

    return value;
  },

  actions: {
    editValue: function() {
      this.set('isEditing', true);
    },

    saveValue: function() {
      this.set('isEditing', false);
      var model = this.get('model');
      model.save();
    },

    reload: function() {
      var model = this.get('model');
      model.reload();
    },

    trigger: function() {
      this.set('numberValue', 1);
      var model = this.get('model');
      model.save();
    }
  }
});
