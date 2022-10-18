FROM artifacts.developer.gov.bc.ca/docker-remote/clamav/clamav:0.105_base
RUN mkdir /run/clamav && \
    ls -l /run && \
    chmod 777 /run/clamav && \
    ls -l /run && \
    ls -l /var/lib && \
    chmod 777 /var/lib/clamav && \
    ls -l /var/lib && \
    chown root:root /var/lib/clamav && \
    ls -l /var/lib