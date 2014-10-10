# -*- coding: utf-8 -*-

import base64
import cv2
import numpy as np

import stromx.runtime

def isNumber(variant):
    if variant.isVariant(stromx.runtime.DataVariant.INT):
        return True
    elif variant.isVariant(stromx.runtime.DataVariant.BOOL):
        return True
    elif variant.isVariant(stromx.runtime.DataVariant.TRIGGER):
        return True
    else:
        return False
    
def isString(variant):
    if variant.isVariant(stromx.runtime.DataVariant.STRING):
        return True
    else:
        return False
    
def hasStringRepresentation(variant):
    if variant.isVariant(stromx.runtime.DataVariant.STRING):
        return True
    elif variant.isVariant(stromx.runtime.DataVariant.MATRIX):
        return True
    elif variant.isVariant(stromx.runtime.DataVariant.IMAGE):
        return True
    else:
        return False
    
def toPythonObserverValue(variant, data):
    if variant.isVariant(stromx.runtime.DataVariant.IMAGE):
        return stromxImageToData(data)
    else:
        return toPythonValue(variant, data)
    
def toPythonValue(variant, data):
    if data.variant().isVariant(stromx.runtime.DataVariant.NONE):
        return None
    
    if variant.isVariant(stromx.runtime.DataVariant.INT):
        return int(data.get())
    elif variant.isVariant(stromx.runtime.DataVariant.FLOAT):
        return float(data.get())
    elif variant.isVariant(stromx.runtime.DataVariant.BOOL):
        return bool(data.get())
    elif variant.isVariant(stromx.runtime.DataVariant.STRING):
        return str(data.get())
    elif variant.isVariant(stromx.runtime.DataVariant.TRIGGER):
        return 0
    elif variant.isVariant(stromx.runtime.DataVariant.IMAGE):
        return "{0} x {1}".format(data.width(), data.height())
    elif variant.isVariant(stromx.runtime.DataVariant.MATRIX):
        return "{0} x {1}".format(data.rows(), data.cols())
    else:
        return 0
       
def toStromxData(variant, value):
    if variant.isVariant(stromx.runtime.DataVariant.BOOL):
        return stromx.runtime.Bool(bool(value))
    elif variant.isVariant(stromx.runtime.DataVariant.ENUM):
        return stromx.runtime.Enum(value)
    elif variant.isVariant(stromx.runtime.DataVariant.UINT_8):
        return stromx.runtime.UInt8(value)
    elif variant.isVariant(stromx.runtime.DataVariant.UINT_16):
        return stromx.runtime.UInt16(value)
    elif variant.isVariant(stromx.runtime.DataVariant.UINT_32):
        return stromx.runtime.UInt32(value)
    elif variant.isVariant(stromx.runtime.DataVariant.INT_8):
        return stromx.runtime.Int8(value)
    elif variant.isVariant(stromx.runtime.DataVariant.INT_16):
        return stromx.runtime.Int16(value)
    elif variant.isVariant(stromx.runtime.DataVariant.INT_32):
        return stromx.runtime.Int32(value)
    elif variant.isVariant(stromx.runtime.DataVariant.FLOAT_32):
        return stromx.runtime.Float32(value)
    elif variant.isVariant(stromx.runtime.DataVariant.FLOAT_64):
        return stromx.runtime.Float64(value)
    elif variant.isVariant(stromx.runtime.DataVariant.STRING):
        return stromx.runtime.String(str(value))
    elif variant.isVariant(stromx.runtime.DataVariant.TRIGGER):
        return stromx.runtime.TriggerData()
    else:
        return None
    
def variantToString(variant):
    if variant.isVariant(stromx.runtime.DataVariant.FLOAT):
        return 'float'
    elif variant.isVariant(stromx.runtime.DataVariant.TRIGGER):
        return 'trigger'
    elif variant.isVariant(stromx.runtime.DataVariant.ENUM):
        return 'enum'
    elif variant.isVariant(stromx.runtime.DataVariant.INT):
        return 'int'
    elif variant.isVariant(stromx.runtime.DataVariant.BOOL):
        return 'bool'
    elif variant.isVariant(stromx.runtime.DataVariant.STRING):
        return 'string'
    elif variant.isVariant(stromx.runtime.DataVariant.IMAGE):
        return 'image'
    elif variant.isVariant(stromx.runtime.DataVariant.MATRIX):
        return 'matrix'
    else:
        return 'none'
    
def stromxImageToData(image):
    array = np.frombuffer(image.data(), dtype=np.ubyte)
    array = array.reshape((image.width(), image.height(), image.pixelSize()))
    _, jpg = cv2.imencode('.jpg', array)
    data = "data:image/jpg;base64,{0}".format(
                                base64.encodestring(jpg.data).replace("\n", ""))
    return data

def stromxColorToString(color):
    return '#{0:02x}{1:02x}{2:02x}'.format(color.r(), color.g(), color.b())

def stringToStromxColor(string):
    red = int(string[1:3], 16)
    green = int(string[3:5], 16)
    blue = int(string[5:], 16)
    return stromx.runtime.Color(red, green, blue)