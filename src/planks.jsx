import React from 'react';
import Plank from './plank';

/**
 * Container for planks. Handles the sizing, positioning, and responsiveness for all individual planks.
 *
 * @param Object props.options          
 */
export default class Planks extends React.Component {
    constructor(props) {
        super(props);

        let breakpointKey = this.getCurrentBreakpointKey();
        let planksRendered = {};

        planksRendered[breakpointKey] = {
            hiddenPlanksRendered: false,
            heightsSet: false
        };

        this.validateConfigOptions();

        this.state = {
            plankWidths: {},                    // Caches all the plank widths per breakpoint
            plankHeights: {},                   // Caches and used to determine when to unhide
            plankPosition: {},                  // The calculated positions for each plank
            containerWidth: 0,                  // Used to determine widths of planks based on current screen breakpoint
            containerHeights: {},               // Must set height because container element is absolute
            breakpointKey: breakpointKey,       // Current responsive breakpoint
            allPlanksRendered: planksRendered   // Caches when to unhide by breakpoint
        };
    }

    /**
     * When this component first mounts, no data has been loaded yet. Therefore, no dimensions of the children
     * components can be known. The objective here is to simply get the widths of the child planks so that they can
     * be quickly rendered.
     */
    componentDidMount() {
        console.log('[PLANKS CONTAINER] COMPONENT DID MOUNT...');
        let containerWidth = this.getPlankContainerWidth();
        let plankWidths = this.getSinglePlankWidths(containerWidth);
        let planksRendered = this.state.allPlanksRendered;

        console.log('[PLANKS CONTAINER] INITIAL CONTAINER WIDTH: ' + containerWidth);
        console.log('[PLANKS CONTAINER] INITIAL PLANK WIDTH: ' + plankWidths[this.state.breakpointKey]);
        
        // Event listener to calculate dimensions and positions on re-size. Caches results for faster subsequent
        // rendering.
        window.addEventListener('resize', this.handleResize.bind(this));

        this.setState({ 
            plankWidths: plankWidths,
            containerWidth: containerWidth,
            allPlanksRendered: planksRendered
        });

        // Force update so that all children's state gets synced with the new width.
        console.log('[PLANKS CONTAINER] FORCE UPDATE');
        this.forceUpdate();
    }

    /**
     * There are two phases of rendering individual child planks:
     *      1. When the width is first set and they are rendered hidden and without positioning.
     *      2. When all their heights have been received and positions have been calculated.
     */
    shouldComponentUpdate() {
        console.log('[PLANKS CONTAINER] SHOULD COMPONENT UPDATE?');
        if (!this.state.allPlanksRendered[this.state.breakpointKey].hiddenPlanksRendered) {
            console.log('[PLANKS CONTAINER] YES, INVISIBLE PLANKS HAVE NOT BEEN RENDERED YET');
            return true;
        }
        if (!this.state.allPlanksRendered[this.state.breakpointKey].heightsSet) {
            console.log('[PLANKS CONTAINER] NO, ALL HEIGHTS HAVE NOT BEEN RECEIVED. BYPASSING UPDATE');
            return false;
        }
        return true;
    }

    componentWillUnmount() {
    }

    /**
     * TODO -- move this into it's own module that you include outside of Plank's scope.
     * 
     * Checks to make sure the options passed in as this.props of this component are valid. Issue warnings and use
     * defaults if they are not valid.
     */
    validateConfigOptions() {
        // TODO -- check to make sure keys are screen widths in numbers. issue a warning if they aren't. they don't
        // have to be in order.   
    }

    /**
     * @return Number   the current width of the referenced container element.
     */
    getPlankContainerWidth() {
        return this._planksContainer.offsetWidth;
    }

    /**
     * Returns the current breakpoint key. Use this only when absolutely necessary such as on initial page load and 
     * when a responsive screen re-size has occured.
     */
    getCurrentBreakpointKey() {
        let screenWidth = document.body.offsetWidth;
        let breakpointKey;
        let optionKeys = [];

        // Since for...in loops do not guarantee order, extract the keys
        // into an array that can then be sorted in ascending order. If the current screen size is larger than any
        // defined key, the column count will be associated to the largest key.
        for (let key in this.props.options.breakpoints) {
            optionKeys.push(key);
        }

        optionKeys.sort((a, b) => +a - +b);
        breakpointKey = optionKeys[optionKeys.length - 1];

        // If optionKeys is length 0, then we will use the largest key as assigned by the expression above, 
        // otherwise take the 0 index value as that by definition is the nearest breakpoint to the current screen size.
        optionKeys = optionKeys.filter((item) => screenWidth < item);
        if (optionKeys.length > 0) {
            breakpointKey = optionKeys[0];
        }

        return breakpointKey;
    }

