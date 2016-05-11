jest.unmock('../src/plank');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Planks from '../src/plank';

describe('Plank', () => {
    it('is initially hidden');
    it('sends its dimensions to the planks container');
    it('will fire a special callback if it\'s the last element');
});
