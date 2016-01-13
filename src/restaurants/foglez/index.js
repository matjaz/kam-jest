import FacebookGraph from '../../providers/facebookGraph';
import Parser from './parser';

export function provider() {
  return new FacebookGraph('1374880122759255');
}

export function parser() {
  return new Parser();
}

export function data() {
  return {
    name: 'Foglež',
    location: {
      lat: 46.499744,
      lon: 15.701672
    }
  };
}
