import * as Blockly from 'blockly';

//TODO: (all) auto replace spaces with underscores
//TODO: remove blocks in the "other" tab from the toolbox

export const jsonGenerator = new Blockly.Generator('JSON');
export var previewBlockType = "";

const regex = /[^a-zA-Z0-9_]+/g;

//json doesn't allow expressions, so precedence is all 0
jsonGenerator.PRECEDENCE = 0;

//the null block
jsonGenerator['logic_null'] = function(block) {
    //always returns null; string because JSON uses strings
    return ['null', jsonGenerator.PRECEDENCE];
};

//the text block
jsonGenerator['text'] = function(block) {

    //get the text inside of the block
    const textValue = block.getFieldValue('TEXT');
    //wrap the value in additional quotation marks
        //because it is a string in the JSON code
    const code = `"${textValue}"`;

    //return the text inside of the block
    return [code, jsonGenerator.PRECEDENCE];
};

//number block
jsonGenerator['math_number'] = function(block) {
    //convert the number to a string for JSON
    const code = String(block.getFieldValue('NUM'));
    return [code, jsonGenerator.PRECEDENCE];
};

//bool block
jsonGenerator['logic_boolean'] = function(block) {
    
    //code is 'true' if true, 'false' if false
    const code = (block.getFieldValue('BOOL') === 'TRUE') ? 'true' : 'false';
    return [code, jsonGenerator.PRECEDENCE];

};

//member generator
jsonGenerator['member'] = function(block) {
    const name = block.getFieldValue('MEMBER_NAME');

    //finds the block attached to "MEMBER_VALUE", and turns it to code
    const value = jsonGenerator.valueToCode(
        block, 'MEMBER_VALUE', jsonGenerator.PRECEDENCE); 

    const code = `"${name}": ${value}`;

    return code;
};

//array block
jsonGenerator['lists_create_with'] = function(block) {

    //get the values from the block into an array
    const values = [];
    for(let i = 0; i < block.itemCount_; i++) {

        //the values in the blocks will be ADD0, ADD1...
        const valueCode = jsonGenerator.valueToCode(block, 'ADD'+i,
            jsonGenerator.PRECEDENCE);
        
        //avoids null values (only push if exists)
        if(valueCode) {
            values.push(valueCode);
        }
    }

    //values is currently an array of strings
    //  join values into a SINGLE string (with , & newline between each)
    const valueString = values.join(',\n');

    //add indentation to each line
    //  INDENT defaults to 2 spaces
    const indentedValueString = 
        jsonGenerator.prefixLines(valueString, jsonGenerator.INDENT);

    //wrap in brackets
    const codeString = '[\n' + indentedValueString + '\n]';
    return [codeString, jsonGenerator.PRECEDENCE];

};

//object block generator
jsonGenerator['object'] = function(block) {

    //statementToCode auto indents
    const statement_members = 
        jsonGenerator.statementToCode(block, 'MEMBERS');

    const code = '{\n' + statement_members + '\n}';
    return [code, jsonGenerator.PRECEDENCE];
};

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

