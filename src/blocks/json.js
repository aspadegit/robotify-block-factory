import * as Blockly from 'blockly';

export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray([{
  "type": "object",
  "message0": "{ %1 %2 }",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "MEMBERS"
    }
  ],
  "output": null,
  "colour": 230,
},

//newblock (copy and paste from what's created on the sample app)
{
  "type": "newblock",
  "message0": "%1 %2 %3 %4 %5 %6",
  "args0": [
    {
      "type": "input_value",
      "name": "name_To_Check",
      "align": "RIGHT"

    },
    {
      "type": "field_label",
      "name": "NAME",
      "text": "dsfdf"
    },
    {
      "type": "field_image",
      "src": "https://www.gstatic.com/codesite/ph/images/star_on.gif",
      "width": 15,
      "height": 15,
      "alt": "*",
      "flipRtl": false
    },
    {
      "type": "input_dummy",
      "align": "RIGHT"
    },
    {
      "type": "field_dropdown",
      "name": "NAME",
      "options": [
        [
          {
            "src": "https://www.gstatic.com/codesite/ph/images/star_on.gif",
            "width": 15,
            "height": 15,
            "alt": "*",
          },
          "OPTIONNAME"
        ],
        [
          "option",
          "nbnbbcbvc"
        ]
      ]
    },
    {
      "type": "input_statement",
      "name": "NAME",
      "align": "RIGHT",
      "check": "Boolean"
    }
  ],
  "previousStatement": null,
  "colour": "#FFA800",
  "tooltip": "this is a tooltip",
  "helpUrl": "helpurl"
},

//block creator
{
  "type": "block_creator",
  "message0": "Block Name %1 %2 Block Category %3 %4 Inputs %5 %6 inputs %7 %8 %9 tooltip %10 %11 help url %12 %13 description %14",
  "args0": [
    {
      "type": "field_input",
      "name": "BLOCK_NAME",
      "text": "newBlock"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_dropdown",
      "name": "BLOCK_CATEGORY",
      "options": [
        [
          "Movement",
          "CATEGORY_MOVEMENT"
        ],
        [
          "Sensing",
          "CATEGORY_SENSING"
        ],
        [
          "Logic",
          "CATEGORY_LOGIC"
        ],
        [
          "Loops",
          "CATEGORY_LOOPS"
        ],
        [
          "Math",
          "CATEGORY_MATH"
        ],
        [
          "Text",
          "CATEGORY_TEXT"
        ],
        [
          "Lists",
          "CATEGORY_LISTS"
        ],
        [
          "Variables",
          "CATEGORY_VARIABLES"
        ]
      ]
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "STATEMENT_INPUT",
      "check": "Input"
    },
    {
      "type": "field_dropdown",
      "name": "DROPDOWN_INPUT",
      "options": [
        [
          "automatic",
          "OPTION_AUTO"
        ],
        [
          "external",
          "OPTION_EXTERNAL"
        ],
        [
          "inline",
          "OPTION_INLINE"
        ]
      ]
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_dropdown",
      "name": "DROPDOWN_CONNECTIONS",
      "options": [
        [
          "no connections",
          "OPTION_CONNECTIONS_NONE"
        ],
        [
          "← left output",
          "OPTION_CONNECTIONS_LEFT"
        ],
        [
          "↕ top+bottom connections",
          "OPTION_CONNECTIONS_TOP_BOTTOM"
        ],
        [
          "↑ top connection",
          "OPTION_CONNECTIONS_TOP"
        ],
        [
          "↓ bottom connection",
          "OPTION_CONNECTIONS_BOTTOM"
        ]
      ]
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
      "name": "FIELD_TOOLTIP"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
      "name": "FIELD_HELP"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_multilinetext",
      "name": "FIELD_DESCRIPTION"
    }
  ],
  "colour": 120,
  "tooltip": "",
  "helpUrl": ""
},
/*
//text input
{
  "type": "text_input",
  "message0": "text input %1 , %2",
  "args0": [
    {
      "type": "field_input",
      "name": "FIELD_TEXT",
      "text": "default"
    },
    {
      "type": "field_input",
      "name": "FIELD_NAME",
      "text": "NAME"
    }
  ],
  "previousStatement": "Field",
  "nextStatement": "Field",
  "colour": 165,
  "tooltip": "",
  "helpUrl": ""
},


//text label
{
  "type": "text_label",
  "message0": "text %1 , %2",
  "args0": [
    {
      "type": "field_input",
      "name": "FIELD_TEXT",
      "text": ""
    },
    {
      "type": "field_input",
      "name": "FIELD_NAME",
      "text": "NAME"
    }
  ],
  "previousStatement": "Field",
  "nextStatement": "Field",
  "colour": 165,
  "tooltip": "",
  "helpUrl": ""
},

//numeric input
{
  "type": "numeric_input",
  "message0": "numeric input %1 , %2 %3 min %4 max %5 precision %6",
  "args0": [
    {
      "type": "field_number",
      "name": "FIELD_MAIN_NUMBER",
      "value": 0
    },
    {
      "type": "field_input",
      "name": "FIELD_MAIN_NUMBER_NAME",
      "text": "NAME"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_number",
      "name": "FIELD_MIN_INPUT",
      "value": -Infinity,
    },
    {
      "type": "field_number",
      "name": "FIELD_MAX_INPUT",
      "value": Infinity,
    },
    {
      "type": "field_number",
      "name": "FIELD_PRECISION",
      "value": 0
    }
  ],
  "previousStatement": "Field",
  "nextStatement": "Field",
  "colour": 165,
  "tooltip": "",
  "helpUrl": ""
},

//angle input
{
  "type": "angle_input",
  "message0": "angle input %1 , %2",
  "args0": [
    {
      "type": "field_angle",
      "name": "FIELD_ANGLE_INPUT",
      "angle": 90
    },
    {
      "type": "field_input",
      "name": "FIELD_NAME",
      "text": "NAME"
    }
  ],
  "previousStatement": "Field",
  "nextStatement": "Field",
  "colour": 165,
  "tooltip": "An input field for the user to enter an angle",
  "helpUrl": ""
},*/

