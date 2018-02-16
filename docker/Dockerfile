FROM ubuntu:17.10

MAINTAINER Matthias Fuchs <matz.fuchs@gmx.at>

RUN apt-get update \
    && apt-get install -y software-properties-common \
    && add-apt-repository ppa:stromx-developers/packages \
    && apt-get update \
    && apt-get install -y curl npm python3-tornado python3-daemon python3-opencv python3-stromx libstromx-opencv libstromx-zbar git

RUN git clone https://github.com/uboot/stromx-web.git \
    && cd stromx-web \
    && python3 build.py \
    && python3 setup.py install \
    && cd .. \
    && rm -rf stromx-web \
    && chmod a+rwx -R /var/stromx

EXPOSE 8080
CMD stromx_server_start.py --config /etc/stromx/stromx.conf
