# -*- coding: utf-8 -*-

import base64
import datetime
import json
import os
import re

import stromx.runtime
 
import conversion
import view

class Model(object):
    def __init__(self, directory = ""):
        self.__files = Files(directory, self)
        self.__streams = Streams(self)
        self.__errors = Errors()
        self.__operators = Operators(self)
        self.__parameters = Parameters(self)
        self.__enumDescriptions = EnumDescriptions(self)
        self.__connectors = Connectors(self)
        self.__connections = Connections(self)
        self.__threads = Threads(self)
        self.__views = Views(self)
        self.__parameterObservers = ParameterObservers(self)
        self.__connectorObservers = ConnectorObservers(self)
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
    def threads(self):
        return self.__threads
    
    @property
    def views(self):
        return self.__views
    
    @property
    def parameterObservers(self):
        return self.__parameterObservers
    
    @property
    def connectorObservers(self):
        return self.__connectorObservers
    
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
    properties = []
    
    def __init__(self, model = None):
        self.__index = ""
        self.__model = model
        
    @property
    def data(self):
        props = {prop: self.__getattribute__(prop) for prop in self.properties}
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
        properties = data[name]
        
        for key in properties:
            try:
                self.__setattr__(key, properties[key])
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
        filename = data["file"]["name"]
        duplicates = [f for f in self.values() if f.name == filename]
        assert(len(duplicates) <= 1)
        
        if len(duplicates):
            f = duplicates[0]
        else:         
            f = File(data["file"]["name"], self.model)
            self.addItem(f)
        
        content = data["file"].get("content", "")
        content = re.sub("data:.*;base64,", "", content, re.MULTILINE)
        if content != "":
            with file(f.path, 'w') as streamFile:
                streamFile.write(base64.decodestring(content))
        else:
            if os.path.exists(f.path):
                os.remove(f.path)
                
        return f.data
        
class File(Item):
    properties = ["content", "opened", "stream", "name"]
    
    def __init__(self, name, model):
        super(File, self).__init__(model)
        self.__name = name
        self.__opened = False
        self.__stream = None
    
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
        if self.__name != name:
            newPath = os.path.join(self.model.files.directory, name)
            if os.path.exists(self.path):
                os.rename(self.path, newPath)
            self.__name = name
        
    def delete(self):
        self.opened = False
        if os.path.exists(self.path):
            os.remove(self.path)
        
class Streams(Items):        
    def addFile(self, streamFile):
        factory = self.model.operatorTemplates.factory
        stream = Stream(streamFile, factory, self.model)
        self.addItem(stream)
        return stream
    
    def findStreamModel(self, stromxStream):
        streamModels = filter(
            lambda stream: stream.stromxStream == stromxStream, self.values())
        assert(len(streamModels) <= 1)
        return streamModels[0] if len(streamModels) else None
        
