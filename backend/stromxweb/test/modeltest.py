# -*- coding: utf-8 -*-

import filecmp
import os
import shutil
import time
import unittest

import stromx.cvsupport
import stromx.runtime
import stromx.test

import model

_content = (
"""
data:application/octet-stream;base64,
UEsDBBQAAAAAAOtVZESgtQ4rjAEAAIwBAAAWAAAAc3RyZWFtLnN0dWRpby5nZW9tZXR
yeT/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAA/8AAAAAAAAAAAAC4B2dDLAAEAAAAAAAAAAAAAAAAAxwAAAGMAAAAAAAAAAAAAAMcAAABjAAA
AAAAAAAAAKgAAAP8AAAAA/QAAAAAAAAAAAAAAAAAAAAQAAAAEAAAACAAAAAj8AAAAAAAAAAAuAdnQywA
BAAAAAANuAAAAUQAABcIAAAMlAAADcAAAAGgAAAXAAAADIQAAAAAAAAAAAGQAAAD/AAAAAP0AAAABAAA
AAwAAAlEAAABu/AEAAAAB+wAAABIASQBuAHAAdQB0AEwAaQBzAHQBAAAAAAAAAlEAAABSAQAABQAAAlE
AAAI1AAAABAAAAAQAAAAIAAAACPwAAAAAAT/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/A
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/8AAAAAAAAFBLAwQUAAAAAAApVmRE7do062UGAAB
lBgAACgAAAHN0cmVhbS54bWw8P3htbCB2ZXJzaW9uPSIxLjAiIGVuY29kaW5nPSJVVEYtOCIgc3RhbmR
hbG9uZT0ibm8iID8+CjxTdHJvbXggdmVyc2lvbj0iMC4yLjAiPgoKICA8U3RyZWFtIG5hbWU9IiI+CiA
gICA8T3BlcmF0b3IgaWQ9IjAiIG5hbWU9IkR1bXAiIHBhY2thZ2U9InJ1bnRpbWUiIHR5cGU9IkR1bXA
iIHZlcnNpb249IjAuMi4wIj4KICAgICAgPElucHV0IGlkPSIwIiBvcGVyYXRvcj0iMSIgb3V0cHV0PSI
wIi8+CiAgICA8L09wZXJhdG9yPgogICAgPE9wZXJhdG9yIGlkPSIxIiBuYW1lPSJKb2luIiBwYWNrYWd
lPSJydW50aW1lIiB0eXBlPSJKb2luIiB2ZXJzaW9uPSIwLjIuMCI+CiAgICAgIDxQYXJhbWV0ZXIgaWQ
9IjAiPgogICAgICAgIDxEYXRhIHBhY2thZ2U9InJ1bnRpbWUiIHR5cGU9IlVJbnQzMiIgdmVyc2lvbj0
iMC4yLjAiPjI8L0RhdGE+CiAgICAgIDwvUGFyYW1ldGVyPgogICAgICA8SW5wdXQgaWQ9IjAiIG9wZXJ
hdG9yPSIyIiBvdXRwdXQ9IjAiLz4KICAgICAgPElucHV0IGlkPSIxIiBvcGVyYXRvcj0iMiIgb3V0cHV
0PSIxIi8+CiAgICA8L09wZXJhdG9yPgogICAgPE9wZXJhdG9yIGlkPSIyIiBuYW1lPSJGb3JrIiBwYWN
rYWdlPSJydW50aW1lIiB0eXBlPSJGb3JrIiB2ZXJzaW9uPSIwLjIuMCI+CiAgICAgIDxQYXJhbWV0ZXI
gaWQ9IjAiPgogICAgICAgIDxEYXRhIHBhY2thZ2U9InJ1bnRpbWUiIHR5cGU9IlVJbnQzMiIgdmVyc2l
vbj0iMC4yLjAiPjI8L0RhdGE+CiAgICAgIDwvUGFyYW1ldGVyPgogICAgICA8SW5wdXQgaWQ9IjAiIG9
wZXJhdG9yPSI0IiBvdXRwdXQ9IjAiLz4KICAgIDwvT3BlcmF0b3I+CiAgICA8T3BlcmF0b3IgaWQ9IjM
iIG5hbWU9IkNvdW50ZXIiIHBhY2thZ2U9InJ1bnRpbWUiIHR5cGU9IkNvdW50ZXIiIHZlcnNpb249IjA
uMi4wIi8+CiAgICA8T3BlcmF0b3IgaWQ9IjQiIG5hbWU9IlBlcmlvZGljRGVsYXkiIHBhY2thZ2U9InJ
1bnRpbWUiIHR5cGU9IlBlcmlvZGljRGVsYXkiIHZlcnNpb249IjAuMi4wIj4KICAgICAgPFBhcmFtZXR
lciBpZD0iMCI+CiAgICAgICAgPERhdGEgcGFja2FnZT0icnVudGltZSIgdHlwZT0iVUludDMyIiB2ZXJ
zaW9uPSIwLjIuMCI+MTAwMDwvRGF0YT4KICAgICAgPC9QYXJhbWV0ZXI+CiAgICAgIDxJbnB1dCBpZD0
iMCIgb3BlcmF0b3I9IjMiIG91dHB1dD0iMCIvPgogICAgPC9PcGVyYXRvcj4KICAgIDxUaHJlYWQgbmF
tZT0iVGhyZWFkIEEiPgogICAgICA8SW5wdXRDb25uZWN0b3IgaW5wdXQ9IjAiIG9wZXJhdG9yPSI0Ii8
+CiAgICAgIDxJbnB1dENvbm5lY3RvciBpbnB1dD0iMCIgb3BlcmF0b3I9IjIiLz4KICAgICAgPElucHV
0Q29ubmVjdG9yIGlucHV0PSIwIiBvcGVyYXRvcj0iMCIvPgogICAgPC9UaHJlYWQ+CiAgICA8VGhyZWF
kIG5hbWU9IlRocmVhZCBCIj4KICAgICAgPElucHV0Q29ubmVjdG9yIGlucHV0PSIwIiBvcGVyYXRvcj0
iMSIvPgogICAgPC9UaHJlYWQ+CiAgICA8VGhyZWFkIG5hbWU9IlRocmVhZCBDIj4KICAgICAgPElucHV
0Q29ubmVjdG9yIGlucHV0PSIxIiBvcGVyYXRvcj0iMSIvPgogICAgPC9UaHJlYWQ+CiAgPC9TdHJlYW0
+Cgo8L1N0cm9teD4KPCEtLVhNTCBnZW5lcmF0ZWQgYXV0b21hdGljYWxseSBieSBYbWxXcml0ZXIgb2Y
gdGhlIG9wZW4gc291cmNlIGxpYnJhcnkgU3Ryb214LS0+ClBLAwQUAAAAAADrVWREEiWzBL8AAAC/AAA
AGAAAAHN0cmVhbV91bmluaXRpYWxpemVkLnhtbDw/eG1sIHZlcnNpb249IjEuMCIgZW5jb2Rpbmc9IlV
URi04IiBzdGFuZGFsb25lPSJubyIgPz4KPFN0cm9teCB2ZXJzaW9uPSIwLjIuMCI+CgogIDxQYXJhbWV
0ZXJzLz4KCjwvU3Ryb214Pgo8IS0tWE1MIGdlbmVyYXRlZCBhdXRvbWF0aWNhbGx5IGJ5IFhtbFdyaXR
lciBvZiB0aGUgb3BlbiBzb3VyY2UgbGlicmFyeSBTdHJvbXgtLT4KUEsDBBQAAAAAAOtVZES5gTwwhgE
AAIYBAAANAAAAc3RyZWFtLnN0dWRpbyAREgIAAAAAAAAAAQAAAAAAAAAAAAAABUB7oAAAAAAAQHQQAAA
AAABAenAAAAAAAEBeQAAAAAAAQGfAAAAAAABAXkAAAAAAAEBYgAAAAAAAQHQgAAAAAABAcFAAAAAAAEB
0IAAAAAAAAAAAAAAAAAMB//++viAgLi4AAAH//yAgdXW8vAAAAf//AQGVlUdHAAAAAAABAAAAEABPAGI
AcwBlAHIAdgBlAHIAAAABAAAAAAAAAAAAAAADAAAAGgB2AGkAcwB1AGEAbABpAHoAYQB0AGkAbwBuAAA
AAgAAAAAAAAAACgBjAG8AbABvAHIAAABDAAH//yAgdXW8vAAAAAAADABhAGMAdABpAHYAZQAAAAEAAQA
AAAMAAAAaAGQAZQBsAGEAeQBEAHUAcgBhAHQAaQBvAG4AAAACAAAAAGQAAAAWAGQAZQBsAGEAeQBBAGM
AdABpAHYAZQAAAAEAAAAAABoAYQBjAGMAZQBzAHMAVABpAG0AZQBvAHUAdAAAAAIAAAATiFBLAQIUAxQ
AAAAAAOtVZESgtQ4rjAEAAIwBAAAWAAAAAAAAAAAAAACkgQAAAABzdHJlYW0uc3R1ZGlvLmdlb21ldHJ
5UEsBAhQDFAAAAAAAKVZkRO3aNOtlBgAAZQYAAAoAAAAAAAAAAAAAAKSBwAEAAHN0cmVhbS54bWxQSwE
CFAMUAAAAAADrVWREEiWzBL8AAAC/AAAAGAAAAAAAAAAAAAAApIFNCAAAc3RyZWFtX3VuaW5pdGlhbGl
6ZWQueG1sUEsBAhQDFAAAAAAA61VkRLmBPDCGAQAAhgEAAA0AAAAAAAAAAAAAAKSBQgkAAHN0cmVhbS5
zdHVkaW9QSwUGAAAAAAQABAD9AAAA8woAAAAA
""")

