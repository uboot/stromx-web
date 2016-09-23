import Ember from "ember";
import ENV from '../config/environment';

export default Ember.Component.extend({
  isEditing: false,
  isEditingParameter: false,
  tagName: 'td',
  isParameter: Ember.computed.equal('model.currentType', 'parameter'),

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
    return this.get('model.variant.ident') === 'image' ||
      this.get('model.variant.ident') === 'file';
  }.property('model.variant'),

  timedOut: function() {
    return this.get('model.state') === 'timedOut';
  }.property('model.state'),

  current: function() {
    return this.get('model.state') === 'current';
  }.property('model.state'),

  offerReload: function() {
    if (this.get('model.behavior') === 'push') {
      return false;
    }
    if (this.get('model.behavior') === 'pull') {
      return true;
    }
    if (this.get('model.originalType') === 'output') {
      return true;
    }

    return this.get('timedOut') || this.get('accessFailed');
  }.property('timedOut', 'accessFailed', 'model.behavior'),

  offerDownload: Ember.computed.equal('model.variant.ident', 'file'),

  url: function() {
    if (this.get('model.variant.ident') !== 'file')
    {
      return '';
    }

    if (ENV.APP.API_HOST) {
      return ENV.APP.API_HOST + '/temp/' + this.get('model.value.name');
    } else {
      var location =  window.location.protocol + '//' + window.location.host;
      return location + '/temp/' + this.get('model.value.name');
    }
  }.property('model.value'),

  writable: function() {
    var variant = this.get('model.variant.ident');
    var knownTypes = ['string', 'enum', 'int', 'float', 'bool', 'trigger',
                      'matrix', 'image', 'file'];
    if (! knownTypes.includes(variant)) {
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

  fileName: Ember.computed('model.value', {
    get: function() {
      return '';
    },
    set: function(key, value) {
      var strippedName = value.replace(/^.*[\\\/]/, '');
      var v = this.get('model.value');
      v.name = strippedName;
      this.set('model.value', v);
    }
  }),

  isConnector: function() {
    return this.get('model.originalType') !== 'parameter';
  }.property('model.originalType'),

  originalType: function() {
    switch (this.get('model.originalType'))
    {
      case 'input':
        return 'Input';
      case 'output':
        return 'Output';
      default:
        return '';
    }
  }.property('model.originalType'),

  editValue: Ember.computed('model.value', 'model.variant', {
    get: function() {
      var value = this.get('model.value');
      switch (this.get('model.variant.ident')) {
        case 'float':
          return value ? this.get('model.value').toPrecision(3) : 0.0;
        case 'int':
        case 'string':
        case 'enum':
          return value ? this.get('model.value') : '';
        default:
          return '';
      }
    },
    set: function(key, value) {
      var v = this.get('model.value');
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
        case 'file':
          v.content = value;
          break;
        case 'enum':
          v = parseInt(value);
          break;
        case 'bool':
          v = value === 'true';
          break;
        default:
      }

      this.set('model.value', v);
      return v;
    }
  }),

  isTrue: Ember.computed.alias('model.value'),
  isFalse: Ember.computed.not('model.value'),
  isInput: Ember.computed.equal('model.originalType', 'input'),
  isPushParameter: Ember.computed('model.behavior', {
    get: function() {
      return this.get('model.behavior') === 'push';
    },
    set: function(key, value) {
      this.set('model.behavior', value ? 'push' : 'persistent');
      return value;
    }
  }),

  isPullParameter: Ember.computed('model.behavior', {
    get: function() {
      return this.get('model.behavior') === 'pull';
    },
    set: function(key, value) {
      this.set('model.behavior', value ? 'pull' : 'persistent');
      return value;
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

      var value = this.get('model.value');
      switch (this.get('model.variant.ident')) {
        case 'float':
          return value.toPrecision(3);
        case 'enum':
          return this.updateEnumTitle(value);
        case 'bool':
          return value ? 'True' : 'False';
        case 'matrix':
          return value ? value.rows + ' x ' + value.cols + ' matrix' : '';
        case 'image':
          return value ? value.width + ' x ' + value.height + ' image' : '';
        case 'trigger':
          return 'Trigger';
        case 'file':
          return value['name'];
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
    return model.save().catch(function() {
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
      this.set('isEditingParameter', false);
      this.get('model').rollbackAttributes();
    },
    reload: function() {
      this.get('model').reload();
    },
    trigger: function() {
      this.set('isEditing', false);
      this.set('model.value', 1);
      this.save();
    },
    editParameter: function() {
      this.set('isEditingParameter', true);
    },
    saveParameterChanges: function() {
      this.set('isEditingParameter', false);
      var op = this.get('model.operator');
      this.save().then(function() {
        op.then(function(op) {
          op.reload();
        });
      });
    },
    setBehavior: function() {
      this.set('isEditingParameter', false);
      this.save();
    }
  }
});
