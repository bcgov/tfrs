FROM httpd:2.4.46
COPY ./httpd.conf /usr/local/apache2/conf/httpd.conf
COPY ./public-html/ /usr/local/apache2/htdocs/
RUN chgrp -R root /usr/local/apache2/logs \
    && chmod -R g+w /usr/local/apache2/logs