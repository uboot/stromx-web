import Ember from "ember";

export default Ember.Controller.extend({
  isEditing: false,

  isEnum: function() {
    return this.get('model.variant.ident') === 'enum';
  }.property('model.variant'),

  isBool: function() {
    return this.get('model.variant.ident') === 'bool';
  }.property('model.variant'),

  isTrigger: function() {
    return this.get('model.variant.ident') === 'trigger';
  }.property('model.variant'),

  isMatrix: function() {
    return this.get('model.variant.ident') === 'matrix';
  }.property('model.variant'),

  isFile: function() {
    return this.get('model.variant.ident') === 'image';
  }.property('model.variant'),

  timedOut: function() {
    return this.get('model.state') === 'timedOut';
  }.property('model.state'),

  current: function() {
    return this.get('model.state') === 'current';
  }.property('model.state'),

  writable: function() {
    var variant = this.get('model.variant.ident');
    var knownTypes = ['string', 'enum', 'int', 'float', 'bool', 'trigger',
                      'matrix', 'image'];
    var currentAndKnown = this.get('current') && knownTypes.contains(variant);
    if (! currentAndKnown) {
      return false;
    }

    switch(this.get('model.access')) {
    case 'full':
      return true;
    case 'inactive':
      return ! this.get('model.operator.stream.active');
    default:
      return false;
    }
  }.property('model.access', 'model.current', 'model.variant', 'model.operator.stream.active'),

  accessFailed: function() {
    return this.get('model.state') === 'accessFailed';
  }.property('model.state'),

  editValue:  function(key, value) {
    if (value === undefined) {
      switch (this.get('variant.ident')) {
        case 'int':
        case 'float':
        case 'string':
          return this.get('value');
        default:
          return '';
      }
    } else {
      var v = '';
      switch (this.get('variant.ident')) {
        case 'int':
          v = parseInt(value, 10);
          if (isNaN(v)) {
            return value;
          }
          break;
        case 'float':
          v = parseFloat(value);
          if (isNaN(v)) {
            return value;
          }
          break;
        case 'string':
          v = value;
          break;
        case 'image':
          v = {
            values: value
          };
          break;
        default:
      }

      this.set('value', v);
      return v;
    }
  }.property('model.value', 'model.variant'),

  displayValue: function(key, newValue) {
    if (newValue !== undefined) {
      return value;
    }

    if (! this.get('current')) {
      return '';
    }

    if (this.get('isEditing')) {
      return '';
    }

    var value = this.get('model.value');
    switch (this.get('model.variant.ident')) {
      case 'int':
      case 'float':
        return value;
      case 'enum':
        return this.updateEnumTitle(value);
      case 'bool':
        return value ? 'Active' : 'Inactive';
      case 'matrix':
        return value.rows + ' x ' + value.cols + ' matrix';
      case 'image':
        return value.width + ' x ' + value.height + ' image';
      case 'trigger':
        return 'Trigger';
      default:
        return value;
    }
  }.property('model.value', 'model.variant', 'isEditing'),

  // cf. http://stackoverflow.com/q/20623027
  updateEnumTitle: function(enumValue) {
    var value = enumValue;
    var title = this.get('model.descriptions').then( function(value){
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
    saveChanges: function() {
      this.set('isEditing', false);
      this.get('model').save();
    },
    discardChanges: function() {
      this.set('isEditing', false);
      this.get('model').rollback();
    },
    reload: function() {
      this.get('model').reload();
    },
    setTrue: function() {
      this.set('isEditing', false);
      this.set('model.value', true);
      this.get('model').save();
    },
    setFalse: function() {
      this.set('isEditing', false);
      this.set('model.value', false);
      this.get('model').save();
    },
    trigger: function() {
      this.set('isEditing', false);
      this.set('model.value', 1);
      this.get('model').save();
    }
  }
});
