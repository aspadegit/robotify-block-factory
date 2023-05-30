/**
 * This file is for generating the code for the interpreter and for the JavaScript
 * Each generator[blockType] function generates the code for that block
 * generator['block_creator'] ties it all together, so the bulk of the code is in there
 */

/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {javascriptGenerator} from 'blockly/javascript';

export const generator = Object.create(null);
const regex = /[^a-zA-Z0-9_]+/g;  //removes special characters & spaces

//Coordinates the code for all of the blocks inside of it
generator['block_creator'] = function(block) {
  
  let code = "";
  let blockType = block.getFieldValue("BLOCK_NAME");
  blockType = blockType.replace(regex, "_");
  let paramList = []; 
  var delimiter = "!DELIMITER!";

  //get every name in the workspace
  var allBlocks = block.workspace.getAllBlocks(false);
  //this is the list of the parameters located in the interpeter code
  for(let i = 0; i < allBlocks.length; i++)
  {
    let param = allBlocks[i].getFieldValue("FIELDNAME");

    //try and see if it's an input, if that input is null
    if(param === null)
      param = allBlocks[i].getFieldValue("INPUTNAME");

    if(param != null && allBlocks[i].type != "text_label" && shouldOutputCode(allBlocks[i]))
    {
      param = param.replace(regex, "_");
      paramList.push(param);
    }
  }

  let finalParamList = paramList.toString();
  if(finalParamList != "")
    finalParamList+= ",";

  //interpreter declaration
  let interpreterDeclaration = `
function init${blockType}(interpreter, globalObject)
{
  var wrapper = async function(${finalParamList}callback)
  {};

  Blockly.JavaScript.addReservedWords('${blockType}');
  interpreter.setProperty(globalObject, '${blockType}', interpreter.createAsyncFunction(wrapper));
}

init${blockType}(interpreter, globalObject);\n
`

  //this is the same as in generators/json.js (with some simplifications)
  //generates the code in the JavaScript section
  if(block.getChildren(false).length > 0)
  {
    let nextBlock = block.getChildren(false)[0];
    while(nextBlock != null)
    {
      code += javascriptGenerator.blockToCode(nextBlock,true);

      //make the indent nonexistent (statementToCode auto indents)
      javascriptGenerator.INDENT = "";
      let nestedStatements = javascriptGenerator.statementToCode(nextBlock, 'FIELDS');        
      if(nestedStatements != "")
          code += nestedStatements;

      //continue down the line
      nextBlock = nextBlock.getNextBlock();
    }

    //restore indent to default (two spaces)
    javascriptGenerator.INDENT = "  ";
  }

  // get the variable names by splitting the string of the JS code
  // probably not efficient or good practice
  let splitByVar = code.split("var ");
  let variableNames = [];
  for(let i = 1; i < splitByVar.length; i++)
  {
    let splitBySpaces = splitByVar[i].split(" ");
    variableNames.push(`" ' + ${splitBySpaces[0]} + ' "`);
  }
 
  code += `var code = '${blockType}(${variableNames.toString()})`;

  //for left output type
  if(block.getFieldValue("DROPDOWN_CONNECTIONS") === "OPTION_CONNECTIONS_LEFT")
  { 
    let leftOutputEndCode = "';\nreturn [code, Blockly.JavaScript.ORDER_NONE];\n"
    return interpreterDeclaration + delimiter + code + leftOutputEndCode;
  }

  //for anything that isn't the left output type
  return interpreterDeclaration + delimiter  + code + `;\\n';` + "\nreturn code;";

}

//======== the rest of the code is for each individual block. it creates the var ... = ... in the JS code =============

generator['text_input'] = function(block) {
  if(!shouldOutputCode(block)) return null;

  let blockName = block.getFieldValue("FIELDNAME");

  return "var text_" + blockName.toLowerCase()
   + " = block.getFieldValue(\'" + blockName + "\');\n";

}

