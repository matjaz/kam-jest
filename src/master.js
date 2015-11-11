import forky from 'forky';

forky({
  path: `${__dirname}/server.js`,
  enable_logging: process.env.NODE_ENV === 'development',
});