//member
{
  "type": "member",
  "message0": "%1 %2 %3",
  "args0": [
    {
      "type": "field_input",
      "name": "MEMBER_NAME",
      "text": ""
    },
    {
      "type": "field_label",
      "name": "COLON",
      "text": ":"
    },
    {
      "type": "input_value",
      "name": "MEMBER_VALUE"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
}]);


//from https://github.com/google/blockly/blob/master/demos/blockfactory/blocks.js ===============================

var FIELD_MESSAGE = 'fields %1 %2';
var FIELD_ARGS = [
  {
    "type": "field_dropdown",
    "name": "ALIGN",
    "options": [['left', 'LEFT'], ['right', 'RIGHT'], ['centre', 'CENTRE']],
  },
  {
    "type": "input_statement",
    "name": "FIELDS",
    "check": "Field"
  }
];

var TYPE_MESSAGE = 'type %1';
var TYPE_ARGS = [
  {
    "type": "input_value",
    "name": "TYPE",
    "check": "Type",
    "align": "RIGHT"
  }
];

Blockly.Blocks['input_value'] = {
  // Value input.
  init: function() {
    this.jsonInit({
      "message0": "value input %1 %2",
      "args0": [
        {
          "type": "field_input",
          "name": "INPUTNAME",
          "text": "NAME"
        },
        {
          "type": "input_dummy"
        }
      ],
      "message1": FIELD_MESSAGE,
      "args1": FIELD_ARGS,
      "message2": TYPE_MESSAGE,
      "args2": TYPE_ARGS,
      "previousStatement": "Input",
      "nextStatement": "Input",
      "colour": 210,
      "tooltip": "A value socket for horizontal connections.",
      "helpUrl": "https://www.youtube.com/watch?v=s2_xaEvcVI0#t=71"
    });
  },
  onchange: function() {
    inputNameCheck(this);
  }
};

Blockly.Blocks['dummy_input'] = {
  // Dummy input.
  init: function() {
    this.jsonInit({
      "message0": "dummy input",
      "message1": FIELD_MESSAGE,
      "args1": FIELD_ARGS,
      "previousStatement": "Input",
      "nextStatement": "Input",
      "colour": 210,
      "tooltip": "For adding fields on a separate row with no " +
                 "connections. Alignment options (left, right, centre) " +
                 "apply only to multi-line fields.",
      "helpUrl": "https://www.youtube.com/watch?v=s2_xaEvcVI0#t=293"
    });
  }
};

