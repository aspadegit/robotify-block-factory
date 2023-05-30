/**
 * This file is for generating the code for the block definition JSON
 * Each generator[blockType] function generates the code for that block
 * generator['block_creator'] ties it all together, so the bulk of the code is in there
 */

import * as Blockly from 'blockly';

export const jsonGenerator = new Blockly.Generator('JSON');
export var previewBlockType = "";

const regex = /[^a-zA-Z0-9_]+/g;

//json doesn't allow expressions, so precedence is all 0
jsonGenerator.PRECEDENCE = 0;

//override the .scrub_ function to handle stacks of blocks
//  thisOnly generates code for ONLY this block & no subsequent blocks when true
jsonGenerator.scrub_ = function(block, code, thisOnly) {
    const nextBlock = 
        block.nextConnection && block.nextConnection.targetBlock();
    
    //if there's a next block && scrub should generate code for more than this block
    if(nextBlock && !thisOnly) {
        return code + ',\n' + jsonGenerator.blockToCode(nextBlock);
    }

    return code;
};

// handles & organizes all of the code of the individual blocks
jsonGenerator['block_creator'] = function(block) {

    let blockName = block.getFieldValue("BLOCK_NAME").toLowerCase();
    blockName = blockName.replace(regex, "_");
    previewBlockType = blockName;
    let args = `"args0": [\n`;
    let argsCount = 1;  //i forget why it's one. i think it's for an empty input case
    let decreaseArgs = 0;   //argsCount is based on a list length, but some things don't add to the args, so the amount to decrease is here
    
    //probably could/should have increased args as i went instead of starting them at a value & decreasing
        //but i ran into issues a long time ago, and so it ended up weird like this (sorry)

    // if the block creator is not empty
    if(block.getChildren(false).length > 0)
    {
        let firstChild = block.getChildren(false)[0];
        let nestedStatements = jsonGenerator.statementToCode(firstChild, 'FIELDS');
        let nextBlock = firstChild.getNextBlock();

        //add the nested statements first (will be "" if there are no nested statements in the input)
        if(nestedStatements != "")
        {
            args += nestedStatements;
            args += ",\n"
        }

        //dummy input is only added to the JSON if there is a block below it
        let isDummy = isDummyBlock(firstChild);
        let writeDummyJson = isDummy && nextBlock != null;

        if(writeDummyJson || !isDummy)
        {
            //print the block to the JSON
            args += jsonGenerator.prefixLines(jsonGenerator.blockToCode(firstChild,true), "  ");
            decreaseArgs += checkOutputToDecreaseArgs(firstChild);
            args += ",\n";
        }

        //adjust args to be deleted if it's ending on a dummy
            //since the dummy isn't added to the JSON if it doesn't have a next block
        if(isDummy && nextBlock === null)
        {
            decreaseArgs++;
            if(nestedStatements === "")
                args+= "  ";    //offsets the substring at the end (avoids brackets being deleted)
        }

        //use a loop to get all the others ==================================================

        while(nextBlock != null)
        {
            //the input's nested statements
            let nestedStatements = jsonGenerator.statementToCode(nextBlock, 'FIELDS');        
            if(nestedStatements != "")
                args += nestedStatements +  ",\n" ;
            
           
            //input statement (like dummy, value, or statement)
            args += jsonGenerator.prefixLines(jsonGenerator.blockToCode(nextBlock,true), "  ");
            decreaseArgs += checkOutputToDecreaseArgs(nextBlock);
            args += ",\n";
        


            //continue down the line
            nextBlock = nextBlock.getNextBlock();
        }

        //cut off the ending comma + newline (,\n)
        args = args.substring(0, args.length-2);
        args += "\n],\n";

        //adjust overall args spacing
        args = jsonGenerator.prefixLines(args, "  ");

    }
    else
    {
        args = "";
    }
    

    argsCount = block.getDescendants(false).length - 1;
    argsCount = argsCount - decreaseArgs;

    //message (shows the args from argsCount)
    let message = ""; 
    if(argsCount > 0)
    {
        message = `  "message0": "`;
        for(let i = 0; i < argsCount-1; i++)
        {
            message += "%" + (i+1) + " ";
        }
        message += "%" + argsCount + `",\n`
    }


    //determine colour
    let colour = `  "colour": `;
    const category = block.getFieldValue("BLOCK_CATEGORY");
    colour += "\"" + categoryToColour(category) + "\",\n";

    //determine input type
    const inputType = block.getFieldValue("DROPDOWN_INPUT");
    let inputTypeString = inputTypeToString(inputType);

    //determine connections
    const connection = block.getFieldValue("DROPDOWN_CONNECTIONS");
    let connectionString = connectionToString(connection);

    //tooltip and helpurl are just strings
    const tooltip = `  "tooltip": "` + block.getFieldValue("FIELD_TOOLTIP") + `", \n`;
    const helpUrl = `  "helpUrl": "` + block.getFieldValue("FIELD_HELP") + `"`;

    //description is handled in index.js

    //put it all together
    const code =
        '{\n' + 
        `  "type": "${blockName}",` + '\n' +
        message +
        args +
        inputTypeString +
        connectionString +
        colour +
        tooltip +
        helpUrl +
        '\n}';

    return code;
    
};