    /**
     * Checks if width has previously been calculated and returns the cached value. Otherwise this calculates the width
     * taking into account the current breakpoint, number of columns associated to the breakpoint, and horizontal
     * padding.
     *
     * @param   Number      containerWidth      the current container width
     * @param   String      nextBreakpointKey   hacky optional param to set the next value when a resize occurs
     * @return  Object      plankWidths         cache of breakpoint keys to plank widths
     */
    getSinglePlankWidths(containerWidth, nextBreakpointKey) {
        let plankWidths = this.state.plankWidths;
        let breakpointKey = nextBreakpointKey || this.state.breakpointKey;
        let numColumns;
        let singlePlankWidth;

        // Check for cached value
        if (plankWidths[breakpointKey] && plankWidths[breakpointKey].length > 0) {
            return plankWidths[breakpointKey];
        }

        // To get the width of a single plank, the horizontal padding must be accounted for.
        numColumns = this.props.options.breakpoints[breakpointKey + ''];
        
        // 16px === 1rem
        let hPadding = this.props.options.horizontalPadding;
        let unitRatio = this.props.options.unitType === 'rem' ? 16 : 1;
        singlePlankWidth = (containerWidth - ((numColumns - 1) * hPadding * unitRatio)) / numColumns / unitRatio;
        
        // Cache the current value against the breakpoint key
        plankWidths[breakpointKey] = singlePlankWidth;

        return plankWidths;
    }

    /**
     * For optimization we need a flag to determine when all the hidden planks have been rendered. This allows us to
     * skip re-rendering until all the hidden planks have been rendered.
     */
    handleAllHiddenPlanksRendered() {
        let planksRendered = this.state.allPlanksRendered;

        console.log('[PLANKS CONTAINER] LAST HIDDEN PLANK RENDERED');
        planksRendered[this.state.breakpointKey].hiddenPlanksRendered = true;
        this.setState({ allPlanksRendered: planksRendered });
        return true;
    }

    /**
     * Screen resizes must handle the re-ordering of cards. If this ordering has already occurred for the existing
     * data set, use a locally cached version of that particular ordering. By definition if a resize event 
     * occurs, this.state.breakpointKey and this.state.plankWidths will have been set at least once.
     * 
     * TODO -- handle orientationchange event for mobile
     */
    handleResize() {
        let containerWidth = this.getPlankContainerWidth();

        // Screen widths alone do not determine when a responsive change has occured. Responsiveness is a set of fixed
        // container widths that exist over ranges of screen sizes. Handling resize is more optimal when 
        // calculations only occur when container width changes. Additionally, setting the current
        // breakpointKey should only occur here and in the constructor.
        if (this.state.containerWidth !== containerWidth) {
            console.log('[PLANKS CONTAINER] RESIZE DETECTED...');
            let breakpointKey = this.getCurrentBreakpointKey();
            let planksRendered = this.state.allPlanksRendered;
            let plankWidths = this.getSinglePlankWidths(containerWidth, breakpointKey);

            console.log(planksRendered[breakpointKey]);
            if (planksRendered[breakpointKey] !== undefined) {
                this.setState({ 
                    breakpointKey: breakpointKey,
                    containerWidth: containerWidth
                });
                return; // Cache exists. Do nothing.
            }
            
            planksRendered[breakpointKey] = {
                hiddenPlanksRendered: false,
                heightsSet: false
            };

            this.setState({
                breakpointKey: breakpointKey,
                plankWidths: plankWidths,
                containerWidth: containerWidth,
                allPlanksRendered: planksRendered
            });
        }
    }

    /**
     * A callback that receives the hidden child element's height. When all heights are received, we can then calculate
     * their correct positioning and set their visibility. This callback should execute one time per element render. 
     * This means that responsiveness should trigger a new render. However, we have to also account for cached values.
     */
    receiveChildHeight(key, childHeight) {
        let plankHeights = this.state.plankHeights;
        let planksRendered = this.state.allPlanksRendered;
        let renderAllPlanks;

        console.log('[PLANKS CONTAINER] RECEIVING CHILD HEIGHT:');
        console.log('[PLANKS CONTAINER] KEY: ' + key, 'HEIGHT: ' + childHeight);

        if (plankHeights[this.state.breakpointKey] === undefined) {
            plankHeights[this.state.breakpointKey] = {};
        }
       
        // It is very normal for updated heights to come back to us. This could indicated another image loaded, an 
        // image failing to load, or even new content. In this case we must force update if all the other heights 
        // have already been received.
        let heightExists = plankHeights[this.state.breakpointKey][key] || false;

        plankHeights[this.state.breakpointKey][key] = childHeight;

        this.setState({ plankHeights: plankHeights });

        if (heightExists && this.state.allPlanksRendered[this.state.breakpointKey].heightsSet) {
            console.log('[PLANKS CONTAINER] UPDATING EXISTING HEIGHT. FORCE UPDATE');
            this.setPlankPositioning();
            this.forceUpdate();
        }

        // Render planks when all the heights have been received.
        renderAllPlanks = Object.keys(plankHeights[this.state.breakpointKey]).length === this.props.children.length;

        // Initialize the rendering flags that corresponds to the two phases of child plank rendering.
        if (!planksRendered[this.state.breakpointKey]) {
            planksRendered[this.state.breakpointKey] = {
                hiddenPlanksRendered: false, 
                heightsSet: false
            };
        }

        // once we have all the heights of each plank, we can now calculate their absolute positioning.
        if (renderAllPlanks) {
            this.setPlankPositioning();
            planksRendered[this.state.breakpointKey].heightsSet = true;
        }

        this.setState({ 
            allPlanksRendered: planksRendered
        });
    }

