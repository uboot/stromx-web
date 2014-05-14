#!/usr/bin/env python

from daemon import runner
import signal

import stromxweb

def stopServer(signum, frame):
    stromxweb.stop()

signal.signal(signal.SIGTERM, stopServer)

class App():
    def __init__(self):
        self.pidfile_path =  '/tmp/stromxweb.pid'
        self.pidfile_timeout = 5
        
    def run(self):
        stromxweb.start('/tmp/stromx-web')

app = App()
daemon_runner = runner.DaemonRunner(app)
daemon_runner.do_action()