_parallelFile = {
    'id': '0',
    'name': '0_parallel.stromx',
    'content': '',
    'opened': False,
    'stream': None
}

_renamedFile = {
    'id': '0',
    'name': 'renamed.stromx',
    'content': '',
    'opened': False,
    'stream': None
}

_openedFile = {'id': '0', 
    'name': '0_parallel.stromx', 
    'content': '',
    'opened': True, 
    'stream': '0'
}

_testFile = {'id': '1', 
    'name': 'test.stromx', 
    'content': '', 
    'opened': False,
    'stream': None
}

_noFile = {'id': '1', 
    'name': 'nothing.stromx', 
    'content': '', 
    'opened': False,
    'stream': None
}

_stream = {
    'id': '0',
    'name': '',
    'saved': False,
    'active': False,
    'paused': False,
    'file': '0',
    'connections': ['0', '1', '2', '3', '4'],
    'operators': ['0', '1', '2', '3', '4'],
    'views': [],
    'threads': ['0', '1', '2']
}

_fork = {
    'status': 'initialized',
    'name': 'Fork',
    'parameters': ['1'],
    'package': 'runtime',
    'connectors': ['4', '5', '6'],
    'version': '0.1.0',
    'position': {'y': 0.0, 'x': 0.0},
    'type': 'Fork', 'id': '2',
    'stream': '0'
}