class Stream(Item):
    properties = ["name", "saved", "active", "paused", "file", "operators",
                  "connections", "views", "threads"]
    
    def __init__(self, streamFile, factory, model):
        super(Stream, self).__init__(model)
        self.__file = streamFile
        self.__saved = False
        self.__operators = []
        self.__connections = []
        self.__views = []
        self.__threads = []
        
        if os.path.exists(streamFile.path):
            zipInput = stromx.runtime.ZipFileInput(str(streamFile.path))
            reader = stromx.runtime.XmlReader()
            self.__stream = reader.readStream(zipInput, "stream.xml", factory)
        else:
            self.__stream = stromx.runtime.Stream()
            
        for stromxOp in self.__stream.operators():
            op = self.model.operators.addStromxOp(stromxOp, self)
            self.__operators.append(op)
            
        for stromxThread in self.__stream.threads():
            threadModel = self.model.threads.addStromxThread(stromxThread, self)
            self.__threads.append(threadModel)
            
        connectors = self.model.connectors
        for op in self.__operators:
            for stromxInput in op.stromxOp.info().inputs():
                source = self.__stream.connectionSource(op.stromxOp,
                                                        stromxInput.id())
                if source.op() == None:
                    continue
                
                sourceConnector = connectors.findConnectorModel(
                                source.op(), source.id(), Connector.OUTPUT)
                assert(sourceConnector)
                
                targetConnector = connectors.findConnectorModel(
                                op.stromxOp, stromxInput.id(), Connector.INPUT)
                assert(targetConnector)
                
                thread = self.model.threads.findThreadModel(op.stromxOp,
                                                            stromxInput)
                
                connection = self.model.connections.addConnection(
                                    sourceConnector, targetConnector, thread)
                self.__connections.append(connection)
        
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
                self.__stream.start()
            except stromx.runtime.Exception as e:
                self.model.errors.addError(e)
        
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
        if self.name != str(value):
            self.__stream.setName(str(value))
        
    @property
    def saved(self):
        return self.__saved
    
    @saved.setter
    def saved(self, value):
        # it makes no sense to mark a clean (i.e. non-dirty) file as dirty
        if not value:
            return
        
        # compile the list of view data
        viewData = [view.stromxView.serialize() for view in self.__views]
        
        # write the file
        writer = stromx.runtime.XmlWriter()
        try:
            zipOutput = stromx.runtime.ZipFileOutput(self.__file.path)
            writer.writeStream(zipOutput, 'stream', self.__stream)
            
            zipOutput.initialize('views')
            zipOutput.openFile("json", stromx.runtime.OutputProvider.OpenMode.TEXT)
            json.dump(viewData, zipOutput.file())
            zipOutput.close()
            
            self.__saved = True
        except stromx.runtime.Exception as e:
            self.model.errors.addError(e)
    
    @property
    def operators(self):
        return [op.index for op in self.__operators]
    
    @property
    def connections(self):
        return [connection.index for connection in self.__connections]
    
    @property
    def views(self):
        return [view.index for view in self.__views]
    
    @property
    def threads(self):
        return [thread.index for thread in self.__threads]
    
    def delete(self):
        for viewIndex in self.views:
            self.model.views.delete(viewIndex)
            
        for op in self.__operators:
            self.model.operators.delete(op.index)
            
        for threadIndex in self.threads:
            self.model.threads.delete(threadIndex)
    
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
        
class OperatorTemplate(Item):
    properties = ["type", "package", "version"]
    
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
        
        stromx.runtime.register(self.__factory)
        _registerExtraPackages(self.__factory)
        
        for op in self.__factory.availableOperators():
            template = OperatorTemplate(op, self.model)
            self.addItem(template)
        
    @property
    def factory(self):
        return self.__factory
        
class Operators(Items):
    def addStromxOp(self, stromxOp, stream = None):
        operator = Operator(stromxOp, stream, self.model)
        self.addItem(operator)
        return operator
    
    def findOperatorModel(self, stromxOp):
        ops = [op for op in self.values() if op.stromxOp == stromxOp]
        assert(len(ops) == 1)
        return ops[0]
        
class Operator(Item):
    properties = ["name", "status", "type", "package", "version", "parameters",
                  "position", "connectors", "stream"]
    
    def __init__(self, stromxOp, stream, model):
        super(Operator, self).__init__(model)
        self.__op = stromxOp
        self.__stream = stream
        
        self.__parameters = []
        parameters = self.model.parameters
        for param in self.__op.info().parameters():
            if not _parameterIsReadable(self.__op, param):
                continue
            
            parameter = parameters.addStromxParameter(self.__op, param)
            self.__parameters.append(parameter)
            
        self.__connectors = []
        connectors = self.model.connectors
        for description in self.__op.info().inputs():
            connector = connectors.addStromxConnector(self.__op, description,
                                                      Connector.INPUT)
            self.__connectors.append(connector)
            
        for description in self.__op.info().outputs():
            connector = connectors.addStromxConnector(self.__op, description,
                                                      Connector.OUTPUT)
            self.__connectors.append(connector)
        
    @property
    def name(self):
        return self.__op.name()
    
    @name.setter
    def name(self, value):
        self.__op.setName(str(value))
        
    @property
    def status(self):
        if self.__op.status() == stromx.runtime.Operator.Status.NONE:
            return 'none'
        elif self.__op.status() == stromx.runtime.Operator.Status.INITIALIZED:
            return 'initialized'
        elif self.__op.status() == stromx.runtime.Operator.Status.ACTIVE:
            return 'active'
        else:
            return 'undefined'
        
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
        return [op.index for op in self.__parameters]
        
    @property
    def connectors(self):
        return map(lambda model: model.index, self.__connectors)
    
    @property
    def stream(self):
        return self.__stream.index if self.__stream != None else None
    
    @property
    def stromxOp(self):
        return self.__op
    
    def delete(self):
        for param in self.__parameters:
            self.model.parameters.delete(param.index)
            
        for connector in self.__connectors:
            self.model.connectors.delete(connector.index)
    
    def findOutputPosition(self, index):
        outputs = [i for i, output in enumerate(self.__op.info().outputs())
                   if output.id() == index]
        assert(len(outputs) == 1)
        return outputs[0]
    
