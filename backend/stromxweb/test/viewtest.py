# -*- coding: utf-8 -*-


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
        self.stream = reader.readStream('data/stream/parallel.stromx', factory)
        
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
        print self.view.serialize()
        self.assertEqual(_refData, self.view.serialize())
        
    def testSerialize(self):
        data = self.view.serialize()
        self.assertEqual(_refData, data)
        
