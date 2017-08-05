# -*- coding: utf-8 -*-

import os
import shutil
import subprocess

# build the client
os.chdir('frontend')
if os.path.exists('dist'):
    shutil.rmtree('dist')
env = os.environ.copy()
subprocess.call(['npm', 'install'])
subprocess.call(['node', './node_modules/.bin/ember', 'build', '--environment=production'])
os.chdir('..')

# copy the client
if os.path.exists('backend/stromxweb/static'):
    shutil.rmtree('backend/stromxweb/static')
shutil.copytree('frontend/dist', 'backend/stromxweb/static')