class Parameters(Items):
    def addStromxParameter(self, op, param):
        parameter = Parameter(op, param, self.model)
        self.addItem(parameter)
        return parameter
    
class Parameter(Item):
    properties = ['title', 'variant', 'operator', 'value',
                  'minimum', 'maximum', 'writable', 'descriptions', 'state']
    
    def __init__(self, op, param, model):
        super(Parameter, self).__init__(model)
        self.__param = param
        self.__op = op
        self.__state = 'current'
        self.__descriptions = []
        for desc in self.__param.descriptions():
            if not _parameterIsReadable(op, param):
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
        variant = self.__param.variant()
        return conversion.variantToString(variant)
        
    @property
    def operator(self):
        op = self.model.operators.findOperatorModel(self.__op)
        if op:
            return op.index
        else:
            assert(False)
        
    @property
    def value(self):
        variant = self.__param.variant()
        return self.__getParameter(variant)
        
    @value.setter
    def value(self, value):
        assert(type(value) == str or type(value) == unicode or
               type(value) == float or type(value) == int)
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
    def writable(self):
        return _parameterIsWritable(self.__op, self.__param)
        
    @property
    def descriptions(self):
        return [desc.index for desc in self.__descriptions]
        return self.__descriptions
    
    @property
    def stromxOp(self):
        return self.__op
    
    @property
    def stromxId(self):
        return self.__param.id()
    
    def __getParameter(self, variant):
        try:
            data = self.__op.getParameter(self.__param.id())
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
            self.__op.setParameter(self.__param.id(), data)
        except stromx.runtime.Exception as e:
            self.model.errors.addError(e)
    
class EnumDescriptions(Items):
    def addStromxEnumDescription(self, desc):
        description = EnumDescription(desc, self.model)
        self.addItem(description)
        return description
    
class EnumDescription(Item):
    properties = ['value', 'title']
    
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
    properties = ['sourceConnector', 'targetConnector', 'thread']
    
    def __init__(self, sourceConnector, targetConnector, thread, model):
        assert(sourceConnector != None)
        assert(targetConnector != None)
        
        super(Connection, self).__init__(model)
        self.__sourceConnector = sourceConnector
        self.__targetConnector = targetConnector
        self.__thread = thread
    
    @property
    def sourceConnector(self):
        return self.__sourceConnector.index
    
    @property
    def targetConnector(self):
        return self.__targetConnector.index
    
    @property
    def thread(self):
        if self.__thread != None:
            return self.__thread.index
        else:
            return None
        
    def delete(self):
        self.__sourceConnector.removeConnection(self)
        self.__targetConnector.removeConnection(self)
        
        
class Connections(Items):
    def addConnection(self, sourceConnector, targetConnector, thread):        
        connection = Connection(sourceConnector, targetConnector, thread,
                                self.model)
        self.addItem(connection)
        
        sourceConnector.addConnection(connection)
        targetConnector.addConnection(connection)
        
        return connection
    
class Thread(Item):
    properties = ['name', 'color', 'stream']
    
    def __init__(self, stromxThread, stream, model):
        super(Thread, self).__init__(model)
        self.__thread = stromxThread
        self.__stream = stream
    
    @property
    def name(self):
        return self.__thread.name()
    
    @property
    def color(self):
        return conversion.stromxColorToString(self.__thread.color())
    
    @property
    def stream(self):
        return self.__stream.index if self.__stream != None else None
    
    @property
    def stromxThread(self):
        return self.__thread
        