    /**
     * Set the plank positioning. Position sorting occurs here.
     */
    setPlankPositioning() {
        let plankPosition = this.state.plankPosition;

        if (!plankPosition[this.state.breakpointKey]) {
            plankPosition[this.state.breakpointKey] = {};
        }

        let numColumns = this.props.options.breakpoints[this.state.breakpointKey];
        let columnHeights = [];
        let colHeightPadding = []; // Keeps track of the accumulated vertical padding;

        for (let i = 0; i < numColumns; i++) {
            columnHeights[i] = colHeightPadding[i] = 0;
        }

        // iterate from left col to right col looking for the shortest col.
        // if all cols are equal height, place in the left most col.
        let [i, col, left] = [0, 0, 0];
        let plankWidth = this.state.plankWidths[this.state.breakpointKey];
        let hPadding = this.props.options.horizontalPadding;
        let vPadding = this.props.options.verticalPadding;
        let unitRatio = this.props.options.unitType === 'rem' ? 16 : 1;
        for (; i < this.props.children.length; i++) {
            let plankHeight = this.state.plankHeights[this.state.breakpointKey][i];
            let positionStyle = {};
            let shortestColHeight = Math.min.apply(Math, columnHeights);
            let shortestColIndex = columnHeights.indexOf(Math.min.apply(Math, columnHeights));
            let leftProperty = shortestColIndex * plankWidth + shortestColIndex * hPadding;
            let topProperty = shortestColHeight / unitRatio + colHeightPadding[shortestColIndex];

            positionStyle = {
                left: leftProperty,
                top: topProperty
            };

            plankPosition[this.state.breakpointKey][i] = positionStyle;
            columnHeights[shortestColIndex] += plankHeight;
            colHeightPadding[shortestColIndex] += vPadding;

            if (col === numColumns - 1) {
                col = left = 0;
            }
        }

        let greatestHeight = columnHeights.reduce((prev, cur) => prev > cur ? prev : cur);
        let containerHeights = this.state.containerHeights;

        greatestHeight += Math.max.apply(Math, colHeightPadding) * unitRatio;
        containerHeights[this.state.breakpointKey] = greatestHeight;
        
        this.setState({
            plankPosition: plankPosition,
            containerHeights: containerHeights
        });
    }

    getPlankStyles(index) {
        if (!this.state.allPlanksRendered[this.state.breakpointKey].heightsSet) {
            return {
                visibility: 'hidden',
                width: this.state.plankWidths[this.state.breakpointKey] + this.props.options.unitType
            };
        } else {
            let positionStyles = this.state.plankPosition[this.state.breakpointKey][index + ''];
            
            return {
                visibility: 'visible',
                width: this.state.plankWidths[this.state.breakpointKey] + this.props.options.unitType,
                left: positionStyles.left + 'rem',
                top: positionStyles.top + 'rem'
            };
        }
    }

    /**
     * Child styles are fetched upon rendering in order to allow for responsiveness. These styles have already been
     * calculated and are simply set here to render based on the current responsive breakpoint.
     */
    render() {
        console.log('[PLANKS CONTAINER] CONTAINER RENDERING...');
        console.log('[PLANKS CONTAINER] CURRENT CHILD PLANK WIDTH: ' + this.state.plankWidths[this.state.breakpointKey]);

        let containerStyle = { height: this.state.containerHeights[this.state.breakpointKey] };
        let planks = this.props.children.map((plank, index) => {
            let styles = this.getPlankStyles(index);
            let lastPlankHandler = index === React.Children.count(this.props.children) - 1
                ? this.handleAllHiddenPlanksRendered.bind(this)
                : (() => null);

            return (
                <Plank
                    key={ index }
                    index={ index }
                    plankStyles={ styles }
                    plankWidth={ this.state.plankWidths[this.state.breakpointKey] }
                    updateChildHeight={ this.receiveChildHeight.bind(this) }
                    handleLastPlank={ lastPlankHandler }
                >
                    { plank }
                </Plank>
            );
        });
        
        return (
            <div style={ containerStyle } ref={ (c) => this._planksContainer = c }>{ planks }</div>
        );
    }
}

Planks.propTypes = { options: React.PropTypes.object };
Planks.defaultProps = {
    options: {
        'breakpoints': {
            '544': 1,
            '768': 2,
            '992': 3,
            '1200': 4
        },
        'horizontalPadding': 1,
        'verticalPadding': 1,
        'unitType': 'rem'
    }
};
