/* exported waitForModal */

import Ember from 'ember';
import Application from '../../app';
import config from '../../config/environment';
import waitForModal from './wait-for-modal';

export default function startApp(attrs) {
  let application;

  // use defaults, but you can override
  let attributes = Ember.assign({}, config.APP, attrs);

  Ember.run(() => {
    application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
  });

  return application;
}
