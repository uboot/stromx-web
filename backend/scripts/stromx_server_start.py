#!/usr/bin/env python

import argparse
import stromxweb

parser = argparse.ArgumentParser()
parser.add_argument('directory', help=('the directory in which the stromx '
                                       'stream files will be stored'))
args = parser.parse_args()

stromxweb.start(args.directory)