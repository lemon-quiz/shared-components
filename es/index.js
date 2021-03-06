import { __assign, __spreadArray, __rest, __extends } from 'tslib';
import * as React from 'react';
import React__default, { useContext, useState, useEffect, useMemo } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Slider, IconButton, FormControl, FormGroup, FormControlLabel, Checkbox, FormHelperText, InputLabel, Input, RadioGroup, Radio, Select, MenuItem, Box, Button as Button$1, TableCell, InputAdornment, TableContainer, Paper, Table, TableHead, TableRow, TableBody, TablePagination } from '@material-ui/core';
import { ArrowDropDown, AddBox, Delete, KeyboardArrowRight, KeyboardArrowDown, ArrowDropUp, Backspace, Edit, Done } from '@material-ui/icons';
import { CSSTransition } from 'react-transition-group';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import { BehaviorSubject, Subject, from } from 'rxjs';
import { takeUntil, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { v4 } from 'uuid';
import { makeStyles } from '@material-ui/styles';
import { grey, amber } from '@material-ui/core/colors';
import MatSnackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useRouter } from 'next/router';
import { makeStyles as makeStyles$1 } from '@material-ui/core/styles';
import moment from 'moment';
import { FORM_ERROR } from 'final-form';

var AppContext = React.createContext({});
var AppProvider = AppContext.Provider;
var AppConsumer = AppContext.Consumer;

function ConfirmDialog(_a) {
    var open = _a.open, title = _a.title, content = _a.content, submitLabel = _a.submitLabel, cancelLabel = _a.cancelLabel, handleClose = _a.handleClose;
    return (React__default.createElement(Dialog, { open: open, onClose: function () { return handleClose(false); }, "aria-labelledby": "alert-dialog-title", "aria-describedby": "alert-dialog-description" },
        React__default.createElement(DialogTitle, { id: "alert-dialog-title" }, title),
        React__default.createElement(DialogContent, null,
            React__default.createElement(DialogContentText, { id: "alert-dialog-description", dangerouslySetInnerHTML: { __html: content } })),
        React__default.createElement(DialogActions, null,
            React__default.createElement(Button, { onClick: function () { return handleClose(false); }, color: "primary" }, cancelLabel !== null && cancelLabel !== void 0 ? cancelLabel : 'Cancel'),
            React__default.createElement(Button, { onClick: function () { return handleClose(true); }, color: "primary", autoFocus: true }, submitLabel !== null && submitLabel !== void 0 ? submitLabel : 'Submit'))));
}

var EditorContext = React__default.createContext(null);

function valuetext(value) {
    return "" + value;
}
function SliderControl(_a) {
    var node = _a.node, path = _a.path, index = _a.index, length = _a.length;
    var editorContext = useContext(EditorContext);
    var _b = useState(0), start = _b[0], setStart = _b[1];
    var _c = useState(0), counter = _c[0], setCounter = _c[1];
    useEffect(function () {
        var siblings = editorContext.getSiblings(path);
        setStart(siblings.length);
        setCounter(siblings.length);
    }, [index, length]);
    var handleChange = function (event, newValue) {
        if (newValue > counter) {
            var amountToAdd = newValue - counter;
            editorContext.addNode(path, undefined, amountToAdd);
            setCounter(newValue);
            return;
        }
        if (newValue < counter) {
            var amountToDelete = counter - newValue;
            editorContext.deleteNode(path, amountToDelete);
            setCounter(newValue);
        }
    };
    var setValue = function (event, newValue) {
        setStart(newValue);
    };
    var config = node.config;
    return (React__default.createElement(Slider, __assign({ value: start, getAriaValueText: valuetext, "aria-labelledby": "discrete-slider", valueLabelDisplay: "auto", step: 1, marks: true, min: 0, max: 100, onChangeCommitted: handleChange, onChange: setValue }, config === null || config === void 0 ? void 0 : config.slider)));
}

/* eslint-disable import/no-extraneous-dependencies */
function Controls(_a) {
    var node = _a.node, index = _a.index, path = _a.path, length = _a.length;
    var pageContext = useContext(EditorContext);
    var _b = useState({
        canMoveUp: false,
        canMoveDown: false,
        canAdd: false,
        canDelete: false,
    }), state = _b[0], setState = _b[1];
    var moveUp = function () {
        pageContext.moveUp(path);
    };
    var moveDown = function () {
        pageContext.moveDown(path);
    };
    var addNode = function () {
        if (node.uuid) {
            pageContext.addNode(path, index);
            return;
        }
        pageContext.addNode(path);
    };
    var deleteNode = function () {
        pageContext.deleteNode(path);
    };
    useEffect(function () {
        setState({
            canMoveUp: pageContext.canMoveUp(path, index, node.type, node.name),
            canMoveDown: pageContext.canMoveDown(path, index, node.type, node.name),
            canAdd: pageContext.canAdd(path),
            canDelete: pageContext.canDelete(path),
        });
    }, [index, length]);
    return (React__default.createElement(React__default.Fragment, null,
        React__default.createElement(IconButton, { onClick: moveUp, disabled: !state.canMoveUp, component: "span", color: "primary", size: "small" },
            React__default.createElement(ArrowDropUpIcon, null)),
        React__default.createElement(IconButton, { onClick: moveDown, disabled: !state.canMoveDown, component: "span", color: "primary", size: "small" },
            React__default.createElement(ArrowDropDown, null)),
        React__default.createElement(IconButton, { onClick: addNode, disabled: !state.canAdd, component: "span", color: "primary", size: "small" },
            React__default.createElement(AddBox, null)),
        React__default.createElement(IconButton, { onClick: deleteNode, disabled: !state.canDelete, component: "span", color: "primary", size: "small" },
            React__default.createElement(Delete, null))));
}

