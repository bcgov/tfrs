#!/bin/bash

# Start Gunicorn processes
echo Starting Gunicorn.
exec gunicorn wsgi:application \
        --bind 0.0.0.0:9000 \
        --workers 3
