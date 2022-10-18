FROM artifacts.developer.gov.bc.ca/docker-remote/clamav/clamav:0.105_base
RUN ls -l /run
COPY init /init
RUN mkdir /run/clamav && \
    chmod 777 /run/clamav