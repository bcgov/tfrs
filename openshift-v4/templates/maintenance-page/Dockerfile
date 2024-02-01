FROM artifacts.developer.gov.bc.ca/docker-remote/httpd:2.4.46
COPY ./httpd.conf /usr/local/apache2/conf/httpd.conf
COPY ./public-html/ /usr/local/apache2/htdocs/
RUN chgrp -R root /usr/local/apache2/logs \
    && chmod -R g+w /usr/local/apache2/logs
RUN apt-get install curl
RUN which curl
RUN curl --silent -L -o /tmp/oc.tar https://downloads-openshift-console.apps.silver.devops.gov.bc.ca/arm64/linux/oc.tar
WORKDIR /tmp
RUN tar xvf oc.tar && \
    cp oc /bin