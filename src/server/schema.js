import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLFloat,
  GraphQLEnumType,
  GraphQLNonNull
} from 'graphql'

import { getRestaurants } from '../restaurants'
import { getDailyOffers, OfferTypes } from '../offers'

const GeoPointInput = new GraphQLInputObjectType({
  name: 'GeoPointInput',
  fields: {
    lat: { type: new GraphQLNonNull(GraphQLFloat) },
    lon: { type: new GraphQLNonNull(GraphQLFloat) },
    alt: { type: GraphQLFloat, defaultValue: 0 }
  }
})

const GeoPoint = new GraphQLObjectType({
  name: 'GeoPoint',
  fields: {
    lat: { type: new GraphQLNonNull(GraphQLFloat) },
    lon: { type: new GraphQLNonNull(GraphQLFloat) },
    alt: { type: GraphQLFloat, defaultValue: 0 }
  }
})

var OfferType = (() => {
  var values = {}
  Object.keys(OfferTypes).forEach((key) => {
    if (key !== 'from') {
      values[key] = {
        value: OfferTypes[key]
      }
    }
  })
  return new GraphQLEnumType({
    name: 'OfferType',
    values: values
  })
})()

const Restaurant = new GraphQLObjectType({
  name: 'Restaurant',
  description: 'Restaurant',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    location: { type: GeoPoint },
    distance: { type: GraphQLFloat },
    dailyOffers: {
      type: new GraphQLList(RestaurantDailyOffer),
      args: {
        date: { type: GraphQLString },
        type: {
          description: 'Include only offers of this type. Negate by prefixing with !.',
          type: GraphQLString
        }
      },
      resolve (source, args) {
        return getDailyOffers(source.id, args)
      }
    }
  })
})

const RestaurantOffer = new GraphQLObjectType({
  name: 'RestaurantOffer',
  description: 'Restaurant Offer',
  fields: () => ({
    text: { type: new GraphQLNonNull(GraphQLString) },
    type: { type: new GraphQLNonNull(OfferType) },
    price: { type: GraphQLFloat },
    allergens: { type: new GraphQLList(GraphQLString) }
  })
})

const RestaurantDailyOffer = new GraphQLObjectType({
  name: 'RestaurantDailyOffer',
  description: 'Restaurant Daily Offer',
  fields: {
    date: { type: GraphQLString },
    offersImages: { type: new GraphQLList(GraphQLString) },
    offers: { type: new GraphQLList(RestaurantOffer) },
    special: { type: new GraphQLList(RestaurantOffer) }
  }
})

const Query = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    restaurants: {
      type: new GraphQLList(Restaurant),
      args: {
        id: {
          description: 'Include only restaurant with specified id. Negate by prefixing with !.',
          type: GraphQLID
        },
        loc: { type: GeoPointInput },
        distance: { type: GraphQLFloat }
      },
      resolve (source, args, req, ast) {
        if (ast && !args.loc) {
          var fields = ast.fieldNodes[0].selectionSet.selections.map((selection) => selection.name.value)
          if (fields.includes('distance')) {
            throw new Error('distance field requires loc argument')
          }
        }
        return getRestaurants(args)
      }
    }
  }
})

const Schema = new GraphQLSchema({
  query: Query
})

export default Schema
