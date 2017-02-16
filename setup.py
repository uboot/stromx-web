# -*- coding: utf-8 -*-

from distutils.core import setup
import os
import shutil
import subprocess

# build the client
os.chdir('frontend')
if os.path.exists('dist'):
    shutil.rmtree('dist')
env = os.environ.copy()
subprocess.call(['npm', 'install'])
subprocess.call(['./node_modules/.bin/bower', 'install'], shell=True)
subprocess.call(['./node_modules/.bin/ember', 'build', '--environment', 'production'], shell=True)
os.chdir('..')

# copy the client
if os.path.exists('backend/stromxweb/static'):
    shutil.rmtree('backend/stromxweb/static')
shutil.copytree('frontend/dist', 'backend/stromxweb/static')

# collect the client file
static_files = []
for root, dirs, files in os.walk('backend/stromxweb/static', ):
    relative_root = os.path.relpath(root, 'backend/stromxweb')
    paths = [os.path.join(relative_root, f) for f in files]
    static_files.extend(paths)

setup(name='stromx-web',
      version='0.3',
      description='Web interface to operate stromx streams',
      author='Matthias Fuchs',
      author_email='stromx-devel@googlegroups.com',
      url='http://www.stromx.org',
      
      packages=['stromxweb'],
      package_data={'stromxweb': static_files},
      package_dir={'stromxweb': 'backend/stromxweb'},
      scripts=['backend/scripts/stromx_server_start.py',
               'backend/scripts/stromx_server.py'],
      data_files=[('/etc/stromx', ['backend/stromx.conf'])],
      requires=['tornado(>=4.0)', 'daemon(>=1.5)']
)
