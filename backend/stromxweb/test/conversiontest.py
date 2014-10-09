# -*- coding: utf-8 -*-

import unittest

import conversion

import cv2
import base64
import numpy as np
import stromx.cvsupport

class ConversionTest(unittest.TestCase):
    def testStromxImageToNumpyArrayColor(self):
        stromxImage = stromx.cvsupport.Image('data/image/lenna.jpg')
        array = np.frombuffer(stromxImage.data(), dtype=np.ubyte)
        image = array.reshape((stromxImage.width(), stromxImage.height(), 3))
        _, jpg = cv2.imencode('.jpg', image)
        data = "data:image/jpg;base64,{0}".format(
                                base64.encodestring(jpg.data).replace("\n", ""))
        
        print data