import React from 'react';
import '../style/markdown.scss';
import SplitPaneContext from './SplitPaneContext';
import { ROW_SEPARATOR } from '../constants/Constants';
import { COL_SEPARATOR } from '../constants/Constants';
import { SPLITPANE_COL } from '../constants/Constants';
import { SPLITPANE_ROW } from '../constants/Constants';
//https://reactjs.org/docs/composition-vs-inheritance.html
const SplitPane = (props) => {

    const [dividerClassName, setDividerClassName] = React.useState();
    const [splitPaneClassName, setSplitPaneClassName] = React.useState();
    const {clientHeight, setClientHeight} = React.useContext(SplitPaneContext);
    const {clientWidth, setClientWidth} = React.useContext(SplitPaneContext);

   React.useEffect(() =>{
        if(props.narrowScreen == null){
            return;
        } else {
            //with and height should reset to null here when window is resizing in order to 
            // replace with resizable pane's initial values 
            //console.log(clientHeight + "sdfs" + clientWidth);
            setClientHeight(null);
            setClientWidth(null);
        }

        if(props.narrowScreen){
            setDividerClassName(ROW_SEPARATOR);
            setSplitPaneClassName(SPLITPANE_COL);
        } else {
            setDividerClassName(COL_SEPARATOR);
            setSplitPaneClassName(SPLITPANE_ROW);
        }
    
        //console.log("splitPaneClassName " + splitPaneClassName);
      }, [props.narrowScreen]);

    //https://reactjs.org/docs/composition-vs-inheritance.html - Containment 
//you can pass props as anything. and there is a special prop called children props.children if you don't know children ahead of time.
//but this is less common and we can define props to pass a set of components - eg left={<Component />}

    return (
        <div className={splitPaneClassName}>
                <LeftPane className="splitpane-left" splitPaneClassName={splitPaneClassName}>
                    {props.left}
                </LeftPane>

                <Divider className={dividerClassName}/>
                
                <RightPane className="splitpane-right" >
                    {props.right}
                </RightPane>
            
        </div>
    );
}

export default SplitPane;

export const RightPane = ({children, ...props}) => {
    return(
        <div className={props.className}>
            {children}{/*Some components don’t know their children ahead of time. */ }
        </div>
    );
}

//you can pass props as anything. and there is a special prop called children if you don't know children ahead of time.
export const LeftPane = (props) => {

    //createRef create new ref for every rerender whereas useRef maintain the state of same ref throughout.
    const resizedRef = React.createRef();//createRef also working check the difference.
    const {clientWidth, setClientWidth} = React.useContext(SplitPaneContext);
    const {clientHeight, setClientHeight} = React.useContext(SplitPaneContext);
  
    React.useEffect(() => {
        if(!props.splitPaneClassName){
            //console.log("returning");
            return;
        }else {
            //here these min, max width and height settings should reset to null in order to reset
            // element to take the initial clientHeight and clientWidth values when flex direction is changing with respect to the window resizing
            resizedRef.current.style.minWidth = null;
            resizedRef.current.style.maxWidth = null;
            resizedRef.current.style.minHeight = null;   
            resizedRef.current.style.maxHeight = null;
           console.log("clientWidth - " + resizedRef.current.clientWidth + "style- " + resizedRef.current.style.minWidth );
            
        }
        if (!clientWidth && !clientHeight) {
            console.log(clientHeight + " sdfs " + clientWidth);
            console.log(resizedRef.current.clientHeight + " resizedRef " + resizedRef.current.clientWidth);
            setClientWidth(resizedRef.current.clientWidth);
            setClientHeight(resizedRef.current.clientHeight);
            console.log("setting width");
            console.log(clientHeight + "sdfs" + clientWidth);
            
            return;
        }

        if(props.splitPaneClassName === SPLITPANE_ROW){
            resizedRef.current.style.minWidth = clientWidth + "px";
            resizedRef.current.style.maxWidth = clientWidth + "px";
            console.log(clientHeight + " SPLITPANE_ROW " + clientWidth);
            return;
        }
        
        if(props.splitPaneClassName === SPLITPANE_COL){
            console.log(clientHeight + " SPLITPANE_COL " + clientWidth);
            resizedRef.current.style.minHeight = clientHeight + "px";   
            resizedRef.current.style.maxHeight = clientHeight + "px";
           
            return;
        }
            
    }, [clientWidth, setClientWidth, resizedRef, props.splitPaneClassName, clientHeight, setClientHeight]);
  
    //we can use spread operator on an element <div {...props} > to spread
    // all the props but it is an antipattern which add unnecessary IDs for element which don't belong there.
    //https://hackernoon.com/top-9-tips-to-improve-react-performance?source=rss
    return (<div className={props.className} ref={resizedRef}>
      {props.children} </div>);
}

//when props are changing and updating, componenet will rerender
//useEffect also makes components rerendering
export const Divider = (props) =>{
    const {onMouseDown} = React.useContext(SplitPaneContext);
    const {onTouchStart} = React.useContext(SplitPaneContext);

    return(
        <div className={props.className} onMouseDown = {onMouseDown}
         onTouchStart = {onTouchStart} >   
        </div>
    );
    //we have to use proper react mouse and touch event listener names on the element here to add event listener. eg. onMouseDown
//https://reactjs.org/docs/events.html#touch-events
}

