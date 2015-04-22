# -*- coding: utf-8 -*-

import base64
import datetime
import json
import os
import pkgutil
import re
import threading

import stromx.runtime
 
import conversion
import view

_EXECUTION_DELAY = 1000 # ms

def _str(value):
    return str(value.encode('utf-8'))

from error import Failed

class Model(object):
    def __init__(self, directory = ""):
        self.__files = Files(directory, self)
        self.__streams = Streams(self)
        self.__errors = Errors()
        self.__operators = Operators(self)
        self.__parameters = Parameters(self)
        self.__enumDescriptions = EnumDescriptions(self)
        self.__inputs = Inputs(self)
        self.__outputs = Outputs(self)
        self.__connections = Connections(self)
        self.__views = Views(self)
        self.__parameterObservers = ParameterObservers(self)
        self.__inputObservers = InputObservers(self)
        self.__outputObservers = OutputObservers(self)
        self.__connectorValues = ConnectorValues(self)
        self.__operatorTemplates = OperatorTemplates(self)
    
    @property
    def files(self):
        return self.__files
    
    @property
    def streams(self):
        return self.__streams
    
    @property
    def errors(self):
        return self.__errors
    
    @property
    def operators(self):
        return self.__operators
    
    @property
    def parameters(self):
        return self.__parameters
    
    @property
    def enumDescriptions(self):
        return self.__enumDescriptions
    
    @property
    def connections(self):
        return self.__connections
    
    @property
    def connectors(self):
        return self.__connectors
    
    @property
    def inputs(self):
        return self.__inputs
    
    @property
    def outputs(self):
        return self.__outputs
    
    @property
    def views(self):
        return self.__views
    
    @property
    def parameterObservers(self):
        return self.__parameterObservers
    
    @property
    def inputObservers(self):
        return self.__inputObservers
    
    @property
    def outputObservers(self):
        return self.__outputObservers
    
    @property
    def connectorValues(self):
        return self.__connectorValues
    
    @property
    def operatorTemplates(self):
        return self.__operatorTemplates
    
class Items(dict):
    def __init__(self, model = None):
        self.__index = 0
        self.__model = model
        
    @property
    def data(self):
        name = _resourceName(self.__class__.__name__)
        itemList = [item.data.values()[0] for item in self.values()]
        return {name: itemList}
        
    @property
    def model(self):
        return self.__model
    
    def set(self, index, data):
        obj = self[index]
        obj.set(data)
        return obj.data
    
    def addItem(self, item):
        item.index = self.__index
        self[str(self.__index)] =  item
        self.__index += 1
    
    def addItems(self, items):
        for item in items:
            self.addItem(item)
        
    def delete(self, index):
        item = self.pop(index)
        item.delete()
        
    def addData(self, data):
        raise NotImplementedError()
            
class Item(object):
    _properties = []
    
    def __init__(self, model = None):
        self.__index = ""
        self.__model = model
        
    @property
    def data(self):
        props = {prop: self.__getattribute__(prop) for prop in self._properties}
        props['id'] = self.index
        name = self.modelName
        return {name: props}
           
    @property
    def model(self):
        return self.__model
        
    @property
    def index(self):
        return self.__index
    
    @index.setter
    def index(self, value):
        self.__index = str(value)
        
    @property
    def modelName(self):
        return _resourceName(self.__class__.__name__)
        
    def set(self, data):
        name = _resourceName(self.__class__.__name__)
        _properties = data[name]
        
        for key in _properties:
            try:
                self.__setattr__(key, _properties[key])
            except AttributeError:
                pass
            
        return self.data
        
    def delete(self):
        pass
        
class Files(Items):
    @property
    def directory(self):
        return self.__directory
    
    def __init__(self, directory, model):
        super(Files, self).__init__(model)
        self.__directory = directory
        files = []
        if directory != "":
            files = [File(name, self.model) for name
                     in sorted(os.listdir(directory))]
        self.addItems(files)
        
    def addData(self, data):
        filename = File.secureName(data["file"]["name"])
        duplicates = [f for f in self.values() if f.name == filename]
        assert(len(duplicates) <= 1)
        
        if len(duplicates):
            f = duplicates[0]
        else:         
            f = File(_str(data["file"]["name"]), self.model)
            self.addItem(f)
        
        content = data["file"].get("content", "")
        if content != "" and  content != None:
            content = re.sub("data:.*;base64,", "", content, re.MULTILINE)
            with file(f.path, 'w') as streamFile:
                streamFile.write(base64.decodestring(content))
        else:
            if os.path.exists(f.path):
                os.remove(f.path)
               
        f.set(data) 
        return f.data
        
class File(Item):
    _properties = ["content", "saved", "opened", "stream", "name"]
    
    def __init__(self, name, model):
        super(File, self).__init__(model)
        self.__name = name
        self.__opened = False
        self.__stream = None
        
    @property
    def saved(self):
        return False
    
    @saved.setter
    def saved(self, value):
        if not value:
            return
        
        if not self.__stream:
            return
            
        self.__stream.save()
    
    @property
    def opened(self):
        return self.__opened
    
    @opened.setter
    def opened(self, value):
        if self.__opened == value:
            return
        
        if value:
            try:
                self.__stream = self.model.streams.addFile(self)
                self.__opened = True
            except stromx.runtime.Exception as e:
                self.model.errors.addError(e)
                raise Failed()
        else:
            self.model.streams.delete(self.__stream.index)
            self.__stream = None
            self.__opened = False
    
    @property
    def stream(self):
        return self.__stream.index if self.__stream else None
    
    @property
    def content(self):
        return ""
    
    @property
    def path(self):
        return os.path.join(self.model.files.directory, self.__name)
    
    @property
    def name(self):
        return self.__name
    
    @name.setter
    def name(self, name):
        basename = File.secureName(name)
        
        if not basename:
            return
            
        if self.__name != basename:
            newPath = os.path.join(self.model.files.directory, basename)
            if os.path.exists(self.path):
                os.rename(self.path, newPath)
            self.__name = basename
        
    def delete(self):
        self.opened = False
        if os.path.exists(self.path):
            os.remove(self.path)
    
    @staticmethod
    def secureName(name):
        secureName = _str(name)
        secureName = os.path.basename(secureName)
        secureName = secureName.lstrip('.')
        secureName = secureName.lstrip('.')
        secureName = secureName.translate(None, '\\')
        
        if not secureName:
            return ''
            
        if os.path.splitext(secureName)[1] != '.stromx':
            secureName += '.stromx'
            
        return secureName
        
