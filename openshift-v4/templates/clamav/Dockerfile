FROM artifacts.developer.gov.bc.ca/docker-remote/clamav/clamav:0.105_base
RUN mkdir /run/clamav && \
    chown clamav:clamav /run/clamav && \
    chown clamav:clamav /var/lib/clamav && \
    chmod 750 /run/clamav && \
    chmod 750 /var/lib/clamav
