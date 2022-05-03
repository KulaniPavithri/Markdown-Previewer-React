import React, {Component} from 'react';
import image from '../img/omnom2.png';
class Cursor extends Component{
    state ={
        x:0,
        y:0
    };

    handleMouseMove = (event) =>{
        this.setState(
            {
                x: event.clientX,
                y: event.clientY
            }
        );
    }
//https://stackoverflow.com/questions/6802956/how-to-position-a-div-in-a-specific-coordinates
    render(){
        
        //render-props pattern - a render prop is a function prop that a component uses to know what to render
        //Code reusing - this encapsulates the mouse movement behavior allowing to change the rendered output
        // https://reactjs.org/docs/render-props.html
        //Don't have to name render-prop as render. prop can be named as any but functionality should be as render-props
        return(
            <div onMouseMove={this.handleMouseMove}>
                {this.props.render(this.state)}
                
            </div>
        )
    }
}

class Cat extends Component{
    render(){
        const mouse = this.props.mousePosition;
        return(
            //image not loading in react - https://daveceddia.com/react-image-tag/
            //following way or put img folder into 'public' directory in the project
            <img src={image}
            style={{position: "fixed", top: mouse.y, left: mouse.x}} 
            alt="Omnom"/>
            
        );
    }
}

class CursorTracker extends Component{
    
    render(){
        return(
            <div>
                <h1>Cursor Point</h1>
                <Cursor render={mousePosition => (
                    <Cat mousePosition={mousePosition} />
                )} />
            </div>
        );
    }
}

/*Rather than above class CursorTracker, it
 can implement most higher-order components (HOC) using a regular component with a render prop
function cursorTracker (Component){
    return class extends Component{
        render(){
            return(
                <Cursor render={mouse => (
                    <Component {...this.props} mouse={mouse} />
                )} />
            );
        }
    }
} */

export default CursorTracker;

