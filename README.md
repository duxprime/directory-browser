# Directory Browser
The directory browser projects consist of source code for both a client and server. Both can be installed and run using the supplied `start.sh` bash script. 

## Server
The server is written in TypeScript and Node using the NestJs framework. To manually install and run:

```
cd server
npm install
npm run start
```
By default, the server listens at `http://localhost:3000`.

### Supported Environment Variables
* `API_PORT`: The port the server should listen at. Default is `3000`.
* `HOME_DIR`: The home directory exposed by the API. Default is `C:`.

## Client
The client is written in TypeScript and KnockoutJS. It uses Webpack as its bundler. To manually install and run:
```
cd client
npm install
npm run start
```

The client is available at `http://localhost:8080`.

### Supported Environment Variables
* `API_URI`: The URI of the API the web client should communicate with. Default is `http://localhost:3000`.