class DummyItems(model.Items):
    pass

class DummyItem(model.Item):
    properties = ['read', 'write']
    
    def __init__(self):
        self.__write = 0
    
    @property
    def read(self):
        return 0
    
    @property
    def write(self):
        return self.__write
    
    @write.setter
    def write(self, value):
        self.__write = value
    
    
class ItemTest(unittest.TestCase):
    def setUp(self):
        self.items = DummyItems()
        self.item = DummyItem()
        self.items.addItem(self.item)
        
    def testData(self):
        self.assertEqual({'dummyItem': {'read': 0, 'write': 0, 'id': '0'}},
                         self.item.data)
        
    def testSet(self):
        self.item.set({'dummyItem': {'read': 0, 'write': 0}})

class FilesTest(unittest.TestCase):
    def setUp(self):
        shutil.rmtree('temp', True)
        shutil.copytree('data/stream', 'temp')
        
        self.files = model.Model('temp').files
        self.streams = self.files.model.streams

    def testData(self):
        self.assertEqual({'files': [_parallelFile]}, self.files.data)

    def testDelete(self):
        self.files.delete('0')
        self.assertEqual({'files': []}, self.files.data)
        self.assertFalse(os.path.exists('temp/parallel.stromx'))
    
    def testDeleteEmptyFile(self):
        self.files.addData({'file': {'name': 'test.stromx'}})
        self.files.delete('1')
    
    def testDeleteOpenedFile(self):
        self.files.set('0', {'file': {'opened': True}})
        self.files.delete('0')
        self.assertEqual({'streams': []}, self.streams.data)
            
    def testGetItem(self):
        self.assertEqual({'file': _parallelFile}, 
                         self.files['0'].data)
        
    def testSetOpenTrue(self):
        f = self.files.set('0', {'file': {'opened': True}})
        self.assertEqual({'file': _openedFile}, f)
        self.assertEqual({'stream':_stream}, self.streams['0'].data)
        
    def testSetOpenFalse(self):
        self.files.set('0', {'file': {'opened': True}})
        f = self.files.set('0', {'file': {'opened': False}})
        self.assertEqual(False, f['file']['opened'])
        self.assertEqual({'streams': []}, self.streams.data)
        
    def testSetOpenFails(self):
        shutil.rmtree('temp', True)
        os.mkdir('temp')
        with file('temp/invalid.stromx', 'w') as f:
            f.write("nonsense")
        self.files = model.Model('temp').files
        self.streams = self.files.model.streams
             
        f = self.files.set('0', {'file': {'opened': True}})
        
        self.assertEqual(False, f['file']['opened'])
        self.assertEqual(1, len(self.files.model.errors))
        
    def testSetName(self):
        f = self.files.set('0', {'file': {'name': 'renamed.stromx'}})
        self.assertEqual({'file': _renamedFile}, f)
        self.assertTrue(os.path.exists('temp/renamed.stromx'))
        self.assertFalse(os.path.exists('temp/parallel.stromx'))
        
    def testAddEmpty(self):
        self.files.addData({'file': {'name': 'test.stromx'}})
        self.assertEqual({'files': [_testFile, _parallelFile]},
                         self.files.data)
        self.assertFalse(os.path.exists('temp/test.stromx'))
        
    def testAddData(self):
        self.files.addData({'file': {'name': 'test.stromx', 'content': _content}})
        self.assertEqual({'files': [_testFile, _parallelFile]}, self.files.data)
        self.assertTrue(os.path.exists('temp/test.stromx'))
        self.assertTrue(filecmp.cmp('data/stream/0_parallel.stromx',
                                    'temp/test.stromx'))
        
    def testAddDuplicate(self):
        self.files.addData({'file': {'name': '0_parallel.stromx'}})
        self.assertEqual({'files': [_parallelFile]}, self.files.data)
        self.assertFalse(os.path.exists('temp/0_parallel.stromx'))
        
    def tearDown(self):
        shutil.rmtree('temp', True)
        
