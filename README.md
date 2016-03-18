# react-planks
A React component to create responsive masonry (pinterest style) layouts. 

**Why use planks?**
It's simple to use, comes with no-frills, and is fast because of React's capability for rendering optimization.

This project is currently in development. Use at your own risk.

##### TODO:
* Tests
* Minify
* Linting
* CI

### Demo
*Coming soon*

### Installation
```
npm install react-planks
```

or clone from github and build from source using babel.

### Usage
The Planks component can be incldued in any React project. 

##### ES6:
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import Planks from 'react-planks';

let elementsArr = [
    /* Array of any other React component/element. Bootstrap 4 cards perhaps? */
];

// Optional options
let options = {
    'breakpoints': {
        '544': 1,
        '768': 2,
        '992': 3,
        '1200': 4,
        '1600': 5
    },
    'horizontalPadding': 1,
    'verticalPadding': 0,
    'unitType': 'rem'
};

ReactDOM.render(
    <Planks options={ options }>{ elementArr }</Planks>,
    document.getElementById('planksNode')
);
```

##### ES5:
*Coming soon*

### Options
If no options are passed in, defaults are used.