class Streams(Items):        
    def addFile(self, streamFile):
        stream = Stream(streamFile, self.model)
        self.addItem(stream)
        return stream
    
    def findStreamModel(self, stromxStream):
        streamModels = filter(
            lambda stream: stream.stromxStream == stromxStream, self.values())
        assert(len(streamModels) <= 1)
        return streamModels[0] if len(streamModels) else None
    
class ExceptionObserver(stromx.runtime.ExceptionObserver):
    stream = None
    
    def observe(self, phase, info, thread):
        message = '{0} ({1}::{2}) during {4}: {3}'.format(
          info.name(), info.package(), info.type(), info.message(), phase
        )
        
        self.stream.observeException(message)
        
class Stream(Item):
    _properties = ["name", "active", "paused", "file", "operators",
                  "connections", "views"]
    
    def __init__(self, streamFile, model):
        super(Stream, self).__init__(model)
        self.__file = streamFile
        self.__operators = []
        self.__connections = []
        self.__views = []
        self.__exceptionObserver = ExceptionObserver()
        self.__exceptionObserver.stream = self
        
        factory = self.model.operatorTemplates.factory
        if os.path.exists(streamFile.path):
            zipInput = stromx.runtime.ZipFileInput(streamFile.path)
            reader = stromx.runtime.XmlReader()
            self.__stream = reader.readStream(zipInput, "stream.xml", factory)
        else:
            self.__stream = stromx.runtime.Stream()
            
        # set execution delay to a sane value to avoid CPU overload
        self.__stream.setDelay(_EXECUTION_DELAY)
            
        # install the exception observer
        self.__stream.addObserver(self.__exceptionObserver)
            
        for stromxOp in self.__stream.operators():
            op = self.model.operators.addStromxOp(stromxOp, self)
            self.__operators.append(op)
            
        inputs = self.model.inputs
        outputs = self.model.outputs
        for op in self.__operators:
            # no need to investigate connections of non-initialized operators
            if op.status == 'none':
                continue
            
            for stromxInput in op.stromxOp.info().inputs():
                source = self.__stream.connectionSource(op.stromxOp,
                                                        stromxInput.id())
                if source.op() == None:
                    continue
                
                outputConnector = outputs.findOutputModel(source.op(),
                                                          source.id())
                assert(outputConnector)
                
                inputConnector = inputs.findInputModel(op.stromxOp,
                                                       stromxInput.id())
                assert(inputConnector)
                
                # the connection added below assigns itself to the stream, so 
                # there is no need to store it in self.__connections
                self.model.connections.addConnection(self, outputConnector, 
                                                     inputConnector)
        
        if os.path.exists(streamFile.path):
            zipInput.initialize("", "views.json")
            try:
                zipInput.openFile(stromx.runtime.InputProvider.OpenMode.TEXT)
                viewData = json.load(zipInput.file())
                for data in viewData:
                    stromxView = view.View(self.stromxStream)
                    stromxView.deserialize(data)
                    viewModel = self.model.views.addStromxView(stromxView)
                    self.__views.append(viewModel)
            except stromx.runtime.FileAccessFailed:
                pass
        
    @property
    def file(self):
        return self.__file.index
    
    @property
    def active(self):
        status = self.__stream.status()
        return (status == stromx.runtime.Stream.Status.ACTIVE or
                status == stromx.runtime.Stream.Status.DEACTIVATING or
                status == stromx.runtime.Stream.Status.PAUSED)
        
    @active.setter
    def active(self, value):
        status = self.__stream.status()
        if value and status == stromx.runtime.Stream.Status.INACTIVE:
            try:
                self.__prepareStream()
                self.__stream.start()
            except stromx.runtime.Exception as e:
                self.model.errors.addError(e)
                raise Failed()
        
        if not value:
            self.__stream.stop()
            self.__stream.join()
        
    @property
    def paused(self):
        status = self.__stream.status()
        return status == stromx.runtime.Stream.Status.PAUSED
    
    @paused.setter
    def paused(self, value):
        if value and self.active:
            self.__stream.pause()
        
        status = self.__stream.status()
        if not value and status == stromx.runtime.Stream.Status.PAUSED:
            self.__stream.resume()
            
    @property
    def name(self):
        return self.__stream.name()
    
    @name.setter
    def name(self, value):
        if self.name != _str(value):
            self.__stream.setName(_str(value))
    
    @property
    def operators(self):
        return [op.index for op in self.__operators]
    
    @property
    def connections(self):
        return [connection.index for connection in self.__connections]
    
    @property
    def views(self):
        return [view.index for view in self.__views]
    
    def delete(self):
        self.active = False
        
        for viewIndex in self.views:
            self.model.views.delete(viewIndex)
            
        for connectionIndex in self.connections:
            self.model.connections.delete(connectionIndex)
            
        for opIndex in self.operators:
            self.model.operators.delete(opIndex)
    
    @property  
    def stromxStream(self):
        return self.__stream
            
    def addView(self):
        stromxView = view.View(self.__stream)
        viewModel = View(stromxView, self.model)
        self.__views.append(viewModel)
        return viewModel
    
    def removeView(self, view):
        self.__views.remove(view)
        
    def addThread(self, thread):
        self.__threads.append(thread)
        
    def removeThread(self, thread):
        self.__stream.removeThread(thread.stromxThread)
        self.__threads.remove(thread)
        
    def addConnection(self, connection):
        self.__connections.append(connection)
        
    def removeConnection(self, connection):
        self.__stream.disconnect(connection.stromxTargetOp, 
                                 connection.stromxTargetId)
        self.__connections.remove(connection)
        
    def addOperator(self, op):
        self.__operators.append(op)
        
    def removeOperator(self, op):
        self.__stream.removeOperator(op.stromxOp)
        self.__operators.remove(op)
        
    def observeException(self, message):
        self.model.errors.addError(message)
        
    def save(self):# compile the list of view data
        viewData = [view.stromxView.serialize() for view in self.__views]
        
        # write the file
        writer = stromx.runtime.XmlWriter()
        try:
            zipOutput = stromx.runtime.ZipFileOutput(self.__file.path)
            writer.writeStream(zipOutput, 'stream', self.__stream)
            
            zipOutput.initialize('views')
            zipOutput.openFile(".json", stromx.runtime.OutputProvider.OpenMode.TEXT)
            json.dump(viewData, zipOutput.file())
            zipOutput.close()
        except stromx.runtime.Exception as e:
            self.model.errors.addError(e)
            
    def __prepareStream(self):
        assignThreads = stromx.runtime.AssignThreadsAlgorithm()
        assignThreads.apply(self.__stream)
        sort = stromx.runtime.SortInputsAlgorithm()
        sort.apply(self.__stream)
        
        for i, thread in enumerate(self.__stream.threads()):
            for input in thread.inputSequence():
                connections = [
                    connection for connection in self.__connections if
                    connection.stromxTargetOp == input.op() and
                    connection.stromxTargetId == input.id()
                ]
                assert(len(connections) == 1)
                connection = connections[0]
                connection.setStromxThreadId(i)
        