//============ The rest of this is individual blocks that block_creator uses to generate code ===================

jsonGenerator['dummy_input'] = function(block){
    if(!shouldOutputCode(block)) return null;

    //alignment
    let align = block.getFieldValue("ALIGN");
    if(align === "LEFT")
        align = "";
    else
        align = `,\n  "align": "${align}"`

    return `{\n  "type": "input_dummy"${align}\n}`;
};

//text that the user can input on the final block
jsonGenerator['text_input'] = function (block){
    if(!shouldOutputCode(block)) return null;

    //it's an input type for text
    const type = `  "type": "field_input",\n`;

    //the name of the field (how to access it)
    let name = block.getFieldValue("FIELDNAME");
    name = name.replace(regex, "_");
    name = `  "name": "${name}",\n`;
    
    //the text of the field (what the user types in)
    let text = block.getFieldValue("TEXT");
    text = `  "text": "${text}"\n`;

    return "{\n" + type + name + text + "}"
};

//text that shows as a label (that the user can't edit on the final block)
jsonGenerator['text_label'] = function(block) {
    if(!shouldOutputCode(block)) return null;

    const type = `  "type": "field_label",\n`;

    //what distinguishes it from other fields
    let name = block.getFieldValue("FIELDNAME");
    name = name.replace(regex, "_");
    name = `  "name": "${name}", \n`;

    //what the label text says
    let text = block.getFieldValue("TEXT");
    text = `  "text": "${text}"\n`;

    return "{\n" + type + name + text + "}";

};

//field_numeric is a more accurate name 
jsonGenerator['numeric_input'] = function(block) {
    if(!shouldOutputCode(block)) return null;

    //these values must always be included
    const type = `  "type": "field_number",\n`;
    const name = `  "name": "` + block.getFieldValue("FIELDNAME").replace(regex, "_") + `",\n`;
    const value = `  "value": ` + block.getFieldValue("VALUE");

    //the values that might not be included
    const min = block.getFieldValue("MIN");
    let minString = "";
    const max = block.getFieldValue("MAX");
    let maxString = "";
    const precision = block.getFieldValue("PRECISION");
    let precisionString = "";

    //only include min, max, and precision if they have values of note
    if(min > -Infinity)
        minString = `,\n  "min": ` + min;
    if(max < Infinity)
        maxString = `,\n  "max": ` + max;
    if(precision != 0)
        precisionString = `,\n  "precision": ` + precision;
   
    return "{\n" + type + name + value + minString + maxString + precisionString + "\n}";


};

//field_angle is a more accurate name 
jsonGenerator['angle_input'] = function(block) {
    if(!shouldOutputCode(block)) return null;

    const type = `  "type": "field_angle",\n`;

    //what distinguishes it from other fields
    let name = block.getFieldValue("FIELDNAME");
    name = name.replace(regex, "_");
    name = `  "name": "${name}",\n`;

    //what default angle is shown
    let angle = block.getFieldValue("ANGLE");
    angle = `  "angle": ${angle}\n`;

    return "{\n" + type + name + angle + "}";
};

jsonGenerator['field_dropdown'] = function(block) {
    if(!shouldOutputCode(block)) return null;

    //fields:
    // USER+i = what the user puts as the name of the option, that's visible in the final block
    // CPU+i = the "name" value of the option (used for accessing values with getFieldValue, not visible in final block)

    // for images:
    // SRC+i, WIDTH+i, HEIGHT+i, ALT+i for each of those values
    // CPU+i: same as above

    const type = `  "type": "field_dropdown",\n`;

    //what distinguishes it from other fields
    let name = block.getFieldValue("FIELDNAME");
    name = name.replace(regex, "_");
    name = `  "name": "${name}",\n`;

    let optionString = `  "options": [\n`;

    for(let i = 0; i < block.optionList_.length; i++)
    {
        //open the brackets for this option
        optionString += "    [\n"
        let prefix = "      ";  //prefix for everything inside an option

        //image
        if(block.optionList_[i] === "image")
        {   
            optionString += prefix + "{\n";
            optionString += prefix + `  "src": "` + block.getFieldValue("SRC"+i) + `",\n`;
            optionString += prefix + `  "width": ` + block.getFieldValue("WIDTH"+i) + `,\n`;
            optionString += prefix + `  "height": ` + block.getFieldValue("HEIGHT"+i) + `,\n`;
            optionString += prefix + `  "alt": "` + block.getFieldValue("ALT"+i) + `",\n`;
            optionString += prefix + "},\n";

            optionString += prefix + "\"" + block.getFieldValue("CPU"+i) + "\"\n";
        }
        //text
        else
        {
            optionString += prefix + "\"" + block.getFieldValue("USER"+i) + "\",\n";
            optionString += prefix + "\"" + block.getFieldValue("CPU"+i) + "\"\n";
        }

        //close the brackets for this option
        optionString += "    ]";
        if(i < block.optionList_.length-1) 
            optionString += ",";
        optionString += "\n";
    }

    optionString += "  ]\n"

    return "{\n" + type + name + optionString + "}";
};