class StreamsTest(unittest.TestCase):
    def setUp(self):
        shutil.rmtree('temp', True)
        
    def setUpStream(self):
        shutil.copytree('data/stream', 'temp')
        
        self.model = model.Model('temp')
        self.streams = self.model.streams
        self.streamFile = self.model.files['0']
        
    def setUpException(self):
        shutil.copytree('data/exception', 'temp')
        
        self.model = model.Model('temp')
        self.streams = self.model.streams
        stromx.test.register(self.streams.factory)
        self.activateFile = self.model.files['0']
        self.deactivateFile = self.model.files['1']
        self.deinitializeFile = self.model.files['2']
        
    def setUpViews(self):
        shutil.copytree('data/views', 'temp')
        
        self.model = model.Model('temp')
        self.streams = self.model.streams
        self.streamFile = self.model.files['0']
        
    def testAddData(self):
        self.setUpStream()
        self.streamFile.opened = True
        self.assertEqual({'streams': [_stream]}, self.streams.data)
        
        self.assertEqual(5, len(self.model.operators))
        for op in self.model.operators.values():
            self.assertEqual('0', op.stream)
            
        self.assertEqual(3, len(self.model.threads))
        for thread in self.model.threads.values():
            self.assertEqual('0', thread.stream)
            
        self.assertEqual(10, len(self.model.connectors))
        self.assertEqual(5, len(self.model.connections))
        self.assertEqual({'operator': _fork}, self.model.operators['2'].data)
        
    def testAddNoFile(self):
        self.setUpStream()
        files = self.model.files
        files.addData({'file': _noFile})
        self.streams.addFile(files['1'])
        
    def testSetActivate(self):
        self.setUpStream()
        self.streamFile.opened = True
        self.streams.set('0', {'stream': {'active': True}})
        self.assertTrue(self.streams.data['streams'][0]['active'])
        
    def testSetActivateFails(self):
        self.setUpException()
        self.activateFile.opened = True
        
        self.streams.set('0', {'stream': {'active': True}})
        self.assertFalse(self.streams.data['streams'][0]['active'])
        self.assertEqual(1, len(self.model.errors))
        
    def testSetDeactivate(self):
        self.setUpStream()
        self.streamFile.opened = True
        self.streams.set('0', {'stream': {'active': True}})
        self.streams.set('0', {'stream': {'active': False}})
        self.assertFalse(self.streams.data['streams'][0]['active'])
        self.streams.set('0', {'stream': {'active': False}})
        
    def testSetDeactivateFails(self):
        self.setUpException()
        self.activateFile.opened = True
        self.streams.set('0', {'stream': {'active': True}})
        self.streams.set('0', {'stream': {'active': False}})
        
        self.assertFalse(self.streams.data['streams'][0]['active'])
        self.assertEqual(1, len(self.model.errors))
        
    def testSetDeactivateTwice(self):
        self.setUpStream()
        self.streamFile.opened = True
        self.streams.set('0', {'stream': {'active': True}})
        self.streams.set('0', {'stream': {'active': False}})
        self.streams.set('0', {'stream': {'active': False}})
        
    def testSetPause(self):
        self.setUpStream()
        self.streams.addFile(self.streamFile)
        self.streams.set('0', {'stream': {'active': True}})
        self.streams.set('0', {'stream': {'paused': True}})
        self.assertTrue(self.streams.data['streams'][0]['paused'])
        
    def testSetResume(self):
        self.setUpStream()
        self.streamFile.opened = True
        self.streams.set('0', {'stream': {'active': True}})
        self.streams.set('0', {'stream': {'paused': True}})
        self.streams.set('0', {'stream': {'paused': False}})
        self.assertFalse(self.streams.data['streams'][0]['paused'])
        
    def testSetSaved(self):
        self.setUpStream()
        self.streamFile.opened = True
        self.streams.set('0', {'stream': {'name': 'New name'}})
        self.streams.set('0', {'stream': {'saved': True}})
        
        self.streamFile.set({'file': {'opened': False}})
        self.streamFile.set({'file': {'opened': True}})
        self.assertEqual('New name', self.streams.data['streams'][0]['name'])
        
    def testSetName(self):
        self.setUpStream()
        self.streamFile.opened = True
        self.streams.set('0', {'stream': {'name': 'New name'}})
        self.assertEqual('New name', self.streams.data['streams'][0]['name'])
        self.assertEqual(False, self.streams.data['streams'][0]['saved'])
        
    def testDelete(self):
        self.setUpStream()
        self.streamFile.opened = True
        stream = self.streams['0']
        self.streams.delete(stream.index)
        self.assertEqual(dict(), self.model.operators)  
        
    def testReadViews(self):
        self.setUpViews()
        self.streamFile.opened = True
        stream = self.streams['0']
        self.assertEqual(['0'], stream.data['stream']['views'])
        
    def tearDown(self):
        shutil.rmtree('temp', True)
        
