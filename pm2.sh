#!/bin/bash

APP_NAME="fractal"
DEFAULT_PORT=45503
PORT=${1:-$DEFAULT_PORT}

echo "Starting $APP_NAME on port $PORT..."

npm run build

export PORT=$PORT

pm2 delete "$APP_NAME" || true
pm2 start build/index.js --name "$APP_NAME"
pm2 save

echo "Running on port $PORT"