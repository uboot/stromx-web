import Ember from "ember";

import { COLORS } from 'stromx-web/colors';

export default Ember.Component.extend({
  colors: COLORS,
  actions: {
    choose: function(color) {
      this.sendAction("choose", color);
    }
  }
});