Blockly.Blocks['input_statement'] = {
  // Statement input.
  init: function() {
    this.jsonInit({
      "message0": "statement input %1 %2",
      "args0": [
        {
          "type": "field_input",
          "name": "INPUTNAME",
          "text": "NAME"
        },
        {
          "type": "input_dummy"
        },
      ],
      "message1": FIELD_MESSAGE,
      "args1": FIELD_ARGS,
      "message2": TYPE_MESSAGE,
      "args2": TYPE_ARGS,
      "previousStatement": "Input",
      "nextStatement": "Input",
      "colour": 210,
      "tooltip": "A statement socket for enclosed vertical stacks.",
      "helpUrl": "https://www.youtube.com/watch?v=s2_xaEvcVI0#t=246"
    });
  },
  onchange: function() {
    inputNameCheck(this);
  }
};

// =================================== FIELDS =========================================

Blockly.Blocks['text_label'] = {
  // Text value that is saved to XML.
  init: function() {
    this.setColour(160);
    this.appendDummyInput('FIRST')
        .appendField('text')
        .appendField(new Blockly.FieldTextInput(''), 'TEXT')
        .appendField(',')
        .appendField(new Blockly.FieldTextInput('NAME'), 'FIELDNAME');
    this.setPreviousStatement(true, 'Field');
    this.setNextStatement(true, 'Field');
    this.setTooltip('Static text that serves as a label, and is saved to' +
      ' XML. Use only if you want to modify this label at runtime.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=88');
  },
  onchange: function() {
    fieldNameCheck(this);
  }
};

Blockly.Blocks['text_input'] = {
  // Text input.
  init: function() {
    this.setColour(160);
    this.appendDummyInput()
        .appendField('text input')
        .appendField(new Blockly.FieldTextInput('default'), 'TEXT')
        .appendField(',')
        .appendField(new Blockly.FieldTextInput('NAME'), 'FIELDNAME');
    this.setPreviousStatement(true, 'Field');
    this.setNextStatement(true, 'Field');
    this.setTooltip('An input field for the user to enter text.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=319');
  },
  onchange: function() {
    fieldNameCheck(this);
  }
};

Blockly.Blocks['numeric_input'] = {
  // Numeric input.
  init: function() {
    this.setColour(160);
    this.appendDummyInput()
        .appendField('numeric input')
        .appendField(new Blockly.FieldNumber(0), 'VALUE')
        .appendField(',')
        .appendField(new Blockly.FieldTextInput('NAME'), 'FIELDNAME');
    this.appendDummyInput()
        .appendField('min')
        .appendField(new Blockly.FieldNumber(-Infinity), 'MIN')
        .appendField('max')
        .appendField(new Blockly.FieldNumber(Infinity), 'MAX')
        .appendField('precision')
        .appendField(new Blockly.FieldNumber(0, 0), 'PRECISION');
    this.setPreviousStatement(true, 'Field');
    this.setNextStatement(true, 'Field');
    this.setTooltip('An input field for the user to enter a number.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=319');
  },
  onchange: function() {
    fieldNameCheck(this);
  }
};

Blockly.Blocks['angle_input'] = {
  // Angle input.
  init: function() {
    this.setColour(160);
    this.appendDummyInput()
        .appendField('angle input')
        .appendField(new Blockly.FieldAngle('90'), 'ANGLE')
        .appendField(',')
        .appendField(new Blockly.FieldTextInput('NAME'), 'FIELDNAME');
    this.setPreviousStatement(true, 'Field');
    this.setNextStatement(true, 'Field');
    this.setTooltip('An input field for the user to enter an angle.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=372');
  },
  onchange: function() {
    fieldNameCheck(this);
  }
};

