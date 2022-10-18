FROM artifacts.developer.gov.bc.ca/docker-remote/clamav/clamav:0.105_base
RUN cat /init
COPY init /init
RUN mkdir /run/clamav && \
    chmod 777 /run/clamav