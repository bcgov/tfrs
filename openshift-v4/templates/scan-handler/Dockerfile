FROM artifacts.developer.gov.bc.ca/docker-remote/python:3.9.15
RUN apt-get update \
    && apt-get install -y git \
    && apt-get install -y supervisor
WORKDIR /app/tfrs
COPY . .
COPY security-scan/scan-handler/scan-handler.conf /etc/supervisor/conf.d
RUN pip install --upgrade pip==24.0 \
  && pip install -r backend/requirements.txt \
  && chgrp -R root /var/log/supervisor \
  && chmod -R g+w /var/log/supervisor \
  && chmod -R g+w /run || : \
  && chmod -R g+w /app
CMD ["supervisord"]