class OperatorsTest(unittest.TestCase):
    def setUp(self):
        self.model = model.Model()
        self.operators = self.model.operators
        
        kernel = stromx.runtime.Receive()
        self.stream = stromx.runtime.Stream()
        self.stromxOp = self.stream.addOperator(kernel)
        self.stream.initializeOperator(self.stromxOp)
        self.stromxOp.setName('Name')
        self.operator = self.operators.addStromxOp(self.stromxOp)
        
    def testSetName(self):
        self.operators.set('0', {'operator': {'name': 'New name'}})
        self.assertEqual('New name',
                         self.operator.data['operator']['name'])
        
    def testSetPosition(self):
        self.operators.set('0', {'operator': 
                                 {'position': {'x': 20.5, 'y': 30.5}}
                                 })
        self.assertAlmostEqual(20.5,
                               self.operator.data['operator']['position']['x'])
        self.assertAlmostEqual(30.5,
                               self.operator.data['operator']['position']['y'])
        
    def testData(self):
        data = {'operator': {'id': '0', 
                             'name': 'Name',
                             'package': 'runtime',
                             'type': 'Receive',
                             'status': 'initialized',
                             'version': '0.1.0',
                             'parameters': ['0', '1'],
                             'connectors': ['0'],
                             'position': {'x': 0.0, 'y': 0.0},
                             'stream': None}}
        self.assertEqual(data, self.operator.data)
        
    def testDataDeinitialized(self):
        kernel = stromx.runtime.Receive()
        self.stream = stromx.runtime.Stream()
        stromxOp = self.stream.addOperator(kernel)
        op = self.operators.addStromxOp(stromxOp)
        
        data = {'operator': {'id': '1', 
                             'name': '',
                             'package': 'runtime',
                             'type': 'Receive',
                             'status': 'none',
                             'version': '0.1.0',
                             'parameters': [],
                             'connectors': [],
                             'position': {'x': 0.0, 'y': 0.0} ,
                             'stream': None}}
        self.assertEqual(data, op.data)
    
    def testFindOperatorModel(self):
        op = self.operators.findOperatorModel(self.stromxOp)
        self.assertEqual(self.operator, op)
        
    def testFindOutputPosition(self):
        pos = self.operator.findOutputPosition(0)
        self.assertEqual(0, pos)
        
    def tearDown(self):
        self.__stream = None
        
class ParametersTest(unittest.TestCase):
    def setUp(self):
        self.model = model.Model()
        self.parameters = self.model.parameters
        
        self.stream = stromx.runtime.Stream()
        kernel = stromx.runtime.Receive()
        self.receive = self.stream.addOperator(kernel)
        kernel = stromx.runtime.Fork()
        self.fork = self.stream.addOperator(kernel)
        kernel = stromx.cvsupport.DummyCamera()
        self.dummyCamera = self.stream.addOperator(kernel)
        kernel = stromx.test.ExceptionOperator()
        self.exceptionOperator = self.stream.addOperator(kernel)
        kernel = stromx.test.ParameterOperator()
        self.parameterOperator = self.stream.addOperator(kernel)
        self.stream.initializeOperator(self.fork)
        self.stream.initializeOperator(self.receive)
        self.stream.initializeOperator(self.dummyCamera)
        self.stream.initializeOperator(self.exceptionOperator)
        self.stream.initializeOperator(self.parameterOperator)
        
    def testDataUrl(self):
        self.model.operators.addStromxOp(self.receive)
        param = self.parameters['0']
        data = {'parameter': {'descriptions': [],
                              'id': '0',
                              'maximum': 0,
                              'minimum': 0,
                              'state': 'current',
                              'value': 'localhost',
                              'title': 'URL',
                              'variant': 'string',
                              'operator': '0',
                              'writable': True}}
        self.assertEqual(data, param.data)
        
    def testSetUrl(self):
        self.model.operators.addStromxOp(self.receive)
        param = self.parameters['0']
        param.set({'parameter': {'id': '0',
                                 'value': '127.0.0.1'}})
        self.assertEqual('127.0.0.1', self.receive.getParameter(0).get())
        
    def testSetUrlUnicode(self):
        self.model.operators.addStromxOp(self.receive)
        param = self.parameters['0']
        param.set({'parameter': {'id': '0',
                                 'value': u'127.0.0.1'}})
        self.assertEqual('127.0.0.1', self.receive.getParameter(0).get())
        
    def testDataPort(self):
        self.model.operators.addStromxOp(self.receive)
        param = self.parameters['1']
        data = {'parameter': {'descriptions': [],
                              'id': '1',
                              'maximum': 65535,
                              'minimum': 49152,
                              'value': 49152,
                              'state': 'current',
                              'title': 'TCP port',
                              'variant': 'int',
                              'operator': '0',
                              'writable': True}}
        self.assertEqual(data, param.data)
        
    def testSetPort(self):
        self.model.operators.addStromxOp(self.receive)
        param = self.parameters['1']
        param.set({'parameter': {'id': '0',
                                 'value': 50000}})
        self.assertEqual(50000, self.receive.getParameter(1).get())
        
    def testDataNumberOfOutputs(self):
        self.model.operators.addStromxOp(self.fork)
        param = self.parameters['0']
        data = {'parameter': {'descriptions': [],
                              'id': '0',
                              'maximum': 4,
                              'minimum': 2,
                              'value': 2,
                              'state': 'current',
                              'title': 'Number of outputs',
                              'variant': 'int',
                              'operator': '0',
                              'writable': False}}
        self.assertEqual(data, param.data)
        
    def testSetNumberOfOutputs(self):
        self.model.operators.addStromxOp(self.fork)
        self.stream.deinitializeOperator(self.fork)
        param = self.parameters['0']
        param.set({'parameter': {'id': '0',
                                 'value': 3}})
        self.assertEqual(3, self.fork.getParameter(0).get())
        
    def testDataPixelType(self):
        self.model.operators.addStromxOp(self.dummyCamera)
        param = self.parameters['1']
        data = {'parameter': {'descriptions': ['0', '1', '2'],
                              'id': '1',
                              'maximum': 0,
                              'minimum': 0,
                              'value': 0,
                              'state': 'current',
                              'title': 'Trigger mode',
                              'variant': 'enum',
                              'operator': '0',
                              'writable': True}}
        self.assertEqual(data, param.data)
        
    def testSetPixelType(self):
        self.model.operators.addStromxOp(self.dummyCamera)
        param = self.parameters['1']
        param.set({'parameter': {'id': '1',
                                 'value': 1}})
        self.assertEqual(1, self.dummyCamera.getParameter(2).get())
        
    def testDataException(self):
        self.__activateExceptionOnParameter()
        param = self.parameters['6']
        
        state = param.data['parameter']['state']
        self.assertEqual('accessFailed', state)
        self.assertEqual(1, len(self.model.errors))
        
    def testSetParameterException(self):
        self.__activateExceptionOnParameter()
        stromxParam = self.exceptionOperator.info().parameters()[6]
        param = self.parameters.addStromxParameter(self.exceptionOperator,
                                                   stromxParam)
        
        data = param.set({'parameter': {'id': '0',
                                        'value': 1}})
        state = data['parameter']['state']
        self.assertEqual('accessFailed', state)
        self.assertEqual(2, len(self.model.errors))
        
    def __activateExceptionOnParameter(self):
        self.model.operators.addStromxOp(self.exceptionOperator)
        param = self.parameters['5']
        param.set({'parameter': {'id': '0',
                                 'value': 1}})
        
    def testDataTrigger(self):
        self.model.operators.addStromxOp(self.parameterOperator)
        valueParam = self.parameters['6']
        param = self.parameters['7']
        
        self.assertEqual('trigger', param.data['parameter']['variant'])
        self.assertEqual(0, valueParam.data['parameter']['value'])
        
    def testSetTrigger(self):
        self.model.operators.addStromxOp(self.parameterOperator)
        valueParam = self.parameters['6']
        param = self.parameters['7']
        
        param.set({'parameter': {'id': '7',
                                 'value': 1}})
        self.assertEqual(1, valueParam.data['parameter']['value'])
        
