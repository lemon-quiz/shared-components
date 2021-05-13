import { PageInterface } from '../lib';

const page: PageInterface = [
  {
    type: 'line',
    name: 'page_title',
    label: 'Page title',
    multiple: true,
    mandatory: true,
  },
  {
    type: 'checkbox',
    name: 'checkbox',
    label: 'Checkbox',
    mandatory: true,
    allowEmpty: true,
  },
  {
    type: 'line',
    name: 'menu_title',
    label: 'Menu title',
    show: 'page_title in a,b,c,d,edje\\, cindy',
    // show: 'checkbox === true',
    // show: 'page_title !== homepage',
    // show: 'page_title > 1',
    // show: 'page_title < 10',
    // show: 'page_title >= 1',
    // show: 'page_title <= 10',
    mandatory: true,
  },
  {
    type: 'complex',
    name: 'paragraph',
    label: 'Paragraph',
    mandatory: true,
    multiple: true,
    children: [
      {
        type: 'line',
        name: 'header',
        label: 'Paragraph header',
        multiple: true,
        mandatory: true,
      },
      {
        type: 'textarea',
        name: 'text',
        // show: 'header === homepage',
        mandatory: true,
      },
    ],
  },
];

export default page;
