# -*- coding: utf-8 -*-

import os

class Files(object):
    def __init__(self, directory):
        self.__directory = directory
        self.__files = {str(index): File(index, name) for index, name 
                        in enumerate(os.listdir(directory))}
        self.__index = len(self.__files)
                        
    @property
    def data(self):
        return {"files": [f.data for f in self.__files.values()]}
        
    def delete(self, index):
        f = self.__files[index]
        path = os.path.join(self.__directory, f.name)
        os.remove(path)
        self.__files.pop(index)
        
    def post(self, data):
        f = File(self.__index, data["file"]["name"])
        self.__files[f.index] = f
        self.__index += 1
        return f.data
        
class File(object):
    def __init__(self, index, name):
        self.__index = str(index)
        self.__name = name
        
    @property
    def data(self):
        return {"id": self.__index, "name": self.__name}
        
    @property
    def index(self):
        return self.__name
        
    @property
    def name(self):
        return self.__name
