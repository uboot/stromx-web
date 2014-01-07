# -*- coding: utf-8 -*-

import unittest

import model

class FilesTest(unittest.TestCase):
    def setUp(self):
        self.__files = model.Files("../files")

    def testData(self):
        self.assertEqual("", self.__files.data)
        
if __name__ == '__main__':
    unittest.main()