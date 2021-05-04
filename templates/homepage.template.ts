import { PageInterface } from '../lib';

const page: PageInterface = [
  {
    name: 'Meta',
    type: 'complex',
    mandatory: true,
    export: ['default', 'index'],
    users: [],
    roles: [],
    children: [
      {
        type: 'line', name: 'page_title', mandatory: true, multiple: true, validator: 'isEmail', slider: true,
      },
      { type: 'checkbox', name: 'checkbox', mandatory: true },
      { type: 'checkbox', name: 'simba' },
      { type: 'line', name: 'url', validator: ['isFQDN'] },
      {
        type: 'radio',
        name: 'radio X',
        options: [
          { value: '1', desc: 'Option 1' },
          { value: '2', desc: 'Option 2' },
          { value: '3', desc: 'Option 3' },
        ],
      },
      {
        type: 'checkbox',
        name: 'Rgb',
        mandatory: true,
        options: [
          { value: 'red', desc: 'Red' },
          { value: 'green', desc: 'Green' },
          { value: 'blue', desc: 'Blue' },
        ],
      },
      {
        type: 'select',
        name: 'Selectbox',
        mandatory: true,
        value: 'blue',
        options: [
          { value: 'red', desc: 'Red' },
          { value: 'green', desc: 'Green' },
          { value: 'blue', desc: 'Blue' },
        ],
      },
    ],
  },
  {
    name: 'Body',
    type: 'complex',
    mandatory: true,
    children: [
      { type: 'line', name: 'page_title' },
      {
        type: 'complex',
        name: 'paragraph',
        mandatory: true,
        multiple: true,
        slider: true,
        children: [
          { type: 'line', name: 'title', mandatory: true },
          {
            type: 'textarea', name: 'text', mandatory: true,
          },
          { type: 'line', name: 'subscript', mandatory: true },
        ],
      },
    ],
  },
  {
    name: 'tinymce',
    type: 'tinymce',
    mandatory: true,
    multiple: true,
    config: {
      editor: {
        toolbar: 'undo redo | copy paste | ',
        valid_elements: 'img[class=myclass|!src|border:0|alt|title|width|height|style],span,strong,p,div,em,i',
      },
    },
  },
];

export default page;
