import express from 'express';
import expressGraphql from 'express-graphql';

import Schema from './server/schema.js';

var app = express();

app.use('/graphql', expressGraphql({
  schema: Schema,
  graphiql: true
}));

let server = app.listen(process.env.PORT || 3000, function () {
  let host = server.address().address;
  let port = server.address().port;

  console.log('Server listening at http://%s:%s', host, port);
});
