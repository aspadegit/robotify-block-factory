/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {javascriptGenerator} from 'blockly/javascript';

// Export all the code generators for our custom blocks,
// but don't register them with Blockly yet.
// This file has no side effects!
export const generator = Object.create(null);
const regex = /[^a-zA-Z0-9_]+/g;
//export const jsGenerator = new Blockly.Generator('js');

generator['add_text'] = function(block) {
  const text = javascriptGenerator.valueToCode(block, 'TEXT',
      javascriptGenerator.ORDER_NONE) || '\'\'';
  const color = javascriptGenerator.valueToCode(block, 'COLOR',
      javascriptGenerator.ORDER_ATOMIC) || '\'#ffffff\'';

  const addText = javascriptGenerator.provideFunction_(
      'addText',
      ['function ' + javascriptGenerator.FUNCTION_NAME_PLACEHOLDER_ +
          '(text, color) {',
      '  // Add text to the output area.',
      '  const outputDiv = document.getElementById(\'output\');',
      '  const textEl = document.createElement(\'p\');',
      '  textEl.innerText = text;',
      '  textEl.style.color = color;',
      '  outputDiv.appendChild(textEl);',
      '}']);
    // Generate the function call for this block.
  const code = `${addText}(${text}, ${color});\n`;
  return code;
};

generator['block_creator'] = function(block) {
  
  let code = "";
  let blockType = block.getFieldValue("BLOCK_NAME");
  blockType = blockType.replace(regex, "_");
  let paramList = []; 
  var delimiter = "!DELIMITER!";

  //get every name in the workspace
  var allBlocks = block.workspace.getAllBlocks(false);
  for(let i = 0; i < allBlocks.length; i++)
  {
    let param = allBlocks[i].getFieldValue("FIELDNAME");

    //try and see if it's an input if it's null
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

  // get the variable names 
  // probably not efficient at all
  let splitByVar = code.split("var ");
  let variableNames = [];
  for(let i = 1; i < splitByVar.length; i++)
  {
    let splitBySpaces = splitByVar[i].split(" ");
    variableNames.push(`" ' + ${splitBySpaces[0]} + ' "`);
  }
 
  code += `var code = '${blockType}(${variableNames.toString()})`;
  //for anything WITHOUT left output type

  //for left output type
  let leftOutputEndCode = "';\nreturn [code, Blockly.JavaScript.ORDER_NONE];\n"

  if(block.getFieldValue("DROPDOWN_CONNECTIONS") === "OPTION_CONNECTIONS_LEFT")
  {
    return interpreterDeclaration + delimiter + code + leftOutputEndCode;
  }

  return interpreterDeclaration + delimiter  + code + `;\\n';` + "\nreturn code;";

}

generator['text_input'] = function(block) {
  if(!shouldOutputCode(block)) return null;

  let blockName = block.getFieldValue("FIELDNAME");

  return "var text_" + blockName.toLowerCase()
   + " = block.getFieldValue(\'" + blockName + "\');\n";

}

//labels aren't relevant to function of the block
generator['text_label'] = function(block) {

  return "";

}

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

generator['type_group'] = function(block) { return "";}
generator['type_null'] = function(block) { return "";}
generator['type_boolean'] = function(block) { return "";}
generator['type_number'] = function(block) { return "";}
generator['type_string'] = function(block) { return "";}
generator['type_list'] = function(block) { return "";}
generator['type_other'] = function(block) { return "";}

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
    
    //surroundParent is null -> it's not connected -> should not output JSON
    return false;

}