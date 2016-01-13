import HttpProvider from '../../providers/http';
import Parser from './parser';

export function provider() {
  return new HttpProvider('http://www.da-noi.si');
}

export function parser() {
  return new Parser();
}

export function data() {
  return {
    name: 'Da Noi',
    location: {
      lat: 46.539322,
      lon: 15.640531
    }
  };
}
