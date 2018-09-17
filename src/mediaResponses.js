const fs = require('fs'); // pull in the file system module
const url = require('url'); // pull in the url module
// Load our index fully into memory.
// THIS IS NOT ALWAYS THE BEST IDEA.
// We are using this for simplicity. Ideally we won't have
// synchronous operations or load entire files into memory.
const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const styles = fs.readFileSync(`${__dirname}/../client/style.css`);

const responseStruct = {
  '/success': {
    id: 'Success',
    response: 'This is a successful response',
    code: 200,
  },
  '/badRequest': {
    id: 'Bad Request',
    response: 'Missing a valid query parameter set to true',
    code: 400,
  },
  '/badRequest?valid=true': {
    id: 'Bad Request',
    response: 'This request has the required parameters',
    code: 200,
  },
  '/unauthorized': {
    id: 'Unauthorized',
    response: 'Missing a logedIn parameter set to yes',
    code: 401,
  },
  '/forbidden': {
    id: 'Unauthorized',
    response: 'You do not have access to this content',
    code: 403,
  },
  '/forbidden?loggedIn=yes': {
    id: 'Authenticated',
    response: 'You have access to this content',
    code: 200,
  },
  '/internal': {
    id: 'Internal Server Error',
    response: 'Internal Server Error, Something went wrong',
    code: 500,
  },
  '/notImplemented': {
    id: 'Not Implemented',
    response: 'Internal Server Error, Something went wrong',
    code: 501,
  },
  '/notFound': {
    id: 'Not Found',
    response: 'The page you are looking for was not found',
    code: 404,
  },

};
// function to send response
const respond = (request, response, content, type, code) => {
  // set status code (200 success) and content type
  response.writeHead(code, { 'Content-Type': type });
  // write the content string or buffer to response
  response.write(content);
  // send the response to the client
  response.end();
};

// function for our /cats page
// Takes request, response and an array of client requested mime types
const buildResponse = (request, response, acceptedTypes) => {
  const dataPath = (url.parse(request.url)).path;

  // object to send
  const data = responseStruct[dataPath];

  // if the client's most preferred type (first option listed)
  // is xml, then respond xml instead
  if (acceptedTypes[0] === 'text/xml') {
    // create a valid XML string with name and age tags.
    let responseXML = '<response>';
    responseXML = `${responseXML} <id>${data.id}</id>`;
    responseXML = `${responseXML} <message>${data.response}</message>`;
    responseXML = `${responseXML} </response>`;

    // return response passing out string and content type
    return respond(request, response, responseXML, 'text/xml', data.code);
  }

  // stringify the json object (so it doesn't use references/pointers/etc)
  const responseString = JSON.stringify(data);

  // return response passing json and content type
  return respond(request, response, responseString, 'application/json', data.code);
};

// function to handle the index page
const getIndex = (request, response) => {
  respond(request, response, index, 'text/html', 200);
};

// function to handle the css
const getStyles = (request, response) => {
  respond(request, response, styles, 'text/css', 200);
};

const unknown = (request, response) => {
  respond(request, response, JSON.stringify({ message: 'The page you are looking for could not be found', id: 'notFound' }), 'application/json', 404);
};
// exports to set functions to public.
// In this syntax, you can do getCats:getCats, but if they
// are the same name, you can short handle to just getCats,
module.exports = {
  buildResponse,
  getIndex,
  getStyles,
  unknown,
};
