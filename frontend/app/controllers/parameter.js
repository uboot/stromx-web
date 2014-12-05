import Ember from "ember";

export default Ember.ObjectController.extend({
  isEditing: false,

  isEnum: function() {
    return this.get('variant') === 'enum';
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
    var variant = this.get('variant');
    var knownTypes = ['string', 'enum', 'int', 'float'];
    return this.get('writable') && this.get('current') &&
      knownTypes.contains(variant);
  }.property('writable', 'current', 'variant'),

  readOnly: Ember.computed.not('writable'),

  accessFailed: function() {
    return this.get('state') === 'accessFailed';
  }.property('state'),

  editValue:  function(key, value) {
    if (value === undefined) {
      switch (this.get('variant')) {
        case 'int':
        case 'float':
        case 'string':
          return this.get('value');
        default:
          return '';
      }
    } else {
      var v = '';
      switch (this.get('variant')) {
        case 'int':
          v = parseInt(value, 10);
          break;
        case 'float':
          v = parseFloat(value);
          break;
        case 'string':
          v = value;
          break;
        default:
      }
      
      if (isNaN(v)) {
        return value;
      }
        
      this.set('value', v);
      return v;
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
    if (value !== undefined) {
      return value;
    }

    if (! this.get('current')) {
      return '';
    }

    if (this.get('isEditing')) {
      return '';
    }

    switch (this.get('variant')) {
      case 'int':
      case 'float':
        return this.get('value');
      case 'enum':
        return this.updateEnumTitle(this.get('value'));
      case 'bool':
        return '';
      default:
        return this.get('value');
    }
  }.property('value', 'variant', 'isEditing'),

  // cf. http://stackoverflow.com/q/20623027
  updateEnumTitle: function(enumValue) {
    var value = enumValue;
    var title = this.get('descriptions').then( function(value){
      return value.find( function(item) {
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