class EnumDescriptionsTest(unittest.TestCase):
    def setUp(self):
        self.model = model.Model()
        self.enumDescriptions = self.model.enumDescriptions
        
        self.stream = stromx.runtime.Stream()
        kernel = stromx.cvsupport.DummyCamera()
        dummyCamera = self.stream.addOperator(kernel)
        self.stream.initializeOperator(dummyCamera)
        pixelType = dummyCamera.info().parameters()[1]
        self.manual = pixelType.descriptions()[0]
        
    def testData(self):
        desc = self.enumDescriptions.addStromxEnumDescription(self.manual)
        data = {'enumDescription': {'id': '0', 
                                    'title': 'Software trigger', 
                                    'value': 0}}
        self.assertEqual(data, desc.data)
        
class ConnectionTest(unittest.TestCase):
    def setUp(self):
        self.model = model.Model()
        self.connections = self.model.connections
        
        self.stream = stromx.runtime.Stream()
        kernel = stromx.runtime.Fork()
        stromxFork = self.stream.addOperator(kernel)
        kernel = stromx.runtime.Receive()
        stromxReceive = self.stream.addOperator(kernel)
        
        self.stream.initializeOperator(stromxFork)
        self.stream.initializeOperator(stromxReceive)
        
        self.fork = self.model.operators.addStromxOp(stromxFork)
        self.receive = self.model.operators.addStromxOp(stromxReceive)
        
        stromxThread = self.stream.addThread()
        self.thread = self.model.threads.addStromxThread(stromxThread)
        
    def testData(self):
        source = self.model.connectors['0']
        target = self.model.connectors['3']
        connection = self.connections.addConnection(source, target, self.thread)
        data = {'connection': {'id': '0',
                               'thread': '0',
                               'sourceConnector': '0', 
                               'targetConnector': '3'}}
        self.assertEqual(data, connection.data)
        
        self.assertEqual(['0'], source.data['connector']['connections'])
        self.assertEqual(['0'], target.data['connector']['connections'])
        
class ConnectorTest(unittest.TestCase):
    def setUp(self):
        self.model = model.Model()
        
        self.stream = stromx.runtime.Stream()
        kernel = stromx.runtime.Fork()
        stromxOp = self.stream.addOperator(kernel)
        self.stream.initializeOperator(stromxOp)
        self.model.operators.addStromxOp(stromxOp)
        
    def testData(self):
        connector = self.model.connectors['2']
        data = {'connector': {'id': '2',
                              'operator': '0',
                              'title': 'Output 1',
                              'connectorType': 'output',
                              'connections': []}}
        self.assertEqual(data, connector.data)
        
