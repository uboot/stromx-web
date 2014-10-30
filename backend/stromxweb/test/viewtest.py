# -*- coding: utf-8 -*-

import json
import time
import unittest

import stromx.runtime

import view

_refData = {
    'View': {
        'observers': [{
            'ParameterObserver': {
                'color': '#ff0000',
                'zvalue': 1,
                'parameter': 0,
                'active': False,
                'visualization': 'slider',
                'op': 4}
             }, {
            'ConnectorObserver': {
                'connector': 0,
                'color': '#0000ff', 
                'zvalue': 0, 
                'type': 2, 
                'active': True,
                'visualization': 'default',
                'op': 3}
            }
        ],
        'name': 'Test view'
    }
}

class ViewTest(unittest.TestCase):
    def setUp(self):
        factory = stromx.runtime.Factory()
        stromx.runtime.register(factory)
        reader = stromx.runtime.XmlReader()
        self.stream = reader.readStream('data/stream/0_parallel.stromx', factory)
        
        self.view = view.View(self.stream)
        self.view.name = 'Test view'
        
        delay = self.stream.operators()[4]
        parameterObserver = self.view.addParameterObserver(delay, 0)
        parameterObserver.color = stromx.runtime.Color(255, 0, 0)
        parameterObserver.visualization = 'slider'
        
        counter = self.stream.operators()[3]
        connectorType = stromx.runtime.Connector.Type.OUTPUT
        connectorObserver = self.view.addConnectorObserver(counter, 
                                                           connectorType, 0)
        connectorObserver.color = stromx.runtime.Color(0, 0, 255)
        parameterObserver.zvalue = 1
        parameterObserver.active = False
        
    def testDeserialize(self):
        self.view = view.View(self.stream)
        self.view.deserialize(_refData)
        self.assertEqual(_refData, self.view.serialize())
        
    def testSerialize(self):
        data = self.view.serialize()
        self.assertEqual(_refData, data)
        
class ConnectorValueTest(unittest.TestCase):
    def setUp(self):
        factory = stromx.runtime.Factory()
        stromx.runtime.register(factory)
        reader = stromx.runtime.XmlReader()
        streamFile = 'data/views/1_view_with_observers.stromx'
        
        zipInput = stromx.runtime.ZipFileInput(str(streamFile))
        stream = reader.readStream(zipInput, "stream.xml", factory)
        
        zipInput.initialize("", "views.json")
        zipInput.openFile(stromx.runtime.InputProvider.OpenMode.TEXT)
        viewData = json.load(zipInput.file())
        testView = view.View(stream)
        testView.deserialize(viewData[0])
        
        observer = testView.observers[0]
        self.value = observer.connectorValue
        self.stream = stream
        self.data = None
        
    def setData(self, data):
        self.data = data
        
    def testActivate(self):
        self.value.activate()
        
    def testDeactivate(self):
        self.value.activate()
        
    def testObserve(self):
        self.value.handler = self.setData
        self.value.activate()
        
        self.stream.start()
        time.sleep(1)
        self.stream.stop()
        
        self.assertNotEqual(None, self.data)
    
        