Blockly.Blocks['field_dropdown'] = {
  // Dropdown menu.
  init: function() {
    this.appendDummyInput()
        .appendField('dropdown')
        .appendField(new Blockly.FieldTextInput('NAME'), 'FIELDNAME');
    this.optionList_ = ['text', 'text', 'text'];
    this.updateShape_();
    this.setPreviousStatement(true, 'Field');
    this.setNextStatement(true, 'Field');
    this.setMutator(new Blockly.Mutator(['field_dropdown_option_text',
                                         'field_dropdown_option_image']));
    this.setColour(160);
    this.setTooltip('Dropdown menu with a list of options.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=386');
  },
  mutationToDom: function(workspace) {
    // Create XML to represent menu options.
    var container = Blockly.utils.xml.createElement('mutation');
    container.setAttribute('options', JSON.stringify(this.optionList_));
    return container;
  },
  domToMutation: function(container) {
    // Parse XML to restore the menu options.
    var value = JSON.parse(container.getAttribute('options'));
    if (typeof value === 'number') {
      // Old format from before images were added.  November 2016.
      this.optionList_ = [];
      for (var i = 0; i < value; i++) {
        this.optionList_.push('text');
      }
    } else {
      this.optionList_ = value;
    }
    this.updateShape_();
  },
  decompose: function(workspace) {
    // Populate the mutator's dialog with this block's components.
    var containerBlock = workspace.newBlock('field_dropdown_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.optionList_.length; i++) {
      var optionBlock = workspace.newBlock(
          'field_dropdown_option_' + this.optionList_[i]);
      optionBlock.initSvg();
      connection.connect(optionBlock.previousConnection);
      connection = optionBlock.nextConnection;
    }
    return containerBlock;
  },
  compose: function(containerBlock) {
    // Reconfigure this block based on the mutator dialog's components.
    var optionBlock = containerBlock.getInputTargetBlock('STACK');
    // Count number of inputs.
    this.optionList_.length = 0;
    var data = [];
    while (optionBlock) {
      if (optionBlock.type === 'field_dropdown_option_text') {
        this.optionList_.push('text');
      } else if (optionBlock.type === 'field_dropdown_option_image') {
        this.optionList_.push('image');
      }
      data.push([optionBlock.userData_, optionBlock.cpuData_]);
      optionBlock = optionBlock.nextConnection &&
          optionBlock.nextConnection.targetBlock();
    }
    this.updateShape_();
    // Restore any data.
    for (var i = 0; i < this.optionList_.length; i++) {
      var userData = data[i][0];
      if (userData !== undefined) {
        if (typeof userData === 'string') {
          this.setFieldValue(userData || 'option', 'USER' + i);
        } else {
          this.setFieldValue(userData.src, 'SRC' + i);
          this.setFieldValue(userData.width, 'WIDTH' + i);
          this.setFieldValue(userData.height, 'HEIGHT' + i);
          this.setFieldValue(userData.alt, 'ALT' + i);
        }
        this.setFieldValue(data[i][1] || 'OPTIONNAME', 'CPU' + i);
      }
    }
  },
  saveConnections: function(containerBlock) {
    // Store all data for each option.
    var optionBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 0;
    while (optionBlock) {
      optionBlock.userData_ = this.getUserData(i);
      optionBlock.cpuData_ = this.getFieldValue('CPU' + i);
      i++;
      optionBlock = optionBlock.nextConnection &&
          optionBlock.nextConnection.targetBlock();
    }
  },
  updateShape_: function() {
    // Delete everything.
    var i = 0;
    while (this.getInput('OPTION' + i)) {
      this.removeInput('OPTION' + i);
      this.removeInput('OPTION_IMAGE' + i, true);
      i++;
    }
    // Rebuild block.
    var src = 'https://www.gstatic.com/codesite/ph/images/star_on.gif';
    for (var i = 0; i <= this.optionList_.length; i++) {
      var type = this.optionList_[i];
      if (type === 'text') {
        this.appendDummyInput('OPTION' + i)
            .appendField('•')
            .appendField(new Blockly.FieldTextInput('option'), 'USER' + i)
            .appendField(',')
            .appendField(new Blockly.FieldTextInput('OPTIONNAME'), 'CPU' + i);
      } else if (type === 'image') {
        this.appendDummyInput('OPTION' + i)
            .appendField('•')
            .appendField('image')
            .appendField(new Blockly.FieldTextInput(src), 'SRC' + i);
        this.appendDummyInput('OPTION_IMAGE' + i)
            .appendField(' ')
            .appendField('width')
            .appendField(new Blockly.FieldNumber('15', 0, NaN, 1), 'WIDTH' + i)
            .appendField('height')
            .appendField(new Blockly.FieldNumber('15', 0, NaN, 1), 'HEIGHT' + i)
            .appendField('alt text')
            .appendField(new Blockly.FieldTextInput('*'), 'ALT' + i)
            .appendField(',')
            .appendField(new Blockly.FieldTextInput('OPTIONNAME'), 'CPU' + i);
      }
    }
  },
  onchange: function() {
    if (this.workspace && this.optionList_.length < 1) {
      this.setWarningText('Drop down menu must\nhave at least one option.');
    } else {
      fieldNameCheck(this);
    }
  },
  getUserData: function(n) {
    if (this.optionList_[n] === 'text') {
      return this.getFieldValue('USER' + n);
    }
    if (this.optionList_[n] === 'image') {
      return {
        src: this.getFieldValue('SRC' + n),
        width: Number(this.getFieldValue('WIDTH' + n)),
        height: Number(this.getFieldValue('HEIGHT' + n)),
        alt: this.getFieldValue('ALT' + n)
      };
    }
    throw 'Unknown dropdown type';
  }
};