jsonGenerator['field_checkbox'] = function(block) {
    if(!shouldOutputCode(block)) return null;

    const type = `  "type": "field_checkbox",\n`;

    //what distinguishes it from other fields
    let name = block.getFieldValue("FIELDNAME");
    name = name.replace(regex, "_");
    name = `  "name": "${name}",\n`;

    //whether it is checked or unchecked by default
    let checked = block.getFieldValue("CHECKED");
    checked = checked.toLowerCase();
    checked = `  "checked": ${checked}\n`;

    return "{\n" + type + name + checked + "}";

};

jsonGenerator['field_colour'] = function(block) {
    if(!shouldOutputCode(block)) return null;

    const type = `  "type": "field_colour",\n`;

    //what distinguishes it from other fields
    let name = block.getFieldValue("FIELDNAME");
    name = name.replace(regex, "_");
    name = `  "name": "${name}",\n`;

    //what colour it is by default
    let colour = block.getFieldValue("COLOUR");
    colour = `  "colour": "${colour}"\n`;

    return "{\n" + type + name + colour + "}";

};

jsonGenerator['field_variable'] = function(block) {
    if(!shouldOutputCode(block)) return null;

    const type = `  "type": "field_variable",\n`;

    //what distinguishes it from other fields
    let name = block.getFieldValue("FIELDNAME");
    name = name.replace(regex, "_");
    name = `  "name": "${name}",\n`;

    //what the default variable name is
    let variable = block.getFieldValue("TEXT");
    variable = `  "variable": "${variable}"\n`;

    return "{\n" + type + name + variable + "}";

};

jsonGenerator['field_image'] = function(block) {
    if(!shouldOutputCode(block)) return null;

    const type = `  "type": "field_image",\n`;

    // the following are all default settings of the image
    let src = block.getFieldValue("SRC");
    src = `  "src": "${src}",\n`;

    let width = block.getFieldValue("WIDTH");
    width = `  "width": ${width},\n`;

    let height = block.getFieldValue("HEIGHT");
    height = `  "height": ${height},\n`;

    //alt text of the image
    let alt = block.getFieldValue("ALT");
    alt = `  "alt": "${alt}",\n`;

    let rtl = block.getFieldValue("FLIP_RTL").toLowerCase();
    rtl = `  "flipRtl": ${rtl}\n`;

    return "{\n" + type + src + width + height + alt + rtl + "}";

};

jsonGenerator['input_value'] = function(block) {

    if(!shouldOutputCode(block)) return null;

    const type = `  "type": "input_value",\n`;

    let name = block.getFieldValue("INPUTNAME");
    name = name.replace(regex, "_");
    name = `  "name": "${name}"`;

    //type block (if there's an easier way to access it, i don't know it)    
    let typeConnection = block.getInput("TYPE").connection.targetConnection;
    let allowedType = "\n";

    //null checks to ensure that there is indeed a type block attached
    if(typeConnection != null)
        if(jsonGenerator.blockToCode(typeConnection.sourceBlock_) != "")
            allowedType = `,\n  "check": ` + jsonGenerator.blockToCode(typeConnection.sourceBlock_);

        
    //alignment
    let align = block.getFieldValue("ALIGN");
    if(align === "LEFT")
        align = "";
    else
        align = `,\n  "align": "${align}"`

    return "{\n" + type + name + align + allowedType + "\n}";

};

jsonGenerator['input_statement'] = function(block) {
    if(!shouldOutputCode(block)) return null;

    const type = `  "type": "input_statement",\n`;

    let name = block.getFieldValue("INPUTNAME");
    name = name.replace(regex, "_");
    name = `  "name": "${name}"`;

    //type block (if there's an easier way, i don't know it)

    let typeConnection = block.getInput("TYPE").connection.targetConnection;
    let allowedType = "\n";

    //null checks to ensure that there is indeed a type block attached
    if(typeConnection != null)
        if(jsonGenerator.blockToCode(typeConnection.sourceBlock_) != "")
            allowedType = `,\n  "check": ` + jsonGenerator.blockToCode(typeConnection.sourceBlock_) + "\n";

    //alignment
    let align = block.getFieldValue("ALIGN");
    if(align === "LEFT")
        align = "";
    else
        align = `,\n  "align": "${align}"`

    return "{\n" + type + name + align + allowedType + "}";

};

