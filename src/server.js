import express from 'express';
import expressGraphql from 'express-graphql';
import forky from 'forky';

import Schema from './server/schema.js';

var app = express();

app.use('/graphql', expressGraphql({
  schema: Schema,
  graphiql: true
}));

app.get('/', function(req, res) {
  res.send('<a href="https://github.com/matjaz/kam-jest">kam-jest</a>');
});

let server = app.listen(process.env.PORT || 3000, function () {
  let host = server.address().address;
  let port = server.address().port;

  console.log('Server listening at http://%s:%s', host, port);
});

process.on('uncaughtException', function(err) {
  console.error(err);
  forky.disconnect();
});