class Threads(Items):
    def addStromxThread(self, thread, stream = None):
        threadModel = Thread(thread, stream, self.model)
        self.addItem(threadModel)
        return threadModel
    
    def findThreadModel(self, stromxOp, stromxInput):
        threads = [
            thread for thread in self.values() if 
            self.__inputIsInInputSequence(stromxOp, stromxInput, 
                                          thread.stromxThread.inputSequence())
        ]
        assert(len(threads) <= 1)
        return threads[0] if len(threads) else None
        
    def __inputIsInInputSequence(self, stromxOp, stromxInput, sequence):
        for connector in sequence:
            if (connector.type() == stromx.runtime.Connector.Type.INPUT and
                connector.op() == stromxOp and
                connector.id() == stromxInput.id()):
                return True
            
        return False
    
class Connector(Item):
    INPUT = 'input'
    OUTPUT = 'output'
    
    properties = ['operator', 'title', 'connectorType', 'connections',
                  'observers']
    
    def __init__(self, op, description, connectorType, model):
        super(Connector, self).__init__(model)
        self.__description = description
        self.__op = op
        self.__connectorType = connectorType
        self.__connections = []
        self.__observers = []
        
    @property
    def operator(self):
        op = self.model.operators.findOperatorModel(self.__op)
        if op:
            return op.index
        else:
            assert(False)
    
    @property
    def title(self):
        return self.__description.title()
        
    @property
    def connectorType(self):
        return self.__connectorType
    
    @property
    def stromxOp(self):
        return self.__op
    
    @property
    def stromxId(self):
        return self.__description.id()
    
    @property
    def connections(self):
        return [connection.index for connection in self.__connections]
    
    @property
    def observers(self):
        return [observer.index for observer in self.__observers]
    
    def delete(self):
        for connectionIndex in self.connections:
            self.model.connections.delete(connectionIndex)
    
    def addConnection(self, connection):
        self.__connections.append(connection)
        
    def removeConnection(self, connection):
        try:
            self.__connections.remove(connection)
        except ValueError:
            pass
    
    def addObserver(self, observer):
        self.__observers.append(observer)
        
    def removeObserver(self, observer):
        self.__observers.remove(observer)
        
class Connectors(Items):
    def addStromxConnector(self, op, description, connectorType):
        connector = Connector(op, description, connectorType, self.model)
        self.addItem(connector)
        return connector
    
    def findConnectorModel(self, stromxOp, connectorId, connectorType):
        connectors = [
            connector for connector in self.values()
            if (connector.stromxOp == stromxOp and 
                connector.stromxId == connectorId and
                connector.connectorType == connectorType)
        ]
        assert(len(connectors) == 1)
        return connectors[0]
        
class View(Item):
    properties = ['name', 'observers', 'stream']
    
    def __init__(self, stromxView, model):
        super(View, self).__init__(model)
        self.__view = stromxView
        self.__connectorObservers = []
        self.__parameterObservers = []
        for observer in self.__view.observers:
            if isinstance(observer, view.ParameterObserver):
                observers = self.model.parameterObservers
                observerModel = observers.addStromxObserver(self.__view,
                                                            observer)
                self.__parameterObservers.append(observerModel)
            elif isinstance(observer, view.ConnectorObserver):
                observers = self.model.connectorObservers
                observerModel = observers.addStromxObserver(self.__view,
                                                            observer)
                self.__connectorObservers.append(observerModel)
            else:
                assert(False)
        
    @property
    def name(self):
        return str(self.__view.name)
    
    @name.setter
    def name(self, value):
        self.__view.name = str(value)
        
    @property
    def observers(self):
        data = []
        data.extend([{ 'id': model.index, 'type': 'parameterObserver'} for
                     model in self.__parameterObservers])
        data.extend([{ 'id': model.index, 'type': 'connectorObserver'} for
                     model in self.__connectorObservers])
        return data
    
    @property
    def stream(self):
        stream = self.model.streams.findStreamModel(self.__view.stream)
        return stream.index if stream != None else None
        
    @property
    def stromxView(self):
        return self.__view
    
    def delete(self):
        for observer in self.__parameterObservers:
            self.model.parameterObservers.delete(observer.index)
        
        for observer in self.__connectorObservers:
            self.model.connectorObservers.delete(observer.index)
    
    def addParameterObserver(self, parameterIndex):
        param = self.model.parameters[parameterIndex]
        observer = self.__view.addParameterObserver(param.stromxOp,
                                                    param.stromxId)
        parameterObservers = self.model.parameterObservers
        observerModel = parameterObservers.addStromxObserver(self.__view,
                                                             observer)
        self.__parameterObservers.append(observerModel)
        return observerModel
    
    def addConnectorObserver(self, connectorIndex):
        connector = self.model.connectors[connectorIndex]
        if connector.connectorType == Connector.INPUT:
            connectorType = stromx.runtime.Connector.Type.INPUT
        elif connector.connectorType == Connector.OUTPUT:
            connectorType = stromx.runtime.Connector.Type.OUTPUT
        else:
            assert(False)
            
        observer = self.__view.addConnectorObserver(connector.stromxOp,
                                                    int(connectorType),
                                                    connector.stromxId)
        connectorObservers = self.model.connectorObservers
        observerModel = connectorObservers.addStromxObserver(self.__view,
                                                             observer)
        self.__connectorObservers.append(observerModel)
        return observerModel
    
    def removeObserver(self, observerModel):
        self.__view.removeObserver(observerModel.stromxObserver)
        if observerModel in self.__connectorObservers:
            self.__connectorObservers.remove(observerModel)
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
    
    def delete(self, index):
        viewModel = self[index]
        streamIndex = viewModel.stream
        
        if streamIndex != None:
            streamModel = self.model.streams[streamIndex]
            streamModel.removeView(viewModel)
        
        super(Views, self).delete(index)
    
