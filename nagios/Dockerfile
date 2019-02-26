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
RUN htpasswd -bc /etc/nagios3/htpasswd.users nagiosadmin password
ADD .kube /var/lib/nagios/.kube
RUN chown -R nagios.nagios /var/lib/nagios/.kube
# USER nagios
RUN chgrp -R root /var/log/supervisor
RUN chmod -R g+w /var/log/supervisor
CMD supervisord