jsonGenerator['block_creator'] = function(block) {

    let blockName = block.getFieldValue("BLOCK_NAME").toLowerCase();
    blockName = blockName.replace(regex, "_");
    previewBlockType = blockName;
    let args = `"args0": [\n`;
    let argsCount = 1;
    let decreaseArgs = 0;

    if(block.getChildren(false).length > 0)
    {
        let firstChild = block.getChildren(false)[0];
        let nestedStatements = jsonGenerator.statementToCode(firstChild, 'FIELDS');
        let nextBlock = firstChild.getNextBlock();

        //add the nested statements first
        if(nestedStatements != "")
        {
            args += nestedStatements;
            args += ",\n"
        }

        //dummy input is only added if there is a block below it
        let isDummy = isDummyBlock(firstChild);
        let writeDummyJson = isDummy && nextBlock != null;

        if(writeDummyJson || !isDummy)
        {
            args += jsonGenerator.prefixLines(jsonGenerator.blockToCode(firstChild,true), "  ");
            decreaseArgs += checkOutputToDecreaseArgs(firstChild);
            args += ",\n";
        }

        //adjust args to be deleted if it's ending on a dummy
        if(isDummy && nextBlock === null)
        {
            decreaseArgs++;
            if(nestedStatements === "")
                args+= "  ";    //offsets the substring at the end (avoids brackets being deleted)
        }

        //use a loop to get all the others ==================================================

        while(nextBlock != null)
        {
            //its nested statements
            let nestedStatements = jsonGenerator.statementToCode(nextBlock, 'FIELDS');        
            if(nestedStatements != "")
                args += nestedStatements +  ",\n" ;
            
           
            //input statement
            args += jsonGenerator.prefixLines(jsonGenerator.blockToCode(nextBlock,true), "  ");
            decreaseArgs += checkOutputToDecreaseArgs(nextBlock);
            args += ",\n";
        


            //continue down the line
            nextBlock = nextBlock.getNextBlock();
        }

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

    //message
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

    const tooltip = `  "tooltip": "` + block.getFieldValue("FIELD_TOOLTIP") + `", \n`;
    const helpUrl = `  "helpUrl": "` + block.getFieldValue("FIELD_HELP") + `"`;

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

jsonGenerator['text_label'] = function(block) {
    if(!shouldOutputCode(block)) return null;

    const type = `  "type": "field_label",\n`;

    let name = block.getFieldValue("FIELDNAME");
    name = name.replace(regex, "_");
    name = `  "name": "${name}", \n`;

    let text = block.getFieldValue("TEXT");
    text = `  "text": "${text}"\n`;

    return "{\n" + type + name + text + "}";

};

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

jsonGenerator['angle_input'] = function(block) {
    if(!shouldOutputCode(block)) return null;

    const type = `  "type": "field_angle",\n`;

    let name = block.getFieldValue("FIELDNAME");
    name = name.replace(regex, "_");
    name = `  "name": "${name}",\n`;

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

    let name = block.getFieldValue("FIELDNAME");
    name = name.replace(regex, "_");
    name = `  "name": "${name}",\n`;

    let checked = block.getFieldValue("CHECKED");
    checked = checked.toLowerCase();
    checked = `  "checked": ${checked}\n`;

    return "{\n" + type + name + checked + "}";

};

jsonGenerator['field_colour'] = function(block) {
    if(!shouldOutputCode(block)) return null;

    const type = `  "type": "field_colour",\n`;

    let name = block.getFieldValue("FIELDNAME");
    name = name.replace(regex, "_");
    name = `  "name": "${name}",\n`;

    let colour = block.getFieldValue("COLOUR");
    colour = `  "colour": "${colour}"\n`;

    return "{\n" + type + name + colour + "}";

};

jsonGenerator['field_variable'] = function(block) {
    if(!shouldOutputCode(block)) return null;

    const type = `  "type": "field_variable",\n`;

    let name = block.getFieldValue("FIELDNAME");
    name = name.replace(regex, "_");
    name = `  "name": "${name}",\n`;

    let variable = block.getFieldValue("TEXT");
    variable = `  "variable": "${variable}"\n`;

    return "{\n" + type + name + variable + "}";

};

jsonGenerator['field_image'] = function(block) {
    if(!shouldOutputCode(block)) return null;

    const type = `  "type": "field_image",\n`;

    let src = block.getFieldValue("SRC");
    src = `  "src": "${src}",\n`;

    let width = block.getFieldValue("WIDTH");
    width = `  "width": ${width},\n`;

    let height = block.getFieldValue("HEIGHT");
    height = `  "height": ${height},\n`;

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

    //type block (if there's an easier way, i don't know it)    
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

jsonGenerator['type_other'] = function(block) {

    if(!shouldOutputCode(block)) return null;
    
    let customType = block.getFieldValue("TYPE");

    if(customType === "")
        return "";

    return `"${customType}"`;
};


//TODO: temporary, remove later
//jsonGenerator[previewBlockType] = function(block) {    return "";};

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

//when counting args, decrease for every type block you find
function checkOutputToDecreaseArgs(block)
{
    let decreaseArgs = 0;

    if(block.type.includes("dummy"))
        return 0;

    let typeConnect = block.getInput("TYPE").connection.targetConnection;
    if(typeConnect != null)
    {
        decreaseArgs++;

        //more connections to delete
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