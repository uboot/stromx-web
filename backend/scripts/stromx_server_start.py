#!/usr/bin/env python3

import argparse
import stromxweb

parser = argparse.ArgumentParser()
parser.add_argument('--config',
                    help = ('the configuration file for the stromx server'),
                    default = 'stromx.conf')
args = parser.parse_args()

stromxweb.start(args.config)
