# -*- coding: utf-8 -*-

import unittest

import conversiontest
import modeltest
import viewtest

def load_tests(loader, tests, pattern):
    suites = []
    suites.append(loader.loadTestsFromModule(conversiontest))
    suites.append(loader.loadTestsFromModule(modeltest))
    suites.append(loader.loadTestsFromModule(viewtest))
    
    return unittest.TestSuite(suites)
    
if __name__ == '__main__':
    unittest.main()
