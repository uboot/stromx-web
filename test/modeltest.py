# -*- coding: utf-8 -*-

import os
import shutil
import unittest

import model

_parallelFile = {'id': '0', 'name': 'parallel.stromx', 'opened': False}
_testFile = {'id': '1', 'name': 'test.stromx', 'opened': False}

class FilesTest(unittest.TestCase):
    def setUp(self):
        shutil.rmtree("temp", True)
        shutil.copytree("data", "temp")
            
        self.__files = model.Files("temp")

    def testData(self):
        self.assertEqual({'files': [_parallelFile]}, self.__files.data)

    def testDelete(self):
        self.__files.delete("0")
        self.assertEqual({'files': []}, self.__files.data)
        self.assertFalse(os.path.exists("temp/parallel.stromx"))
        
    def testGetItem(self):
        self.assertEqual(_parallelFile, 
                         self.__files["0"].data)
        
    def testPut(self):
        self.__files.put("0", {'opened': True})
        openedFile = _parallelFile.copy()
        openedFile['opened'] = True
        self.assertEqual(openedFile, self.__files["0"].data)
        
    def testPost(self):
        self.__files.post({'file': {'name': 'test.stromx'}})
        self.assertEqual({'files': [_parallelFile, _testFile]},
                         self.__files.data)
        
    def tearDown(self):
        shutil.rmtree("temp", True)
        
if __name__ == '__main__':
    unittest.main()