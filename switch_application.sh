#!/bin/bash

# Define application names and paths
TFRS_COMPOSE_FILE="docker-compose.yml"
REDIS_SERVICE="redis"
RABBITMQ_SERVICE="rabbit"

# Define a default path for LCFS_COMPOSE_DIR (change this to the actual default path if known)
DEFAULT_LCFS_COMPOSE_DIR="/path/to/default/lcfs-repo"
LCFS_COMPOSE_DIR="${LCFS_COMPOSE_DIR:-$DEFAULT_LCFS_COMPOSE_DIR}"

# Check if LCFS_COMPOSE_DIR is valid, otherwise prompt the user
if [ ! -d "$LCFS_COMPOSE_DIR" ]; then
    echo "Default LCFS directory not found. Please provide the path to the LCFS repository directory:"
    read -rp "LCFS directory path: " LCFS_COMPOSE_DIR
fi

# Validate LCFS directory and compose file
LCFS_COMPOSE_FILE="$LCFS_COMPOSE_DIR/docker-compose.yml"
if [ ! -f "$LCFS_COMPOSE_FILE" ]; then
    echo "Error: docker-compose.yml not found in the specified LCFS directory."
    exit 1
fi

# Function to start TFRS and stop LCFS
start_tfrs() {
    echo "Stopping LCFS application if it's running..."
    # Bring down LCFS containers entirely to release resources
    docker-compose -f "$LCFS_COMPOSE_FILE" down
    echo "Starting TFRS application..."
    # Start TFRS containers
    docker-compose -f "$TFRS_COMPOSE_FILE" up -d
    echo "TFRS application is running."
}

# Function to start LCFS and stop TFRS
start_lcfs() {
    echo "Stopping TFRS application if it's running..."
    # Bring down TFRS containers entirely to release resources
    docker-compose -f "$TFRS_COMPOSE_FILE" down
    echo "Starting LCFS application..."
    # Start LCFS containers
    docker-compose -f "$LCFS_COMPOSE_FILE" up -d
    echo "LCFS application is running."
}

# Function to check and ensure Redis is running
check_redis() {
    echo "Ensuring Redis is running..."
    # Start Redis if it's not already running
    if ! docker ps --filter "name=$REDIS_SERVICE" --filter "status=running" | grep -q "$REDIS_SERVICE"; then
        echo "Starting Redis service..."
        docker-compose -f "$LCFS_COMPOSE_FILE" up -d $REDIS_SERVICE
    else
        echo "Redis is already running."
    fi
}

# Function to check and ensure RabbitMQ is running
check_rabbitmq() {
    echo "Ensuring RabbitMQ is running..."
    # Start RabbitMQ if it's not already running
    if ! docker ps --filter "name=$RABBITMQ_SERVICE" --filter "status=running" | grep -q "$RABBITMQ_SERVICE"; then
        echo "Starting RabbitMQ service..."
        docker-compose -f "$TFRS_COMPOSE_FILE" up -d $RABBITMQ_SERVICE
    else
        echo "RabbitMQ is already running."
    fi
}

# Main script logic
if [ -z "$1" ]; then
    echo "Usage: $0 <application_name>"
    echo "Please specify either 'tfrs' or 'lcfs' as the application name."
    exit 1
fi

APPLICATION=$1

# Switch application based on input
case "$APPLICATION" in
    tfrs)
        start_tfrs
        ;;
    lcfs)
        start_lcfs
        ;;
    *)
        echo "Invalid application name. Please specify either 'tfrs' or 'lcfs'."
        exit 1
        ;;
esac

# Check Redis and RabbitMQ pods
check_redis
check_rabbitmq
