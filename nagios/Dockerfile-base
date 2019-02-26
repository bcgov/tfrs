FROM debian:jessie
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install nagios3 monitoring-plugins-standard monitoring-plugins-basic supervisor vim net-tools curl git jq exim4 -y
RUN curl --silent -L -o /tmp/oc.tgz https://github.com/openshift/origin/releases/download/v3.11.0/openshift-origin-client-tools-v3.11.0-0cbc58b-linux-64bit.tar.gz
WORKDIR /tmp
RUN tar xzf oc.tgz
RUN cp openshift-origin-client-tools-v3.11.0-0cbc58b-linux-64bit/oc /bin

