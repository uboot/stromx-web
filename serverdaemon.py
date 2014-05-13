import daemon

from stromxweb import start

context = daemon.DaemonContext(
    working_directory='files'
)

with context:
    start('.')