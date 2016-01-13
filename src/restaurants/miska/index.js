import HttpProvider from '../../providers/http';
import Parser from './parser';

export function provider() {
  return new HttpProvider('http://www.okrepcevalnica-miska.si/');
}

export function parser() {
  return new Parser();
}

export function data() {
  return {
    name: 'Miška',
    location: {
      lat: 46.5225523,
      lon: 15.6533469
    }
  };
}
