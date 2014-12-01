import stromx.runtime

class View(object):
    def __init__(self, stream):
        self.__stream = stream
        self.name = ''
        self.__observers = []
        
    @property
    def observers(self):
        return self.__observers
    
    @property
    def stream(self):
        return self.__stream
        
    def addConnectorObserver(self, op, connectorType, index):
        observer = ConnectorObserver(self.__stream, op, connectorType, index)
        self.__observers.append(observer)
        return observer
        
    def addParameterObserver(self, op, index):
        observer = ParameterObserver(self.__stream, op, index)
        self.__observers.append(observer)
        return observer
    
    def removeObserver(self, observer):
        self.__observers.remove(observer)
        
    def deserialize(self, data):
        properties = data['View']
        self.name = properties['name']
        for data in properties['observers']:
            for key in data:
                if key == 'ParameterObserver':
                    observer = ParameterObserver(self.__stream)
                elif key == 'ConnectorObserver':
                    observer = ConnectorObserver(self.__stream)
                else:
                    assert(False)
                    
                observer.deserialize(data[key])
                self.__observers.append(observer)
    
    def serialize(self):
        observers = [observer.serialize() for observer in self.observers]
        data = {
            'View': {
                'name': self.name,
                'observers': observers
            }
        }
        return data
    
class Observer(object):
    def __init__(self, stream, op):
        self.zvalue = 0
        self.active = True
        self.visualization = 'default'
        self.__properties = dict()
        self.__stream = stream
        self.__op = op
        
    @property
    def op(self):
        return self.__op
        
    @property
    def properties(self):
        return self.__properties
        
    @properties.setter
    def properties(self, value):
        self.__properties = value
    
    def serialize(self):
        data = {
           'Observer': {
                'properties': self.__serializeProperties(),
                'op': self.__opId,
                'zvalue': self.zvalue,
                'active': self.active,
                'visualization': self.visualization
            }
        }
        
        return data
            
    def deserialize(self, values):
        self.zvalue = values['zvalue']
        self.active = values['active']
        self.visualization = values['visualization']
        self.__op = self.__stream.operators()[values['op']]   

        self.__deserializeProperties(values['properties'])
    
    def __serializeProperties(self):
      properties = dict()
      
      for key in self.__properties:
          value = self.__properties[key]
          properties[key] = value
      
      return properties
        
    def __deserializeProperties(self, properties):
      for key in properties:
          value = properties[key]
          self.__properties[key] = value
        
    @property
    def __opId(self):
        for index, op in enumerate(self.__stream.operators()):
            if op == self.__op:
                return index
            
        return -1
        
class ParameterObserver(Observer):
    def __init__(self, stream, op = None, index = None):
        super(ParameterObserver, self).__init__(stream, op)
        self.__index = index
    
    @property
    def parameterIndex(self):
        return self.__index
    
    def serialize(self):
        parentData = super(ParameterObserver, self).serialize()
        data = {
            'parameter': self.__index
        }
        data.update(parentData['Observer'])
        
        return {
           'ParameterObserver': data
        }
        
    def deserialize(self, properties):
        super(ParameterObserver, self).deserialize(properties)
        self.__index = properties['parameter']      
        
class ConnectorObserver(Observer):
    def __init__(self, stream, op = None, connectorType = None, index = None):
        super(ConnectorObserver, self).__init__(stream, op)
        self.__connectorType = connectorType
        self.__index = index
        self.__value = ConnectorValue(self.op, self.__connectorType,
                                      self.__index)
    
    @property
    def connectorIndex(self):
        return self.__index
    
    @property
    def connectorType(self):
        return self.__connectorType
    
    @property
    def connectorValue(self):
        return self.__value
    
    def serialize(self):
        parentData = super(ConnectorObserver, self).serialize()
        data = {
            'type': int(self.__connectorType),
            'connector': self.__index}
        data.update(parentData['Observer'])
        
        return {
           'ConnectorObserver': data
        }
        
    def deserialize(self, properties):
        super(ConnectorObserver, self).deserialize(properties)
        self.__index = properties['connector']
        self.__connectorType = properties['type']
        self.__value = ConnectorValue(self.op, self.__connectorType,
                                      self.__index)

class ObserverCallback(stromx.runtime.ConnectorObserver):
    connectorValue = None
    
    def observe(self, connector, data, thread):
        if not data.empty():
            self.connectorValue.observe(connector, data)
        
class ConnectorValue(object):
    def __init__(self, op, connectorType, connectorIndex):
        self.__op = op
        self.__connectorType = connectorType
        self.__connectorIndex = connectorIndex
        self.__callback = ObserverCallback()
        self.__callback.connectorValue = self
        self.__handler = None
    
    @property
    def handler(self):
        return self.__handler
    
    @handler.setter
    def handler(self, value):
        self.__handler = value
        
    def activate(self):
        self.__op.addObserver(self.__callback)
        
    def deactivate(self):
        self.__op.removeObserver(self.__callback)
      
    def observe(self, connector, data):
        if (connector.id() != self.__connectorIndex or 
            connector.type() != self.__connectorType):
            return
        if self.__handler:
            self.__handler(data)
        
    