Blockly.Blocks['field_dropdown_container'] = {
  // Container.
  init: function() {
    this.setColour(160);
    this.appendDummyInput()
        .appendField('add options');
    this.appendStatementInput('STACK');
    this.setTooltip('Add, remove, or reorder options\n' +
                    'to reconfigure this dropdown menu.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=386');
    this.contextMenu = false;
  }
};

Blockly.Blocks['field_dropdown_option_text'] = {
  // Add text option.
  init: function() {
    this.setColour(160);
    this.appendDummyInput()
        .appendField('text option');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Add a new text option to the dropdown menu.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=386');
    this.contextMenu = false;
  }
};

Blockly.Blocks['field_dropdown_option_image'] = {
  // Add image option.
  init: function() {
    this.setColour(160);
    this.appendDummyInput()
        .appendField('image option');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Add a new image option to the dropdown menu.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=386');
    this.contextMenu = false;
  }
};

Blockly.Blocks['field_checkbox'] = {
  // Checkbox.
  init: function() {
    this.setColour(160);
    this.appendDummyInput()
        .appendField('checkbox')
        .appendField(new Blockly.FieldCheckbox('TRUE'), 'CHECKED')
        .appendField(',')
        .appendField(new Blockly.FieldTextInput('NAME'), 'FIELDNAME');
    this.setPreviousStatement(true, 'Field');
    this.setNextStatement(true, 'Field');
    this.setTooltip('Checkbox field.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=485');
  },
  onchange: function() {
    fieldNameCheck(this);
  }
};

Blockly.Blocks['field_colour'] = {
  // Colour input.
  init: function() {
    this.setColour(160);
    this.appendDummyInput()
        .appendField('colour')
        .appendField(new Blockly.FieldColour('#ff0000'), 'COLOUR')
        .appendField(',')
        .appendField(new Blockly.FieldTextInput('NAME'), 'FIELDNAME');
    this.setPreviousStatement(true, 'Field');
    this.setNextStatement(true, 'Field');
    this.setTooltip('Colour input field.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=495');
  },
  onchange: function() {
    fieldNameCheck(this);
  }
};

Blockly.Blocks['field_variable'] = {
  // Dropdown for variables.
  init: function() {
    this.setColour(160);
    this.appendDummyInput()
        .appendField('variable')
        .appendField(new Blockly.FieldTextInput('item'), 'TEXT')
        .appendField(',')
        .appendField(new Blockly.FieldTextInput('NAME'), 'FIELDNAME');
    this.setPreviousStatement(true, 'Field');
    this.setNextStatement(true, 'Field');
    this.setTooltip('Dropdown menu for variable names.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=510');
  },
  onchange: function() {
    fieldNameCheck(this);
  }
};

Blockly.Blocks['field_image'] = {
  // Image.
  init: function() {
    this.setColour(160);
    var src = 'https://www.gstatic.com/codesite/ph/images/star_on.gif';
    this.appendDummyInput()
        .appendField('image')
        .appendField(new Blockly.FieldTextInput(src), 'SRC');
    this.appendDummyInput()
        .appendField('width')
        .appendField(new Blockly.FieldNumber('15', 0, NaN, 1), 'WIDTH')
        .appendField('height')
        .appendField(new Blockly.FieldNumber('15', 0, NaN, 1), 'HEIGHT')
        .appendField('alt text')
        .appendField(new Blockly.FieldTextInput('*'), 'ALT')
        .appendField('flip RTL')
        .appendField(new Blockly.FieldCheckbox('false'), 'FLIP_RTL');
    this.setPreviousStatement(true, 'Field');
    this.setNextStatement(true, 'Field');
    this.setTooltip('Static image (JPEG, PNG, GIF, SVG, BMP).\n' +
                    'Retains aspect ratio regardless of height and width.\n' +
                    'Alt text is for when collapsed.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=567');
  }
};

