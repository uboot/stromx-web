# -*- coding: utf-8 -*-

import os

class Files(object):
    def __init__(self, directory):
        self.__directory = directory
        self.__files = {str(index): File(directory, index, name) for index, name 
                        in enumerate(os.listdir(directory))}
        self.__index = len(self.__files)
                        
    @property
    def data(self):
        return {"files": [f.data for f in self.__files.values()]}
    
    def __getitem__(self, index):
        return self.__files[index]
        
    def delete(self, index):
        f = self[index]
        f.delete()
        self.__files.pop(index)
        
    def post(self, data):
        f = File(self.__directory, self.__index, data["file"]["name"])
        self.__files[f.index] = f
        self.__index += 1
        return f.data
    
    def put(self, index, data):
        f = self[index]
        f.put(data)
        return f.data
        
class File(object):
    def __init__(self, directory, index, name):
        self.__directory = directory
        self.__index = str(index)
        self.__name = name
        self.__opened = False
        self.__stream = None
        
    @property
    def data(self):
        return {"id": self.__index, "name": self.__name,
                "opened": self.__opened}
        
    @property
    def index(self):
        return self.__name
        
    @property
    def name(self):
        return self.__name

    def delete(self):
        path = os.path.join(self.__directory, self.name)
        os.remove(path)
        
    def put(self, data):
        self.__opened = data["file"]["opened"]