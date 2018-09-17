const http = require('http'); // pull in the http server module
const url = require('url'); // pull in the url module

const responseHandler = require('./mediaResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// key:value object to look up URL routes to specific functions
const urlStruct = {
  '/': responseHandler.getIndex,
  '/style.css': responseHandler.getStyles,
  index: responseHandler.getIndex,
  '/success': responseHandler.buildResponse,
  '/badRequest': responseHandler.buildResponse,
  '/unauthorized': responseHandler.buildResponse,
  '/forbidden': responseHandler.buildResponse,
  '/internal': responseHandler.buildResponse,
  '/notImplemented': responseHandler.buildResponse,
  '/notFound': responseHandler.buildResponse,
  unknown: responseHandler.unknown,
};

// handle HTTP requests. In node the HTTP server will automatically
// send this function request and pre-filled response objects.
const onRequest = (request, response) => {
  // parse the url using the url module
  const parsedUrl = url.parse(request.url);
  // console.dir(parsedUrl);

  // grab the 'accept' headers (comma delimited) and split them into an array
  const acceptedTypes = request.headers.accept.split(',');
  // console.log(acceptedTypes);

  // check if the path name (the /name part of the url) matches
  // any in our url object. If so call that function. If not, default to index.
  if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response, acceptedTypes);
  } else {
    urlStruct.unknown(request, response, acceptedTypes);
  }
};

// start HTTP server
http.createServer(onRequest).listen(port);

// console.log(`Listening on 127.0.0.1: ${port}`);
