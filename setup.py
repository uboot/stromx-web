# -*- coding: utf-8 -*-

from distutils.core import setup
import os

static_files = []

for root, dirs, files in os.walk('stromxweb/static', ):
    relative_root = os.path.relpath(root, 'stromxweb')
    paths = [os.path.join(relative_root, file) for file in files]
    static_files.extend(paths)

print static_files
setup(name='stromx-web',
      version='0.1',
      description='Web interface to operate stromx streams',
      author='Matthias Fuchs',
      author_email='stromx-devel@googlegroups.com',
      url='http://www.stromx.org',
      packages=['stromxweb'],
      package_data={'stromxweb': static_files},
      requires=['tornado(>=3.0)']
)