class ThreadsTest(unittest.TestCase):
    def setUp(self):
        self.model = model.Model()
        self.threads = self.model.threads
        
        self.stream = stromx.runtime.Stream()
        self.thread = self.stream.addThread()
        
        color = stromx.runtime.Color(255, 0, 0)
        self.thread.setColor(color)
        self.thread.setName('Thread')
        
        kernel = stromx.runtime.Fork()
        self.stromxFork = self.stream.addOperator(kernel)
        self.stream.initializeOperator(self.stromxFork)
        self.thread.addInput(self.stromxFork, 0)
        
    def testData(self):
        thread = self.threads.addStromxThread(self.thread)
        data = {'thread': {'color': '#ff0000',
                           'id': '0',
                           'name': 'Thread',
                           'stream': None}}
        self.assertEqual(data, thread.data)
        
    def testFindThreadModel(self):
        thread = self.threads.addStromxThread(self.thread)
        stromxInput = self.stromxFork.info().inputs()[0]
        foundThread = self.threads.findThreadModel(self.stromxFork, stromxInput)
        self.assertEqual(thread, foundThread)
    
class ViewsTest(unittest.TestCase):
    def setUp(self):
        shutil.rmtree('temp', True)
        self.model = None
        
    def setupViewData(self):
        shutil.copytree('data/views', 'temp')
        
        self.model = model.Model('temp')
        self.streamFile = self.model.files['0']
        self.model.streams.addFile(self.streamFile)
        
    def testAddData(self):
        shutil.copytree('data/stream', 'temp')
        self.model = model.Model('temp')
        stream = self.model.streams.addFile(self.model.files['0'])
        viewData = {'view': {'name': 'View name',
                             'observers': [],
                             'stream': '0'}}
        
        self.model.views.addData(viewData)
        
        refData = {'view': {'id': '0',
                            'name': 'View name',
                            'observers': [],
                            'stream': '0'}}
        self.assertEqual(refData, self.model.views['0'].data)
        self.assertEqual(['0'], stream.views)
        
    def testData(self):
        self.setupViewData()
        streamFile = self.model.files['1']
        self.model.streams.addFile(streamFile)
        
        data = {'view': {'id': '1',
                         'name': 'View name',
                         'observers': [{'id': '0', 'type': 'parameterObserver'},
                                       {'id': '0', 'type': 'connectorObserver'}],
                         'stream': '1'}}
        self.assertEqual(data, self.model.views['1'].data)
        
    def testDelete(self):
        self.setupViewData()
        stream = self.model.streams['0']
        
        self.model.views.delete('0')
        
        self.assertEqual({}, self.model.views)
        self.assertEqual([], stream.views)
        
    def testDeleteStreamWithView(self):
        self.setupViewData()
        streamFile = self.model.files['1']
        stream = self.model.streams.addFile(streamFile)
        
        self.model.streams.delete(stream.index)
        self.assertEqual(1, len(self.model.views))
        self.assertEqual(0, len(self.model.connectorObservers))
        self.assertEqual(0, len(self.model.parameterObservers))
        self.assertEqual(0, len(self.model.connectorValues))
        
    def testSetName(self):
        self.setupViewData()
        
        view = self.model.views['0']
        view.set({'view': {'id': '0',
                           'name': 'New name'}})
        self.assertEqual('New name', view.name)
        
    def tearDown(self):
        shutil.rmtree('temp', True)
        
class ObserversTest(unittest.TestCase):
    def setUp(self):
        shutil.rmtree('temp', True)
        shutil.copytree('data/views', 'temp')
        
        self.model = model.Model('temp')
        self.streamFile = self.model.files['1']
        self.model.streams.addFile(self.streamFile)
        
        self.observer = self.model.connectorObservers['0']
        self.stromxObserver = self.observer.stromxObserver
        
    def testSetVisualization(self):
        self.observer.set({'connectorObserver': {'id': '0',
                                                 'visualization': 'lines'}})
        self.assertEqual('lines', self.stromxObserver.visualization)
        
    def testSetColor(self):
        self.observer.set({'connectorObserver': {'id': '0',
                                                 'color': '#ff00ff'}})
        self.assertEqual(stromx.runtime.Color(255, 0, 255),
                         self.stromxObserver.color)
        
    def testSetActive(self):
        self.observer.set({'connectorObserver': {'id': '0',
                                                 'active': False}})
        self.assertEqual(False, self.stromxObserver.active)
        
    def tearDown(self):
        shutil.rmtree('temp', True)
        
