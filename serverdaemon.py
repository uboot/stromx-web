import daemon

from server import start

context = daemon.DaemonContext(
    working_directory=''
)

with context:
    start()