import SplitPaneContext from "./SplitPaneContext";
import React from "react";
const SplitpaneProvider = (props) => {
    const [clientWidth, setClientWidth] = React.useState(null);
    const [clientHeight, setClientHeight] = React.useState(null);
    const xDividerPosition = React.useRef(null);
    const yDividerPosition = React.useRef(null);
    
// We generally recommend binding in the constructor or using the class fields syntax, 
    //binding a method in following way call class fields syntax
    //https://reactjs.org/docs/handling-events.html
    const onMouseDown = (e) => {
        e.preventDefault();
        xDividerPosition.current = e.clientX;
        console.log("xDividerPos.current " + xDividerPosition.current);
        yDividerPosition.current = e.clientY;
    }

    const onMouseUp = () =>{
        xDividerPosition.current = null;
        yDividerPosition.current = null;
    }
    const onMove = (clientX, clientY) =>{
        
        if(!xDividerPosition.current && !yDividerPosition.current){
            //console.log("before exit: " + clientX);
            //console.log(xDividerPos.current);
            return;
        }
        setClientWidth(clientWidth + clientX - xDividerPosition.current);
        console.log("onMove clientwidth " + clientX);
        setClientHeight(clientHeight + clientY - yDividerPosition.current);
        xDividerPosition.current = clientX;
        yDividerPosition.current = clientY;
        console.log("changing " + clientX + " " + clientY );
        //console.log("final clientwidth " + clientX);
        
    }

    const onMouseMove = (e) =>{
        e.preventDefault();
        onMove(e.clientX, e.clientY);
    }

    const onTouchStart = (e) => {
        e.preventDefault();
        if(e){
            
            console.log("start onTouchStart TOUCHING TOUCHING TOUCHING");

    }
        xDividerPosition.current = e.touches[0].clientX;
        yDividerPosition.current = e.touches[0].clientY;
        console.log("xDividerPos.current " + xDividerPosition.current);
    }

    const onTouchMove = (e) => {
        e.preventDefault();
        if(e.touches && e.touches[0].clientX){
            console.log("moving TOUCHING TOUCHING TOUCHING");
            console.log(e.touches[0].clientX);
            console.log(e.touches[0].clientY);
            
            
        }
        onMove(e.touches[0].clientX, e.touches[0].clientY);
        
    }

    const onTouchEnd = () => {  
        onMouseUp();
    }

    React.useEffect(() =>{
        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('touchend', onTouchEnd);
        document.addEventListener('touchmove', onTouchMove);

        return () => {
            document.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('touchend', onTouchEnd);
            document.removeEventListener('touchmove', onTouchMove);
        };
    });

    return (
        <SplitPaneContext.Provider
            value={{
                clientWidth,
                setClientWidth,
                clientHeight,
                setClientHeight,
                onMouseDown, onMouseMove,
                onTouchStart, onTouchEnd, onTouchMove
            }}>
                {props.children}
        </SplitPaneContext.Provider>
    );

}

export default SplitpaneProvider;