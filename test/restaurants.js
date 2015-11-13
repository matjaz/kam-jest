import {expect} from 'chai';

import {getRestaurants, dataSourceFactory} from '../src/restaurants';
import FacebookGraphProvider from '../src/providers/facebookGraph';
import Selih from '../src/parsers/selih';

describe('dataSourceFactory', () => {

  it('should return provider & parser', () => {
    var dataSource = dataSourceFactory('selih');
    expect(dataSource)
      .to.have.property('provider')
      .that.is.an.instanceof(FacebookGraphProvider);
    expect(dataSource)
      .to.have.property('parser')
      .that.is.an.instanceof(Selih);
  });

});
