/**
 * The toolbox contains all the blocks from blocks/json.js (tells Blockly what to include)
 * Changed to a category toolbox from a flyout toolbox for ease of use
 */

export const toolbox = {
  'kind': 'categoryToolbox',
  'contents': [
    { 
      'kind': 'category',
      'name': 'Creator',
      'contents': [
        {
          'kind': 'block',
          'type': 'block_creator'
        }
      ]
    },
    {
      'kind': 'category',
      'name': 'Input',
      'contents': [
        {
          'kind': 'block',
          'type': 'dummy_input'
        },
        {
          'kind': 'block',
          'type': 'input_value'
        },
        {
          'kind': 'block',
          'type': 'input_statement'
        }
      ]
    },
    { 
      'kind': 'category',
      'name': 'Field',
      'contents': [
        {
          'kind': 'block',
          'type': 'text_input'
        },
        {
          'kind': 'block',
          'type': 'text_label'
        },
        {
          'kind': 'block',
          'type': 'numeric_input'
        },
        {
          'kind': 'block',
          'type': 'angle_input'
        },
        {
          'kind': 'block',
          'type': 'field_dropdown'
        },
        {
          'kind': 'block',
          'type': 'field_checkbox'
        },
        {
          'kind': 'block',
          'type': 'field_colour'
        },
        {
          'kind': 'block',
          'type': 'field_variable'
        },
        {
          'kind': 'block',
          'type': 'field_image'
        }
      ]
    },
    {
      'kind': 'category',
      'name': 'Type',
      'contents': [
        {
          'kind': 'block',
          'type': 'type_group'
        },
        {
          'kind': 'block',
          'type': 'type_null'
        },
        {
          'kind': 'block',
          'type': 'type_boolean'
        },
        {
          'kind': 'block',
          'type': 'type_number'
        },
        {
          'kind': 'block',
          'type': 'type_string'
        },
        {
          'kind': 'block',
          'type': 'type_list'
        },
        {
          'kind': 'block',
          'type': 'type_other'
        }
      ]
    }

  ]
}