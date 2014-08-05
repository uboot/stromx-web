import stromx.runtime

class View(object):
    def __init__(self, stream):
        self.__stream = stream
        self.name = ''
        self.observers = []
        
    def deserialize(self, data):
        pass
    
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
        self.color = stromx.runtime.Color(0, 0, 0)
        self.zvalue = 0
        self.active = True
        self.__stream = stream
        self.__op = op
    
    def serialize(self):
        colorStr = '#{0:02x}{1:02x}{2:02x}'.format(self.color.r(),
                                                   self.color.g(),
                                                   self.color.b())
        data = {
           'Observer': {
                'color': colorStr,
                'op': self.__opId,
                'zvalue': self.zvalue,
                'active': self.active
           }
        }
        
        return data
        
    @property
    def __opId(self):
        for index, op in enumerate(self.__stream.operators()):
            if op == self.__op:
                return index
            
        return -1
        
class ParameterObserver(Observer):
    def __init__(self, stream, op, index):
        super(ParameterObserver, self).__init__(stream, op)
        self.__op = op
        self.__index = index
    
    def serialize(self):
        parentData = super(ParameterObserver, self).serialize()
        data = {
            'param': self.__index
        }
        data.update(parentData['Observer'])
        
        return {
           'ParameterObserver': data
        }
        
class ConnectorObserver(Observer):
    def __init__(self, stream, op, connectorType, index):
        super(ConnectorObserver, self).__init__(stream, op)
        self.__connectorType = connectorType
        self.__index = index
    
    def serialize(self):
        parentData = super(ConnectorObserver, self).serialize()
        data = {
            'type': int(self.__connectorType),
            'connector': self.__index}
        data.update(parentData['Observer'])
        
        return {
           'ConnectorObserver': data
        }
    