//labels aren't relevant to function of the block
generator['text_label'] = function(block) {  return ""; }

generator['dummy_input'] = function(block) { return ""; }

generator['numeric_input'] = function(block) {
  if(!shouldOutputCode(block)) return null;

  let blockName = block.getFieldValue("FIELDNAME");
  blockName = blockName.replace(regex, "_");

  return "var number_" + blockName.toLowerCase()
    + " = block.getFieldValue(\'" + blockName + "\');\n";
}

generator['angle_input'] = function(block) {
  if(!shouldOutputCode(block)) return null;

  let blockName = block.getFieldValue("FIELDNAME");
  blockName = blockName.replace(regex, "_");

  return "var angle_" + blockName.toLowerCase() +
    " = block.getFieldValue(\'" + blockName + "\');\n";
}

generator['field_dropdown'] = function(block) {
  if(!shouldOutputCode(block)) return null;

  let blockName = block.getFieldValue("FIELDNAME");
  blockName = blockName.replace(regex, "_");

  return "var dropdown_" + blockName.toLowerCase() +
   " = block.getFieldValue(\'" + blockName + "\');\n";

}

generator['field_checkbox'] = function(block) {
  if(!shouldOutputCode(block)) return null;

  let blockName = block.getFieldValue("FIELDNAME");
  blockName = blockName.replace(regex, "_");

  return "var checkbox_" + blockName.toLowerCase() +
    " = block.getFieldValue(\'" + blockName + "\') === 'TRUE';\n";
}

generator['field_colour'] = function(block) {
  if(!shouldOutputCode(block)) return null;

  let blockName = block.getFieldValue("FIELDNAME");
  blockName = blockName.replace(regex, "_");

  return "var colour_" + blockName.toLowerCase() +
    " = block.getFieldValue(\'" + blockName + "\');\n";
}

generator['field_variable'] = function(block) {
  if(!shouldOutputCode(block)) return null;

  let blockName = block.getFieldValue("FIELDNAME");
  blockName = blockName.replace(regex, "_");

  return "var variable_" + blockName.toLowerCase() +
    " = Blockly.JavaScript.nameDB_.getName(block.getFieldValue(\'" + blockName + "\'), Blockly.Variables.NAME_TYPE);\n";
}

generator['field_image'] = function(block) { return ""; }

generator['input_value'] = function(block) {
  if(!shouldOutputCode(block)) return null;

  let blockName = block.getFieldValue("INPUTNAME");
  blockName = blockName.replace(regex, "_");

  return "var value_" + blockName.toLowerCase() +
    ` = Blockly.JavaScript.valueToCode(block, '${blockName}', Blockly.JavaScript.ORDER_ATOMIC);\n`;

}

generator['input_statement'] = function(block) {

  if(!shouldOutputCode(block)) return null;

  let blockName = block.getFieldValue("INPUTNAME");
  blockName = blockName.replace(regex, "_");

  return "var statements_" + blockName.toLowerCase() +
    ` = Blockly.JavaScript.statementToCode(block, '${blockName}');\n`;

}

//none of the type requirements return any JS/interpreter code
generator['type_group'] = function(block) { return "";}
generator['type_null'] = function(block) { return "";}
generator['type_boolean'] = function(block) { return "";}
generator['type_number'] = function(block) { return "";}
generator['type_string'] = function(block) { return "";}
generator['type_list'] = function(block) { return "";}
generator['type_other'] = function(block) { return "";}

//for when a block is not inside the block creator (should not output code unless it is in the block creator)
//same as in JSON generator
function shouldOutputCode(block)
{
    let surroundParent = block.getSurroundParent();

    //get highest level parent. should be block_creator if it's connected
    while(surroundParent != null && surroundParent.type != "block_creator")
    {
        surroundParent = surroundParent.getSurroundParent();
    }

    if(surroundParent != null)
        return true;
    
    //surroundParent is null -> it's not connected -> should not output code
    return false;

}