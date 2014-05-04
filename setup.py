# -*- coding: utf-8 -*-

from distutils.core import setup

setup(name='stromx-web',
      version='0.1',
      description='Web interface to operate stromx streams',
      author='Matthias Fuchs',
      author_email='stromx-devel@googlegroups.com',
      url='http://www.stromx.org',
      py_modules=['model', 'server'],
)