# -*- coding: utf-8 -*-

import shutil
import unittest

import model

class FilesTest(unittest.TestCase):
    def setUp(self):
        shutil.rmtree("temp", True)
        shutil.copytree("data", "temp")
            
        self.__files = model.Files("temp")

    def testData(self):
        self.assertEqual("", self.__files.data)
        
    def tearDown(self):
        shutil.rmtree("temp", True)
        
if __name__ == '__main__':
    unittest.main()