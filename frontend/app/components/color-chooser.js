import Ember from "ember";

import { colors } from 'stromx-web/colors';

export default Ember.Component.extend({
  colors: colors,
  actions: {
    choose: function(color) {
      this.sendAction("choose", color);
    }
  }
});