function CheckboxNode(_a) {
    var node = _a.node;
    var pageContext = useContext(EditorContext);
    var _b = useState(false), value = _b[0], setValue = _b[1];
    var _c = useState(null), errors = _c[0], setErrors = _c[1];
    useEffect(function () {
        var defaultValue = node.value;
        if (typeof defaultValue !== 'undefined') {
            setValue(defaultValue);
        }
    }, [node.uuid]);
    useEffect(function () {
        var defaultErrors = node.errors;
        if (defaultErrors) {
            setErrors(defaultErrors);
        }
    }, [node === null || node === void 0 ? void 0 : node.errors]);
    var updateValue = function (change) {
        setValue(function (currentValue) {
            var _a;
            var _b = change.target, checkboxChecked = _b.checked, checkboxValue = _b.value;
            var calculatedValue = __assign({}, currentValue);
            if (((_a = node.options) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                if (typeof calculatedValue !== 'object') {
                    calculatedValue = {};
                }
                calculatedValue[checkboxValue] = checkboxChecked;
            }
            else {
                calculatedValue = checkboxChecked;
            }
            var nodeErrors = pageContext.validateNode(node, calculatedValue);
            pageContext.setValue(node.uuid, calculatedValue, nodeErrors);
            setErrors(nodeErrors);
            return calculatedValue;
        });
    };
    var valueChecked = function (name) {
        var _a, _b;
        if (((_a = node.options) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            return (_b = value[name]) !== null && _b !== void 0 ? _b : false;
        }
        return !!value;
    };
    var config = node.config;
    var options = function () { return (node.options || [{ value: false, desc: node.name }]).map(function (option) { return (React__default.createElement(FormControlLabel, __assign({ key: node.name + "-" + String(option.value), control: React__default.createElement(Checkbox, __assign({ checked: valueChecked(option.value), onChange: updateValue, name: option.desc, value: option.value }, config === null || config === void 0 ? void 0 : config.checkbox)), label: option.desc }, config === null || config === void 0 ? void 0 : config.label))); }); };
    return (React__default.createElement(React__default.Fragment, null,
        React__default.createElement(FormControl, { error: errors !== null, fullWidth: true },
            React__default.createElement(FormGroup, null, options()),
            errors !== null && (React__default.createElement(FormHelperText, { id: "input-" + node.uuid + "-error" }, Object.keys(errors).map(function (error) { return (React__default.createElement("span", { key: node.uuid + "-" + error }, error)); }))))));
}

function CustomNode(_a) {
    var node = _a.node;
    var editorContext = useContext(EditorContext);
    var type = node.type;
    var RenderNode = editorContext.getCustomNode(type);
    if (!RenderNode) {
        return React__default.createElement(React__default.Fragment, null);
    }
    return React__default.createElement(RenderNode, { node: node });
}

function LineNode(_a) {
    var node = _a.node;
    var pageContext = useContext(EditorContext);
    var _b = useState(''), value = _b[0], setValue = _b[1];
    var _c = useState(null), errors = _c[0], setErrors = _c[1];
    useEffect(function () {
        var defaultValue = node.value;
        if (typeof defaultValue !== 'undefined') {
            setValue(defaultValue);
        }
    }, [node.uuid]);
    useEffect(function () {
        var defaultErrors = node.errors;
        if (defaultErrors) {
            setErrors(defaultErrors);
        }
    }, [node === null || node === void 0 ? void 0 : node.errors]);
    var updateValue = function (change) {
        var newValue = change.target.value;
        var nodeErrors = pageContext.validateNode(node, newValue);
        pageContext.setValue(node.uuid, newValue, nodeErrors);
        setValue(newValue);
        setErrors(nodeErrors);
    };
    var config = node.config;
    return (React__default.createElement(React__default.Fragment, null,
        React__default.createElement(FormControl, { error: errors !== null, fullWidth: true },
            React__default.createElement(InputLabel, { htmlFor: "input-" + node.uuid }, node.label),
            React__default.createElement(Input, __assign({ id: "input-" + node.uuid, value: value, onChange: updateValue, "aria-describedby": "input-" + node.uuid + "-error" }, config === null || config === void 0 ? void 0 : config.input)),
            errors !== null && (React__default.createElement(FormHelperText, { id: "input-" + node.uuid + "-error" }, Object.keys(errors).map(function (error) { return (React__default.createElement("span", { key: node.uuid + "-" + error }, error)); }))))));
}

function RadioNode(_a) {
    var _b;
    var node = _a.node;
    var pageContext = useContext(EditorContext);
    var _c = useState(''), value = _c[0], setValue = _c[1];
    var _d = useState(null), errors = _d[0], setErrors = _d[1];
    useEffect(function () {
        var defaultValue = node.value;
        if (typeof defaultValue !== 'undefined') {
            setValue(defaultValue);
        }
    }, [node.uuid]);
    useEffect(function () {
        var defaultErrors = node.errors;
        if (defaultErrors) {
            setErrors(defaultErrors);
        }
    }, [node === null || node === void 0 ? void 0 : node.errors]);
    var updateValue = function (change) {
        var newValue = change.target.value;
        var nodeErrors = pageContext.validateNode(node, newValue);
        pageContext.setValue(node.uuid, newValue, nodeErrors);
        setValue(newValue);
        setErrors(nodeErrors);
    };
    var config = node.config;
    return (React__default.createElement(React__default.Fragment, null,
        React__default.createElement(FormControl, { error: errors !== null, fullWidth: true },
            React__default.createElement(RadioGroup, __assign({ value: value, onChange: updateValue }, config === null || config === void 0 ? void 0 : config.group), (_b = node === null || node === void 0 ? void 0 : node.options) === null || _b === void 0 ? void 0 : _b.map(function (_a) {
                var optionValue = _a.value, desc = _a.desc;
                return (React__default.createElement(FormControlLabel, __assign({ key: optionValue, value: optionValue, control: React__default.createElement(Radio, __assign({}, config === null || config === void 0 ? void 0 : config.radio)), label: desc }, config === null || config === void 0 ? void 0 : config.label)));
            })),
            errors !== null && (React__default.createElement(FormHelperText, { id: "input-" + node.uuid + "-error" }, Object.keys(errors).map(function (error) { return (React__default.createElement("span", { key: node.uuid + "-" + error }, error)); }))))));
}

function SelectNode(_a) {
    var _b;
    var node = _a.node;
    var pageContext = useContext(EditorContext);
    var _c = useState(''), value = _c[0], setValue = _c[1];
    var _d = useState(null), errors = _d[0], setErrors = _d[1];
    useEffect(function () {
        var defaultValue = node.value;
        if (typeof defaultValue !== 'undefined') {
            setValue(defaultValue);
        }
    }, [node.uuid]);
    useEffect(function () {
        var defaultErrors = node.errors;
        if (defaultErrors) {
            setErrors(defaultErrors);
        }
    }, [node === null || node === void 0 ? void 0 : node.errors]);
    var updateValue = function (change) {
        var newValue = change.target.value;
        var nodeErrors = pageContext.validateNode(node, newValue);
        pageContext.setValue(node.uuid, newValue, nodeErrors);
        setValue(newValue);
        setErrors(nodeErrors);
    };
    var config = node.config;
    return (React__default.createElement(React__default.Fragment, null,
        React__default.createElement(FormControl, { error: errors !== null, fullWidth: true },
            React__default.createElement(Select, __assign({ value: value, onChange: updateValue }, node === null || node === void 0 ? void 0 : node.select), (_b = node === null || node === void 0 ? void 0 : node.options) === null || _b === void 0 ? void 0 : _b.map(function (_a) {
                var optionValue = _a.value, desc = _a.desc;
                return React__default.createElement(MenuItem, __assign({ key: optionValue, value: optionValue }, config === null || config === void 0 ? void 0 : config.option), desc);
            })),
            errors !== null && (React__default.createElement(FormHelperText, { id: "input-" + node.uuid + "-error" }, Object.keys(errors).map(function (error) { return (React__default.createElement("span", { key: node.uuid + "-" + error }, error)); }))))));
}

function TextareaNode(_a) {
    var node = _a.node;
    var pageContext = useContext(EditorContext);
    var _b = useState(''), value = _b[0], setValue = _b[1];
    var _c = useState(null), errors = _c[0], setErrors = _c[1];
    useEffect(function () {
        var defaultValue = node.value;
        if (typeof defaultValue !== 'undefined') {
            setValue(defaultValue);
        }
    }, [node.uuid]);
    useEffect(function () {
        var defaultErrors = node.errors;
        if (defaultErrors) {
            setErrors(defaultErrors);
        }
    }, [node === null || node === void 0 ? void 0 : node.errors]);
    var updateValue = function (change) {
        var newValue = change.target.value;
        var nodeErrors = pageContext.validateNode(node, newValue);
        pageContext.setValue(node.uuid, newValue, nodeErrors);
        setValue(newValue);
        setErrors(nodeErrors);
    };
    var config = node.config;
    return (React__default.createElement(React__default.Fragment, null,
        React__default.createElement(FormControl, { error: errors !== null, fullWidth: true },
            React__default.createElement(InputLabel, { htmlFor: "input-" + node.uuid }, node.label),
            React__default.createElement(Input, __assign({ value: value, onChange: updateValue, "aria-describedby": "input-" + node.uuid + "-error", multiline: true, rows: 20 }, config === null || config === void 0 ? void 0 : config.input)),
            errors !== null && (React__default.createElement(FormHelperText, { id: "input-" + node.uuid + "-error" }, Object.keys(errors).map(function (error) { return (React__default.createElement("span", { key: node.uuid + "-" + error }, error)); }))))));
}

function NodeRenderer(_a) {
    var node = _a.node;
    var type = node.type;
    var context = useContext(EditorContext);
    if (context.hasCustomNode(type)) {
        return React__default.createElement(CustomNode, { node: node });
    }
    if (type === 'line') {
        return React__default.createElement(LineNode, { node: node });
    }
    if (type === 'radio') {
        return React__default.createElement(RadioNode, { node: node });
    }
    if (type === 'checkbox') {
        return React__default.createElement(CheckboxNode, { node: node });
    }
    if (type === 'select') {
        return React__default.createElement(SelectNode, { node: node });
    }
    if (type === 'textarea') {
        return React__default.createElement(TextareaNode, { node: node });
    }
    return (React__default.createElement("div", null, "Not implemented!"));
}

function NodeWrapper(_a) {
    var node = _a.node, index = _a.index, path = _a.path, length = _a.length;
    var pageContext = useContext(EditorContext);
    var _b = useState(false), animate = _b[0], shouldAnimate = _b[1];
    var _c = useState(false), collapsed = _c[0], setCollapsed = _c[1];
    var _d = useState({
        canAdd: false,
    }), state = _d[0], setState = _d[1];
    var addNode = function () {
        if (node.uuid) {
            pageContext.addNode(path, index);
            return;
        }
        pageContext.addNode(path);
    };
    useEffect(function () {
        shouldAnimate(true);
        setState({
            canAdd: pageContext.canAdd(path),
        });
    }, [node.uuid, node.tuuid, node.display]);
    if ((node.tuuid && !state.canAdd)) {
        // Do not render template nodes
        return React__default.createElement(React__default.Fragment, null);
    }
    if (node.tuuid && state.canAdd && node.display) {
        // Do not render template nodes
        return (React__default.createElement(Box, { display: "flex", flexDirection: "row" },
            React__default.createElement(Box, { p: 1, m: 1, mr: 0, bgcolor: "grey.300" },
                React__default.createElement(Button$1, { onClick: addNode, disabled: !state.canAdd, component: "span", color: "primary", size: "small", startIcon: React__default.createElement(AddBox, null) }, "Add " + node.name)),
            React__default.createElement(Box, { p: 1, m: 1, ml: 0, bgcolor: "grey.300", flexGrow: 1 }, node.slider && React__default.createElement(SliderControl, { node: node, path: path, index: index, length: length }))));
    }
    if ((!node.display)) {
        // Do not render template nodes
        return React__default.createElement(React__default.Fragment, null);
    }
    if (node.type === 'complex') {
        return (React__default.createElement(React__default.Fragment, null,
            React__default.createElement(Box, { display: "flex", flexDirection: "row" },
                React__default.createElement(Box, { flex: "100%", p: 1, m: 1, bgcolor: "grey.300" },
                    React__default.createElement(Button$1, { onClick: function () { return setCollapsed(!collapsed); }, component: "span", color: "primary", size: "small", startIcon: collapsed ? React__default.createElement(KeyboardArrowRight, null) : React__default.createElement(KeyboardArrowDown, null) }, index + ".",
                        ' ', "" + node.label)),
                React__default.createElement(Box, { flex: "140px", flexShrink: 0, p: 1, m: 1, mr: 1, bgcolor: "grey.300" },
                    React__default.createElement(Controls, { node: node, index: index, path: path, length: length }))),
            !collapsed && (React__default.createElement(Box, { display: "flex", flexDirection: "row" },
                React__default.createElement(Box, { flex: "150px", p: 1, m: 1, bgcolor: "grey.100" }),
                React__default.createElement(Box, { flex: "100%", p: 1, pr: 0, m: 1, mr: 0 }, node.children.map(function (childNode, childIndex) { return (React__default.createElement(NodeWrapper, { node: childNode, index: childIndex, key: childNode.uuid || childNode.tuuid, path: __spreadArray(__spreadArray([], path), [childIndex]), length: node.children.length })); }))))));
    }
    return (React__default.createElement(Box, { display: "flex", flexDirection: "row" },
        React__default.createElement(Box, { flex: "1 0 20%", p: 1, m: 1 }, node.label),
        React__default.createElement(Box, { flex: "80%", p: 1, m: 1, bgcolor: "grey.400" },
            React__default.createElement(CSSTransition, { in: animate, timeout: 3000, classNames: {
                    enter: 'animated',
                    enterActive: 'fadeIn',
                } },
                React__default.createElement(NodeRenderer, { node: node }))),
        React__default.createElement(Box, { flex: "140px", flexShrink: 0, p: 1, m: 1, mr: 1, bgcolor: "grey.300" },
            React__default.createElement(Controls, { node: node, index: index, path: path, length: length }))));
}

function Editor(_a) {
    var parser = _a.parser, page = _a.page, customNodes = _a.customNodes;
    var _b = useState([]), state = _b[0], setState = _b[1];
    useEffect(function () {
        var sub = parser.page.subscribe(function (result) {
            setState(result);
        });
        return function () {
            sub.unsubscribe();
        };
    }, [JSON.stringify(page)]);
    var moveUp = function (path, index) {
        parser.moveUp(path, index);
    };
    var moveDown = function (path, index) {
        parser.moveDown(path, index);
    };
    var canMoveUp = function (path, index, type, name) { return parser.canMoveUp(path, index, type, name); };
    var canMoveDown = function (path, index, type, name) { return parser.canMoveDown(path, index, type, name); };
    var canDelete = function (path) { return parser.canDelete(path); };
    var canAdd = function (path) { return parser.canAdd(path); };
    var addNode = function (path, index, amount) {
        parser.addNode(path, index, amount);
    };
    var deleteNode = function (path, amount) {
        parser.deleteNode(path, amount);
    };
    var setValue = function (id, value, errors) { return parser.setValue(id, value, errors); };
    var getValue = function (id, value, errors) { return parser.getValue(id, value, errors); };
    var validateNode = function (node, value) { return parser.validateNode(node, value); };
    var hasCustomNode = function (type) { return !!(customNodes === null || customNodes === void 0 ? void 0 : customNodes[type]); };
    var getCustomNode = function (type) { return customNodes[type]; };
    var getSiblings = function (path) { return parser.getSiblings(path); };
    var getEquationNodeIds = function (field, path) { return parser.getEquationNodeIds(field, path); };
    var pageSubject = parser.page;
    return (React__default.createElement(EditorContext.Provider, { value: {
            moveUp: moveUp,
            canMoveUp: canMoveUp,
            moveDown: moveDown,
            canMoveDown: canMoveDown,
            canAdd: canAdd,
            addNode: addNode,
            canDelete: canDelete,
            deleteNode: deleteNode,
            setValue: setValue,
            getValue: getValue,
            validateNode: validateNode,
            hasCustomNode: hasCustomNode,
            getCustomNode: getCustomNode,
            getSiblings: getSiblings,
            getEquationNodeIds: getEquationNodeIds,
            page: pageSubject,
        } }, state.map(function (node, index) { return (React__default.createElement(NodeWrapper, { key: node.uuid || node.tuuid, index: index, node: node, path: [index], length: state.length })); })));
}

var Parser = /** @class */ (function () {
    function Parser(validator) {
        this.internalPage = new BehaviorSubject([]);
        this.destroy = new Subject();
        this.nodesById = {};
        this.runShowHide = false;
        this.errorsList = {};
        this.validator = validator;
    }
    Object.defineProperty(Parser.prototype, "staticPage", {
        get: function () {
            return Parser.clone(this.internalPage.getValue());
        },
        set: function (value) {
            this.internalPage.next(Parser.clone(value));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Parser.prototype, "page", {
        get: function () {
            return this.internalPage.asObservable();
        },
        enumerable: false,
        configurable: true
    });
    Parser.prototype.loadTemplate = function (template, page) {
        this.destroy.next(true);
        this.nodesById = {};
        this.subscriptions = {};
        this.runShowHide = false;
        var parsed = this.parse(template, page);
        this.staticPage = parsed;
        this.searchShowHide(parsed);
    };
    Parser.clone = function (page) {
        return JSON.parse(JSON.stringify(page));
    };
    Parser.prototype.getPage = function () {
        return this.staticPage;
    };
    /**
     *
     * @param template
     * @param page
     * @param path
     * @private
     */
    Parser.prototype.parse = function (template, page, path) {
        var _this = this;
        if (page === void 0) { page = []; }
        if (path === void 0) { path = []; }
        var staticPage = [];
        // eslint-disable-next-line consistent-return
        template.forEach(function (templateNode, index) {
            if (templateNode.type === 'complex') {
                var nodes_1 = _this.findAllNodes(templateNode, page);
                nodes_1.forEach(function (_a) {
                    var children = _a.children, rest = __rest(_a, ["children"]);
                    var newChildren = _this.parse(templateNode.children, children !== null && children !== void 0 ? children : [], __spreadArray(__spreadArray([], path), [index]));
                    staticPage.push(__assign(__assign({}, rest), { children: newChildren }));
                });
                staticPage.push(__assign(__assign({}, templateNode), { display: !templateNode.show, tuuid: v4() }));
                return staticPage;
            }
            var nodes = _this.findAllNodes(templateNode, page);
            nodes.forEach(function (dataNode) {
                staticPage.push(dataNode);
            });
            staticPage.push(__assign(__assign({}, templateNode), { display: !templateNode.show, tuuid: v4() }));
        });
        return staticPage;
    };
    /**
     *
     * @param node
     * @param data
     * @private
     */
    Parser.prototype.findAllNodes = function (node, data) {
        var _this = this;
        var name = node.name, type = node.type;
        var nodes = data.filter(function (dataNode) { return (dataNode.name === name && dataNode.type === type && dataNode.uuid); })
            .map(function (dataNode) { return (__assign(__assign({}, node), {
            value: dataNode.value,
            uuid: dataNode.uuid,
            children: dataNode.children,
            display: !node.show,
        })); });
        if (nodes.length > 0) {
            if (!node.multiple) {
                var firstChild = nodes.shift();
                this.nodesById[firstChild.uuid] = null;
                return [firstChild];
            }
            nodes.forEach(function (thisNode) {
                _this.nodesById[thisNode.uuid] = null;
            });
            return nodes;
        }
        if (node.mandatory) {
            var uuid = v4();
            var newNode = __assign(__assign({}, node), { display: !node.show, uuid: uuid });
            this.nodesById[newNode.uuid] = null;
            return [newNode];
        }
        return [];
    };
    /**
     * Update the value for given node
     *
     * @param data
     * @param updateUuid
     * @param values
     * @private
     */
    Parser.prototype.updateNode = function (data, updateUuid, values) {
        var _this = this;
        return data.map(function (node) {
            var uuid = node.uuid, tuuid = node.tuuid, children = node.children;
            if (uuid === updateUuid || tuuid === updateUuid) {
                return (__assign(__assign({}, node), values));
            }
            if (Array.isArray(children)) {
                return __assign(__assign({}, node), { children: _this.updateNode(children, updateUuid, values) });
            }
            return node;
        });
    };
    /**
     * Setting the value fo a node, this does not trigger a re-render.
     *
     * @param id
     * @param value
     * @param errors
     */
    Parser.prototype.setValue = function (id, value, errors) {
        this.staticPage = this.updateNode(this.staticPage, id, {
            value: value,
            errors: errors,
        });
        if (!this.nodesById[id]) {
            this.nodesById[id] = new BehaviorSubject({
                value: value,
                errors: errors,
            });
            return;
        }
        var merged = __assign(__assign({}, this.nodesById[id].getValue()), { value: value,
            errors: errors });
        this.nodesById[id].next(merged);
    };
    /**
     * Setting custom params, triggers a re-render.
     *
     * @param id
     * @param params
     */
    Parser.prototype.setParams = function (id, params) {
        this.staticPage = this.updateNode(this.staticPage, id, params);
        if (!this.nodesById[id]) {
            this.nodesById[id] = new BehaviorSubject(params);
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        params.uuid; 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        params.tuuid; 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        params.name; 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        params.type; var rest = __rest(params, ["uuid", "tuuid", "name", "type"]);
        var merged = __assign(__assign({}, this.nodesById[id].getValue()), rest);
        this.nodesById[id].next(merged);
    };
    /**
     * Return the value for a given node
     *
     * @param id
     * @param defaultValue
     * @param defaultErrors
     */
    Parser.prototype.getValue = function (id, defaultValue, defaultErrors) {
        var _a, _b, _c;
        return (_c = (_b = (_a = this.nodesById) === null || _a === void 0 ? void 0 : _a[id]) === null || _b === void 0 ? void 0 : _b.getValue()) !== null && _c !== void 0 ? _c : {
            value: defaultValue,
            errors: defaultErrors,
        };
    };
    /**
     * Move a node 1 position up
     *
     * @param path
     * @param index
     */
    Parser.prototype.moveUp = function (path, index) {
        var clonePath = __spreadArray([], path);
        var nodeIndex = clonePath.pop();
        var page = this.staticPage;
        var siblings = this.getFromPath(clonePath, page).siblings;
        var _a = siblings[nodeIndex], name = _a.name, type = _a.type;
        var canMove = Parser.canMoveUpInternal(siblings, nodeIndex, type, name);
        if (canMove) {
            var newIndex = (typeof index !== 'undefined' ? index : nodeIndex - 1);
            siblings.splice(newIndex, 0, siblings.splice(nodeIndex, 1)[0]);
        }
        this.staticPage = page;
    };
    /**
     * Move node one position up
     * @param path
     * @param index
     */
    Parser.prototype.moveDown = function (path, index) {
        var clonePath = __spreadArray([], path);
        var nodeIndex = clonePath.pop();
        var page = this.staticPage;
        var _a = this.getFromPath(clonePath, page), parent = _a.parent, siblings = _a.siblings;
        var _b = siblings[nodeIndex], name = _b.name, type = _b.type;
        var canMove = Parser.canMoveDownInternal(siblings, nodeIndex, type, name);
        if (canMove) {
            var newIndex = (typeof index !== 'undefined' ? index : nodeIndex + 1);
            siblings.splice(newIndex, 0, siblings.splice(nodeIndex, 1)[0]);
            this.resetIndex(parent, siblings);
        }
        this.staticPage = page;
    };
    /**
     * Check if node can be moved down.
     *
     * @param path
     * @param index
     * @param type
     * @param name
     */
    Parser.prototype.canMoveUp = function (path, index, type, name) {
        var clonePath = __spreadArray([], path);
        var nodeIndex = clonePath.pop();
        var siblings = this.getFromPath(clonePath, this.staticPage).siblings;
        return Parser.canMoveUpInternal(siblings, nodeIndex, type, name);
    };
    /**
     * Check if a node can be added
     *
     * @param path
     */
    Parser.prototype.canAdd = function (path) {
        var clonePath = __spreadArray([], path);
        var nodeIndex = clonePath.pop();
        var siblings = this.getFromPath(clonePath, this.staticPage).siblings;
        var _a = siblings[nodeIndex], name = _a.name, type = _a.type, multiple = _a.multiple, uuid = _a.uuid, tuuid = _a.tuuid;
        if (uuid && !multiple) {
            return false;
        }
        if (tuuid && !multiple) {
            if (nodeIndex === 0) {
                return true;
            }
            var precedingSibling = siblings[nodeIndex - 1];
            if (precedingSibling.name !== name || precedingSibling.type !== type || !precedingSibling.uuid) {
                return true;
            }
        }
        return !!multiple;
    };
    /**
     * Add new node add given position
     *
     * @param path
     * @param index
     * @param amount
     */
    Parser.prototype.addNode = function (path, index, amount) {
        var clonePath = __spreadArray([], path);
        var nodeIndex = clonePath.pop();
        var page = this.staticPage;
        var siblings = this.getFromPath(__spreadArray([], clonePath), page).siblings;
        var _a = siblings[nodeIndex], name = _a.name, type = _a.type;
        var templateNode = siblings.find(function (node) { return (node.name === name && node.type === type && !node.uuid && node.tuuid); });
        if (!templateNode) {
            // eslint-disable-next-line no-console
            console.error("Template node type: " + type + ", name: " + name + " was not found.");
            this.staticPage = page;
            return;
        }
        if (!amount) {
            var newNode = this.initNode(templateNode);
            var insertIndex = typeof index !== 'undefined' ? index + 1 : nodeIndex;
            siblings.splice(insertIndex, 0, newNode);
            this.staticPage = page;
            this.searchShowHide(page);
            return;
        }
        // eslint-disable-next-line no-plusplus
        for (var i = 1; i <= amount; i++) {
            var newNode = this.initNode(templateNode);
            var insertIndex = typeof index !== 'undefined' ? index : nodeIndex;
            siblings.splice(insertIndex, 0, newNode);
        }
        this.staticPage = page;
        this.searchShowHide(page);
    };
    /**
     *
     * @param path
     * @param amount
     */
    Parser.prototype.deleteNode = function (path, amount) {
        var clonePath = __spreadArray([], path);
        var nodeIndex = clonePath.pop();
        var page = this.staticPage;
        var siblings = this.getFromPath(__spreadArray([], clonePath), page).siblings;
        if (!amount) {
            if (!this.canDelete(path)) {
                this.staticPage = page;
                return;
            }
            siblings.splice(nodeIndex, 1);
            this.staticPage = page;
            return;
        }
        // eslint-disable-next-line no-plusplus
        for (var i = 1; i <= amount; i++) {
            if (!this.canDelete(__spreadArray(__spreadArray([], clonePath), [nodeIndex - i]))) {
                this.staticPage = page;
                return;
            }
            siblings.splice(nodeIndex - i, 1);
        }
        this.staticPage = page;
    };
    /**
     *
     * @param path
     */
    Parser.prototype.canDelete = function (path) {
        var clonePath = __spreadArray([], path);
        var nodeIndex = clonePath.pop();
        var siblings = this.getFromPath(clonePath, this.staticPage).siblings;
        var _a = siblings[nodeIndex], type = _a.type, name = _a.name;
        return Parser.canDeleteNodeInternal(siblings, type, name);
    };
    /**
     *
     * @param siblings
     * @param type
     * @param name
     * @private
     */
    Parser.canDeleteNodeInternal = function (siblings, type, name) {
        var filtered = siblings.filter(function (node) { return node.name === name && node.type === type && typeof node.uuid !== 'undefined'; });
        var templateNode = siblings.find(function (node) { return node.name === name && node.type === type && typeof node.tuuid !== 'undefined'; });
        if (!templateNode.mandatory) {
            return true;
        }
        return templateNode.mandatory && filtered.length > 1;
    };
    /**
     * Initiate a given node
     *
     * @param node
     * @private
     */
    Parser.prototype.initNode = function (node) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        node.tuuid; 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        node.uuid; 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        node.value; var rest = __rest(node, ["tuuid", "uuid", "value"]);
        var newNode = __assign(__assign({}, rest), { uuid: v4() });
        return this.parse([rest], [newNode])[0];
    };
    /**
     * Check if node can me moved up
     *
     * @param path
     * @param index
     * @param type
     * @param name
     */
    Parser.prototype.canMoveDown = function (path, index, type, name) {
        var clonePath = __spreadArray([], path);
        var nodeIndex = clonePath.pop();
        var siblings = this.getFromPath(clonePath, this.staticPage).siblings;
        return Parser.canMoveDownInternal(siblings, nodeIndex, type, name);
    };
    /**
     *  Check if a node can be moved up.
     *  For this to be true there should be an preceding initiated node
     *  with the same type and name
     *
     * @param siblings
     * @param index
     * @param type
     * @param name
     * @private
     */
    Parser.canMoveUpInternal = function (siblings, index, type, name) {
        if (index === 0) {
            return false;
        }
        var precedingSibling = siblings[index - 1];
        return typeof precedingSibling.uuid !== 'undefined' && precedingSibling.name === name && precedingSibling.type === type;
    };
    /**
     *
     * @param siblings
     * @param index
     * @param type
     * @param name
     * @private
     */
    Parser.canMoveDownInternal = function (siblings, index, type, name) {
        if (!siblings[index + 1]) {
            return false;
        }
        var nextSibling = siblings[index + 1];
        return typeof nextSibling.uuid !== 'undefined' && nextSibling.name === name && nextSibling.type === type;
    };
    /**
     *
     * Get reference to deep data, this can be used to alter the tree
     *
     * @param path
     * @param data
     * @public
     */
    Parser.prototype.getFromPath = function (path, data) {
        if (path.length === 0) {
            return {
                parent: null,
                siblings: data,
            };
        }
        var index = path.shift();
        if (path.length > 0) {
            return this.getFromPath(path, data[index].children);
        }
        return {
            parent: data[index],
            siblings: data[index].children,
        };
    };
    /**
     * Probably not needed
     *
     * @param parent
     * @param siblings
     * @private
     */
    Parser.prototype.resetIndex = function (parent, siblings) {
        if (parent === null) {
            this.staticPage = siblings.filter(function () { return true; });
            return;
        }
        // eslint-disable-next-line no-param-reassign
        parent.children = siblings.filter(function () { return true; });
    };
    /**
     * Validate the whole page and return the errors
     */
    Parser.prototype.getPageErrors = function () {
        this.errorsList = {};
        this.staticPage = this.validateNodes(this.staticPage);
        return Object.keys(this.errorsList).length > 0 ? this.errorsList : null;
    };
    /**
     * Loop through the page data and validate the nodes.
     *
     * @param data
     * @private
     */
    Parser.prototype.validateNodes = function (data) {
        var _this = this;
        return data.map(function (node) {
            if (!node.uuid || !node.display) {
                return node;
            }
            var errors = _this.validator.checkInput(node, node.value);
            if (errors) {
                _this.errorsList[node.uuid] = {
                    uuid: node.uuid,
                    errors: errors,
                };
            }
            if (node.children) {
                var children = _this.validateNodes(node.children);
                return (__assign(__assign({}, node), { errors: errors,
                    children: children }));
            }
            return (__assign(__assign({}, node), { errors: errors }));
        });
    };
    /**
     * Validate single node
     *
     * @param node
     * @param value
     */
    Parser.prototype.validateNode = function (node, value) {
        var errors = this.validator.checkInput(node, value !== null && value !== void 0 ? value : node.value);
        if (errors) {
            this.errorsList[node.uuid] = {
                uuid: node.uuid,
                errors: errors,
            };
            return errors;
        }
        delete this.errorsList[node.uuid];
        return null;
    };
    /**
     *
     * @param path
     */
    Parser.prototype.getAllSiblings = function (path) {
        var clonePath = __spreadArray([], path);
        var siblings = this.getFromPath(clonePath, this.staticPage).siblings;
        if (!siblings) {
            return [];
        }
        return siblings;
    };
    /**
     *
     * @param path
     */
    Parser.prototype.getSiblings = function (path) {
        var clonePath = __spreadArray([], path);
        var nodeIndex = clonePath.pop();
        var siblings = this.getFromPath(clonePath, this.staticPage).siblings;
        if (!siblings[nodeIndex]) {
            return [];
        }
        var _a = siblings[nodeIndex], name = _a.name, type = _a.type;
        return siblings.filter(function (node) { return (node.name === name && node.type === type && node.uuid && !node.tuuid); });
    };
    Parser.parseEquation = function (equation) {
        if (equation.includes(Parser.EQ_STRICT_EQUAL)) {
            var _a = equation.split(Parser.EQ_STRICT_EQUAL), field = _a[0], value = _a[1];
            field = field.trim();
            value = value.trim();
            return [field, value, Parser.EQ_STRICT_EQUAL];
        }
        if (equation.includes(Parser.EQ_STRICT_NOT_EQUAL)) {
            var _b = equation.split(Parser.EQ_STRICT_NOT_EQUAL), field = _b[0], value = _b[1];
            field = field.trim();
            value = value.trim();
            return [field, value, Parser.EQ_STRICT_NOT_EQUAL];
        }
        if (equation.includes(Parser.EQ_GTE_OR_EQUAL)) {
            var _c = equation.split(Parser.EQ_GTE_OR_EQUAL), field = _c[0], value = _c[1];
            field = field.trim();
            value = value.trim();
            return [field, value, Parser.EQ_GTE_OR_EQUAL];
        }
        if (equation.includes(Parser.EQ_GTE)) {
            var _d = equation.split(Parser.EQ_GTE), field = _d[0], value = _d[1];
            field = field.trim();
            value = value.trim();
            return [field, value, Parser.EQ_GTE];
        }
        if (equation.includes(Parser.EQ_LTE_OR_EQUAL)) {
            var _e = equation.split(Parser.EQ_LTE_OR_EQUAL), field = _e[0], value = _e[1];
            field = field.trim();
            value = value.trim();
            return [field, value, Parser.EQ_LTE_OR_EQUAL];
        }
        if (equation.includes(Parser.EQ_LTE)) {
            var _f = equation.split(Parser.EQ_LTE), field = _f[0], value = _f[1];
            field = field.trim();
            value = value.trim();
            return [field, value, Parser.EQ_LTE];
        }
        if (equation.includes(this.EQ_IN)) {
            var _g = equation.split(this.EQ_IN), field = _g[0], value = _g[1];
            field = field.trim();
            value = value.trim();
            return [field, value, Parser.EQ_IN];
        }
        return [null, null, null];
    };
    Parser.prototype.getEquationNodeIds = function (field, path) {
        var _this = this;
        var clonePath = __spreadArray([], path);
        return this.getAllSiblings(clonePath)
            .filter(function (sibling) { return sibling.name === field && sibling.uuid; })
            .map(function (node) {
            var uuid = node.uuid, value = node.value, errors = node.errors;
            if (_this.nodesById[uuid]) {
                return node;
            }
            _this.nodesById[uuid] = new BehaviorSubject({
                value: value,
                errors: errors,
            });
            return node;
        })
            .map(function (_a) {
            var uuid = _a.uuid;
            return (uuid);
        });
    };
    Parser.prototype.searchShowHide = function (page, path) {
        var _this = this;
        if (path === void 0) { path = []; }
        page.forEach(function (node, index) {
            var _a;
            if (node.children) {
                _this.searchShowHide(node.children, __spreadArray(__spreadArray([], path), [index]));
            }
            if (typeof node.show !== 'undefined' && (node.uuid || node.tuuid)) {
                var _b = Parser.parseEquation(node.show), field = _b[0], value_1 = _b[1], type_1 = _b[2];
                var ids = _this.getEquationNodeIds(field, path);
                _this.setParams((_a = node.uuid) !== null && _a !== void 0 ? _a : node.tuuid, {
                    value: node.value,
                    errors: node.errors,
                    display: node.display,
                });
                ids.forEach(function (id) {
                    var _a;
                    _this.subscribe(((_a = node.uuid) !== null && _a !== void 0 ? _a : node.tuuid), id, value_1, type_1);
                });
            }
        });
    };
    Parser.prototype.subscribe = function (nodeId, fieldId, value, type) {
        var _this = this;
        if (!this.subscriptions[nodeId]) {
            this.subscriptions[nodeId] = {};
        }
        if (!this.subscriptions[nodeId][fieldId] && this.nodesById[fieldId]) {
            this.subscriptions[nodeId][fieldId] = this.nodesById[fieldId]
                .pipe(takeUntil(this.destroy))
                .subscribe(function () {
                var currentDisplay = _this.nodesById[nodeId].getValue().display;
                var hasMatch = __spreadArray(__spreadArray([], Object.keys(_this.subscriptions[nodeId])), [fieldId]).filter(function (id) {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
                    if (type === Parser.EQ_IN) {
                        return Parser.explodeValue(value)
                            .includes((_c = (_b = (_a = _this.nodesById) === null || _a === void 0 ? void 0 : _a[id]) === null || _b === void 0 ? void 0 : _b.getValue()) === null || _c === void 0 ? void 0 : _c.value);
                    }
                    if (type === Parser.EQ_STRICT_EQUAL) {
                        return ((_f = (_e = (_d = _this.nodesById) === null || _d === void 0 ? void 0 : _d[id]) === null || _e === void 0 ? void 0 : _e.getValue()) === null || _f === void 0 ? void 0 : _f.value) === Parser.convertValue(value);
                    }
                    if (type === Parser.EQ_STRICT_NOT_EQUAL) {
                        return ((_j = (_h = (_g = _this.nodesById) === null || _g === void 0 ? void 0 : _g[id]) === null || _h === void 0 ? void 0 : _h.getValue()) === null || _j === void 0 ? void 0 : _j.value) !== Parser.convertValue(value);
                    }
                    if (type === Parser.EQ_GTE_OR_EQUAL) {
                        return Number((_m = (_l = (_k = _this.nodesById) === null || _k === void 0 ? void 0 : _k[id]) === null || _l === void 0 ? void 0 : _l.getValue()) === null || _m === void 0 ? void 0 : _m.value) >= Number(value);
                    }
                    if (type === Parser.EQ_GTE) {
                        return Number((_q = (_p = (_o = _this.nodesById) === null || _o === void 0 ? void 0 : _o[id]) === null || _p === void 0 ? void 0 : _p.getValue()) === null || _q === void 0 ? void 0 : _q.value) > Number(value);
                    }
                    if (type === Parser.EQ_LTE_OR_EQUAL) {
                        return Number((_t = (_s = (_r = _this.nodesById) === null || _r === void 0 ? void 0 : _r[id]) === null || _s === void 0 ? void 0 : _s.getValue()) === null || _t === void 0 ? void 0 : _t.value) <= Number(value);
                    }
                    if (type === Parser.EQ_LTE) {
                        return Number((_w = (_v = (_u = _this.nodesById) === null || _u === void 0 ? void 0 : _u[id]) === null || _v === void 0 ? void 0 : _v.getValue()) === null || _w === void 0 ? void 0 : _w.value) < Number(value);
                    }
                    return false;
                });
                if (hasMatch.length > 0) {
                    if (currentDisplay === true) {
                        return;
                    }
                    _this.setParams(nodeId, { display: true });
                    return;
                }
                if (currentDisplay === false) {
                    return;
                }
                _this.setParams(nodeId, { display: false });
            });
        }
    };
    Parser.convertValue = function (value) {
        if (value.toLowerCase() === 'true') {
            return true;
        }
        if (value.toLowerCase() === 'false') {
            return false;
        }
        return value;
    };
    Parser.explodeValue = function (value) {
        return value
            .replace('\\,', '\\;')
            .split(',')
            .map(function (val) { return val.replace('\\;', ','); });
    };
    Parser.EQ_IN = ' in ';
    Parser.EQ_STRICT_EQUAL = '===';
    Parser.EQ_STRICT_NOT_EQUAL = '!==';
    Parser.EQ_GTE = '>';
    Parser.EQ_LTE = '<';
    Parser.EQ_GTE_OR_EQUAL = '>==';
    Parser.EQ_LTE_OR_EQUAL = '<==';
    return Parser;
}());

var AbstractValidator = /** @class */ (function () {
    function AbstractValidator() {
    }
    return AbstractValidator;
}());

var Validator = /** @class */ (function (_super) {
    __extends(Validator, _super);
    function Validator(validatorLib) {
        var _this = _super.call(this) || this;
        _this.validatorLib = validatorLib;
        return _this;
    }
    Validator.prototype.checkInput = function (node, value) {
        var _this = this;
        var validator = node.validator;
        var errors = {};
        if (node.mandatory && !(value !== null && value !== void 0 ? value : node.value) && !node.allowEmpty && node.type !== 'complex') {
            errors.isEmpty = true;
        }
        if (typeof validator === 'undefined') {
            return Object.keys(errors).length === 0 ? null : errors;
        }
        if (!Array.isArray(validator)) {
            validator = [validator];
        }
        validator.forEach(function (validationRule) {
            var _a;
            var rule = validationRule;
            var params = [];
            if (typeof validationRule === 'object') {
                rule = validationRule.rule;
                params = validationRule.params;
            }
            if (typeof _this.validatorLib[rule] === 'undefined') {
                console.error("Validation rule " + rule + " was not found in the validator library");
                return;
            }
            if (!(_a = _this.validatorLib)[rule].apply(_a, __spreadArray([String((value !== null && value !== void 0 ? value : node.value))], params))) {
                errors[validationRule] = false;
            }
        });
        return Object.keys(errors).length === 0 ? null : errors;
    };
    return Validator;
}(AbstractValidator));

function AuthGuard(_a) {
    var children = _a.children;
    var storeService = useContext(AppContext).storeService;
    if (!storeService.has('AccountsService', 'profile')) {
        return (React__default.createElement("div", null, "unauthorized"));
    }
    return (React__default.createElement(React__default.Fragment, null, children({ x: 'y' })));
}

function RoleGuard(_a) {
    var children = _a.children, _b = _a.expectedRole, expectedRole = _b === void 0 ? [] : _b, rest = __rest(_a, ["children", "expectedRole"]);
    var accountsService = useContext(AppContext).accountsService;
    var access = accountsService.hasAccess(expectedRole);
    if (!access) {
        return React__default.createElement(React__default.Fragment, null);
    }
    return React__default.cloneElement(children, rest);
}

var useStyles$3 = makeStyles(function (_theme) { return ({
    pendingWrapper: {
        position: 'relative',
    },
    pendingLayer: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: grey.A400,
        opacity: '0.1',
    },
}); });
function Pending(_a) {
    var loading = _a.loading, children = _a.children;
    var styles = useStyles$3();
    return (React__default.createElement("div", { className: styles.pendingWrapper },
        loading && React__default.createElement("div", { className: styles.pendingLayer }),
        children));
}

function Alert(props) {
    return React__default.createElement(MuiAlert, __assign({ elevation: 6, variant: "filled" }, props));
}
function Snackbar() {
    var _a = useState({
        open: false,
        type: 'info',
        message: null,
    }), snack = _a[0], setSnack = _a[1];
    var snackbarService = useContext(AppContext).snackbarService;
    useEffect(function () {
        var sub = snackbarService.subject.subscribe(function (next) {
            if (!next) {
                return;
            }
            setSnack(__assign({ open: true }, next));
        });
        return function () {
            sub.unsubscribe();
        };
    }, []);
    var handleClose = function (_event, reason) {
        if (reason === 'clickaway') {
            return;
        }
        setSnack({ open: false, type: 'info', message: null });
    };
    return (React__default.createElement(MatSnackbar, { open: snack.open, autoHideDuration: 6000, onClose: handleClose },
        React__default.createElement(Alert, { onClose: handleClose, severity: snack.type }, snack.message)));
}

function setQueryParam(query, param, value, prefix) {
    var clone = __assign({}, query);
    var queryParam = param;
    if (prefix) {
        queryParam = prefix + "_" + param;
    }
    clone[queryParam] = value;
    return clone;
}

function getPrefixedValues(query, prefix) {
    if (!prefix) {
        return query;
    }
    var regexp = new RegExp("^(" + prefix + "_)(.*)$");
    return Object.keys(query).reduce(function (prev, current) {
        var match = regexp.exec(current);
        if (match && match.length === 3) {
            var key = match[2];
            prev[key] = query[current];
        }
        return prev;
    }, {});
}

function Sortable(_a) {
    var column = _a.column, prefix = _a.prefix;
    var router = useRouter();
    var _b = useState(null), state = _b[0], setState = _b[1];
    var _c = getPrefixedValues(router.query, prefix), order_field = _c.order_field, order_dir = _c.order_dir;
    useEffect(function () {
        if (order_field === column) {
            if (order_dir === 'desc') {
                setState('desc');
                return;
            }
            setState('asc');
            return;
        }
        setState(null);
    }, [order_field, order_dir]);
    var sort = function (dir) {
        var params = __assign({}, router.query);
        if (state === dir) {
            params = setQueryParam(params, 'order_field', null, prefix);
            params = setQueryParam(params, 'order_dir', null, prefix);
            router.push({ query: params });
            return;
        }
        params = setQueryParam(params, 'order_field', column, prefix);
        params = setQueryParam(params, 'order_dir', dir, prefix);
        router.push({ query: params });
    };
    return (React__default.createElement(Box, { p: 1, alignSelf: "flex-end" },
        React__default.createElement("div", null,
            React__default.createElement(IconButton, { size: "small", onClick: function () { return sort('asc'); } },
                React__default.createElement(ArrowDropUp, { color: state === 'asc' ? 'secondary' : 'inherit' })),
            React__default.createElement(IconButton, { size: "small", onClick: function () { return sort('desc'); } },
                React__default.createElement(ArrowDropDown, { color: state === 'desc' ? 'secondary' : 'inherit' })))));
}

function Header(_a) {
    var column = _a.column, label = _a.label, prefix = _a.prefix, sortable = _a.sortable;
    return (React__default.createElement(TableCell, null,
        React__default.createElement(Box, { display: "flex" },
            React__default.createElement(Box, { p: 1, flexGrow: 1, alignSelf: "flex-end" }, label),
            sortable && React__default.createElement(Sortable, { column: column, prefix: prefix }))));
}

var useStyles$2 = makeStyles$1(function () { return ({
    form_control: {
        width: '100%',
    },
}); });
function HeaderSearch(_a) {
    var column = _a.column, label = _a.label, prefix = _a.prefix, sortable = _a.sortable;
    var router = useRouter();
    var classes = useStyles$2();
    var _b = useState(router.query[column] || ''), value = _b[0], setValue = _b[1];
    var subject = useMemo(function () { return new Subject(); }, []);
    useEffect(function () {
        var subscription = subject
            .pipe(distinctUntilChanged(), debounceTime(500))
            .subscribe(function (value) {
            var query = router.query, pathname = router.pathname;
            var params = setQueryParam(query, column, value, prefix);
            params = setQueryParam(params, 'page', 1, prefix);
            return from(router.push({
                pathname: pathname,
                query: params,
            }));
        });
        return function () {
            subscription.unsubscribe();
            subject.complete();
        };
    }, []);
    var onChange = function (event$) {
        var value = event$.target.value;
        setValue(value);
        subject.next(value);
    };
    var handleClearInput = function (event$) {
        event$.preventDefault();
        setValue('');
        subject.next('');
    };
    return (React__default.createElement(TableCell, null,
        React__default.createElement(Box, { display: "flex" },
            React__default.createElement(Box, { p: 1, flexGrow: 1, alignSelf: "flex-end" },
                React__default.createElement(FormControl, { className: classes.form_control },
                    React__default.createElement(InputLabel, { htmlFor: column + "-" + label }, label),
                    React__default.createElement(Input, { id: column + "-" + label, value: value, onChange: onChange, endAdornment: (value && (React__default.createElement(InputAdornment, { position: "end" },
                            React__default.createElement(IconButton, { "aria-label": "remove input", onClick: handleClearInput },
                                React__default.createElement(Backspace, null))))) }))),
            sortable && React__default.createElement(Sortable, { column: column, prefix: prefix }))));
}

function generateChildren(children, record) {
    return React__default.Children.map(children, function (child) {
        if (React__default.isValidElement(child)) {
            return React__default.cloneElement(child, {
                record: record,
                value: record,
            });
        }
        return child;
    });
}
var generateHeaders = function (children, prefix) { return React__default.Children.map(children, function (child) {
    var _a, _b;
    if (React__default.isValidElement(child)) {
        if ((_a = child === null || child === void 0 ? void 0 : child.props) === null || _a === void 0 ? void 0 : _a.searchable) {
            return (React__default.createElement(HeaderSearch, { label: child.props.label, prefix: prefix, column: child.props.column, sortable: child.props.sortable }));
        }
        if (typeof ((_b = child === null || child === void 0 ? void 0 : child.props) === null || _b === void 0 ? void 0 : _b.label) !== undefined) {
            return (React__default.createElement(Header, { label: child.props.label, prefix: prefix, column: child.props.column, sortable: child.props.sortable }));
        }
    }
    return React__default.createElement(TableCell, null);
}); };
var useStyles$1 = makeStyles({
    table: {
        minWidth: 650,
    },
});
function AppTable(_a) {
    var children = _a.children, resource = _a.resource, prefix = _a.prefix;
    var classes = useStyles$1();
    var router = useRouter();
    var handlePageChange = function (_event, page) {
        var currentQuery = router.query, pathname = router.pathname;
        var query = setQueryParam(currentQuery, 'page', page + 1, prefix);
        router.push({
            pathname: pathname,
            query: query,
        }, undefined, { shallow: true });
    };
    return (React__default.createElement(React__default.Fragment, null,
        React__default.createElement(TableContainer, { component: Paper },
            React__default.createElement(Table, { className: classes.table, "aria-label": "simple table", size: "small" },
                React__default.createElement(TableHead, null,
                    React__default.createElement(TableRow, null, generateHeaders(children, prefix))),
                React__default.createElement(TableBody, null, resource && (resource.data).map(function (record, index) { return (React__default.createElement(TableRow, { key: (record === null || record === void 0 ? void 0 : record.id) || index, hover: true }, generateChildren(children, record))); })))),
        React__default.createElement(TablePagination, { rowsPerPageOptions: [15, 25, 50, 100], component: "div", count: (resource === null || resource === void 0 ? void 0 : resource.total) || 0, rowsPerPage: (resource === null || resource === void 0 ? void 0 : resource.per_page) || 15, page: (resource === null || resource === void 0 ? void 0 : resource.current_page) - 1 || 0, onChangePage: handlePageChange, onChangeRowsPerPage: function () {
            } })));
}

function getValue(object, path) {
    return path.replace(/\[/g, '.')
        .replace(/\]/g, '')
        .split('.')
        .reduce(function (o, k) { return (o || {})[k]; }, object);
}

function Column(_a) {
    var align = _a.align, record = _a.record, column = _a.column, children = _a.children;
    if (children) {
        return React__default.createElement(TableCell, { align: align }, children(getValue(record, column), record));
    }
    return (React__default.createElement(TableCell, { align: align }, getValue(record, column)));
}

var useStyles = makeStyles(function (theme) { return ({
    root: {
        '& > *': {
            marginRight: theme.spacing(0.5),
        },
    },
    warning: {
        backgroundColor: amber.A400,
    },
}); });
function ColumnActions(_a) {
    var _b, _c;
    var align = _a.align, record = _a.record, column = _a.column, path = _a.path, handleDelete = _a.handleDelete, requiredRole = _a.requiredRole;
    var styles = useStyles();
    var router = useRouter();
    var _d = useState(false), open = _d[0], toggleOpen = _d[1];
    var handleClose = function (submit) {
        toggleOpen(false);
        if (!submit) {
            return;
        }
        if (handleDelete) {
            handleDelete(record);
        }
    };
    var navigate = function () {
        var pathname = path !== null && path !== void 0 ? path : router.pathname;
        router.push({
            pathname: pathname + "/" + record[column],
        });
    };
    return (React__default.createElement(TableCell, { align: align },
        React__default.createElement("div", { className: styles.root },
            React__default.createElement(RoleGuard, { expectedRole: requiredRole ? [(_b = {}, _b[requiredRole] = 'update', _b)] : [] },
                React__default.createElement(Button$1, { size: "small", variant: "outlined", color: "primary", onClick: navigate, startIcon: React__default.createElement(Edit, null) }, "Edit")),
            handleDelete && (React__default.createElement(RoleGuard, { expectedRole: requiredRole ? [(_c = {}, _c[requiredRole] = 'delete', _c)] : [] },
                React__default.createElement(Button$1, { className: "warning", size: "small", variant: "outlined", color: "secondary", onClick: function () { return toggleOpen(true); } },
                    React__default.createElement(Delete, null))))),
        React__default.createElement(ConfirmDialog, { open: open, handleClose: handleClose, title: "Remove entity?", content: "Are you sure you want to remove this entity?" })));
}

function ColumnBoolean(_a) {
    var align = _a.align, record = _a.record, column = _a.column;
    return (React__default.createElement(TableCell, { align: align }, record[column] ? React__default.createElement(Done, null) : null));
}

function ColumnDate(_a) {
    var align = _a.align, record = _a.record, column = _a.column, format = _a.format, locale = _a.locale;
    var globalLocale = useContext(AppContext).locale;
    var _b = useState(), date = _b[0], setDate = _b[1];
    var value = getValue(record, column);
    useMemo(function () {
        if (format === 'fromNow') {
            setDate(moment(value)
                .locale(locale || globalLocale)
                .fromNow());
            return;
        }
        setDate(moment(value)
            .locale(locale || globalLocale)
            .format(format || 'L HH:mm:ss'));
    }, [value, locale, format]);
    return (React__default.createElement(TableCell, { align: align }, date));
}

var FormResponse = /** @class */ (function () {
    function FormResponse() {
    }
    FormResponse.handleRequest = function (res, resolve, callback) {
        if (res.statusText !== 'ok') {
            if (typeof res.data.errors !== 'undefined') {
                resolve(res.data.errors);
                return;
            }
        }
        if (typeof callback === 'function') {
            callback(res);
        }
        resolve();
    };
    FormResponse.handleError = function (res, resolve, callback) {
        var _a;
        if (typeof callback === 'function') {
            callback(res);
        }
        if (typeof res.response !== 'undefined') {
            var data = res.response.data;
            if (typeof data === 'string') {
                resolve((_a = {}, _a[FORM_ERROR] = data, _a));
                return;
            }
            if (typeof data.error !== 'undefined') {
                resolve(data.error);
                return;
            }
            if (typeof data.errors !== 'undefined') {
                resolve(data.errors);
                return;
            }
            resolve(data);
            return;
        }
        resolve(res);
    };
    FormResponse.finalFormResponse = function (promise, callback) {
        var _this = this;
        return new Promise(function (resolve) {
            promise
                .toPromise()
                .then(function (res) { return _this.handleRequest(res, resolve, callback); })
                .catch(function (res) { return _this.handleError(res, resolve, callback); });
        });
    };
    return FormResponse;
}());

function getQueryParam(query, param, prefix) {
    if (prefix && !query[prefix]) {
        query[prefix] = {};
    }
    return prefix ? query[prefix + "_" + param] : query[param];
}

export { AbstractValidator, AppConsumer, AppContext, AppProvider, AppTable, AuthGuard, Column, ColumnActions, ColumnBoolean, ColumnDate, ConfirmDialog, Controls, CustomNode, Editor, EditorContext, FormResponse, Header, HeaderSearch, LineNode, NodeWrapper, Parser, Pending, RoleGuard, Snackbar, Sortable, Validator, getPrefixedValues, getQueryParam, getValue, setQueryParam };
//# sourceMappingURL=index.js.map
