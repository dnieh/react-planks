# react-planks
A React component to create responsive masonry (pinterest style) layouts. 

**What's special about planks, and why should I use it?**
* Simple to use: use it to horizontally order any existing components you have.
* Comes with no-frills: forget about expensive animations that slow down the browser.
* It's fast and takes advantage of React's built-in ability to optimize renderings.
* Responsiveness baked in from mobile up to any size really.
* Customizable: options let you define breakpoints and padding.

This project is currently in development. Use at your own risk.

##### TODO:
* Tests
* Linting
* CI

## Demo
*Coming soon*

## Installation
```
npm install react-planks
```

or clone from github and build from source using babel.

## Usage
The Planks component can be incldued in any React project. 

##### ES6:
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import Planks from 'react-planks';

let elementsArr = [
    /* Array of any other React component/element. Bootstrap 4 cards perhaps? */
];

// Optional. See below.
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
    <Planks options={ options }>{ elementsArr }</Planks>,
    document.getElementById('planksNode')
);
```

##### Images:
React Planks handles images! If your components contain images, make sure to pass in the prop, `hasImage={ true }`.

Here's an example of a component with the prop:
```javascript
<div className='card' hasImage={ true }>
    <img src='path-to-image.jpg' />
</div>
```

The reason why react-planks needs a flag for images is because images load into the actual DOM unpredictably after the
React component renders. Simply waiting for render to complete without the `hasImage` prop will lead to incorrect
position calculations possibly based on a non-rendered image. Behind the scenes react-planks looks for the `hasImage`
prop and executes a callback on the `onLoad` or `onError` event.

## Options
If no options are passed in, the following defaults are used:

#### Responsive Breakpoints:
The default breakpoint settings match those from Bootstrap specifically xs, sm, md, and lg. If a screen width is
greater than the largest defined breakpoint, the column number from the largest defined breakpoint is carried forward.

Up to Width (pixels) | Number of Columns
--- | ---
544 | 1
768 | 2
992 | 3
1200 | 4

#### Element Padding
The padding between the sorted elements.

`horizontalPadding: 1` in rem
`verticalPadding: 0` in rem

#### Unit Type
Default: rem
