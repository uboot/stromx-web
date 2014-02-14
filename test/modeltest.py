# -*- coding: utf-8 -*-

import filecmp
import os
import shutil
import unittest

import stromx.runtime

import model

_content = (
"""
data:;base64,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
AAA==
""")

_parallelFile = {
    'id': '0',
    'name': 'parallel.stromx',
    'content': '',
    'opened': False,
    'stream': []
}

_renamedFile = {
    'id': '0',
    'name': 'renamed.stromx',
    'content': '',
    'opened': False,
    'stream': []
}

_openedFile = {'id': '0', 
    'name': 'parallel.stromx', 
    'content': '',
    'opened': True, 
    'stream': ['0']
}

_testFile = {'id': '1', 
    'name': 'test.stromx', 
    'content': '', 
    'opened': False,
    'stream': []
}

_noFile = {'id': '1', 
    'name': 'nothing.stromx', 
    'content': '', 
    'opened': False,
    'stream': []
}

_stream = {
    'id': '0',
    'name': '',
    'saved': True,
    'active': False,
    'paused': False,
    'file': '0',
    'operators': ['0', '1', '2', '3', '4']
}

class FilesTest(unittest.TestCase):
    def setUp(self):
        shutil.rmtree('temp', True)
        shutil.copytree('data', 'temp')
        
        self.files = model.Model('temp').files
        self.streams = self.files.model.streams

    def testData(self):
        self.assertEqual({'files': [_parallelFile]}, self.files.data)

    def testDelete(self):
        self.files.delete('0')
        self.assertEqual({'files': []}, self.files.data)
        self.assertFalse(os.path.exists('temp/parallel.stromx'))
    
    def testDeleteEmptyFile(self):
        self.files.add({'file': {'name': 'test.stromx'}})
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
        
    def testSetName(self):
        f = self.files.set('0', {'file': {'name': 'renamed.stromx'}})
        self.assertEqual({'file': _renamedFile}, f)
        self.assertTrue(os.path.exists('temp/renamed.stromx'))
        self.assertFalse(os.path.exists('temp/parallel.stromx'))
        
    def testAddEmpty(self):
        self.files.add({'file': {'name': 'test.stromx'}})
        self.assertEqual({'files': [_testFile, _parallelFile]},
                         self.files.data)
        self.assertFalse(os.path.exists('temp/test.stromx'))
        
    def testAdd(self):
        self.files.add({'file': {'name': 'test.stromx', 'content': _content}})
        self.assertEqual({'files': [_testFile, _parallelFile]},
                         self.files.data)
        self.assertTrue(os.path.exists('temp/test.stromx'))
        self.assertTrue(filecmp.cmp('temp/parallel.stromx', 'temp/test.stromx'))
        
    def testAddDuplicate(self):
        self.files.add({'file': {'name': 'parallel.stromx'}})
        self.assertEqual({'files': [_parallelFile]}, self.files.data)
        self.assertFalse(os.path.exists('temp/parallel.stromx'))
        
    def tearDown(self):
        shutil.rmtree('temp', True)
        
class StreamsTest(unittest.TestCase):
    def setUp(self):
        shutil.rmtree('temp', True)
        shutil.copytree('data', 'temp')
        
        self.model = model.Model('temp')
        self.streams = self.model.streams
        self.streamFile = self.model.files['0']
        
    def testAdd(self):
        self.streams.add(self.streamFile)
        self.assertEqual({'streams': [_stream]}, self.streams.data)
        self.assertEqual(5, len(self.model.operators.items))
        
    def testAddNoFile(self):
        files = self.model.files
        files.add({'file': _noFile})
        self.streams.add(files['1'])
        
#     def testAddInvalidFile(self):
#         with file('temp/invalid.stromx', 'w') as f:
#             f.write("nonsense")
#             
#         files = model.Files('temp', self.streams)
#         self.streams.add(files['0'])
        
    def testSetActivate(self):
        self.streams.add(self.streamFile)
        self.streams.set('0', {'stream': {'active': True}})
        self.assertTrue(self.streams.data['streams'][0]['active'])
        
    def testSetDeactivate(self):
        self.streams.add(self.streamFile)
        self.streams.set('0', {'stream': {'active': True}})
        self.streams.set('0', {'stream': {'active': False}})
        self.assertFalse(self.streams.data['streams'][0]['active'])
        self.streams.set('0', {'stream': {'active': False}})
        
    def testSetDeactivateTwice(self):
        self.streams.add(self.streamFile)
        self.streams.set('0', {'stream': {'active': True}})
        self.streams.set('0', {'stream': {'active': False}})
        self.streams.set('0', {'stream': {'active': False}})
        
    def testSetPause(self):
        self.streams.add(self.streamFile)
        self.streams.set('0', {'stream': {'active': True}})
        self.streams.set('0', {'stream': {'paused': True}})
        self.assertTrue(self.streams.data['streams'][0]['paused'])
        
    def testSetResume(self):
        self.streams.add(self.streamFile)
        self.streams.set('0', {'stream': {'active': True}})
        self.streams.set('0', {'stream': {'paused': True}})
        self.streams.set('0', {'stream': {'paused': False}})
        self.assertFalse(self.streams.data['streams'][0]['paused'])
        
    def testSetSaved(self):
        self.streams.add(self.streamFile)
        self.streams.set('0', {'stream': {'name': 'New name'}})
        self.streams.set('0', {'stream': {'saved': True}})
        
        self.streamFile.set({'file': {'opened': False}})
        self.streamFile.set({'file': {'opened': True}})
        self.assertEqual('New name', self.streams.data['streams'][0]['name'])
        
    def testSetName(self):
        self.streams.add(self.streamFile)
        self.streams.set('0', {'stream': {'name': 'New name'}})
        self.assertEqual('New name', self.streams.data['streams'][0]['name'])
        self.assertEqual(False, self.streams.data['streams'][0]['saved'])
        
    def testDelete(self):
        stream = self.streams.add(self.streamFile)
        self.streams.delete(stream.index)
        self.assertEqual(dict(), self.model.operators.items)  
        
    def tearDown(self):
        shutil.rmtree('temp', True)
        
class OperatorsTest(unittest.TestCase):
    def setUp(self):
        self.model = model.Model()
        self.operators = self.model.operators
        
        kernel = stromx.runtime.Counter()
        stromxOp = stromx.runtime.Operator(kernel)
        stromxOp.setName('Name')
        self.model.operators.add(stromxOp)
        
    def testSetName(self):
        self.operators.set('0', {'operator': {'name': 'New name'}})
        self.assertEqual('New name',
                         self.operators['0'].data['operator']['name'])
        
    def testData(self):
        data = {'operator': {'id': '0', 
                             'name': 'Name',
                             'package': 'Runtime',
                             'type': 'Counter',
                             'status': 'none',
                             'version': '0.1.0',
                             'parameters': []}}
        self.assertEqual(data, self.operators['0'].data)
    
    def tearDown(self):
        self.__stream = None
        
class ErrorsTest(unittest.TestCase):
    def setUp(self):
        self.lastError = None
        self.errors = model.Errors()
        
    def storeError(self, error):
        self.lastError = error
        
    def testAdd(self):
        self.errors.errorHandlers.append(self.storeError)
        self.errors.addError('An error happened')
        self.assertEqual('An error happened',
                         self.lastError.data['error']['description'])
        
if __name__ == '__main__':
    unittest.main()