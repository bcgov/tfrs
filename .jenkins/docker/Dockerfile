FROM bcgov/jenkins-basic:v1-stable

USER 0

COPY ./contrib/jenkins/configuration $JENKINS_REF_HOME
COPY ./contrib/jenkins/configuration/config.xml $JENKINS_REF_HOME
COPY ./contrib/jenkins/configuration/init.groovy.d/099-setup-tfrs-credentials.groovy $JENKINS_REF_HOME/init.groovy.d
COPY ./contrib/jenkins/configuration/plugins/embeddable-build-status.jpi $JENKINS_REF_HOME/plugins

RUN echo $'\nembeddable-build-status:2.0.2' >> $JENKINS_REF_HOME/plugins.txt

RUN set -x && \
    chgrp -R 0 $JENKINS_REF_HOME && \
    chmod -R 644 $JENKINS_REF_HOME && \
    chmod -R g+rwX $JENKINS_REF_HOME

USER 1001
