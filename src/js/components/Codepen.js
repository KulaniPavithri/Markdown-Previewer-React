import React from 'react';
import ReactDOM from 'react-dom';
import marked from 'marked';
import Prism from 'prismjs';
import '../style/markdown.scss';

//errors in codepen codepen Uncaught SyntaxError: Unexpected token '<' react 
//above error can be solved using a transpiler to javascript read the JSX elements
//- https://forum.freecodecamp.org/t/code-pen-issues/264867/2
//select Babel as JavaScript Preprocessor in settings in Codepen


// to enable SCSS, select SCSS as CSS Preprocessor in CSS setting
const ROW_SEPARATOR = "row-separator";
const COL_SEPARATOR = "col-separator";
const  SPLITPANE_ROW = "splitpane-row";
const SPLITPANE_COL = "splitpane-column";
const MAX_WIDTH = "(max-width: 800px)";


const Toolbar = (props) => {
    return (
      <div className="toolbar">
        <i className="fab fa-markdown" title="no-stack-dub-sack" />
        {props.text} 
      </div>
    );
   };
   
   const Editor = (props) => {
    return (
      <textarea  
        id="editor"
        onChange={props.onChange}
        type="text"
        value={props.markdown}
      />
    );
   };
   
   //dangerouslySetInnerHTML - https://reactjs.org/docs/dom-elements.html
   const Previewer = (props) => {
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: marked(props.markdown, { renderer: props.renderer })
        }}
        id="preview"
      />
    );
   };

   
const SplitPaneContext = React.createContext();

const SplitpaneProvider = (props) => {
   const [clientWidth, setClientWidth] = React.useState(null);
   const [clientHeight, setClientHeight] = React.useState(null);
   const xDividerPosition = React.useRef(null);
   const yDividerPosition = React.useRef(null);
   

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
       <SplitPaneContext.Provider value={{clientWidth, setClientWidth, clientHeight, setClientHeight, onMouseDown, onMouseMove, onTouchStart, onTouchEnd, onTouchMove}}>
               {props.children}
       </SplitPaneContext.Provider>
   );

}

const RightPane = ({children, ...props}) => {
    return(
        <div className={props.className}>
            {children}
        </div>
    );
 }
 
 const LeftPane = (props) => {
 
    const resizedRef = React.createRef();
    const {clientWidth, setClientWidth} = React.useContext(SplitPaneContext);
    const {clientHeight, setClientHeight} = React.useContext(SplitPaneContext);
  
    React.useEffect(() => {
        if(!props.splitPaneClassName){
            //console.log("returning");
            return;
        }else {
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
  
    
    return (<div className={props.className} ref={resizedRef}>
      {props.children} </div>);
 }
 
 const Divider = (props) =>{
    const {onMouseDown} = React.useContext(SplitPaneContext);
    const {onTouchStart} = React.useContext(SplitPaneContext);
 
    return(
        <div className={props.className} onMouseDown = {onMouseDown}
         onTouchStart = {onTouchStart} >   
        </div>
    );
 }
 
 
const SplitPane = (props) => {

   const [dividerClassName, setDividerClassName] = React.useState();
   const [splitPaneClassName, setSplitPaneClassName] = React.useState();
   const {clientHeight, setClientHeight} = React.useContext(SplitPaneContext);
   const {clientWidth, setClientWidth} = React.useContext(SplitPaneContext);

  React.useEffect(() =>{
       if(props.narrowScreen == null){
           return;
       } else {
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


const App = () => {
// ALLOWS LINE BREAKS WITH RETURN BUTTON
 marked.setOptions({
   breaks: true,
   highlight: function (code) {
     return Prism.highlight(code, Prism.languages.javascript, 'javascript');
   }
 });

 const renderer = new marked.Renderer();
 renderer.link = function (href, title, text) {
   return `<a target="_blank" href="${href}">${text}</a>`;
 };

 const checkWindowSize = () =>{
   console.log(window.innerWidth);
   if(window.innerWidth < 800){
     return true;
   } else {
      return false;
   }
 }
 const placeholder = `# Welcome to my React Markdown Previewer!

## Heading
Add '#' sign in front of a word or phrase to create a heading. 
# heading level 1

## heading level 2

### heading level 3

For more information about basic syntax click [here](https://www.markdownguide.org/basic-syntax/)

## Code

Enclose the inline code phrase between two backsticks - \`<h1> Hello World </h1>\`

Enclose Code Block between three backsticks:
\`\`\`

//multi-line code

function formatName(user) {
 return user.firstName + ' ' + user.lastName;
}

\`\`\`

## Bold

To make text **bold**, add two asterisks before and after a word or phrase.

## Blockquotes

Add > front of a paragraph to create a blockquote.

>   ### Tip
> This guide is designed for people who prefer learning concepts step by step.
>
>> You can find a list of all the chapters in the lef sidebar.

## List items

To create an ordered list, add line items with numbers followed by period.
1. list item number 1
2. list item number 2
2. list item number 3

To create an unordered list, add dashes (-) in front of line item.

- unordered list number 1
   - indeted to create nested list item
     - another level of nested item


## Images
[![freeCodeCamp Logo](https://cdn.freecodecamp.org/testable-projects-fcc/images/fcc_secondary.svg)](https://www.freecodecamp.org/)
`;
 //remember useState, useEffect are asynchronous. therefore it won't update the state immediately.
 const [markdown, setMarkdown] = React.useState(placeholder);
 const [narrowScreen, setNarrowScreen] = React.useState(checkWindowSize);
 
   
 const mediaQuery = MAX_WIDTH;
 const matchQuery = window.matchMedia(mediaQuery);
 
 //when we set splitpane className at runtime, the componenet will not rerender with props changes. i think it is because ...props syntax
 const handleChange = (e) => {
   setMarkdown(e.target.value);
 }

  const handleScreenSize = (e) => {
   console.log(e.matches);
   console.log(window.innerWidth);
   setNarrowScreen(e.matches);
 }

 React.useEffect( () =>{
   console.log(matchQuery);
   matchQuery.addEventListener('change', handleScreenSize);

   return () => {
     matchQuery.removeEventListener('change', handleScreenSize);
   }
 }, []);

 return (
     <div>
       <head>
       <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css" rel="stylesheet"></link>
       <link rel="stylesheet"
               href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.23.0/themes/prism.min.css" />
         
       </head>
       <SplitpaneProvider>
         <SplitPane narrowScreen={narrowScreen}
         left={<div className="editorWrap">
           <Toolbar text="Editor"/>
           <Editor markdown={markdown} onChange={handleChange}/> 
           </div>
           
         }
         right={<div className="previewWrap">
           <Toolbar text="Previewer" />
           <Previewer markdown={markdown} renderer={renderer}/>
           </div>
         }
         />
         </SplitpaneProvider>
     </div>
   );
 
}

  ReactDOM.render(<App />, document.getElementById('root'));
  