# -*- coding: utf-8 -*-

from distutils.core import setup
import os
import shutil

if os.path.exists('stromxweb/static'):
    shutil.rmtree('stromxweb/static')
shutil.copytree('../frontend/dist', 'stromxweb/static')

for item in os.listdir('stromxweb/templates'):
    shutil.copy2(os.path.join('stromxweb/templates', item), 'stromxweb/static')

static_files = []

for root, dirs, files in os.walk('stromxweb/static', ):
    relative_root = os.path.relpath(root, 'stromxweb')
    paths = [os.path.join(relative_root, f) for f in files]
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
      scripts=['scripts/stromx_server_start.py',
               'scripts/stromx_server.py'],
      data_files=[('/etc/stromx', ['stromx.conf'])],
      requires=['tornado(>=4.0)', 'daemon(>=1.5)']
)