import { Button, ButtonGroup } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import validatorLib from 'validator';

import TinymceNode from '../components/editor/TinymceNode';
import {
  Editor, PageInterface, Parser, Validator,
} from '../lib';
import homepageTemplate from '../templates/single-node.template';

const parser = new Parser(
  new Validator(validatorLib),
);

const customNodes = {
  tinymce: TinymceNode,
};

export default function EditorPage() {
  const [loaded, setLoaded] = useState(false);
  const [page, setPage] = useState<PageInterface>([]);
  const submit = () => {
    const errors = parser.getPageErrors();

    if (errors) {
      setPage(parser.getPage());
    }
  };

  useEffect(() => {
    parser.loadTemplate(homepageTemplate, []);
    setPage(parser.getPage());
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (<div>Loading...</div>);
  }

  return (
    <div>
      <Editor parser={parser} page={page} customNodes={customNodes} />
      <ButtonGroup>
        <Button variant="contained" color="primary" disableElevation onClick={submit}>Save</Button>
      </ButtonGroup>
    </div>
  );
}