class OperatorTemplate(Item):
    _properties = ["type", "package", "version"]
    
    def __init__(self, stromxOpKernel, model):
        super(OperatorTemplate, self).__init__(model)
        self.__op = stromxOpKernel
        
    @property
    def type(self):
        return self.__op.type()
        
    @property
    def package(self):
        return self.__op.package()
        
    @property
    def version(self):
        version = self.__op.version()
        return '{0}.{1}.{2}'.format(version.major(), version.minor(),
                                    version.revision())
         
class OperatorTemplates(Items):
    def __init__(self, model):
        super(OperatorTemplates, self).__init__(model)
        self.__factory = stromx.runtime.Factory()
        
        # register the remaining packages
        _registerPackages(self.__factory)
        
        for op in self.__factory.availableOperators():
            template = OperatorTemplate(op, self.model)
            self.addItem(template)
        
    @property
    def factory(self):
        return self.__factory
        
class Operators(Items):
    def addStromxOp(self, stromxOp, stream):
        operator = Operator(stromxOp, stream, self.model)
        self.addItem(operator)
        return operator
    
    def findOperatorModel(self, stromxOp):
        ops = [op for op in self.values() if op.stromxOp == stromxOp]
        assert(len(ops) == 1)
        return ops[0]
        
    def addData(self, data):
        streamId = data['operator']['stream']
        stream = self.model.streams[streamId]
        
        factory = self.model.operatorTemplates.factory
        try:
            opKernel = factory.newOperator(_str(data['operator']['package']),
                                           _str(data['operator']['type']))
        except stromx.runtime.OperatorAllocationFailed as e:
            self.model.errors.addError(e)
            raise Failed()
        
        try:
            stromxOp = stream.stromxStream.addOperator(opKernel)
        except stromx.runtime.Exception as e:
            self.model.errors.addError(e)
            raise Failed()
            
        op = self.addStromxOp(stromxOp, stream)
        op.set(data)
        stream.addOperator(op)
        return op.data
        
