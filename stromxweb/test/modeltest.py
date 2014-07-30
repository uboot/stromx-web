# -*- coding: utf-8 -*-

import filecmp
import os
import shutil
import unittest

import stromx.cvsupport
import stromx.runtime
import stromx.test

import model

_content = (
"""
data:application/octet-stream;base64,UEsDBBQAAAAAAOtVZESgtQ4rjAEAAIwBAAAWAAAAc3RyZWFtLnN0dWRpby5nZW9tZXR
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
    'name': 'parallel.stromx',
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
    'name': 'parallel.stromx', 
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
    'operators': ['0', '1', '2', '3', '4']
}

_fork = {
    'status': 'initialized',
    'inputs': ['4'],
    'name': 'Fork',
    'parameters': ['1'],
    'package': 'runtime',
    'outputs': ['5', '6'],
    'version': '0.1.0',
     'y': 0.0, 'x': 0.0,
     'type': 'Fork', 'id': '2'
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
        self.assertTrue(filecmp.cmp('data/stream/parallel.stromx',
                                    'temp/test.stromx'))
        
    def testAddDuplicate(self):
        self.files.addData({'file': {'name': 'parallel.stromx'}})
        self.assertEqual({'files': [_parallelFile]}, self.files.data)
        self.assertFalse(os.path.exists('temp/parallel.stromx'))
        
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
        
    def testAddData(self):
        self.setUpStream()
        self.streams.addFile(self.streamFile)
        self.assertEqual({'streams': [_stream]}, self.streams.data)
        self.assertEqual(5, len(self.model.operators))
        self.assertEqual(3, len(self.model.threads))
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
        self.streams.addFile(self.streamFile)
        self.streams.set('0', {'stream': {'active': True}})
        self.assertTrue(self.streams.data['streams'][0]['active'])
        
    def testSetActivateFails(self):
        self.setUpException()
        self.streams.addFile(self.activateFile)
        
        self.streams.set('0', {'stream': {'active': True}})
        self.assertFalse(self.streams.data['streams'][0]['active'])
        self.assertEqual(1, len(self.model.errors))
        
    def testSetDeactivate(self):
        self.setUpStream()
        self.streams.addFile(self.streamFile)
        self.streams.set('0', {'stream': {'active': True}})
        self.streams.set('0', {'stream': {'active': False}})
        self.assertFalse(self.streams.data['streams'][0]['active'])
        self.streams.set('0', {'stream': {'active': False}})
        
    def testSetDeactivateFails(self):
        self.setUpException()
        self.streams.addFile(self.activateFile)
        self.streams.set('0', {'stream': {'active': True}})
        self.streams.set('0', {'stream': {'active': False}})
        
        self.assertFalse(self.streams.data['streams'][0]['active'])
        self.assertEqual(1, len(self.model.errors))
        
    def testSetDeactivateTwice(self):
        self.setUpStream()
        self.streams.addFile(self.streamFile)
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
        self.streams.addFile(self.streamFile)
        self.streams.set('0', {'stream': {'active': True}})
        self.streams.set('0', {'stream': {'paused': True}})
        self.streams.set('0', {'stream': {'paused': False}})
        self.assertFalse(self.streams.data['streams'][0]['paused'])
        
    def testSetSaved(self):
        self.setUpStream()
        self.streams.addFile(self.streamFile)
        self.streams.set('0', {'stream': {'name': 'New name'}})
        self.streams.set('0', {'stream': {'saved': True}})
        
        self.streamFile.set({'file': {'opened': False}})
        self.streamFile.set({'file': {'opened': True}})
        self.assertEqual('New name', self.streams.data['streams'][0]['name'])
        
    def testSetName(self):
        self.setUpStream()
        self.streams.addFile(self.streamFile)
        self.streams.set('0', {'stream': {'name': 'New name'}})
        self.assertEqual('New name', self.streams.data['streams'][0]['name'])
        self.assertEqual(False, self.streams.data['streams'][0]['saved'])
        
    def testDelete(self):
        self.setUpStream()
        stream = self.streams.addFile(self.streamFile)
        self.streams.delete(stream.index)
        self.assertEqual(dict(), self.model.operators)  
        
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
        
    def testSetX(self):
        self.operators.set('0', {'operator': {'x': 20.5}})
        self.assertAlmostEqual(20.5,
                               self.operator.data['operator']['x'])
        
    def testSetY(self):
        self.operators.set('0', {'operator': {'y': 30.5}})
        self.assertAlmostEqual(30.5,
                               self.operator.data['operator']['y'])
        
    def testData(self):
        data = {'operator': {'id': '0', 
                             'name': 'Name',
                             'package': 'runtime',
                             'type': 'Receive',
                             'status': 'initialized',
                             'version': '0.1.0',
                             'parameters': ['0', '1'],
                             'inputs': [],
                             'outputs': ['0'],
                             'x': 0.0,
                             'y': 0.0}}
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
                             'inputs': [],
                             'outputs': [],
                             'x': 0.0,
                             'y': 0.0}}
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
                              'numberValue': 0,
                              'state': 'current',
                              'stringValue': 'localhost',
                              'title': 'URL',
                              'type': 'string',
                              'operator': '0',
                              'writable': True}}
        self.assertEqual(data, param.data)
        
    def testSetUrl(self):
        self.model.operators.addStromxOp(self.receive)
        param = self.parameters['0']
        param.set({'parameter': {'id': '0',
                                 'stringValue': '127.0.0.1',
                                 'numberValue': 0}})
        self.assertEqual('127.0.0.1', self.receive.getParameter(0).get())
        
    def testSetUrlUnicode(self):
        self.model.operators.addStromxOp(self.receive)
        param = self.parameters['0']
        param.set({'parameter': {'id': '0',
                                 'stringValue': u'127.0.0.1',
                                 'numberValue': 0}})
        self.assertEqual('127.0.0.1', self.receive.getParameter(0).get())
        
    def testDataPort(self):
        self.model.operators.addStromxOp(self.receive)
        param = self.parameters['1']
        data = {'parameter': {'descriptions': [],
                              'id': '1',
                              'maximum': 65535,
                              'minimum': 49152,
                              'numberValue': 49152,
                              'state': 'current',
                              'stringValue': '',
                              'title': 'TCP port',
                              'type': 'int',
                              'operator': '0',
                              'writable': True}}
        self.assertEqual(data, param.data)
        
    def testSetPort(self):
        self.model.operators.addStromxOp(self.receive)
        param = self.parameters['1']
        param.set({'parameter': {'id': '0',
                                 'stringValue': '',
                                 'numberValue': 50000}})
        self.assertEqual(50000, self.receive.getParameter(1).get())
        
    def testDataNumberOfOutputs(self):
        self.model.operators.addStromxOp(self.fork)
        param = self.parameters['0']
        data = {'parameter': {'descriptions': [],
                              'id': '0',
                              'maximum': 4,
                              'minimum': 2,
                              'numberValue': 2,
                              'state': 'current',
                              'stringValue': '',
                              'title': 'Number of outputs',
                              'type': 'int',
                              'operator': '0',
                              'writable': False}}
        self.assertEqual(data, param.data)
        
    def testSetNumberOfOutputs(self):
        self.model.operators.addStromxOp(self.fork)
        self.stream.deinitializeOperator(self.fork)
        param = self.parameters['0']
        param.set({'parameter': {'id': '0',
                                 'stringValue': '',
                                 'numberValue': 3}})
        self.assertEqual(3, self.fork.getParameter(0).get())
        
    def testDataPixelType(self):
        self.model.operators.addStromxOp(self.dummyCamera)
        param = self.parameters['1']
        data = {'parameter': {'descriptions': ['0', '1', '2'],
                              'id': '1',
                              'maximum': 0,
                              'minimum': 0,
                              'numberValue': 0,
                              'state': 'current',
                              'stringValue': '',
                              'title': 'Trigger mode',
                              'type': 'enum',
                              'operator': '0',
                              'writable': True}}
        self.assertEqual(data, param.data)
        
    def testSetPixelType(self):
        self.model.operators.addStromxOp(self.dummyCamera)
        param = self.parameters['1']
        param.set({'parameter': {'id': '1',
                                 'stringValue': '',
                                 'numberValue': 1}})
        self.assertEqual(1, self.dummyCamera.getParameter(2).get())
        
    def testDataException(self):
        self.__activateExceptionOnParameter()
        self.model.operators.addStromxOp(self.exceptionOperator)
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
                                        'stringValue': '',
                                        'numberValue': 1}})
        state = data['parameter']['state']
        self.assertEqual('accessFailed', state)
        self.assertEqual(2, len(self.model.errors))
        
    def __activateExceptionOnParameter(self):
        self.model.operators.addStromxOp(self.exceptionOperator)
        param = self.parameters['5']
        param.set({'parameter': {'id': '0',
                                 'stringValue': '',
                                 'numberValue': 1}})
        
    def testDataTrigger(self):
        self.model.operators.addStromxOp(self.parameterOperator)
        valueParam = self.parameters['6']
        param = self.parameters['7']
        
        self.assertEqual('trigger', param.data['parameter']['type'])
        self.assertEqual(0, valueParam.data['parameter']['numberValue'])
        
    def testSetTrigger(self):
        self.model.operators.addStromxOp(self.parameterOperator)
        valueParam = self.parameters['6']
        param = self.parameters['7']
        
        param.set({'parameter': {'id': '7',
                                 'stringValue': '',
                                 'numberValue': 1}})
        self.assertEqual(1, valueParam.data['parameter']['numberValue'])
        
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
                              'title': 'Output 1'}}
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
                           'name': 'Thread'}}
        self.assertEqual(data, thread.data)
        
    def testFindThread(self):
        thread = self.threads.addStromxThread(self.thread)
        stromxInput = self.stromxFork.info().inputs()[0]
        foundThread = self.threads.findThread(self.stromxFork, stromxInput)
        self.assertEqual(thread, foundThread)
    
class ErrorsTest(unittest.TestCase):
    def setUp(self):
        self.lastError = None
        self.errors = model.Errors()
        
    def storeError(self, error):
        self.lastError = error
        
    def testAddData(self):
        self.errors.errorHandlers.append(self.storeError)
        self.errors.addError('An error happened')
        self.assertEqual('An error happened',
                         self.lastError.data['error']['description'])
        
if __name__ == '__main__':
    unittest.main()