# -*- coding: utf-8 -*-

from distutils.core import setup

setup(name='stromx-web',
      version='0.1',
      description='Web interface to operate stromx streams',
      author='Matthias Fuchs',
      author_email='stromx-devel@googlegroups.com',
      url='http://www.stromx.org',
      packages=['stromxweb'],
      package_data={'stromxweb': ['static/*',
                                  'static/css/*',
                                  'static/fonts/*',
                                  'static/js/*',
                                  'static/js/controllers/*',
                                  'static/js/libs/*',
                                  'static/js/models/*',
                                  'static/js/views/*']},
      requires=['tornado(>=3.0)']
)