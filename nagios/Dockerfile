FROM docker-registry.default.svc:5000/mem-tfrs-tools/nagios-base:latest
EXPOSE 8080
RUN mkdir /var/run/apache2-supervisord \
    && chown -R nagios.nagios /var/run/apache2-supervisord \
    && mkdir /var/run/supervisord \
    && chown -R nagios.nagios /var/run/supervisord \
    && mkdir /docroot \
    && chown -R nagios.nagios /docroot
WORKDIR /
ADD docroot /docroot
ADD apache2 /etc/apache2
ADD supervisord /etc
# remove the default configuration
RUN rm -fr /etc/nagios3 \
    && mkdir /etc/nagios3
ADD nagios3 /etc/nagios3
RUN chown -R nagios.nagios /etc/nagios3
ARG NAGIOS_USER
ARG NAGIOS_PASSWORD
ARG ENV_NAME
RUN /etc/nagios3/cleanup-cfg.sh $ENV_NAME
RUN echo $NAGIOS_USER \
    && htpasswd -bc /etc/nagios3/htpasswd.users $NAGIOS_USER $NAGIOS_PASSWORD
ADD .kube /var/lib/nagios/.kube
RUN chown -R nagios.nagios /var/lib/nagios/.kube \
    && chgrp -R root /var/log/supervisor \
    && chmod -R g+w /var/log/supervisor \
    && chgrp -R root /var/log/apache2 \
    && chmod -R g+w /var/log/apache2 \
    && chgrp -R root /run/supervisord \
    && chmod -R g+w /run/supervisord \
    && chgrp -R root /run/apache2 \
    && chmod -R g+w /run/apache2 \
    && chgrp -R root /run/apache2-supervisord \
    && chmod -R g+w /run/apache2-supervisord \
    && chgrp -R root /run/nagios3 \
    && chmod -R g+w /run/nagios3 \
    && chgrp -R root /etc/nagios3 \
    && chmod -R g+w /etc/nagios3 \
    && chgrp -R root /var/cache/nagios3 \
    && chmod -R g+w /var/cache/nagios3 \
    && chgrp -R root /var/lib/nagios3 \
    && chmod -R g+w /var/lib/nagios3 \
    && chgrp -R root /var/log/nagios3 \
    && chmod -R g+w /var/log/nagios3 \
    && mkdir /.kube \
    && chgrp -R root /.kube \
    && chmod -R g+w /.kube
CMD supervisord