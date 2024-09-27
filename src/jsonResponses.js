/* Author: Andrew Black
 *Purpose: json response handler returns status codes in their json form. 
 *handles multiple types of requests including HEAD, GET and POST
 *GET requests have a message and id, while the rest 
 *NOTE: starter code not provided for this, but the basis of this was taken from
 *Austin Willoughby from an in-class lecture at Rochester Institute of Technology.
 *NOTE2: 
 *GET returns JSON, message and id only for Error Codes
 *HEAD returns Status Codes only
 *POST returns Status Codes with Message and ID for successes and errors
 *Source: https://github.com/IGM-RichMedia-at-RIT/head-request-example-done/blob/master/src/jsonResponses.js
 *Exports: getUsers,
  headUsers,
  addUser,
  notReal,
  headNotReal,
  notFound,
 */

// storage of users added by client side
const users = {};

// function for handling JSON responses
const respondJSON = (request, response, status, object) => {
  const content = JSON.stringify(object);

  const headers = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  };

  response.writeHead(status, headers);

  if (request.method !== 'HEAD') {
    response.write(content);
  }

  response.end();
};

// function for handling response for GET getUsers
// return an empty object if there are no added users
// always succesful
const getUsers = (request, response) => {
  if (Object.keys(users).length !== 0) {
    respondJSON(request, response, 200, users);
  } else {
    respondJSON(request, response, 200, {});
  }
};

// function for handling HEAD response for getUsers 
// only returns the status code
// always succesful 
const headUsers = (request, response) => {
  respondJSON(request, response, 200, {});
};

// function for handling POST addUser responses to:
// add a user (204), update a user's age if their name already exists (2041,
// or return a 400 if no age or name was passed in
const addUser = (request, response) => {
  const body = [];

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const params = JSON.parse(bodyString);

    // no name or age, throw a 400 at 'em
    if (!params.name || !params.age) {
      const responseObj = {
        message: 'Name and age are both required.',
        id: 'userMissingParams',
      };
      return respondJSON(request, response, 400, responseObj);
    }

    // user exists, update age
    if (users[params.name]) {
      users[params.name].age = params.age;
      return respondJSON(request, response, 204, {});
    }

    // create new user
    users[params.name] = { name: params.name, age: params.age };
    const responseObj = { message: 'User created successfully.', id: 'userCreated' };
    return respondJSON(request, response, 201, responseObj);
  });
};

// function for handling GET notReal response
// notReal is basically just a 404 not found page, and as such just
// returns out basic notFound function (see below)
const notReal = (request, response) => {
  const responseObj = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };
  respondJSON(request, response, 404, responseObj);
};

// function for handling HEAD notReal response
// notReal is basically just a 404 not found page
// HEAD = no body
const headNotReal = (request, response) => {
  respondJSON(request, response, 404, {});
};

// general 404 not found response
// technically this isn't really any different than the notReal function,
// but is included due to assignment specification to assign any other undefined page
// to a 404 status code
const notFound = (request, response) => {
  const responseObj = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };
  respondJSON(request, response, 404, responseObj);
};

module.exports = {
  getUsers,
  headUsers,
  addUser,
  notReal,
  headNotReal,
  notFound,
};