class Operator(Item):
    _properties = ["name", "status", "type", "package", "version", "parameters",
                  "position", "inputs", "outputs", "stream"]
    
    def __init__(self, stromxOp, stream, model):
        super(Operator, self).__init__(model)
        self.__op = stromxOp
        self.__stream = stream
        
        self.__parameters = []
        self.__allocateParameters()
        
        # allocate connectors for initialized operators only
        self.__inputs = []
        self.__outputs = []
        if self.__op.status() != stromx.runtime.Operator.Status.NONE:
            self.__allocateConnectors()
        
    @property
    def name(self):
        return self.__op.name()
    
    @name.setter
    def name(self, value):
        self.__op.setName(_str(value))
        
    @property
    def status(self):
        if self.__op.status() == stromx.runtime.Operator.Status.NONE:
            return 'none'
        elif (self.__op.status() == stromx.runtime.Operator.Status.INITIALIZED
              or self.__op.status() == stromx.runtime.Operator.Status.ACTIVE):
            return 'initialized'
        else:
            return 'undefined'
        
    @status.setter
    def status(self, value):
        if value == self.status:
            return
            
        if value == 'none':
            self.__removeParameters()
            self.__removeConnectors()
            
            try:
                self.__stream.stromxStream.deinitializeOperator(self.__op)
            except stromx.runtime.Exception as e:
                self.model.errors.addError(e)
                
            self.__allocateParameters()
        elif value == 'initialized':
            try:
                # attempt to initialize operator
                self.__stream.stromxStream.initializeOperator(self.__op)
                
                # update the parameters
                self.__removeParameters()
                self.__allocateParameters()
                self.__allocateConnectors()
            except stromx.runtime.Exception as e:
                self.model.errors.addError(e)
                raise Failed()
        else:
            assert(False)          
        
    @property
    def type(self):
        return self.__op.info().type()
        
    @property
    def package(self):
        return self.__op.info().package()
        
    @property
    def version(self):
        version = self.__op.info().version()
        return '{0}.{1}.{2}'.format(version.major(), version.minor(),
                                    version.revision())
        
    @property
    def position(self):
        pos = self.__op.position()
        value = {'x': pos.x(), 'y': pos.y()}
        return value
    
    @position.setter
    def position(self, value):
        pos = stromx.runtime.Position(value['x'], value['y'])
        self.__op.setPosition(pos)
        
    @property
    def parameters(self):
        return [param.index for param in self.__parameters]
        
    @property
    def inputs(self):
        return map(lambda model: model.index, self.__inputs)
        
    @property
    def outputs(self):
        return map(lambda model: model.index, self.__outputs)
    
    @property
    def stream(self):
        return self.__stream.index if self.__stream != None else None
    
    @property
    def stromxOp(self):
        return self.__op
    
    def delete(self):
        self.__removeParameters()
        self.__removeConnectors() 
        self.__stream.removeOperator(self)
        
    def removeInput(self, input):
        self.__inputs.remove(input)
        
    def removeOutput(self, output):
        self.__outputs.remove(output)
        
    def removeParameter(self, param):
        self.__parameters.remove(param)
    
    def __allocateConnectors(self):
        inputs = self.model.inputs
        outputs = self.model.outputs
        for description in self.__op.info().inputs():
            connector = inputs.addStromxInput(self, description)
            self.__inputs.append(connector)
            
        for description in self.__op.info().outputs():
            connector = outputs.addStromxOutput(self, description)
            self.__outputs.append(connector)
            
    def __allocateParameters(self):
        parameters = self.model.parameters
        for param in self.__op.info().parameters():
            if not _parameterIsReadable(self.__op, param):
                continue
            
            parameter = parameters.addStromxParameter(self, param)
            self.__parameters.append(parameter)
            
    def __removeConnectors(self):
        for connector in self.__inputs:
            self.model.inputs.delete(connector.index)
        self.__inputs = []
        
        for connector in self.__outputs:
            self.model.outputs.delete(connector.index)
        self.__outputs = []
        
    def __removeParameters(self):
        for param in self.__parameters:
            self.model.parameters.delete(param.index) 
        self.__parameters = []       
            
class Parameters(Items):
    def addStromxParameter(self, op, param):
        parameter = Parameter(op, param, self.model)
        self.addItem(parameter)
        return parameter
    
class Parameter(Item):
    _properties = ['title', 'variant', 'operator', 'value',
                  'minimum', 'maximum', 'rows', 'cols', 'access',
                  'descriptions', 'state', 'observers']
    
    def __init__(self, op, param, model):
        super(Parameter, self).__init__(model)
        self.__param = param
        self.__op = op
        self.__state = 'current'
        self.__descriptions = []
        self.__observers = []
        for desc in self.__param.descriptions():
            if not _parameterIsReadable(op.stromxOp, param):
                continue
            
            description = (
                self.model.enumDescriptions.addStromxEnumDescription(desc)
            )
            self.__descriptions.append(description)
        
    @property
    def state(self):
        return self.__state
    
    @property
    def title(self):
        return self.__param.title()
    
    @property
    def variant(self):
        stromxVariant = self.__param.variant()
        variant = {
            'ident': conversion.variantToString(stromxVariant),
            'title': stromxVariant.title()
        }
        return variant
        
    @property
    def operator(self):
        return self.__op.index
        
    @property
    def value(self):
        variant = self.__param.variant()
        return self.__getParameter(variant)
        
    @value.setter
    def value(self, value):
        variant = self.__param.variant()
        data = conversion.toStromxData(variant, value)
        self.__setParameter(data)
        
    @property
    def minimum(self):
        variant = self.__param.variant()
        if not conversion.isNumber(variant):
            return 0
        
        data = self.__param.min()
        value = conversion.toPythonValue(variant, data)
        if value == None:
            return 0
        return value
        
    @property
    def maximum(self):
        variant = self.__param.variant()
        if not conversion.isNumber(variant):
            return 0
        
        data = self.__param.max()
        value = conversion.toPythonValue(variant, data)
        if value == None:
            return 0
        return value
        
    @property
    def rows(self):
        return self.__param.rows()
        
    @property
    def cols(self):
        return self.__param.cols()
    
    @property
    def access(self):
        return _parameterAccess(self.stromxOp, self.__param)
        
    @property
    def descriptions(self):
        return [desc.index for desc in self.__descriptions]
        return self.__descriptions
    
    @property
    def stromxOp(self):
        return self.__op.stromxOp
    
    @property
    def stromxId(self):
        return self.__param.id()
        
    @property
    def observers(self):
        return [observer.index for observer in self.__observers]
    
    def addObserver(self, observer):
        self.__observers.append(observer)
        
    def removeObserver(self, observer):
        self.__observers.remove(observer)
        
    def delete(self):
        for observer in self.observers:
            self.model.parameterObservers.delete(observer)
            
        self.__op.removeParameter(self)
    
    def __getParameter(self, variant):
        try:
            data = self.stromxOp.getParameter(self.__param.id())
            self.__state = 'current'
            value = conversion.toPythonValue(variant, data)
        except stromx.runtime.Exception as e:
            self.__state = 'accessFailed'
            value = ''
            self.model.errors.addError(e)
        return value
        
    def __setParameter(self, data):
        if data == None:
            return
            
        try:
            self.stromxOp.setParameter(self.__param.id(), data)
        except stromx.runtime.Exception as e:
            self.model.errors.addError(e)
            raise Failed()
    
