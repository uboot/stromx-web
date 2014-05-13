import daemon

from stromxweb import start

context = daemon.DaemonContext(
    working_directory=''
)

with context:
    start(".")