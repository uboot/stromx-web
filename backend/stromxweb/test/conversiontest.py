# -*- coding: utf-8 -*-

import stromx.cvsupport
import stromx.runtime
import stromx.test
import unittest

import conversion

_colorImage = (
"""
data:image/jpg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAg
ICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAw
UKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCA
ANAAwDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAw
UFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NT
Y3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6
ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQ
EBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcR
MiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZG
VmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0t
PU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwCz8GfHXgq8+LB8D+L9Kk119cs2n1
BvO8pdOjfb/pZdfm3Nldir/ErbtqbmqK1/Z00H9qeSf4wa34g8aQ2N3N9m8PQQX8kMi2EKiNHm+zoEZ5
XWWcf3Y5o0HCCvNfgvp51T9rq88O6jcyNY6RHNH5MEjRm4hNtZR+W7Kc8clW6rnjFd/wCLP20fjT+zBq
rfBv4Mapb2GjaRJNbql5ZQ3LyNFPJAr7nTK/uoolxzypP8VfL1cLVw1WNHApOpyxd3ppKPM/0+4/prF1
8TiYrERfxOSSbsrRdul9T/2Q==
""")

_grayImage = (
"""
data:image/jpg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAg
ICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/wAALCAANAAwBAREA/8
QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBR
IhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVF
VWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxM
XGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/9oACAEBAAA/AMj4I+OPA958W28E+NNJk1
5tes2l1Bmm8tdNR9v+ls6/NubK7FX+JTu2puai0/Zt0L9qp5/jFq+u+NUsLub7N4dhj1GSGVbCFVjR5v
sybGeV1lnHdY5o06IteZfB3TRqH7XV14b1K4d7HR0lTyYXaI3EP2WxTy3ZTnjJKt1XPFeh+Lf22Pjb+y
1qf/CmfgtqVpYaLpLzW6R31hDdO5huJbdW3OmV/dQxDHqpP8Vf/9k=
""")

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
        
    def testStromxMatrixToDataInt32(self):
        valueType = stromx.cvsupport.Matrix.ValueType.INT_32
        matrix = stromx.cvsupport.Matrix.eye(3, 4, valueType)
        data = conversion.stromxMatrixToData(matrix)
        refData = {'rows': 3,
                   'cols': 4,
                   'values': [[1, 0, 0, 0], 
                              [0, 1, 0, 0], 
                              [0, 0, 1, 0]]}
        self.assertEqual(refData, data)
        
    def testStromxListToData(self):
        stream = stromx.runtime.Stream()
        op = stream.addOperator(stromx.test.TestDataOperator())
        stream.initializeOperator(op)
        
        DATA_TYPE = 0
        MATRIX_FLOAT_32 = 5
        OBJECT_TYPE = 1
        POLYGONS = 4
        op.setParameter(DATA_TYPE, stromx.runtime.Enum(MATRIX_FLOAT_32))
        op.setParameter(OBJECT_TYPE, stromx.runtime.Enum(POLYGONS))
        stream.start()
        
        container = op.getOutputData(0)
        value = stromx.runtime.ReadAccess(container).get()
        
        data = conversion.stromxListToData(value)
        self.assertEqual(6, data['numItems'])
        self.assertEqual(6, len(data['values']))   

        for value in data['values']:
            self.assertEqual('matrix', value['variant']['ident'])
            self.assertEqual(32, value['value']['rows'])
            self.assertEqual(2, value['value']['cols'])
            
        value = data['values'][0]
        self.assertAlmostEqual(78.27293396, value['value']['values'][1][0])
        self.assertAlmostEqual(56.86110687, value['value']['values'][2][1])
        
    def testStromxMatrixToDataFloat32(self):
        valueType = stromx.cvsupport.Matrix.ValueType.FLOAT_32
        matrix = stromx.cvsupport.Matrix.eye(3, 4, valueType)
        data = conversion.stromxMatrixToData(matrix)
        
        refData = {'cols': 4, 
                   'rows': 3, 
                   'values': [[1, 0, 0, 0], 
                              [0, 1, 0, 0], 
                              [0, 0, 1, 0]]}
        self.assertEqual(refData, data)
        
    def testDataToStromxImageColor(self):
        image = conversion.dataToStromxImage({'values': _colorImage})
        self.assertEqual(12, image.width())
        self.assertEqual(13, image.height())
        self.assertEqual(stromx.runtime.Image.PixelType.BGR_24,
                         image.pixelType())
        
    def testDataToStromxImageGray(self):
        image = conversion.dataToStromxImage({'values': _grayImage})
        self.assertEqual(12, image.width())
        self.assertEqual(13, image.height())
        self.assertEqual(stromx.runtime.Image.PixelType.MONO_8,
                         image.pixelType())