class EnumDescriptions(Items):
    def addStromxEnumDescription(self, desc):
        description = EnumDescription(desc, self.model)
        self.addItem(description)
        return description
    
class EnumDescription(Item):
    _properties = ['value', 'title']
    
    def __init__(self, desc, model):
        super(EnumDescription, self).__init__(model)
        self.__desc = desc
        
    @property
    def value(self):
        return self.__desc.value().get()
    
    @property
    def title(self):
        return self.__desc.title()
    
class Connection(Item):
    _properties = ['output', 'input', 'thread', 'stream']
    
    def __init__(self, stream, outputConnector, inputConnector, model):
        assert(outputConnector != None)
        assert(inputConnector != None)
        
        super(Connection, self).__init__(model)
        self.__output = outputConnector
        self.__input = inputConnector
        self.__stream = stream
        self.__thread = None
        
        self.__stream.addConnection(self)
    
    @property
    def output(self):
        return self.__output.index
    
    @property
    def input(self):
        return self.__input.index
    
    @property
    def stream(self):
        return self.__stream.index
    
    @property
    def thread(self):
        return self.__thread
            
    @property
    def stromxTargetOp(self):
        return self.__input.stromxOp
    
    @property
    def stromxTargetId(self):
        return self.__input.stromxId
        
    def setStromxThreadId(self, value):
        self.__thread = value
        
    def delete(self):     
        try:          
          if self.__stream != None:
              self.__stream.removeConnection(self)
        except stromx.runtime.Exception as e:
          self.model.errors.addError(e)
          raise Failed()
          
        self.__output.removeConnection(self)
        self.__input.setConnection(None)
        
class Connections(Items):
    def addConnection(self, stream, outputConnector, inputConnector):        
        connection = Connection(stream, outputConnector, inputConnector,
                                self.model)
        self.addItem(connection)
        
        outputConnector.addConnection(connection)
        inputConnector.setConnection(connection)
        
        return connection
        
    def addData(self, data):
        props = data['connection']
        outputConnector = self.model.outputs[props['output']]
        inputConnector = self.model.inputs[props['input']]
        
        sourceOp = self.model.operators[outputConnector.operator]
        targetOp = self.model.operators[inputConnector.operator]
        assert(sourceOp.stream == targetOp.stream)
        
        stream = self.model.streams[sourceOp.stream]
        try:
            stream.stromxStream.connect(sourceOp.stromxOp,
                                        outputConnector.stromxId,
                                        targetOp.stromxOp,
                                        inputConnector.stromxId)
        except stromx.runtime.Exception as e:
            self.model.errors.addError(e)
            raise Failed()
            
        connection = self.addConnection(stream, outputConnector, inputConnector)
        return connection.data
        
class ConnectorBase(Item):
    _properties = ['operator', 'title', 'variant', 'observers']
    
    def __init__(self, op, description, model):
        super(ConnectorBase, self).__init__(model)
        self.__description = description
        self.__op = op
        self.__observers = []
        
    @property
    def operator(self):
        return self.__op.index
    
    @property
    def observers(self):
        return [observer.index for observer in self.__observers]
    
    @property
    def title(self):
        return self.__description.title()
    
    @property
    def variant(self):
        stromxVariant = self.__description.variant()
        variant = {
            'ident': conversion.variantToString(stromxVariant),
            'title': stromxVariant.title()
        }
        return variant
    
    @property
    def stromxOp(self):
        return self.__op.stromxOp
    
    @property
    def operatorModel(self):
        return self.__op
    
    @property
    def stromxId(self):
        return self.__description.id()
    
    def addObserver(self, observer):
        self.__observers.append(observer)
        
    def removeObserver(self, observer):
        self.__observers.remove(observer)
        
class Input(ConnectorBase):
    _properties = ConnectorBase._properties + ['connection']
    
    def __init__(self, op, description, model):
        super(Input, self).__init__(op, description, model)
        self.__connection = None
    
    @property
    def connection(self):
        return self.__connection.index if self.__connection != None else None
    
    def delete(self):
        if self.__connection != None:
            self.model.connections.delete(self.connection)
        
        for observer in self.observers:
            self.model.inputObservers.delete(observer)
            
        self.operatorModel.removeInput(self)
    
    def setConnection(self, connection):
        self.__connection = connection
        
class Inputs(Items):
    def addStromxInput(self, op, description):
        connector = Input(op, description, self.model)
        self.addItem(connector)
        return connector
    
    def findInputModel(self, stromxOp, connectorId):
        connectors = [
            connector for connector in self.values()
            if (connector.stromxOp == stromxOp and 
                connector.stromxId == connectorId)
        ]
        assert(len(connectors) == 1)
        return connectors[0]
    
