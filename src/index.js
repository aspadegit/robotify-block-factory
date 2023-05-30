/**
 * This connects the generator code to index.html
 * It also handles block descriptions, some input changes, loading & saving, the preview block, and 
 *    generating the JS object.
 */

/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly';
import {blocks} from './blocks/json';
import {generator} from './generators/javascript';
import {javascriptGenerator} from 'blockly/javascript';
import { jsonGenerator } from './generators/json';
import {save, load} from './serialization';
import {toolbox} from './toolbox';
import './index.css';

// Register the blocks and generator with Blockly
Blockly.common.defineBlocks(blocks);
Object.assign(javascriptGenerator, generator);

// Set up UI elements and inject Blockly
const codeDiv = document.getElementById('generatedCode').firstChild;
const outputDiv = document.getElementById('javascript').firstChild.firstChild;
const interpreterDiv = document.getElementById('interpreter').firstChild.firstChild;
const outputBlockDiv = document.getElementById('preview');
const blocklyDiv = document.getElementById('blocklyDiv');
const descriptionInput = document.getElementById('descriptionInput').firstChild;
const jsObject = document.getElementById('jsObject').firstChild;
const ws = Blockly.inject(blocklyDiv, {toolbox});
const ws2 = Blockly.inject(outputBlockDiv, {scrollbars:true});  //preview workspace

const regex = /[^a-zA-Z0-9_]+/g;

var tempJsonCode = "";
var previewBlock = null;
var prevBlockXY = null;
var blockDescription = "";
var blockCreator = null;

var jsonCode = "";
var jsCode = "";
var interpreterCode = "";

//set all of the HTML buttons' functions
window.onload = function() {
  var btn = document.getElementById("generatedCodeBtn");
  btn.onclick = function() { copyText("generatedCode")};

  btn = document.getElementById("jsBtn")
  btn.onclick = function() { copyText("javascript"); };

  btn = document.getElementById("interpreterBtn");
  btn.onclick = function() { copyText("interpreter"); };

  btn = document.getElementById("jsObjBtn");
  btn.onclick = function() { copyText("jsObject"); };

  btn = document.getElementById("descBtn");
  btn.onclick = function () { copyText("descriptionInput")};

  btn = document.getElementById("saveButton");
  btn.onclick = saveWorkspace;

}

// This function resets the code and output divs, shows the
// generated code from the workspace, and evals the code.
// In a real application, you probably shouldn't use `eval`.
const runCode = () => {
  const code = jsonGenerator.workspaceToCode(ws);
  const javascriptCode = javascriptGenerator.workspaceToCode(ws);

  //json code
  codeDiv.innerText = code;
  jsonCode = code;

  //split the interpreter code & js code (they are both handled in the javascript code)
    //the !DELIMITER! value is hardcoded in generators/javascript.js
    //shouldn't conflict with user values since JS code uses names, and those filter out special characters
  interpreterCode = javascriptCode.split("!DELIMITER!")[0];
  jsCode = javascriptCode.split("!DELIMITER!")[1];

  interpreterDiv.innerText = interpreterCode;
  outputDiv.innerHTML = jsCode;

  jsObject.innerText = JSON.stringify(generateJavascriptObj(code, interpreterCode, jsCode),null,'  ');

  //ensures it's either the block creator or null
  let blockCreators =  ws.getBlocksByType("block_creator", false);
  if(blockCreators.length > 0)
    blockCreator = blockCreators[0];
  
  blockDescription = blockCreator.getFieldValue("FIELD_DESCRIPTION");
  descriptionInput.innerText = blockDescription;

  //check for changes in the code to update the preview
  if(code != tempJsonCode)
  {

    //clear the preview workspace and replace it with a new block
    ws2.clear();

    //gets the name by splitting with quotation marks
    let newBlockType = code.split("\"")[3];

    //create a new block
    Blockly.Blocks[newBlockType] = {
      init: function() {
        this.jsonInit(
          JSON.parse(code)
        )
      }
    }
    
    //create the new block in the second workspace
    previewBlock = ws2.newBlock(newBlockType);

    //the first block; prevBlockXY hasn't been set
    if(prevBlockXY != null)
      previewBlock.moveBy(prevBlockXY.x, prevBlockXY.y);
    else
      previewBlock.moveBy(30, 30);

    //set up the new preview block
    previewBlock.initSvg();
    previewBlock.render();
    tempJsonCode = code;

  }

  //eval(code);
};

// Load the initial state from storage and run the code.
load(ws);
runCode();

// Every time the workspace changes state, save the changes to storage.
ws.addChangeListener((e) => {
  // UI events are things like scrolling, zooming, etc.
  // No need to save after one of these.
  if (e.isUiEvent) return;
  save(ws);
});

// Whenever the workspace changes meaningfully, run the code again.
ws.addChangeListener((e) => {
  // Don't run the code when the workspace finishes loading; we're
  // already running it once when the application starts.
  // Don't run the code during drags; we might have invalid state.
  if (e.isUiEvent || e.type == Blockly.Events.FINISHED_LOADING ||
    ws.isDragging()) {
    return;
  }

  //check for changes to update the description code
  if(e.type == Blockly.Events.BLOCK_CHANGE)
  {
    if(e.name == "FIELD_DESCRIPTION")
    {
      blockDescription = e.newValue;
    }
  }
  runCode();
});

//check if the user moves the block in the preview section
ws2.addChangeListener((e) => {

  //update the coordinates so that when the block is replaced its in the right spot
  if(e.type == Blockly.Events.BLOCK_MOVE )
  {
    prevBlockXY = e.newCoordinate;
  }

  runCode();
});

//for loading from a file
const fileSelector = document.getElementById('loadWorkspace');
fileSelector.addEventListener('change', (event) => {

  //get the files that were loaded
  const fileList = event.target.files;
  
  //reads the content of the file the user loaded
  var reader = new FileReader();
  reader.readAsText(fileList[0], "UTF-8");
  reader.onload = function (e) {

    //clear the workspace and replace it with the loaded workspace
    ws.clear();
    var newXml = Blockly.Xml.textToDom(e.target.result);
    Blockly.Xml.domToWorkspace(newXml, ws);

    //reset the fileSelector
    fileSelector.value = "";

    //reload the page to update the stubborn HTML elements that don't update automatically
    location.reload();
  }

});

//for generating the JS object in the second column
function generateJavascriptObj(json, interpreter, js) {
  
  if(blockCreator != null)
  {
    let block =
      {
        fileName: blockCreator.getFieldValue("BLOCK_NAME").replace(regex, "_") + ".js",
        category: blockCreator.getField("BLOCK_CATEGORY").selectedOption_[0],
        description: blockDescription,
        jsonCode: json,
        interpreterDeclaration: interpreter,
        jsCode: js,
        customName: blockCreator.getFieldValue("BLOCK_NAME").replace(regex, "_")
      };
    
    return block;
  }

  //if blockCreator is null then we have nothing to do
  return "";
}

//convert the workspace to XML and save the file to downloads
function saveWorkspace() {
  var xmlDom = Blockly.Xml.workspaceToDom(ws);
  var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
  let blob = new Blob([xmlText], {type: 'text/plain'});
  let link = document.getElementById("saveLink");

  link.download = blockCreator.getFieldValue("BLOCK_NAME").replace(regex, "_") + ".xml";
  link.href = URL.createObjectURL(blob);
}

//for the buttons that copy the code in the divs
function copyText(id){
  let text = document.getElementById(id).innerText;
  navigator.clipboard.writeText(text);
}