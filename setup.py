# -*- coding: utf-8 -*-

from distutils.core import setup
import os
import shutil

# collect the client files
static_files = []
for root, dirs, files in os.walk('backend/stromxweb/static', ):
    relative_root = os.path.relpath(root, 'backend/stromxweb')
    paths = [os.path.join(relative_root, f) for f in files]
    static_files.extend(paths)

# collect the example files
stromx_files = [os.path.join('backend/files', f) for f in
                os.listdir('backend/files')]

# collect the data files
data_files = [os.path.join('backend/data', f) for f in
              os.listdir('backend/data')]

setup(name='stromx-web',
      version='0.3',
      description='Web interface to operate stromx streams',
      author='Matthias Fuchs',
      author_email='stromx-devel@googlegroups.com',
      url='http://www.stromx.org',

      packages=['stromxweb'],
      package_data={'stromxweb': static_files},
      package_dir={'stromxweb': 'backend/stromxweb'},
      scripts=['backend/scripts/stromx-server',
               'backend/scripts/stromx_server_start.py'],
      data_files=[('/etc/stromx', ['backend/stromx.conf']),
                  ('/var/stromx', stromx_files),
                  ('/usr/share/stromx-web/data/Chessboard', data_files)],
      requires=['tornado(>=4.0)', 'daemon(>=1.5)']
)
