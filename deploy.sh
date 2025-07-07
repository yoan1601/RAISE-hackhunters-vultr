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

BACKEND_IMAGE=$REGISTRY/backend:$COMMIT_SHA
FRONTEND_IMAGE=$REGISTRY/frontend:$COMMIT_SHA

echo "Building and pushing backend image..."
docker build -t $BACKEND_IMAGE ./backend
docker push $BACKEND_IMAGE

echo "Building and pushing frontend image..."
docker build -t $FRONTEND_IMAGE ./frontend
docker push $FRONTEND_IMAGE

echo "Applying Kubernetes deployments..."

# Export variables for envsubst
export COMMIT_SHA
export REACT_APP_BACKEND_URL="http://${BACKEND_SERVICE_NAME}:${BACKEND_PORT}"

# Process backend deployment
envsubst '$COMMIT_SHA' < k8s/backend-deployment.yaml | kubectl apply -f -

# Process frontend deployment
envsubst '$COMMIT_SHA $REACT_APP_BACKEND_URL' < k8s/frontend-deployment.yaml | kubectl apply -f -

echo "Deployment complete."