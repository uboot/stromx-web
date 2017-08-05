#!/usr/bin/env python

from daemon import runner
import signal

import stromxweb

def stopServer(signum, frame):
    stromxweb.stop()

class App():
    def __init__(self):
        self.pidfile_path = '/tmp/stromxweb.pid'
        self.pidfile_timeout = 5
        self.stdin_path = '/dev/null'
        self.stdout_path = '/dev/tty'
        self.stderr_path = '/dev/tty'
 
    def run(self):
        signal.signal(signal.SIGTERM, stopServer)
        stromxweb.start('/etc/stromx/stromx.conf')

app = App()
daemon_runner = runner.DaemonRunner(app)
daemon_runner.do_action()
