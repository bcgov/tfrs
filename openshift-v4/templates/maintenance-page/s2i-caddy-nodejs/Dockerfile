# caddy-s2i-builder
FROM registry.redhat.io/rhel8/nodejs-12:latest

USER 0

LABEL maintainer="Jason Leach <jason.leach@fullboar.ca>"

ENV BUILDER_VERSION 1.1
ENV CADDY_VERSION 2.1.1

LABEL io.k8s.description="Platform for building Caddy images" \
     io.k8s.display-name="builder ${BUILDER_VERSION}" \
     io.openshift.expose-services="8080:http" \
     io.openshift.tags="builder,${BUILDER_VERSION},caddy"

# TODO: Install required packages here:
# RUN yum install -y ... && yum clean all -y
# RUN yum install -y rubygems && yum clean all -y
# RUN gem install asdf

RUN curl https://github.com/caddyserver/caddy/releases/download/v${CADDY_VERSION}/caddy_${CADDY_VERSION}_linux_amd64.tar.gz \
    -SL --header "Accept: application/tar+gzip, application/x-gzip, application/octet-stream" | \
    tar -zx -C /usr/bin/ && \
    chmod 0755 /usr/bin/caddy

# This is where the s2i run script will look
# for the default config file.
ADD Caddyfile /opt/app-root/etc/Caddyfile

# Copy the S2I scripts to /usr/libexec/s2i, since openshift/base-centos7
# image sets io.openshift.s2i.scripts-url label that way, or 
# update that label
COPY ./s2i/bin/ /usr/libexec/s2i

RUN chmod -R 775 /opt/app-root/*

USER 1001

EXPOSE 2015
