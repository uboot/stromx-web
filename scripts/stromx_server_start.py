#!/usr/bin/env python

import argparse
import daemon
import os.path
import signal

import stromxweb

def stopServer(signum, frame):
    stromxweb.stop()

parser = argparse.ArgumentParser()
parser.add_argument('directory', help=('the directory in which the stromx '
                                       'stream files will be stored'))
args = parser.parse_args()

files = os.path.abspath(args.directory)
context = daemon.DaemonContext(
    working_directory = files,
    signal_map = { signal.SIGTERM: stopServer }
)

print 'Start stromx web server...'
print 'Files: {0}'.format(files)

with context:
    stromxweb.start('.')