#!/bin/bash
set -e

# Variables
REGISTRY=ghcr.io/yoan1601
COMMIT_SHA=$1
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
envsubst < k8s/backend-deployment.yaml | kubectl apply -f -

# Process frontend deployment
envsubst < k8s/frontend-deployment.yaml | kubectl apply -f -

echo "Deployment complete."