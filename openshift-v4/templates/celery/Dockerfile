FROM artifacts.developer.gov.bc.ca/docker-remote/python:3.9.15
RUN apt-get update \
    && apt-get install -y git \
    && apt-get install -y supervisor
RUN pwd && ls -l
RUN pip install --upgrade pip \
    && pip install -r backend/requirements.txt
RUN cp security-scan/scan-handler/celery.conf/celery.conf /etc/supervisor/conf.d
RUN chgrp -R root /var/log/supervisor
RUN chmod -R g+w /var/log/supervisor
RUN chmod -R g+w /run || :
RUN chmod -R g+w /app
CMD ["supervisord"]