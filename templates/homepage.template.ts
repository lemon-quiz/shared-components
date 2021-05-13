import { PageInterface } from '../lib';

const template: PageInterface = [
  {
    name: 'Meta',
    type: 'complex',
    label: 'complex',
    mandatory: true,
    export: ['default', 'index'],
    users: [],
    roles: [],
    children: [
      {
        type: 'line', name: 'page_title', label: 'page_title', mandatory: true,
      },
      {
        type: 'line', name: 'menu_title', label: 'menu_title', mandatory: true,
      },
      {
        type: 'line', name: 'description', label: 'description', mandatory: true, allowEmpty: true,
      },
      {
        type: 'line', name: 'keyword', label: 'keyword', mandatory: true, allowEmpty: true,
      },
    ],
  },
  {
    type: 'complex',
    name: 'complex',
    label: 'complex',
    mandatory: true,
    children: [
      {
        type: 'complex',
        name: 'node',
        label: 'node',
        mandatory: true,
        multiple: true,
        children: [
          {
            type: 'line', name: 'name', label: 'name', mandatory: true,
          },
          {
            type: 'select',
            name: 'type',
            label: 'type',
            mandatory: 1,
            options: [
              { value: 'line', desc: 'line' },
              { value: 'checkbox', desc: 'checkbox' },
              { value: 'select', desc: 'select' },
              { value: 'radio', desc: 'radio' },
              { value: 'complex', desc: 'complex' },
            ],
          },
          {
            type: 'checkbox', name: 'mandatory', label: 'mandatory', mandatory: true,
          },
          {
            type: 'checkbox', name: 'multiple', label: 'multiple', mandatory: true,
          },
          {
            type: 'textarea', name: 'options', label: 'options',
          },
          {
            type: 'complex',
            name: 'values',
            label: 'values',
            slider: true,
            show: 'type in radio,select,checkbox',
            children: [
              { type: 'line', name: 'value', mandatory: true },
              { type: 'line', name: 'description', mandatory: true },
            ],
          },

        ],
      },
    ],
  },

];

export default template;
