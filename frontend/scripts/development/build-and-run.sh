#!/bin/bash

CONTAINER_NAME="tecina-client-container"

if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
  docker stop $CONTAINER_NAME
  docker rm $CONTAINER_NAME
fi

docker build --no-cache -t tecnica-client .
docker run -p 8080:8080 --name $CONTAINER_NAME tecnica-client