//=========================== TYPES ===============================

Blockly.Blocks['type_group'] = {
  // Group of types.
  init: function() {
    this.typeCount_ = 2;
    this.updateShape_();
    this.setOutput(true, 'Type');
    this.setMutator(new Blockly.Mutator(['type_group_item']));
    this.setColour(230);
    this.setTooltip('Allows more than one type to be accepted.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=677');
  },
  mutationToDom: function(workspace) {
    // Create XML to represent a group of types.
    var container = Blockly.utils.xml.createElement('mutation');
    container.setAttribute('types', this.typeCount_);
    return container;
  },
  domToMutation: function(container) {
    // Parse XML to restore the group of types.
    this.typeCount_ = parseInt(container.getAttribute('types'), 10);
    this.updateShape_();
    for (var i = 0; i < this.typeCount_; i++) {
      this.removeInput('TYPE' + i);
    }
    for (var i = 0; i < this.typeCount_; i++) {
      var input = this.appendValueInput('TYPE' + i)
                      .setCheck('Type');
      if (i === 0) {
        input.appendField('any of');
      }
    }
  },
  decompose: function(workspace) {
    // Populate the mutator's dialog with this block's components.
    var containerBlock = workspace.newBlock('type_group_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.typeCount_; i++) {
      var typeBlock = workspace.newBlock('type_group_item');
      typeBlock.initSvg();
      connection.connect(typeBlock.previousConnection);
      connection = typeBlock.nextConnection;
    }
    return containerBlock;
  },
  compose: function(containerBlock) {
    // Reconfigure this block based on the mutator dialog's components.
    var typeBlock = containerBlock.getInputTargetBlock('STACK');
    // Count number of inputs.
    var connections = [];
    while (typeBlock) {
      connections.push(typeBlock.valueConnection_);
      typeBlock = typeBlock.nextConnection &&
          typeBlock.nextConnection.targetBlock();
    }
    // Disconnect any children that don't belong.
    for (var i = 0; i < this.typeCount_; i++) {
      var connection = this.getInput('TYPE' + i).connection.targetConnection;
      if (connection && connections.indexOf(connection) === -1) {
        connection.disconnect();
      }
    }
    this.typeCount_ = connections.length;
    this.updateShape_();
    // Reconnect any child blocks.
    for (var i = 0; i < this.typeCount_; i++) {
      Blockly.Mutator.reconnect(connections[i], this, 'TYPE' + i);
    }
  },
  saveConnections: function(containerBlock) {
    // Store a pointer to any connected child blocks.
    var typeBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 0;
    while (typeBlock) {
      var input = this.getInput('TYPE' + i);
      typeBlock.valueConnection_ = input && input.connection.targetConnection;
      i++;
      typeBlock = typeBlock.nextConnection &&
          typeBlock.nextConnection.targetBlock();
    }
  },
  updateShape_: function() {
    // Modify this block to have the correct number of inputs.
    // Add new inputs.
    for (var i = 0; i < this.typeCount_; i++) {
      if (!this.getInput('TYPE' + i)) {
        var input = this.appendValueInput('TYPE' + i);
        if (i === 0) {
          input.appendField('any of');
        }
      }
    }
    // Remove deleted inputs.
    while (this.getInput('TYPE' + i)) {
      this.removeInput('TYPE' + i);
      i++;
    }
  }
};

Blockly.Blocks['type_group_container'] = {
  // Container.
  init: function() {
    this.jsonInit({
      "message0": "add types %1 %2",
      "args0": [
        {"type": "input_dummy"},
        {"type": "input_statement", "name": "STACK"}
      ],
      "colour": 230,
      "tooltip": "Add, or remove allowed type.",
      "helpUrl": "https://www.youtube.com/watch?v=s2_xaEvcVI0#t=677"
    });
  }
};

Blockly.Blocks['type_group_item'] = {
  // Add type.
  init: function() {
    this.jsonInit({
      "message0": "type",
      "previousStatement": null,
      "nextStatement": null,
      "colour": 230,
      "tooltip": "Add a new allowed type.",
      "helpUrl": "https://www.youtube.com/watch?v=s2_xaEvcVI0#t=677"
    });
  }
};

