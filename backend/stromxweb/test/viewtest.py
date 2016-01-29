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
                'properties': {
                    'color': '#ff0000',
                },
                'zvalue': 1,
                'parameter': 0,
                'active': False,
                'visualization': 'slider',
                'op': 4}
             }, {
            'ConnectorObserver': {
                'connector': 0,
                'properties': {
                    'color': '#0000ff',
                },
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

_testData = {
    'View': {
        'observers': [{
            'ConnectorObserver': {
                'connector': 0,
                'properties': {
                    'color': '#0000ff',
                },
                'zvalue': 0, 
                'type': 2, 
                'active': True,
                'visualization': 'default',
                'op': 3}
            },{
            'ParameterObserver': {
                'properties': {
                    'color': '#ff0000',
                },
                'zvalue': 2,
                'parameter': 0,
                'active': False,
                'visualization': 'slider',
                'op': 4}
             }
        ],
        'name': 'Test view'
    }
}

class ViewTest(unittest.TestCase):
    def setUp(self):
        factory = stromx.runtime.Factory()
        stromx.register('runtime', factory)
        reader = stromx.runtime.XmlReader()
        
        self.stream = reader.readStream('data/stream/0_parallel.stromx', factory)
        
        self.view = view.View(self.stream)
        self.view.name = 'Test view'
        
        self.counter = self.stream.operators()[3]
        connectorType = stromx.runtime.Connector.Type.OUTPUT
        self.connectorObserver = self.view.addConnectorObserver(self.counter, 
                                                                connectorType, 0)
        self.connectorObserver.properties['color'] = '#0000ff'
        
        self.delay = self.stream.operators()[4]
        self.parameterObserver = self.view.addParameterObserver(self.delay, 0)
        self.parameterObserver.properties['color'] = '#ff0000'
        self.parameterObserver.visualization = 'slider'
        self.parameterObserver.active = False
        
    def testSetProperties(self):
        observer = self.view.observers[0]
        observer.properties = {'height': 500 }
        self.assertEqual(500, observer.properties['height'])
        
    def testDeserialize(self):
        self.view = view.View(self.stream)
        self.view.deserialize(_testData)
        self.assertEqual(_refData, self.view.serialize())
        
    def testSerialize(self):
        data = self.view.serialize()
        self.assertEqual(_refData, data)
        
    def testIncreaseZvalue(self):
        self.connectorObserver.zvalue = 1
        
        observers = self.view.serialize()['View']['observers']
        self.assertEqual(1, observers[1]['ConnectorObserver']['zvalue'])
        self.assertEqual(0, observers[0]['ParameterObserver']['zvalue'])
        
    def testDecreaseZvalue(self):
        self.parameterObserver.zvalue = 0
        
        observers = self.view.serialize()['View']['observers']
        self.assertEqual(1, observers[1]['ConnectorObserver']['zvalue'])
        self.assertEqual(0, observers[0]['ParameterObserver']['zvalue'])
        
    def testDecreaseZvalueMinimalElement(self):
        self.connectorObserver.zvalue = -1
        
        observers = self.view.serialize()['View']['observers']
        self.assertEqual(0, observers[1]['ConnectorObserver']['zvalue'])
        self.assertEqual(1, observers[0]['ParameterObserver']['zvalue'])
        
    def testIncreaseZvalueMaximalElement(self):
        self.parameterObserver.zvalue = 2
        
        observers = self.view.serialize()['View']['observers']
        self.assertEqual(0, observers[1]['ConnectorObserver']['zvalue'])
        self.assertEqual(1, observers[0]['ParameterObserver']['zvalue'])
        
    def testAddConnectorObserver(self):
        OUTPUT = stromx.runtime.Connector.Type.OUTPUT
        observer = self.view.addConnectorObserver(self.counter, OUTPUT, 0)
        self.assertEqual(2, observer.zvalue)
        
    def testAddObserver(self):
        observer = self.view.addParameterObserver(self.delay, 0)
        self.assertEqual(2, observer.zvalue)
        
    def testRemoveObserver(self):
        self.view.removeObserver(self.connectorObserver)
        self.assertFalse(self.connectorObserver in self.view.observers)
        self.assertEqual(0, self.parameterObserver.zvalue)
        
class ConnectorValueTest(unittest.TestCase):
    def setUp(self):
        factory = stromx.runtime.Factory()
        stromx.register('runtime', factory)
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
    
        