class Output(ConnectorBase):
    _properties = ConnectorBase._properties + ['connections']
    
    def __init__(self, op, description, model):
        super(Output, self).__init__(op, description, model)
        self.__connections = []
    
    @property
    def connections(self):
        return [connection.index for connection in self.__connections]
    
    def delete(self):
        for connectionIndex in self.connections:
            self.model.connections.delete(connectionIndex)
        
        for observer in self.observers:
            self.model.outputObservers.delete(observer)
            
        self.operatorModel.removeOutput(self)
    
    def addConnection(self, connection):
        self.__connections.append(connection)
        
    def removeConnection(self, connection):
        try:
            self.__connections.remove(connection)
        except ValueError:
            pass
        
class Outputs(Items):
    def addStromxOutput(self, op, description):
        connector = Output(op, description, self.model)
        self.addItem(connector)
        return connector
    
    def findOutputModel(self, stromxOp, connectorId):
        connectors = [
            connector for connector in self.values()
            if (connector.stromxOp == stromxOp and 
                connector.stromxId == connectorId)
        ]
        assert(len(connectors) == 1)
        return connectors[0]
        
class View(Item):
    _properties = ['name', 'observers', 'stream']
    
    def __init__(self, stromxView, model):
        super(View, self).__init__(model)
        self.__view = stromxView
        self.__inputObservers = []
        self.__outputObservers = []
        self.__parameterObservers = []
        for observer in self.__view.observers:
            if isinstance(observer, view.ParameterObserver):
                observers = self.model.parameterObservers
                observerModel = observers.addStromxObserver(self, observer)
                self.__parameterObservers.append(observerModel)
            elif isinstance(observer, view.ConnectorObserver):
                INPUT = stromx.runtime.Connector.Type.INPUT
                OUTPUT = stromx.runtime.Connector.Type.OUTPUT
                if observer.connectorType == INPUT:
                    observers = self.model.inputObservers
                    observerModel = observers.addStromxObserver(self, observer)
                    self.__inputObservers.append(observerModel)
                elif observer.connectorType == OUTPUT:
                    observers = self.model.outputObservers
                    observerModel = observers.addStromxObserver(self, observer)
                    self.__outputObservers.append(observerModel)
                else:
                    assert(False)
            else:
                assert(False)
        
    @property
    def name(self):
        return _str(self.__view.name)
    
    @name.setter
    def name(self, value):
        self.__view.name = _str(value)
        
    @property
    def observers(self):
        data = []
        data.extend([{ 'id': model.index, 'type': 'parameterObserver'} for
                     model in self.__parameterObservers])
        data.extend([{ 'id': model.index, 'type': 'inputObserver'} for
                     model in self.__inputObservers])
        data.extend([{ 'id': model.index, 'type': 'outputObserver'} for
                     model in self.__outputObservers])
        return data
    
    @property
    def stream(self):
        stream = self.model.streams.findStreamModel(self.__view.stream)
        return stream.index if stream != None else None
        
    @property
    def stromxView(self):
        return self.__view
    
    def delete(self):
        streamIndex = self.stream
        if streamIndex != None:
            streamModel = self.model.streams[streamIndex]
            streamModel.removeView(self)
            
        for observer in self.__parameterObservers:
            self.model.parameterObservers.delete(observer.index)
        
        for observer in self.__inputObservers:
            self.model.inputObservers.delete(observer.index)
    
    def addParameterObserver(self, parameterIndex):
        param = self.model.parameters[parameterIndex]
        observer = self.__view.addParameterObserver(param.stromxOp,
                                                    param.stromxId)
        parameterObservers = self.model.parameterObservers
        observerModel = parameterObservers.addStromxObserver(self,
                                                             observer)
        self.__parameterObservers.append(observerModel)
        return observerModel
    
    def addInputObserver(self, connectorIndex):
        connector = self.model.inputs[connectorIndex]
        connectorType = stromx.runtime.Connector.Type.INPUT
        observer = self.__view.addConnectorObserver(connector.stromxOp,
                                                    connectorType, 
                                                    connector.stromxId)
        inputObservers = self.model.inputObservers
        observerModel = inputObservers.addStromxObserver(self, observer)
        self.__inputObservers.append(observerModel)
        return observerModel
    
    def addOutputObserver(self, connectorIndex):
        connector = self.model.outputs[connectorIndex]
        connectorType = stromx.runtime.Connector.Type.OUTPUT
        observer = self.__view.addConnectorObserver(connector.stromxOp,
                                                    connectorType, 
                                                    connector.stromxId)
        outputObservers = self.model.outputObservers
        observerModel = outputObservers.addStromxObserver(self, observer)
        self.__outputObservers.append(observerModel)
        return observerModel
    
    def removeObserver(self, observerModel):
        self.__view.removeObserver(observerModel.stromxObserver)
        if observerModel in self.__inputObservers:
            self.__inputObservers.remove(observerModel)
        elif observerModel in self.__outputObservers:
            self.__outputObservers.remove(observerModel)
        elif observerModel in self.__parameterObservers:
            self.__parameterObservers.remove(observerModel)
        else:
            assert(False)
        
class Views(Items):  
    def addStromxView(self, stromxView):  
        view = View(stromxView, self.model)
        self.addItem(view)
        return view
    
    def findViewModel(self, stromxView):
        viewModels = filter(lambda view: view.stromxView == stromxView, 
                            self.values())
        assert(len(viewModels) <= 1)
        return viewModels[0] if len(viewModels) else None
        
    def addData(self, data):
        streamIndex = data['view']['stream']
        stream = self.model.streams[streamIndex]
        view = stream.addView()
        view.set(data)
        self.addItem(view)
        return view.data
    
