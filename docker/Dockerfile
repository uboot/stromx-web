FROM ubuntu:16.04

MAINTAINER Matthias Fuchs <matz.fuchs@gmx.at>

RUN apt-get update \
    && apt-get install -y software-properties-common \
    && add-apt-repository ppa:stromx-developers/packages \
    && curl -sL https://deb.nodesource.com/setup_6.x | bash - \
    && apt-get update \
    && apt-get install -y curl nodejs python-pip python-daemon python-opencv python-stromx libstromx-opencv libstromx-zbar git \
    && pip install tornado

RUN git clone https://github.com/uboot/stromx-web.git \
    && cd stromx-web \
    && python setup.py build \
    && python setup.py install \
    && mkdir /var/stromx \
    && cd .. \
    && rm -rf stromx-web

ADD stromx.conf /etc/stromx/
ADD files/*.stromx /var/stromx/
ADD data/chess*.png /usr/share/stromx-web/data/Chessboard/

VOLUME /var/stromx

EXPOSE 8080
CMD stromx_server_start.py --config /etc/stromx/stromx.conf
