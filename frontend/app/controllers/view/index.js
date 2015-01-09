import Ember from "ember";

import ViewController from 'stromx-web/controllers/view';

export default ViewController.extend({
  sorting: ['zvalue:desc'],
  sortedObservers: Ember.computed.sort('observers', 'sorting')
});
