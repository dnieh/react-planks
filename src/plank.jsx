import React from 'react'; 

export default class Plank extends React.Component {
    constructor(props) {
        super(props);

        // Cache when heights have been set at particular breakpoints. Don't execute the callback since the
        // parent will already have a cached value.
        // TODO -- This will need to be bypassed when new content comes in and height actually changes.
        this.state = {
            plankWidth: null, // Cache the current width. Use to determine responsiveness.
            breakpointsRendered: {}
        };
    }

    /**
     * plankWidth doesn't get set here since the initial render will have no relevant data from the parent
     * plank container
     */
    componentDidMount() {
        if (!this.props.children.props.hasImage) {
            this.handleHeightSet();
        }
    }

    componentWillReceiveProps(nextProps) {
        // Indicates a responsive resize has occurred. 
        if (this.state.plankWidth !== nextProps.plankWidth) { 
            console.log('[SINGLE PLANK INDEX ' + this.props.index + '] setting plank width to: ' + nextProps.plankWidth);
            this.setState({ plankWidth: nextProps.plankWidth });
            if (!this.state.breakpointsRendered[this.state.plankWidth]) {
                if (this.props.handleLastPlank()) {
                    console.log('[SINGLE PLANK INDEX ' + this.props.index + '] last hidden plank rendered'); 
                };
            }
        }
    }

    /**
     * Determines when a responsive re-size has occurred. 
     */
    componentDidUpdate(prevProps, prevState) {
        if (prevState.plankWidth === null) {
            return; // Do nothing when the component first loads.
        }

        if (prevState.plankWidth !== this.state.plankWidth) {
            if (!this.previouslyRendered()) {
                this.updateBreakpointRenderings();
                console.log('[SINGLE PLANK INDEX ' + this.props.index + '] new width detected... sending new height to planks container...');
                this.sendHeightToPlanksContainer();

            } else {
                console.log('[SINGLE PLANK INDEX ' + this.props.index + '] change in width detected. previously rendered. nothing to do here.');
            }
        }
    }

    /**
     * @return Boolean
     */ 
    previouslyRendered() {
        return this.state.breakpointsRendered[this.state.plankWidth] !== undefined;
    }

    updateBreakpointRenderings() {
        let updatedBreakpointRenderings = this.state.breakpointsRendered;

        updatedBreakpointRenderings[this.state.plankWidth] = true;
        this.setState({ breakpointsRendered: updatedBreakpointRenderings });
    }

    handleHeightSet() {
        window.requestAnimationFrame(() => {
            console.log('[SINGLE PLANK INDEX ' + this.props.index + '] height being set (requestAnimationFrame)');
            // If we're here, this assumes that the height has not been previously set for this breakpoint/plank width.
            this.updateBreakpointRenderings();
            this.sendHeightToPlanksContainer();
        });
    }

    sendHeightToPlanksContainer() {
        this.props.updateChildHeight(this.props.index, this.elRef.offsetHeight);
    }

    handleImageLoad() {
        console.log('[SINGLE PLANK INDEX ' + this.props.index + '] image loaded!');
        this.sendHeightToPlanksContainer(); 
    }

    /**
     * Same for now as this.handleImageLoad but we might want to do something different in the future e.g. hide the
     * broken image icon.
     */
    handleImageLoadError() {
        console.log('[SINGLE PLANK INDEX ' + this.props.index + '] error loading image');
        this.sendHeightToPlanksContainer();
    }

    /**
     * For optimization there are 3 general conditions for rendering invidivual planks:
     *      1. plank width is first set and visibility is hidden since height is unknown
     *      2. plank height has been set and our owner, <Planks />, has determined our position
     *      3. responsive re-size has occurred, potentially starting (1) and (2) over again unless cached
     */
    render() {
        console.log('[SINGLE PLANK INDEX ' + this.props.index + '] single plank rendering...');
        console.log('[SINGLE PLANK INDEX ' + this.props.index + '] visibility: ' + this.props.plankStyles.visibility);
        return (
            <div
                onLoad={ this.handleImageLoad.bind(this) }
                onError={ this.handleImageLoadError.bind(this) }
                className='plank'
                style={ this.props.plankStyles }
                ref={ (c) => this.elRef = c }
            >
                { this.props.children }
            </div>
        );
    }
}
