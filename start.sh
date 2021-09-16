#!/bin/sh

# install and start server
cd server
npm install
npm run start &
cd ..

# install and start client
cd client
npm install
npm run start &

wait