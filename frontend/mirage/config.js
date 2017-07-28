export default function() {
  // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing
  this.namespace = 'api';    // make this `/api`, for example, if your API is namespaced

  this.del('/connections/:id');
  this.del('/files/:id');
  this.del('/operators/:id');
  this.del('/views/:id');
  
  this.get('/connectorValues/:id');
  this.get('/connections/:id');
  this.get('/enumDescriptions/:id');
  this.get('/files');
  this.get('/files/:id');
  this.get('/inputObservers/:id');
  this.get('/inputs/:id');
  this.get('/operators/:id');
  this.get('/operatorTemplates')
  this.get('/outputObservers/:id');
  this.get('/outputs/:id');
  this.get('/parameterObservers/:id')
  this.get('/parameters/:id')
  this.get('/streams/:id');
  this.get('/views/:id');
  
  this.post('/connections');
  this.post('/files');
  this.post('/inputObservers');
  this.post('/operators');
  this.post('/outputObservers');
  this.post('/views');
  
  this.put('/files/:id');
  this.put('/inputObservers/:id');
  this.put('/outputObservers/:id');
  this.put('/operators/:id');
  this.put('/parameterObservers/:id');
  this.put('/parameters/:id');
  this.put('/streams/:id');
  this.put('/views/:id');
}
