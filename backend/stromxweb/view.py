import stromx.runtime

import conversion

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
        observer = ConnectorObserver(self.__stream, self, op, connectorType,
                                     index)
        return self.__addObserver(observer)
        
    def addParameterObserver(self, op, index):
        observer = ParameterObserver(self.__stream, self, op, index)
        return self.__addObserver(observer)
    
    def removeObserver(self, observer):
        self.__observers.remove(observer)
        self.__updateZValues()
        
    def deserialize(self, data):
        properties = data['View']
        self.name = properties['name']
        for data in properties['observers']:
            for key in data:
                if key == 'ParameterObserver':
                    observer = ParameterObserver(self.__stream, self)
                elif key == 'ConnectorObserver':
                    observer = ConnectorObserver(self.__stream, self)
                else:
                    assert(False)
                    
                observer.deserialize(data[key])
                self.__observers.append(observer)
        self.__updateZValues()
        
    def serialize(self):
        observers = [observer.serialize() for observer in self.observers]
        data = {
            'View': {
                'name': self.name,
                'observers': observers
            }
        }
        
        return data
        
    def setObserverZvalue(self, observer, value):
        if value < 0:
            value = 0
        
        if value >= len(self.__observers):
            value = len(self.__observers) - 1
            
        conflicting = [o for o in self.__observers 
                       if o != observer and o.zvalue == value]
        
        for o in conflicting:
            o.updateZvalue(observer.zvalue)
    
        observer.updateZvalue(value)
    
    def __addObserver(self, observer):
        observer.updateZvalue(len(self.__observers))
        self.__observers.append(observer)
        self.__updateZValues()
        return observer
    
    def __updateZValues(self):
        self.__observers.sort(key = lambda o: o.zvalue, reverse = True)
        for i, observer in enumerate(reversed(self.__observers)):
            observer.updateZvalue(i)
            
class Observer(object):
    def __init__(self, stream, op, parent):
        self.__zvalue = 0
        self.active = True
        self.__visualization = ''
        self.__properties = dict()
        self.__stream = stream
        self.__op = op
        self.__parent = parent
        
    @property
    def op(self):
        return self.__op
        
    @property
    def properties(self):
        return self.__properties
        
    @properties.setter
    def properties(self, value):
        self.__properties = value
        
    @property
    def visualization(self):
        if self.__visualization == '':
            visualizations = self.__getVisualizationData()
            self.__visualization = visualizations[0]
        return self.__visualization
    
    @visualization.setter
    def visualization(self, value):
        self.__visualization = value
        
    @property
    def visualizations(self):
        return self.__getVisualizationData()
        
    @property
    def zvalue(self):
        return self.__zvalue
        
    @zvalue.setter
    def zvalue(self, value):
        if self.__zvalue == value:
            return;
        
        self.__parent.setObserverZvalue(self, value)
            
    def updateZvalue(self, value):
        self.__zvalue = value
        
    def __getVisualizationData(self):
        description = self.getDescription()
        dataVariant = description.variant()
        visualizationVariant = description.visualization()
        return conversion.stromxVariantsToVisualization(dataVariant,
                                                        visualizationVariant)
    
    def serialize(self):
        data = {
           'Observer': {
                'properties': self.__serializeProperties(),
                'op': self.__opId,
                'zvalue': self.__zvalue,
                'active': self.active,
                'visualization': self.visualization
            }
        }
        
        return data
            
    def deserialize(self, values):
        self.__zvalue = values['zvalue']
        self.active = values['active']
        self.__visualization = values['visualization']
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
    def __init__(self, stream, parent, op = None, index = None):
        super(ParameterObserver, self).__init__(stream, op, parent)
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
    
    
    def getDescription(self):
        return self.op.info().parameter(self.__index)
        
class ConnectorObserver(Observer):
    def __init__(self, stream, parent, op = None, connectorType = None,
                 index = None):
        super(ConnectorObserver, self).__init__(stream, op, parent)
        self.__connectorType = connectorType
        self.__index = index
        self.__value = ConnectorValue(self)
    
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
        self.__value = ConnectorValue(self)
    
    def getDescription(self):
        if self.__connectorType == stromx.runtime.Connector.Type.INPUT:
            return self.op.info().input(self.__index)
        elif self.__connectorType == stromx.runtime.Connector.Type.OUTPUT:
            return self.op.info().output(self.__index)
        else:
            assert(False)

class ObserverCallback(stromx.runtime.ConnectorObserver):
    connectorValue = None
    
    def observe(self, connector, oldData, newData, thread):
        self.connectorValue.observe(connector, oldData, newData)
        
class ConnectorValue(object):
    def __init__(self, connectorObserver):
        self.__connectorObserver = connectorObserver
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
        self.__connectorObserver.op.addObserver(self.__callback)
        
    def deactivate(self):
        self.__connectorObserver.op.removeObserver(self.__callback)
      
    def observe(self, connector, oldData, newData):
        connectorIndex = self.__connectorObserver.connectorIndex
        connectorType = self.__connectorObserver.connectorType
        if (connector.id() != connectorIndex or 
            connector.type() != connectorType):
            return
        
        data = None
        if connector.type() == stromx.runtime.Connector.OUTPUT:
            data = oldData
        elif connector.type() == stromx.runtime.Connector.INPUT:
            data = newData
        else:
            assert(False)
            
        if data.empty():
            return
            
        if self.__handler:
            self.__handler(data, self.__connectorObserver.visualization, 
                           self.__connectorObserver.properties)
        
    