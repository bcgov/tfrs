FROM artifacts.developer.gov.bc.ca/docker-remote/clamav/clamav:0.105_base
RUN mkdir /run/clamav && \
    chown clamav:clamav /run/clamav && \
    chmod 750 /run/clamav && \
    chown clamav:clamav /var/lib/clamav && \
    chmod 750 /var/lib/clamav

RUN chgrp -R root /var/log/clamav && \
    chmod -R g+w /var/log/clamav && \
    chgrp -R root /var/lib/clamav && \
    chmod -R g+w /var/lib/clamav && \
    chgrp -R root /run/clamav && \
    chmod -R g+w /run/clamav