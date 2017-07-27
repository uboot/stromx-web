export default function() {
  // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing
  this.namespace = 'api';    // make this `/api`, for example, if your API is namespaced

  this.post('/files');
  this.del('/files/:id');
  this.get('/files');
  this.put('/files/:id');
  this.get('/inputs/:id');
  this.get('/operators/:id');
  this.get('/outputs/:id');
  this.get('/streams/:id');
  this.post('/views');
}