class ParameterObserversTest(unittest.TestCase):
    def setUp(self):
        shutil.rmtree('temp', True)
        shutil.copytree('data/views', 'temp')
        self.model = model.Model('temp')
        
    def setupEmptyView(self):
        streamFile = self.model.files['0']
        self.model.streams.addFile(streamFile)
        
    def setupView(self):
        streamFile = self.model.files['1']
        self.model.streams.addFile(streamFile)
        
    def testAddData(self):
        self.setupEmptyView()
        data = {'parameterObserver': {'id': '0',
                                      'parameter': '2',
                                      'view': '0'}}
        
        self.model.parameterObservers.addData(data)
        
        refData = {'parameterObserver': {'id': '0',
                                         'parameter': '2',
                                         'view': '0',
                                         'active': True,
                                         'color': '#000000',
                                         'visualization': 'default',
                                         'zvalue': 0}}
        self.assertEqual(refData, self.model.parameterObservers['0'].data)
        viewModel = self.model.views['0']
        self.assertEqual([{'id': '0', 'type': 'parameterObserver'}],
                         viewModel.observers)
        
    def testDelete(self):
        self.setupView()
        viewModel = self.model.views['0']
        stromxView = viewModel.stromxView
        
        self.model.parameterObservers.delete('0')
        
        self.assertEqual(1, len(viewModel.observers))
        self.assertEqual(1, len(stromxView.observers))
        
    def tearDown(self):
        shutil.rmtree('temp', True)
        
class ConnectorObserversTest(unittest.TestCase):
    def setUp(self):
        shutil.rmtree('temp', True)
        shutil.copytree('data/views', 'temp')
        self.model = model.Model('temp')
        
    def setupEmptyView(self):
        streamFile = self.model.files['0']
        self.model.streams.addFile(streamFile)
        
    def setupView(self):
        streamFile = self.model.files['1']
        self.model.streams.addFile(streamFile)
        
    def testAddData(self):
        self.setupEmptyView()
        data = {'connectorObserver': {'id': '0',
                                      'connector': '2',
                                      'view': '0'}}
        
        self.model.connectorObservers.addData(data)
        
        refData = {'connectorObserver': {'id': '0',
                                         'connector': '2',
                                         'view': '0',
                                         'active': True,
                                         'value': '0',
                                         'color': '#000000',
                                         'visualization': 'default',
                                         'zvalue': 0}}
        self.assertEqual(refData, self.model.connectorObservers['0'].data)
        viewModel = self.model.views['0']
        self.assertEqual([{'id': '0', 'type': 'connectorObserver'}],
                         viewModel.observers)
        refData = {'connectorValues': [{'variant': 'none',
                                        'id': '0',
                                        'value': None
                                        }]
                  }
        self.assertEqual(refData, self.model.connectorValues.data)
        
    def testDelete(self):
        self.setupView()
        viewModel = self.model.views['0']
        stromxView = viewModel.stromxView
        
        self.model.connectorObservers.delete('0')
        
        self.assertEqual(1, len(viewModel.observers))
        self.assertEqual(1, len(stromxView.observers))
        
    def tearDown(self):
        shutil.rmtree('temp', True)
        
class ConnectorValuesTest(unittest.TestCase):
    def setUp(self):
        shutil.rmtree('temp', True)
        shutil.copytree('data/views', 'temp')
        
        self.model = model.Model('temp')
        
        observerFile = self.model.files['1']
        self.observerStream = self.model.streams.addFile(observerFile)
        
        cameraFile = self.model.files['2']
        self.cameraStream = self.model.streams.addFile(cameraFile)
        
        self.data = None
        
    def setValue(self, value):
        self.data = value.data
        
    def testData(self):
        refData = {'connectorValue': {'id': '0', 
                                      'value': None, 
                                      'variant': 'none'}}
        self.assertEqual(refData, self.model.connectorValues['0'].data)
        
    def testHandlerObserver(self):
        self.model.connectorValues.handlers.append(self.setValue)
        self.observerStream.active = True
        time.sleep(1)
        self.observerStream.active = False
        
        refData = {'connectorValue': {'variant': 'int',
                                      'id': '0',
                                      'value': 0}}
        self.assertEqual(refData, self.data)
        
    def testHandlerCamera(self):
        self.model.connectorValues.handlers.append(self.setValue)
        self.cameraStream.active = True
        time.sleep(1)
        self.cameraStream.active = False
        
        self.assertEqual('1', self.data['connectorValue']['id'])
        self.assertEqual('image', self.data['connectorValue']['variant'])
        
        value = self.data['connectorValue']['value']
        self.assertEqual(125, value['width'])
        self.assertEqual(128, value['height'])
        self.assertEqual('data:image/jpg;base64,/9j/4AAQ', value['values'][:30])
        self.assertEqual('oL/8QAtRAAAgEDAwIEAwUFBAQAAAF9', 
                         value['values'][200:230])
        
    def tearDown(self):
        shutil.rmtree('temp', True)
    
class ErrorsTest(unittest.TestCase):
    def setUp(self):
        self.lastError = None
        self.errors = model.Errors()
        
    def storeError(self, error):
        self.lastError = error
        
    def testAddData(self):
        self.errors.handlers.append(self.storeError)
        self.errors.addError('An error happened')
        self.assertEqual('An error happened',
                         self.lastError.data['error']['description'])
        
if __name__ == '__main__':
    unittest.main()