#!/bin/bash
set -e

# Variables
COMMIT_SHA=$1
if [ -z "$COMMIT_SHA" ]; then
    echo "Error: Commit SHA is required. Pass it as the first argument."
    exit 1
fi

REGISTRY=ghcr.io/yoan1601
BACKEND_SERVICE_NAME="backend-service" # Name of the Kubernetes service for the backend
BACKEND_PORT="8000" # Port the backend service exposes

echo "Applying Kubernetes deployments..."

# Export variables for envsubst
export COMMIT_SHA

# Process backend deployment
envsubst '$COMMIT_SHA' < k8s/backend-deployment.yaml | kubectl apply -f -

# Process frontend deployment
envsubst '$COMMIT_SHA' < k8s/frontend-deployment.yaml | kubectl apply -f -

echo "Deployment complete."