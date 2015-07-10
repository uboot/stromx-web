import Ember from "ember";

export default Ember.Component.extend({
  isEditing: false,
  tagName: 'td',

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

  editValue: Ember.computed('model.value', 'model.variant', {
    get: function() {
      switch (this.get('model.variant.ident')) {
        case 'float':
          return this.get('model.value').toPrecision(3);
        case 'int':
        case 'string':
        case 'enum':
          return this.get('model.value');
        default:
          return '';
      }
    },
    set: function(key, value) {
      var v = null;
      switch (this.get('model.variant.ident')) {
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
        case 'enum':
          v = parseInt(value);
          break;
        default:
      }

      this.set('model.value', v);
      return v;
    }
  }),

  displayValue: Ember.computed('model.value', 'model.variant', 'isEditing', {
    set: function(key, newValue) {
      return newValue;
    },
    get: function() {
      if (! this.get('current')) {
        return '';
      }

      if (this.get('isEditing')) {
        return '';
      }

      var value = this.get('model.value');
      switch (this.get('model.variant.ident')) {
        case 'float':
          return value.toPrecision(3);
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
    }
  }),

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

  save: function() {
    var model = this.get('model');
    model.save().catch(function() {
      model.rollbackAttributes();
    });
  },

  actions: {
    editValue: function() {
      this.set('isEditing', true);
    },
    saveChanges: function() {
      this.set('isEditing', false);
      this.save();
    },
    discardChanges: function() {
      this.set('isEditing', false);
      this.get('model').rollbackAttributes();
    },
    reload: function() {
      this.get('model').reload();
    },
    setTrue: function() {
      this.set('isEditing', false);
      this.set('model.value', true);
      this.save();
    },
    setFalse: function() {
      this.set('isEditing', false);
      this.set('model.value', false);
      this.save();
    },
    trigger: function() {
      this.set('isEditing', false);
      this.set('model.value', 1);
      this.save();
    }
  }
});
