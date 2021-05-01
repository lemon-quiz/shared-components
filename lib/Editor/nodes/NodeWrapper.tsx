import React from 'react';
import { Box, Button, IconButton } from '@material-ui/core';
import {
  AddBox,
  KeyboardArrowDown,
  KeyboardArrowRight,
} from '@material-ui/icons';
import { useContext, useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import { EditorContext, EditorContextInterface } from '../EditorContext';
import { NodeType } from '../../Interfaces/template.interface';
import Controls from './Controls';
import LineNode from './LineNode';

export default function NodeWrapper({
  node,
  index,
  path,
  length,
}: { node: NodeType, index: number, path: number[], length: number }) {
  const pageContext = useContext<EditorContextInterface>(EditorContext);
  const [animate, shouldAnimate] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [state, setState] = useState({
    canAdd: false,
  });

  const addNode = () => {
    if (node.uuid) {
      pageContext.addNode(path, index);

      return;
    }

    pageContext.addNode(path);
  };

  useEffect(() => {
    shouldAnimate(true);
    setState({
      canAdd: pageContext.canAdd(path),
    });
  }, [index, length]);

  if (node.tuuid && !state.canAdd) {
    // Do not render template nodes
    return <></>;
  }

  if (node.tuuid && state.canAdd) {
    // Do not render template nodes
    return (
      <Box display="flex" flexDirection="row">
        <Box flex="100%" p={1} m={1} bgcolor="grey.300">
          <Button
            onClick={addNode}
            disabled={!state.canAdd}
            component="span"
            color="primary"
            size="small"
            startIcon={<AddBox />}
          >
            {`Add ${node.name}`}
          </Button>
        </Box>
      </Box>
    );
  }

  if (node.type === 'complex') {
    return (
      <>
        <Box display="flex" flexDirection="row">
          <Box flex="100%" p={1} m={1} bgcolor="grey.300">
            <Button
              onClick={() => setCollapsed(!collapsed)}
              component="span"
              color="primary"
              size="small"
              startIcon={collapsed ? <KeyboardArrowRight /> : <KeyboardArrowDown />}
            >
              {`${index}.`}
              {' '}
              {`${node.name}`}
            </Button>
          </Box>
          <Box
            flex="140px"
            flexShrink={0}
            p={1}
            m={1}
            mr={1}
            bgcolor="grey.300"
          >
            <Controls node={node} index={index} path={path} length={length} />
          </Box>
        </Box>
        {!collapsed && (
          <Box display="flex" flexDirection="row">
            <Box flex="150px" p={1} m={1} bgcolor="grey.100" />
            <Box flex="100%" p={1} pr={0} m={1} mr={0}>
              {node.children.map((childNode, childIndex: number) => (
                <NodeWrapper
                  node={childNode}
                  index={childIndex}
                  key={childNode.uuid || childNode.tuuid}
                  path={[...path, childIndex]}
                  length={node.children.length}
                />
              ))}
            </Box>
          </Box>
        )}
      </>
    );
  }

  return (
    <Box display="flex" flexDirection="row">
      <Box flex="1 0 20%" p={1} m={1}>{node.name}</Box>
      <Box flex="80%" p={1} m={1} bgcolor="grey.400">
        <CSSTransition
          in={animate}
          timeout={3000}
          classNames={{
            enter: 'animated',
            enterActive: 'fadeIn',

          }}
        >
          <div>
            <LineNode node={node} />
          </div>
        </CSSTransition>
      </Box>
      <Box flex="140px" flexShrink={0} p={1} m={1} mr={1} bgcolor="grey.300">
        <Controls node={node} index={index} path={path} length={length} />
      </Box>
    </Box>
  );
}
