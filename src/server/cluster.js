import forky from 'forky';

forky({
  path: `${__dirname}/index.js`,
  enable_logging: process.env.NODE_ENV === 'development',
});
