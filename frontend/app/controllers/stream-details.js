import Stream from 'stromx-web/controllers/stream';

export default Stream.extend({
  patternUri: function() {
    return 'url(' + this.get('parentController.target.url') + '#grid)';
  }.property('parentController.target.url'),
});
