'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Planks from '../index';
import { mockData } from './mockData';

let options = {
    'breakpoints': {
        '500': 1,
        // '800': 2,
        '1000': 3,
        '1300': 4
        // '1600': 5
    },
    'horizontalPadding': 1,
    'verticalPadding': 0,
    'unitType': 'rem'
};

let cards = mockData.map((card, index) => {
    switch (card.cardType) {
    case 'basic':
        let image = card.imgSrc
            ? <img className='card-img-top img-fluid' src={ card.imgSrc } />
            : null;

        card = (
            <div className='card' key={ index } hasImage={ image !== null }>
                { image }
                <div className='card-block'>
                    <h4 className='card-title'>{ card.title }</h4>
                    <p className='card-text'>{ card.text }</p>
                </div>
            </div>
        );
        break;
    case 'list': 
        let listItems = card.list.map((item, index) => {
            return (<li className='list-group-item' key={ index }>{ item }</li>);
        });

        card = (
            <div className='card' key={ index }>
                <div className='card-block'>
                    <h4 className='card-title'>{ card.title }</h4>
                </div> 
                <ul className='list-group list-group-flush'>
                    { listItems }
                </ul>
            </div>
        );
        break;
    case 'quote':
        card = (
            <div className='card card-block' key={ index }>
                <h4 className='card-title'>{ card.title }</h4>
                <blockquote className='card-blockquote'>
                    <p>{ card.text }</p>
                </blockquote>
                <footer>{ card.author }</footer>
            </div>
        );
        break;
    case 'psa':
        card = (
            <div className='card card-block card-inverse card-success' key={ index }>
                <h4 className='card-title'>{ card.title }</h4>
                <h5 className='card-title'>{ card.subTitle }</h5>
                <p className='card-text'>{ card.text }</p>
            </div>
        );
        break;
    default:
        card = null;
    }

    return card;
});

$(function() { 
    if ($('[data-react-root=planks]').length > 0) {
        ReactDOM.render(<Planks options={ options }>{ cards }</Planks>, $('[data-react-root=planks]')[0]);
    } 
}); 
