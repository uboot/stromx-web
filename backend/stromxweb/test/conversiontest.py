# -*- coding: utf-8 -*-

import stromx.cvsupport
import unittest

import conversion

class ConversionTest(unittest.TestCase):
    def testStromxImageToDataColor(self):
        stromxImage = stromx.cvsupport.Image('data/image/lenna.jpg')
        data = conversion.stromxImageToData(stromxImage)
        
        self.assertEqual(125, data['width'])
        self.assertEqual(128, data['height'])
        
        values = data['values']
        self.assertEqual('data:image/jpg;base64,/9j/4AAQ', values[:30])
        self.assertEqual('oKCgoKCgoKCgoKCgoKCgoKCgoKCgoK', values[200:230])
        
    def testStromxImageToDataGrayscale(self):
        grayscale = stromx.cvsupport.Image.Conversion.GRAYSCALE
        stromxImage = stromx.cvsupport.Image('data/image/lenna.jpg', grayscale)
        data = conversion.stromxImageToData(stromxImage)
        
        self.assertEqual(125, data['width'])
        self.assertEqual(128, data['height'])
        
        values = data['values']
        self.assertEqual('data:image/jpg;base64,/9j/4AAQ', values[:30])
        self.assertEqual('oL/8QAtRAAAgEDAwIEAwUFBAQAAAF9', values[200:230])
        
    def testStromxMatrixToData(self):
        valueType = stromx.cvsupport.Matrix.ValueType.INT_32
        matrix = stromx.cvsupport.Matrix.eye(3, 4, valueType)
        data = conversion.stromxMatrixToData(matrix)
        
        refData = {'cols': 4, 
                   'rows': 3, 
                   'values': [[1, 0, 0, 0], 
                              [0, 0, 0, 0], 
                               [0, 0, 0, 0]]}
        self.assertEqual(refData, data)