import { Button, ButtonGroup } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import validatorLib from 'validator';

import TinymceNode from '../components/editor/TinymceNode';
import {
  PageInterface, Validator,
} from '../lib';
import Editor from '../lib/Editor/Editor';
import Parser from '../lib/Editor/parser';
import homepageTemplate from '../templates/homepage.template';

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
    console.error(parser.getPageErrors());
    console.log(parser.getPage());
  };

  useEffect(() => {
    parser.loadTemplate(homepageTemplate, []);
    const sub = parser.page.subscribe((res: PageInterface) => {
      setPage(res);
      setLoaded(true);
    });

    return () => {
      sub.unsubscribe();
    };
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