class Observer(Item):
    _properties = ['view', 'zvalue', 'visualization', 'properties', 'active']
    
    def __init__(self, view, stromxObserver, model):
        super(Observer, self).__init__(model)
        self.__view = view
        self.__observer = stromxObserver
        
    @property
    def view(self):
        return self.__view.index if self.__view != None else None 
    
    @property
    def zvalue(self):
        return self.__observer.zvalue
    
    @zvalue.setter
    def zvalue(self, value):
        self.__observer.zvalue = value
        
    @property
    def visualization(self):
        return self.__observer.visualization
        
    @visualization.setter
    def visualization(self, value):
        self.__observer.visualization = value
        
    @property
    def properties(self):
        return self.__observer.properties
        
    @properties.setter
    def properties(self, value):
        self.__observer.properties = value
        
    @property
    def active(self):
        return self.__observer.active
        
    @active.setter
    def active(self, value):
        self.__observer.active = value
    
    @property
    def stromxObserver(self):
        return self.__observer
        
    def delete(self):
        if self.__view != None:
            self.__view.removeObserver(self)
            
        super(Observer, self).delete()
    
class ParameterObserver(Observer):
    _properties = Observer._properties + ['parameter', 'view']
    
    def __init__(self, view, stromxObserver, model):
        super(ParameterObserver, self).__init__(view, stromxObserver, 
                                                model)
        self.__parameter = self.__findParameterModel()
        
    @property
    def parameter(self):
        return self.__parameter.index
    
    def delete(self):
        self.__parameter.removeObserver(self)
        super(ParameterObserver, self).delete()
    
    def __findParameterModel(self):
        index = self.stromxObserver.parameterIndex
        op = self.stromxObserver.op
        
        selector = lambda param: (param.stromxOp == op and
                                  param.stromxId == index)
        parameterModels = filter(selector, self.model.parameters.values())
        assert(len(parameterModels) == 1)
        return parameterModels[0]

class InputObserver(Observer):
    _properties = Observer._properties + ['input', 'value']
    
    def __init__(self, view, stromxObserver, model):
        super(InputObserver, self).__init__(view, stromxObserver, model)
        self.__value = None
        if stromxObserver.connectorValue:
            self.__value = self.model.connectorValues.addStromxConnectorValue(
                                                stromxObserver.connectorValue)
        self.__input = self.__findInputModel()

    @property
    def input(self):
        return self.__input.index
        
    @property
    def value(self):
        if self.__value:
            return self.__value.index
        else:
            return None
    
    def delete(self):
        if self.__value != None:
            self.model.connectorValues.delete(self.__value.index)
        self.__input.removeObserver(self)
        
        super(InputObserver, self).delete()
    
    def __findInputModel(self):
        index = self.stromxObserver.connectorIndex
        op = self.stromxObserver.op
        
        selector = lambda connector: (connector.stromxOp == op and
                                      connector.stromxId == index)
                                      
        if (self.stromxObserver.connectorType 
            == stromx.runtime.Connector.Type.INPUT):
            connectorModel = filter(selector, self.model.inputs.values())
        elif (self.stromxObserver.connectorType
              == stromx.runtime.Connector.Type.OUTPUT):
            connectorModel = filter(selector, self.model.outputs.values())
        else:
            assert(False)
            
        assert(len(connectorModel) == 1)
        return connectorModel[0]

class OutputObserver(Observer):
    _properties = Observer._properties + ['output', 'value']
    
    def __init__(self, view, stromxObserver, model):
        super(OutputObserver, self).__init__(view, stromxObserver, model)
        self.__value = None
        if stromxObserver.connectorValue:
            self.__value = self.model.connectorValues.addStromxConnectorValue(
                                                stromxObserver.connectorValue)
        self.__output = self.__findOutputModel()

    @property
    def output(self):
        return self.__output.index
        
    @property
    def value(self):
        if self.__value:
            return self.__value.index
        else:
            return None
    
    def delete(self):
        if self.__value != None:
            self.model.connectorValues.delete(self.__value.index)
        self.__output.removeObserver(self)
        
        super(OutputObserver, self).delete()
    
    def __findOutputModel(self):
        index = self.stromxObserver.connectorIndex
        op = self.stromxObserver.op
        
        selector = lambda connector: (connector.stromxOp == op and
                                      connector.stromxId == index)
                                      
        if (self.stromxObserver.connectorType 
            == stromx.runtime.Connector.Type.INPUT):
            connectorModel = filter(selector, self.model.inputs.values())
        elif (self.stromxObserver.connectorType
              == stromx.runtime.Connector.Type.OUTPUT):
            connectorModel = filter(selector, self.model.outputs.values())
        else:
            assert(False)
            
        assert(len(connectorModel) == 1)
        return connectorModel[0]
        
class Observers(Items):
    pass
    
class ParameterObservers(Observers):
    def addStromxObserver(self, view, stromxObserver):
        observer = ParameterObserver(view, stromxObserver, self.model)
        self.addItem(observer)
        parameterId = observer.parameter
        self.model.parameters[parameterId].addObserver(observer)
        return observer
        
    def addData(self, data):
        viewIndex = data['parameterObserver']['view']
        view = self.model.views[viewIndex]
        parameterIndex = data['parameterObserver']['parameter']
        observerModel = view.addParameterObserver(parameterIndex)
        observerModel.set(data)
        return observerModel.data

class InputObservers(Observers):
    def addStromxObserver(self, view, stromxObserver):
        observer = InputObserver(view, stromxObserver, self.model)
        self.addItem(observer)
        inputIndex = observer.input
        self.model.inputs[inputIndex].addObserver(observer)
        return observer
        
    def addData(self, data):
        viewIndex = data['inputObserver']['view']
        view = self.model.views[viewIndex]
        inputIndex = data['inputObserver']['input']
        observerModel = view.addInputObserver(inputIndex)
        observerModel.set(data)
        return observerModel.data