//multiple types
jsonGenerator['type_group'] = function(block) {
    if(!shouldOutputCode(block)) return null;

    let check = `[`;
    let allNull = true;

    //for every block in the type list
    for(let i = 0; i < block.typeCount_; i++)
    {
        let targetConnect = block.getInput("TYPE"+i).connection.targetConnection;
        if(targetConnect != null)
        {
            check += jsonGenerator.blockToCode(targetConnect.sourceBlock_) + ", ";
            
            allNull = false;
        }
    }

    //if the user doesn't put any types in, default to "any" type
    if(allNull)
        return "";

    //cut off the trailing comma
    check = check.slice(0, check.length-2);

    check += "]";
    return check;

};

//any type
jsonGenerator['type_null'] = function(block) {
    return "";
};

jsonGenerator['type_boolean'] = function(block) {
    if(!shouldOutputCode(block)) return null;

    return `"Boolean"`;
};

jsonGenerator['type_number'] = function(block) {
    if(!shouldOutputCode(block)) return null;

    return `"Number"`;
};

jsonGenerator['type_string'] = function(block) {
    if(!shouldOutputCode(block)) return null;

    return `"String"`;
};

jsonGenerator['type_list'] = function(block) {
    if(!shouldOutputCode(block)) return null;

    return `"Array"`;
};

//user-inputted type
jsonGenerator['type_other'] = function(block) {

    if(!shouldOutputCode(block)) return null;
    
    let customType = block.getFieldValue("TYPE");

    if(customType === "")
        return "";

    return `"${customType}"`;
};

//category is a string based on the Robotify categories that determines the colour of the resulting block 
function categoryToColour(category)
{
    switch(category)
    {
        case "CATEGORY_MOVEMENT":
            return "#D91E1E";
        case "CATEGORY_SENSING":
            return "#FF811E";
        case "CATEGORY_LOGIC":
            return "#FFA800";
        case "CATEGORY_LOOPS":
            return "#3EBB10";
        case "CATEGORY_MATH":
            return "#0ACA96";
        case "CATEGORY_TEXT":
            return "#0AB6D4";
        case "CATEGORY_LISTS":
            return "#0A68CA";
        case "CATEGORY_VARIABLES":
            return "#5C0ACA";
        default:
            return 230;
    }
}

//inputType is a string to determine whether its auto, inline, or external
function inputTypeToString(inputType)
{
    switch(inputType)
    {
        case "OPTION_AUTO":
            return "";
        case "OPTION_EXTERNAL":
            return `  "inputsInline": false,\n`;
        case "OPTION_INLINE":
            return `  "inputsInline": true,\n`;

    }

    return "";
}

//connection is a string that determines how a block will connect to others
function connectionToString(connection)
{
    switch(connection)
    {
        case "OPTION_CONNECTIONS_LEFT":
            return `  "output": null,\n`;
            
        case "OPTION_CONNECTIONS_TOP_BOTTOM":
            return `  "previousStatement": null,\n  "nextStatement": null,\n`;

        case "OPTION_CONNECTIONS_TOP":
            return `  "previousStatement": null,\n`;
        
        case "OPTION_CONNECTIONS_BOTTOM":
            return `  "nextStatement": null,\n`;

    }
    return "";
}

//when counting args, decrease for every type block you find (for the message0: %1 %2....)
function checkOutputToDecreaseArgs(block)
{
    let decreaseArgs = 0;

    if(block.type.includes("dummy_input"))
        return 0;

    //type blocks don't add to the message list of args (ex: type boolean, type any, etc.)
        //accessing them is weird (but this works)
    let typeConnect = block.getInput("TYPE").connection.targetConnection;
    if(typeConnect != null)
    {
        decreaseArgs++;

        //more connections to delete (type_group can have a list of types it accepts)
        if(typeConnect.sourceBlock_.type === "type_group")
        {
            for(let i = 0; i < typeConnect.sourceBlock_.typeCount_; i++)
            {
                if(typeConnect.sourceBlock_.getInput("TYPE"+i).connection.targetConnection != null)
                    decreaseArgs++;
            }
        }
    }

    return decreaseArgs;
}

//returns false if null
function isDummyBlock(block)
{
    if(block != null)
        return block.type === "dummy_input";

    return false;
}

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