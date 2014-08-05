# -*- coding: utf-8 -*-


import unittest

import stromx.runtime

import view

class ViewTest(unittest.TestCase):
    def setUp(self):
        factory = stromx.runtime.Factory()
        stromx.runtime.register(factory)
        reader = stromx.runtime.XmlReader()
        stream = reader.readStream('data/stream/parallel.stromx', factory)
        
        self.view = view.View(stream)
        self.view.name = 'Test view'
        
        delay = stream.operators()[4]
        parameterObserver = view.ParameterObserver(stream, delay, 0)
        parameterObserver.color = stromx.runtime.Color(255, 0, 0)
        parameterObserver.zvalue = 0
        self.view.observers.append(parameterObserver)
        
        counter = stream.operators()[3]
        connectorType = stromx.runtime.Connector.Type.OUTPUT
        connectorObserver = view.ConnectorObserver(stream,counter,
                                                   connectorType, 0)
        connectorObserver.color = stromx.runtime.Color(0, 0, 255)
        parameterObserver.zvalue = 1
        self.view.observers.append(connectorObserver)
        
    def testDeserialize(self):
        data = {}
        self.view.deserialize(data)
        
    def testSerialize(self):
        data = self.view.serialize()
        refData = {
            'View': {
                'observers': [{
                    'ParameterObserver': {
                        'color': '#ff0000',
                        'zvalue': 1,
                        'param': 0,
                        'op': 4}
                     }, {
                    'ConnectorObserver': {
                        'connector': 0,
                        'color': '#0000ff', 
                        'zvalue': 0, 
                        'type': 2, 
                        'op': 3}
                    }
                ],
                'name': 'Test view'
            }
        }
        self.assertEqual(refData, data)