class OutputObservers(Observers):
    def addStromxObserver(self, view, stromxObserver):
        observer = OutputObserver(view, stromxObserver, self.model)
        self.addItem(observer)
        outputIndex = observer.output
        self.model.outputs[outputIndex].addObserver(observer)
        return observer
        
    def addData(self, data):
        viewIndex = data['outputObserver']['view']
        view = self.model.views[viewIndex]
        outputIndex = data['outputObserver']['output']
        observerModel = view.addOutputObserver(outputIndex)
        observerModel.set(data)
        return observerModel.data
    
class ConnectorValueBase(Item):
    _properties = ['variant', 'value']
    
    def __init__(self, dataAccess, model):
        super(ConnectorValueBase, self).__init__(model)
        self.__access = None
        if dataAccess != None:
            if not dataAccess.empty():
                self.__access = dataAccess
        
    @property
    def variant(self):
        if self.__access == None:
            return {'ident': 'none'}
        
        ident = conversion.variantToString(self.__access.get().variant())
        return {'ident': ident}
    
    @property
    def value(self):
        if self.__access == None:
            return None
        
        return conversion.toPythonObserverValue(self.__access.get().variant(),
                                      self.__access.get())
        
    @property
    def stromxConnectorValue(self):
        return self.__value
    
    @property
    def modelName(self):
        return 'connectorValue'
    
class ConnectorValue(ConnectorValueBase):
    _properties = ['variant', 'value']
    
    def __init__(self, stromxConnectorValue, model):
        super(ConnectorValue, self).__init__(None, model)
        stromxConnectorValue.handler = self.handleData
        stromxConnectorValue.activate()
        self.__value = stromxConnectorValue
        
    @property
    def stromxConnectorValue(self):
        return self.__value
    
    def handleData(self, data):
        try:
            with stromx.runtime.ReadAccess(data) as access:
                value = ConnectorValueBase(access, self.model)
                value.index = self.index
                self.model.connectorValues.sendValue(value)
        except stromx.runtime.Exception as e:
            print 'Exception while observing data: {0}'.format(e)
        
    def delete(self):
        self.__value.deactivate()
        super(ConnectorValue, self).delete()
    
class ConnectorValues(Items):
    def __init__(self, model = None):
        super(ConnectorValues, self).__init__(model)
        self.__handlers = []
        
    def addStromxConnectorValue(self, stromxConnectorValue):
        connectorValue = ConnectorValue(stromxConnectorValue, self.model)
        self.addItem(connectorValue)
        
        return connectorValue
    
    @property
    def handlers(self):
        return self.__handlers
    
    def sendValue(self, connectorValue):
        for handler in self.__handlers:
            handler(connectorValue)
        
class Errors(Items):
    def __init__(self):
        super(Errors, self).__init__()
        self.__handlers = []
        self.__lock = threading.Lock()
    
    @property
    def handlers(self):
        return self.__handlers
        
    def addError(self, description):
        error = Error(description)
        # Add an index to the error by adding it to the error list. This is done
        # in a thread-safe way.
        # TODO: Do not allow access to the error list from outside because this
        # access would not be thread-safe.
        with self.__lock:
            # set the in index of this item by adding it to the error list
            self.addItem(error)
            
            # remove it right after to make sure the error list does not grow
            # indefinitely
            self.delete(error.index)
        
        for handler in self.__handlers:
            handler(error)
        return error
   
    def clear(self):
        self.items.clear()
        
class Error(Item):
    _properties = ["time", "description"]
    
    def __init__(self, description):
        super(Error, self).__init__()
        self.__time = datetime.datetime.now()
        self.__description = str(description)
        
    @property
    def time(self):
        return self.__time.isoformat()
    
    @property
    def description(self):
        return self.__description
    
def _resourceName(name):
    if len(name) == 0:
        return name
    else:
        return name[0].lower() + name[1:]

def _parameterIsReadable(op, param):
    status = op.status()
    accessMode = param.accessMode()
    
    AccessMode = stromx.runtime.Parameter.AccessMode
    Status = stromx.runtime.Operator.Status
    
    if accessMode == AccessMode.NONE_READ:
        return True
    elif accessMode == AccessMode.NONE_WRITE:
        return True
    elif accessMode == AccessMode.INITIALIZED_READ and status != Status.NONE:
        return True
    elif accessMode == AccessMode.INITIALIZED_WRITE and status != Status.NONE:
        return True
    elif accessMode == AccessMode.ACTIVATED_WRITE and status != Status.NONE:
        return True
    else:
        return False

def _parameterAccess(op, param):
    status = op.status()
    accessMode = param.accessMode()
    
    AccessMode = stromx.runtime.Parameter.AccessMode
    Status = stromx.runtime.Operator.Status
    
    if accessMode == AccessMode.NONE_WRITE and status == Status.NONE:
        return "full"
    elif accessMode == AccessMode.INITIALIZED_WRITE and status != Status.NONE:
        return "inactive"
    elif accessMode == AccessMode.ACTIVATED_WRITE and status != Status.NONE:
        return "full"
    else:
        return "none"  
    
def _registerPackages(factory):
    # register 'runtime' first to make sure the unit tests pass
    stromx.runtime.register(factory)
    
    for importer, modname, ispkg in pkgutil.iter_modules(stromx.__path__):
        if modname == 'runtime':
            continue
            
        # this produces a lot of output on the console so ignore it for now
        if modname == 'cvhighgui':
            continue
            
        try:
            package = importer.find_module(modname).load_module(modname)
            package.register(factory)
        except ImportError:
            pass
        