class Observer(Item):
    properties = ['view', 'zvalue', 'visualization', 'color', 'active']
    
    def __init__(self, stromxView, stromxObserver, model):
        super(Observer, self).__init__(model)
        self.__view = stromxView
        self.__observer = stromxObserver
        
    @property
    def view(self):
        viewModel = self.model.views.findViewModel(self.__view)
        return viewModel.index if viewModel != None else None 
    
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
    def color(self):
        return conversion.stromxColorToString(self.__observer.color)
        
    @color.setter
    def color(self, value):
        self.__observer.color = conversion.stringToStromxColor(value)
        
    @property
    def active(self):
        return self.__observer.active
        
    @active.setter
    def active(self, value):
        self.__observer.active = value
    
    @property
    def stromxObserver(self):
        return self.__observer
    
class ParameterObserver(Observer):
    properties = Observer.properties + ['parameter', 'view']
    
    def __init__(self, stromxView, stromxObserver, model):
        super(ParameterObserver, self).__init__(stromxView, stromxObserver, 
                                                model)
        
    @property
    def parameter(self):
        index = self.stromxObserver.parameterIndex
        op = self.stromxObserver.op
        
        selector = lambda param: (param.stromxOp == op and
                                  param.stromxId == index)
        parameterModels = filter(selector, self.model.parameters.values())
        assert(len(parameterModels) == 1)
        return parameterModels[0].index

class ConnectorObserver(Observer):
    properties = Observer.properties + ['connector', 'value']
    
    def __init__(self, stromxView, stromxObserver, model):
        super(ConnectorObserver, self).__init__(stromxView, stromxObserver,
                                                model)
        self.__value = None
        if stromxObserver.connectorValue:
            self.__value = self.model.connectorValues.addStromxConnectorValue(
                                                stromxObserver.connectorValue)

    @property
    def connector(self):
        index = self.stromxObserver.connectorIndex
        op = self.stromxObserver.op
        if (self.stromxObserver.connectorType 
            == stromx.runtime.Connector.Type.INPUT):
            connectorType = Connector.INPUT 
        elif (self.stromxObserver.connectorType
              == stromx.runtime.Connector.Type.OUTPUT):
            connectorType = Connector.OUTPUT 
        else:
            assert(False)
            
        selector = lambda connector: (connector.stromxOp == op and
                                      connector.stromxId == index and
                                      connector.connectorType == connectorType)
        connectorModel = filter(selector, self.model.connectors.values())
        assert(len(connectorModel) == 1)
        return connectorModel[0].index
    
    @property
    def value(self):
        if self.__value:
            return self.__value.index
        else:
            return None
    
    def delete(self):
        if self.__value != None:
            self.model.connectorValues.delete(self.__value.index)
        connectorId = self.connector
        connector = self.model.connectors[connectorId]
        connector.removeObserver(self)
        
