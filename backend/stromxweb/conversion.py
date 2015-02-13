# -*- coding: utf-8 -*-

import base64
import cv2
import io
import numpy as np
import re

import stromx.runtime
import stromx.cvsupport

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
    elif variant.isVariant(stromx.runtime.DataVariant.MATRIX):
        return stromxMatrixToData(data)
    elif variant.isVariant(stromx.runtime.DataVariant.LIST):
        return stromxListToData(data)
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
        return {'width': data.width(), 'height': data.height() }
    elif variant.isVariant(stromx.runtime.DataVariant.MATRIX):
        return {'rows': data.rows(), 'cols': data.cols() }
    elif variant.isVariant(stromx.runtime.DataVariant.LIST):
        return {'numItems': len(data.content()) }
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
    elif variant.isVariant(stromx.runtime.DataVariant.IMAGE):
        return dataToStromxImage(value)
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
    elif variant.isVariant(stromx.runtime.DataVariant.LIST):
        return 'list'
    else:
        return 'none'
    
def stromxImageToData(image):
    array = np.asarray(image.data())
    rows = image.rows()
    cols = image.cols()
    
    if not image.variant().isVariant(stromx.runtime.DataVariant.MONO_IMAGE):
        array = array.reshape((rows, cols / 3, 3))
    _, jpg = cv2.imencode('.jpg', array)
    values = 'data:image/jpg;base64,{0}'.format(
                                base64.encodestring(jpg.data).replace("\n", ""))
    data = {
        'width': image.width(),
        'height': image.height(),
        'values': values
    }
    
    return data

def stromxMatrixToData(matrix):
    array = np.asarray(matrix.data())
    
    data = {
        'rows': matrix.rows(),
        'cols': matrix.cols(),
        'values': array.tolist()
    }
    
    return data

def stromxListToData(list):
    values = []
    for item in list.content():
        value = {
            'variant': {
                'ident': variantToString(item.variant())
            },
            'value': toPythonObserverValue(item.variant(), item)
        }
        values.append(value)
    
    return { 'numItems': len(values), 'values': values }

def dataToStromxImage(data):
    content = re.sub("data:.*;base64,", "", data['values'], re.MULTILINE)
    buf = np.frombuffer(base64.decodestring(content), dtype = np.uint8)
    array = cv2.imdecode(buf, cv2.IMREAD_UNCHANGED)
    
    if len(array.shape) == 3 and array.shape[2] == 3:
        image = stromx.cvsupport.Image(array.shape[1], array.shape[0],
                                       stromx.runtime.Image.PixelType.BGR_24)
        imageData = np.asarray(image.data())
        imageData[:, :] = array.reshape(array.shape[0], array.shape[1] * 3)
    elif len(array.shape) == 2:
        image = stromx.cvsupport.Image(array.shape[1], array.shape[0],
                                       stromx.runtime.Image.PixelType.MONO_8)
        imageData = np.asarray(image.data())
        imageData[:, :] = array.reshape(array.shape[0], array.shape[1])
    else:
        assert(False)
    return image

def stromxColorToString(color):
    return '#{0:02x}{1:02x}{2:02x}'.format(color.r(), color.g(), color.b())

def stringToStromxColor(string):
    red = int(string[1:3], 16)
    green = int(string[3:5], 16)
    blue = int(string[5:], 16)
    return stromx.runtime.Color(red, green, blue)