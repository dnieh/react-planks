jest.unmock('../src/planks');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Planks from '../src/planks';

describe('Planks', () => {
    it('can take in an empty array of elements');
    it('can take in an array of arbitrary child elements');
    it('can take in an array of identical child elements');
    it('can take in a large array of elements');
    it('continually responds to newly added elements');
    it('responds to screen size changes');
    it('caches previously calculated element positions');
    it('receives the dimensions of its children');
    it('renders only when all current dimensions are available');
});
