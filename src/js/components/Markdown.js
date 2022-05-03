import React from 'react';
import ReactDOM from 'react-dom';
import marked from 'marked';
import Prism from 'prismjs';
import SplitPane from './SplitPane';
import SplitpaneProvider from './SplitpaneProvider';
import '../style/markdown.scss';
import {MAX_WIDTH} from '../constants/Constants.js';

// to install sass to the project to access .scss file - npm install node-sass
// to install marked, npm install --save marked - https://forum.freecodecamp.org/t/import-marked-library-into-project/234182
//install Prism https://medium.com/get-it-working/get-prismjs-working-in-react-a6d989e59290
//https://betterstack.dev/blog/code-highlighting-in-react-using-prismjs/

///* globals marked, Prism, React, ReactDOM */
/* eslint-disable react/prop-types, no-nested-ternary */

// View a more complex version of this project with custom toolbar here:
// https://codepen.io/no_stack_dub_sack/pen/JbPZvm?editors=0110

// coded by @no-stack-dub-sack (github) / @no_stack_sub_sack (Codepen)

// eslint-disable-next-line no-unused-vars
const projectName = 'markdown-previewer';




const App = () => {
// ALLOWS LINE BREAKS WITH RETURN BUTTON
  marked.setOptions({
    breaks: true,
    highlight: function (code) {
      return Prism.highlight(code, Prism.languages.javascript, 'javascript');
    }
  });

  // INSERTS target="_blank" INTO HREF TAGS (required for Codepen links)
//dollar-sign-and-curly-braces - https://stackoverflow.com/questions/35835362/what-does-dollar-sign-and-curly-braces-mean-in-a-string-in-javascript 
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

  
 //check react fragment to avoid warning that <head> cannot appear as a child element.
  //Font awesome 'fa' is deprecated after version 5. 'fas' for solid and 'fab' for brands
    return (
      //const dividerClassName = narrowScreen ? "row-separator" : "col-separator";
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


//ReactDOM.render(<App />, document.getElementById('root'));

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);


