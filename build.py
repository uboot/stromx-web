# -*- coding: utf-8 -*-

import os
import shutil
import subprocess
import string

VERSION = '0.1.0'

# try to get the git SHA of this repository
try:
    sha = subprocess.check_output(['git', 'rev-parse', 'HEAD'])
    sha = sha[:6].decode()
    print('Git SHA: {0}'.format(sha))
except (OSError, subprocess.CalledProcessError):
    print('Failed to obtain git SHA of repository')
    sha = ''
    
# setup a version file
with open('backend/stromxweb/version.py.in') as f:
    template = string.Template(f.read())
with open('backend/stromxweb/version.py', 'w') as f:
    f.write(template.substitute(versionString='{0}-{1}'.format(VERSION, sha)))
    
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
