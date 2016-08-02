
import unittest

import model
import stromx
import stromx.runtime
       
class RegressionTest(unittest.TestCase):
    def setUp(self):
        self.model = model.Model()
        
        fileModel = model.File("", self.model)
        self.stream = self.model.streams.addFile(fileModel)
        self.stromxStream = self.stream.stromxStream
        
        self.factory = stromx.runtime.Factory()
        stromx.register('libstromx_cvsupport.so.0.8.0', self.factory)
        
    def testDummyCameraOutputToParameter(self):
        kernel = self.factory.newOperator('cv::support', 'DummyCamera')
        stromxOp = self.stromxStream.addOperator(kernel)
        stromxOp.setParameter(2, stromx.runtime.Bool(True))
        self.stromxStream.initializeOperator(stromxOp)
        self.model.operators.addStromxOp(stromxOp, self.stream)
        
        index = self.model.outputs['1']
        index.set({'output': {'currentType': 'parameter', 
                              'behavior': 'persistent'}})
        indexParam = self.model.parameters['17']
        
        self.assertEqual('Index', indexParam.data['parameter']['title'])
        
        output = self.model.outputs['0']
        output.set({'output': {'currentType': 'parameter', 
                               'behavior': 'persistent'}})
        outputParam = self.model.parameters['18']
        
        self.assertEqual('Output', outputParam.data['parameter']['title'])
        self.assertEqual('Index', indexParam.data['parameter']['title'])
        
