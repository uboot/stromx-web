# -*- coding: utf-8 -*-

import os
import shutil
import unittest

import model

class FilesTest(unittest.TestCase):
    def setUp(self):
        shutil.rmtree("temp", True)
        shutil.copytree("data", "temp")
            
        self.__files = model.Files("temp")

    def testData(self):
        self.assertEqual({'files': [{'id': '0', 'name': 'parallel.stromx'}]},
                         self.__files.data)

    def testDelete(self):
        self.__files.delete("0")
        self.assertEqual({'files': []}, self.__files.data)
        self.assertFalse(os.path.exists("temp/parallel.stromx"))
        
    def testGetItem(self):
        self.assertEqual({'id': '0', 'name': 'parallel.stromx'}, 
                         self.__files["0"].data)
        
    def testPut(self):
        self.__files.put("0", {'name': 'file.stromx'})
        self.assertEqual({'files': [{'id': '0', 'name': 'file.stromx'}]},
                         self.__files.data)
        
    def testPost(self):
        self.__files.post({'file': {'name': 'file.stromx'}})
        self.assertEqual({'files': [{'id': '0', 'name': 'parallel.stromx'},
                                    {'id': '1', 'name': 'file.stromx'}]},
                         self.__files.data)
        
    def tearDown(self):
        shutil.rmtree("temp", True)
        
if __name__ == '__main__':
    unittest.main()