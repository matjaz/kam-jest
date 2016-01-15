# kam-jest
[![Build status][travis-image]][travis-url] [![Code Climate][codeclimate-image]][codeclimate-url] [![Codeship Status for matjaz/kam-jest][codeship-image]][codeship-url] [![Coverage Status][coverage-image]][coverage-url] [![js-standard-style][standard-image]][standard-url] [![Dependencies][david-image]][david-url] [![devDependencies][david-dev-image]][david-dev-url]

Restaurant daily meal offers GraphQL API

## Query examples

### Get all restaurant ids
```graphql
{
  restaurants {
    id
  }
}
```
[Try it!](https://kam-jest.herokuapp.com/graphql?query=%7B%0A%20%20restaurants%20%7B%0A%20%20%20%20id%0A%20%20%7D%0A%7D)

### Full query with comments
```graphql
{
  restaurants (
    # filter by restaurant. Exclude by prefixing with !.
    id: "selih"

    # to calculate distance we need reference location
    loc: {lat: 46.522425 lon: 15.669608}

    # max distance to filter by
#     distance: 2
  )  {
    # list fields you're interested in
    # use ctrl+space for autocomplete
    id
    name
    location {
      lat
      lon
    }
    distance
    
    # this will fetch live data from source
    # remove date argument to display all dates
#     dailyOffers (date: "2015-11-13" type: "MALICA") {
#       date
#       offers {
#         text
#         type
#         price
#         allergens
#       }
#     }
 
  }
} 
```

### Multi query
```graphql
{
  r1: restaurants (id: "selih") {
    id
  }
  r2: restaurants (id: "!selih") {
    id
  }
}
```

## Install

    npm install
    npm start

*Using `FacebookGraphProvider` you need `FB_APP_ID` & `FB_APP_SECRET` env. vars. set.*

## Development

    # run lint, tests & generate coverage
    npm test

    # run tests only
    npm run mocha


[travis-image]: https://img.shields.io/travis/matjaz/kam-jest/master.svg?style=flat
[travis-url]: https://travis-ci.org/matjaz/kam-jest
[codeclimate-image]: https://img.shields.io/codeclimate/github/matjaz/kam-jest.svg?style=flat
[codeclimate-url]: https://codeclimate.com/github/matjaz/kam-jest
[codeship-image]: https://img.shields.io/codeship/cf37bb00-6c82-0133-62fa-261517c79011/master.svg?style=flat
[codeship-url]: https://codeship.com/projects/115577
[coverage-image]: https://img.shields.io/coveralls/matjaz/kam-jest/master.svg?style=flat
[coverage-url]: https://coveralls.io/r/matjaz/kam-jest
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[standard-url]: http://standardjs.com
[david-image]: https://img.shields.io/david/matjaz/kam-jest.svg?style=flat
[david-url]: https://david-dm.org/matjaz/kam-jest
[david-dev-image]: https://img.shields.io/david/dev/matjaz/kam-jest.svg?style=flat
[david-dev-url]: https://david-dm.org/matjaz/kam-jest#info=devDependencies