class Observers(Items):
    def delete(self, index):
        observerModel = self[index]
        viewIndex = observerModel.view
        if viewIndex != None:
            viewModel = self.model.views[viewIndex]
            viewModel.removeObserver(observerModel)
        
        super(Observers, self).delete(index)
    
class ParameterObservers(Observers):
    def addStromxObserver(self, stromxView, stromxObserver):
        observer = ParameterObserver(stromxView, stromxObserver, self.model)
        self.addItem(observer)
        return observer
        
    def addData(self, data):
        viewIndex = data['parameterObserver']['view']
        view = self.model.views[viewIndex]
        parameterIndex = data['parameterObserver']['parameter']
        observerModel = view.addParameterObserver(parameterIndex)
        observerModel.set(data)
        return observerModel.data

class ConnectorObservers(Observers):
    def addStromxObserver(self, stromxView, stromxObserver):
        observer = ConnectorObserver(stromxView, stromxObserver, self.model)
        self.addItem(observer)
        connectorId = observer.connector
        self.model.connectors[connectorId].addObserver(observer)
        return observer
        
    def addData(self, data):
        viewIndex = data['connectorObserver']['view']
        view = self.model.views[viewIndex]
        connectorIndex = data['connectorObserver']['connector']
        observerModel = view.addConnectorObserver(connectorIndex)
        observerModel.set(data)
        return observerModel.data
    
class ConnectorValueBase(Item):
    properties = ['variant', 'value']
    
    def __init__(self, dataAccess, model):
        super(ConnectorValueBase, self).__init__(model)
        self.__access = None
        if dataAccess != None:
            if not dataAccess.empty():
                self.__access = dataAccess
        
    @property
    def variant(self):
        if self.__access == None:
            return 'none'
        
        return conversion.variantToString(self.__access.get().variant())
    
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
    properties = ['variant', 'value']
    
    def __init__(self, stromxConnectorValue, model):
        super(ConnectorValue, self).__init__(None, model)
        stromxConnectorValue.handler = self.handleData
        stromxConnectorValue.activate()
        self.__value = stromxConnectorValue
        
    @property
    def stromxConnectorValue(self):
        return self.__value
    
    def handleData(self, data):
        with stromx.runtime.ReadAccess(data) as access:
            value = ConnectorValueBase(access, self.model)
            value.index = self.index
            self.model.connectorValues.sendValue(value)
        
    def delete(self):
        self.__value.deactivate()
        super(ConnectorValue, self).delete()
    
class ConnectorValues(Items):
    def addStromxConnectorValue(self, stromxConnectorValue):
        connectorValue = ConnectorValue(stromxConnectorValue, self.model)
        self.addItem(connectorValue)
        self.__handlers = []
        
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
    
    @property
    def handlers(self):
        return self.__handlers
        
    def addError(self, description):
        error = Error(description)
        self.addItem(error)
        for handler in self.__handlers:
            handler(error)
        return error
   
    def clear(self):
        self.items.clear()
        
class Error(Item):
    properties = ["time", "description"]
    
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

def _parameterIsWritable(op, param):
    status = op.status()
    accessMode = param.accessMode()
    
    AccessMode = stromx.runtime.Parameter.AccessMode
    Status = stromx.runtime.Operator.Status
    
    if accessMode == AccessMode.NONE_WRITE and status == Status.NONE:
        return True
    elif (accessMode == AccessMode.INITIALIZED_WRITE and 
          status == Status.INITIALIZED):
        return True
    elif accessMode == AccessMode.ACTIVATED_WRITE and status != Status.NONE:
        return True
    else:
        return False  
    
def _registerExtraPackages(factory):
        try:
            import stromx.cvsupport as cvsupport
            cvsupport.register(factory)
        except ImportError:
            pass
        
        try:
            import stromx.cvimgproc as cvimgproc
            cvimgproc.register(factory)
        except ImportError:
            pass
        
        try:
            import stromx.cvcore as cvcore
            cvcore.register(factory)
        except ImportError:
            pass
        
#         try:
#             import stromx.cvhighgui as cvhighgui
#             cvhighgui.register(factory)
#         except ImportError:
#             pass
        
        try:
            import stromx.raspi as raspi
            raspi.register(factory)
        except ImportError:
            pass
        