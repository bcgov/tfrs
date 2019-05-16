FROM python:3.7-stretch
ENV PYTHONUNBUFFERED 1
EXPOSE 2500
RUN mkdir /app
WORKDIR /app
ADD . /app
ENTRYPOINT python3 smtplogger.py
