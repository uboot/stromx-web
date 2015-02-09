import Ember from "ember";

export default Ember.ObjectController.extend({
  isEditing: false,

  isEnum: function() {
    return this.get('variant.ident') === 'enum';
  }.property('variant'),

  isBool: function() {
    return this.get('variant.ident') === 'bool';
  }.property('variant'),

  isTrigger: function() {
    return this.get('variant.ident') === 'trigger';
  }.property('variant'),

  isFile: function() {
    return this.get('variant.ident') === 'image';
  }.property('variant'),

  timedOut: function() {
    return this.get('state') === 'timedOut';
  }.property('state'),

  current: function() {
    return this.get('state') === 'current';
  }.property('state'),

  writable: function() {
    var variant = this.get('variant.ident');
    var knownTypes = ['string', 'enum', 'int', 'float', 'bool', 'trigger', 'image'];
    var currentAndKnown = this.get('current') && knownTypes.contains(variant);
    if (! currentAndKnown) {
      return false;
    }

    switch(this.get('access')) {
    case 'full':
      return true;
    case 'inactive':
      return ! this.get('operator.stream.active');
    default:
      return false;
    }
  }.property('access', 'current', 'variant', 'operator.stream.active'),

  accessFailed: function() {
    return this.get('state') === 'accessFailed';
  }.property('state'),

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
  }.property('value', 'variant'),

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

    switch (this.get('variant.ident')) {
      case 'int':
      case 'float':
        return this.get('value');
      case 'enum':
        return this.updateEnumTitle(this.get('value'));
      case 'bool':
        return this.get('value') ? 'Active' : 'Inactive';
      case 'matrix':
        return this.get('value.rows') + ' x ' + this.get('value.rows') + ' matrix';
      case 'image':
        return this.get('value.width') + ' x ' + this.get('value.height') + ' image';
      case 'trigger':
        return 'Trigger';
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
      this.set('value', true);
      this.get('model').save();
    },
    setFalse: function() {
      this.set('isEditing', false);
      this.set('value', false);
      this.get('model').save();
    },
    trigger: function() {
      this.set('isEditing', false);
      this.set('value', 1);
      this.get('model').save();
    }
  }
});
