# -*- coding: utf-8 -*-

import stromx.cvsupport
import unittest

import conversion

class ConversionTest(unittest.TestCase):
    def testStromxImageToDataColor(self):
        stromxImage = stromx.cvsupport.Image('data/image/lenna.jpg')
        data = conversion.stromxImageToData(stromxImage)
        self.assertEqual('data:image/jpg;base64,/9j/4AAQ', data[:30])
        self.assertEqual('oKCgoKCgoKCgoKCgoKCgoKCgoKCgoK', data[200:230])
        
    def testStromxImageToDataGrayscale(self):
        grayscale = stromx.cvsupport.Image.Conversion.GRAYSCALE
        stromxImage = stromx.cvsupport.Image('data/image/lenna.jpg', grayscale)
        data = conversion.stromxImageToData(stromxImage)
        self.assertEqual('data:image/jpg;base64,/9j/4AAQ', data[:30])
        self.assertEqual('oL/8QAtRAAAgEDAwIEAwUFBAQAAAF9', data[200:230])