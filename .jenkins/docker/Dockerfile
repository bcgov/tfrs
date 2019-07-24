FROM bcgov/jenkins-basic:v1-stable

USER 0

COPY ./contrib/jenkins/configuration $JENKINS_REF_HOME
COPY ./contrib/jenkins/configuration/config.xml /var/lib/jenkins
COPY ./contrib/jenkins/configuration/init.groovy.d/099-setup-tfrs-credentials.groovy /var/lib/jenkins/init.groovy.d

RUN set -x && \
    chgrp -R 0 $JENKINS_REF_HOME && \
    chmod -R 644 $JENKINS_REF_HOME && \
    chmod -R g+rwX $JENKINS_REF_HOME

USER 1001
