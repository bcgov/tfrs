FROM docker-registry.default.svc:5000/mem-tfrs-tools/nagios-base:latest
EXPOSE 8080
RUN mkdir /var/run/apache2-supervisord
RUN chown -R nagios.nagios /var/run/apache2-supervisord
RUN mkdir /var/run/supervisord
RUN chown -R nagios.nagios /var/run/supervisord
RUN mkdir /docroot
RUN chown -R nagios.nagios /docroot
WORKDIR /
ADD docroot /docroot
ADD apache2 /etc/apache2
ADD supervisord /etc
# remove the default configuration
RUN rm -fr /etc/nagios3
RUN mkdir /etc/nagios3
ADD nagios3 /etc/nagios3
RUN chown -R nagios.nagios /etc/nagios3
ARG NAGIOS_USER
ARG NAGIOS_PASSWORD
RUN echo $NAGIOS_USER
RUN htpasswd -bc /etc/nagios3/htpasswd.users $NAGIOS_USER $NAGIOS_PASSWORD
ADD .kube /var/lib/nagios/.kube
RUN chown -R nagios.nagios /var/lib/nagios/.kube
# USER nagios
RUN chgrp -R root /var/log/supervisor
RUN chmod -R g+w /var/log/supervisor
RUN chgrp -R root /run/supervisord
RUN chmod -R g+w /run/supervisord
RUN chgrp -R root /run/apache2
RUN chmod -R g+w /run/apache2
RUN chgrp -R root /run/apache2-supervisord
RUN chmod -R g+w /run/apache2-supervisord
RUN chgrp -R root /run/nagios3
RUN chmod -R g+w /run/nagios3
RUN chgrp -R root /etc/nagios3
RUN chmod -R g+w /etc/nagios3
RUN chgrp -R root /var/cache/nagios3
RUN chmod -R g+w /var/cache/nagios3
RUN chgrp -R root /var/lib/nagios3
RUN chmod -R g+w /var/lib/nagios3
RUN mkdir /.kube
RUN chgrp -R root /.kube
RUN chmod -R g+w /.kube
CMD supervisord