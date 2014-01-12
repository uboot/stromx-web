# -*- coding: utf-8 -*-

import os
import shutil
import unittest

import model

_parallelFile = {
    'id': '0',
    'name': 'parallel.stromx',
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

_stream = {
    'id': '0',
    'name': 'TestName',
    'active': False,
    'paused': False,
    'file': '0'
}

class FilesTest(unittest.TestCase):
    def setUp(self):
        shutil.rmtree("temp", True)
        shutil.copytree("data", "temp")
            
        self.__streams = model.Streams()
        self.__files = model.Files("temp", self.__streams)

    def testData(self):
        self.assertEqual({'files': [_parallelFile]}, self.__files.data)

    def testDelete(self):
        self.__files.delete("0")
        self.assertEqual({'files': []}, self.__files.data)
        self.assertFalse(os.path.exists("temp/parallel.stromx"))
        
    def testGetItem(self):
        self.assertEqual(_parallelFile, 
                         self.__files["0"].data)
        
    def testPutOpen(self):
        f = self.__files.put("0", {'file': {'opened': True}})
        self.assertEqual({'file': [_openedFile]}, f)
        self.assertEqual(_stream, self.__streams["0"].data)
        
    def testPost(self):
        self.__files.post({'file': {'name': 'test.stromx'}})
        self.assertEqual({'files': [_testFile, _parallelFile]},
                         self.__files.data)
        
    def tearDown(self):
        shutil.rmtree("temp", True)
        
class StreamsTest(unittest.TestCase):
    def setUp(self):
        self.__streams = model.Streams()
        
        
        
if __name__ == '__main__':
    unittest.main()