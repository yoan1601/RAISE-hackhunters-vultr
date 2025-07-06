#!/bin/bash
set -e

# Variables
REGISTRY=ghcr.io/yoan1601
COMMIT_SHA=$1

BACKEND_IMAGE=$REGISTRY/backend:$COMMIT_SHA
FRONTEND_IMAGE=$REGISTRY/frontend:$COMMIT_SHA

echo "Building and pushing backend image..."
docker build -t $BACKEND_IMAGE ./backend
docker push $BACKEND_IMAGE

echo "Building and pushing frontend image..."
docker build -t $FRONTEND_IMAGE ./frontend
docker push $FRONTEND_IMAGE

echo "Applying Kubernetes deployments..."
kubectl apply -f k8s/

echo "Updating Kubernetes deployments..."
kubectl set image deployment/backend-deployment backend=$BACKEND_IMAGE
kubectl set image deployment/frontend-deployment frontend=$FRONTEND_IMAGE

echo "Deployment complete."