Blockly.Blocks['type_null'] = {
  // Null type.
  valueType: null,
  init: function() {
    this.jsonInit({
      "message0": "any",
      "output": "Type",
      "colour": 230,
      "tooltip": "Any type is allowed.",
      "helpUrl": "https://www.youtube.com/watch?v=s2_xaEvcVI0#t=602"
    });
  }
};

Blockly.Blocks['type_boolean'] = {
  // Boolean type.
  valueType: 'Boolean',
  init: function() {
    this.jsonInit({
      "message0": "Boolean",
      "output": "Type",
      "colour": 230,
      "tooltip": "Booleans (true/false) are allowed.",
      "helpUrl": "https://www.youtube.com/watch?v=s2_xaEvcVI0#t=602"
    });
  }
};

Blockly.Blocks['type_number'] = {
  // Number type.
  valueType: 'Number',
  init: function() {
    this.jsonInit({
      "message0": "Number",
      "output": "Type",
      "colour": 230,
      "tooltip": "Numbers (int/float) are allowed.",
      "helpUrl": "https://www.youtube.com/watch?v=s2_xaEvcVI0#t=602"
    });
  }
};

Blockly.Blocks['type_string'] = {
  // String type.
  valueType: 'String',
  init: function() {
    this.jsonInit({
      "message0": "String",
      "output": "Type",
      "colour": 230,
      "tooltip": "Strings (text) are allowed.",
      "helpUrl": "https://www.youtube.com/watch?v=s2_xaEvcVI0#t=602"
    });
  }
};

Blockly.Blocks['type_list'] = {
  // List type.
  valueType: 'Array',
  init: function() {
    this.jsonInit({
      "message0": "Array",
      "output": "Type",
      "colour": 230,
      "tooltip": "Arrays (lists) are allowed.",
      "helpUrl": "https://www.youtube.com/watch?v=s2_xaEvcVI0#t=602"
    });
  }
};

Blockly.Blocks['type_other'] = {
  // Other type.
  init: function() {
    this.jsonInit({
      "message0": "other %1",
      "args0": [{"type": "field_input", "name": "TYPE", "text": ""}],
      "output": "Type",
      "colour": 230,
      "tooltip": "Custom type to allow.",
      "helpUrl": "https://www.youtube.com/watch?v=s2_xaEvcVI0#t=702"
    });
  }
};


/**
 * Check to see if more than one field has this name.
 * Highly inefficient (On^2), but n is small.
 * @param {!Blockly.Block} referenceBlock Block to check.
 */
function fieldNameCheck(referenceBlock) {
  if (!referenceBlock.workspace) {
    // Block has been deleted.
    return;
  }
  var name = referenceBlock.getFieldValue('FIELDNAME').toLowerCase();
  var count = 0;
  var blocks = referenceBlock.workspace.getAllBlocks(false);
  for (var i = 0, block; block = blocks[i]; i++) {
    var otherName = block.getFieldValue('FIELDNAME');
    if (!block.disabled && !block.getInheritedDisabled() &&
        otherName && otherName.toLowerCase() === name) {
      count++;
    }
  }
  var msg = (count > 1) ?
      'There are ' + count + ' field blocks\n with this name.' : null;
  referenceBlock.setWarningText(msg);
}

/**
 * Check to see if more than one input has this name.
 * Highly inefficient (On^2), but n is small.
 * @param {!Blockly.Block} referenceBlock Block to check.
 */
function inputNameCheck(referenceBlock) {
  if (!referenceBlock.workspace) {
    // Block has been deleted.
    return;
  }
  var name = referenceBlock.getFieldValue('INPUTNAME').toLowerCase();
  var count = 0;
  var blocks = referenceBlock.workspace.getAllBlocks(false);
  for (var i = 0, block; block = blocks[i]; i++) {
    var otherName = block.getFieldValue('INPUTNAME');
    if (!block.disabled && !block.getInheritedDisabled() &&
        otherName && otherName.toLowerCase() === name) {
      count++;
    }
  }
  var msg = (count > 1) ?
      'There are ' + count + ' input blocks\n with this name.' : null;
  referenceBlock.setWarningText(msg);
}