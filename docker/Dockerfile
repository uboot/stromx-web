FROM ubuntu:14.04

MAINTAINER Matthias Fuchs <matz.fuchs@gmx.at>

RUN apt-get install -y software-properties-common \
    && add-apt-repository ppa:stromx-developers/packages \
    && apt-get update \
    && apt-get install -y curl python-pip python-daemon python-opencv python-stromx git nodejs-legacy npm \
    && pip install tornado

ENV PATH $PATH:./node_modules/.bin

RUN git clone https://gitorious.org/stromx-web/stromx-web.git \
    && cd stromx-web/frontend \
    && npm install \
    && npm install bower \
    && bower --allow-root install \
    && ember build --environment production \
    && cd ../backend \
    && python setup.py build \
    && python setup.py install \ 
    && mkdir /var/stromx \
    && cd ../.. \
    && rm -rf stromx-web

ADD stromx.conf /etc/stromx/
VOLUME /var/stromx

EXPOSE 8080
CMD stromx_server_start.py --config /etc/stromx/stromx.conf
