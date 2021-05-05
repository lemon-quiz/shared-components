'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var Button = require('@material-ui/core/Button');
var Dialog = require('@material-ui/core/Dialog');
var DialogActions = require('@material-ui/core/DialogActions');
var DialogContent = require('@material-ui/core/DialogContent');
var DialogContentText = require('@material-ui/core/DialogContentText');
var DialogTitle = require('@material-ui/core/DialogTitle');
var core = require('@material-ui/core');
var icons = require('@material-ui/icons');
var reactTransitionGroup = require('react-transition-group');
var ArrowDropUpIcon = require('@material-ui/icons/ArrowDropUp');
var uuid = require('uuid');
var styles = require('@material-ui/styles');
var colors = require('@material-ui/core/colors');
var MatSnackbar = require('@material-ui/core/Snackbar');
var MuiAlert = require('@material-ui/lab/Alert');
var router = require('next/router');
var rxjs = require('rxjs');
var operators = require('rxjs/operators');
var styles$1 = require('@material-ui/core/styles');
var moment = require('moment');
var finalForm = require('final-form');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () {
            return e[k];
          }
        });
      }
    });
  }
  n['default'] = e;
  return Object.freeze(n);
}

var React__namespace = /*#__PURE__*/_interopNamespace(React);
var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var Button__default = /*#__PURE__*/_interopDefaultLegacy(Button);
var Dialog__default = /*#__PURE__*/_interopDefaultLegacy(Dialog);
var DialogActions__default = /*#__PURE__*/_interopDefaultLegacy(DialogActions);
var DialogContent__default = /*#__PURE__*/_interopDefaultLegacy(DialogContent);
var DialogContentText__default = /*#__PURE__*/_interopDefaultLegacy(DialogContentText);
var DialogTitle__default = /*#__PURE__*/_interopDefaultLegacy(DialogTitle);
var ArrowDropUpIcon__default = /*#__PURE__*/_interopDefaultLegacy(ArrowDropUpIcon);
var MatSnackbar__default = /*#__PURE__*/_interopDefaultLegacy(MatSnackbar);
var MuiAlert__default = /*#__PURE__*/_interopDefaultLegacy(MuiAlert);
var moment__default = /*#__PURE__*/_interopDefaultLegacy(moment);

var AppContext = React__namespace.createContext({});
AppContext.Provider;
AppContext.Consumer;

function ConfirmDialog(_a) {
    var open = _a.open, title = _a.title, content = _a.content, submitLabel = _a.submitLabel, cancelLabel = _a.cancelLabel, handleClose = _a.handleClose;
    return (React__default['default'].createElement(Dialog__default['default'], { open: open, onClose: function () { return handleClose(false); }, "aria-labelledby": "alert-dialog-title", "aria-describedby": "alert-dialog-description" },
        React__default['default'].createElement(DialogTitle__default['default'], { id: "alert-dialog-title" }, title),
        React__default['default'].createElement(DialogContent__default['default'], null,
            React__default['default'].createElement(DialogContentText__default['default'], { id: "alert-dialog-description", dangerouslySetInnerHTML: { __html: content } })),
        React__default['default'].createElement(DialogActions__default['default'], null,
            React__default['default'].createElement(Button__default['default'], { onClick: function () { return handleClose(false); }, color: "primary" }, cancelLabel !== null && cancelLabel !== void 0 ? cancelLabel : 'Cancel'),
            React__default['default'].createElement(Button__default['default'], { onClick: function () { return handleClose(true); }, color: "primary", autoFocus: true }, submitLabel !== null && submitLabel !== void 0 ? submitLabel : 'Submit'))));
}

var EditorContext = React__default['default'].createContext(null);

function valuetext(value) {
    return "" + value;
}
function SliderControl(_a) {
    var node = _a.node, path = _a.path, index = _a.index, length = _a.length;
    var editorContext = React.useContext(EditorContext);
    var _b = React.useState(0), start = _b[0], setStart = _b[1];
    var _c = React.useState(0), counter = _c[0], setCounter = _c[1];
    React.useEffect(function () {
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
    return (React__default['default'].createElement(core.Slider, tslib.__assign({ value: start, getAriaValueText: valuetext, "aria-labelledby": "discrete-slider", valueLabelDisplay: "auto", step: 1, marks: true, min: 0, max: 100, onChangeCommitted: handleChange, onChange: setValue }, config === null || config === void 0 ? void 0 : config.slider)));
}

/* eslint-disable import/no-extraneous-dependencies */
function Controls(_a) {
    var node = _a.node, index = _a.index, path = _a.path, length = _a.length;
    var pageContext = React.useContext(EditorContext);
    var _b = React.useState({
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
    React.useEffect(function () {
        setState({
            canMoveUp: pageContext.canMoveUp(path, index, node.type, node.name),
            canMoveDown: pageContext.canMoveDown(path, index, node.type, node.name),
            canAdd: pageContext.canAdd(path),
            canDelete: pageContext.canDelete(path),
        });
    }, [index, length]);
    return (React__default['default'].createElement(React__default['default'].Fragment, null,
        React__default['default'].createElement(core.IconButton, { onClick: moveUp, disabled: !state.canMoveUp, component: "span", color: "primary", size: "small" },
            React__default['default'].createElement(ArrowDropUpIcon__default['default'], null)),
        React__default['default'].createElement(core.IconButton, { onClick: moveDown, disabled: !state.canMoveDown, component: "span", color: "primary", size: "small" },
            React__default['default'].createElement(icons.ArrowDropDown, null)),
        React__default['default'].createElement(core.IconButton, { onClick: addNode, disabled: !state.canAdd, component: "span", color: "primary", size: "small" },
            React__default['default'].createElement(icons.AddBox, null)),
        React__default['default'].createElement(core.IconButton, { onClick: deleteNode, disabled: !state.canDelete, component: "span", color: "primary", size: "small" },
            React__default['default'].createElement(icons.Delete, null))));
}

function CheckboxNode(_a) {
    var node = _a.node;
    var pageContext = React.useContext(EditorContext);
    var _b = React.useState(false), value = _b[0], setValue = _b[1];
    var _c = React.useState(null), errors = _c[0], setErrors = _c[1];
    React.useEffect(function () {
        var uuid = node.uuid, defaultValue = node.value, defaultErrors = node.errors;
        var _a = pageContext.getValue(uuid, defaultValue, defaultErrors), initValue = _a.value, initErrors = _a.errors;
        if (typeof initValue !== 'undefined') {
            setValue(initValue);
        }
        if (typeof initErrors !== 'undefined') {
            setErrors(initErrors);
        }
    }, [node === null || node === void 0 ? void 0 : node.errors]);
    var updateValue = function (change) {
        setValue(function (currentValue) {
            var _a;
            var _b = change.target, checkboxChecked = _b.checked, checkboxValue = _b.value;
            var calculatedValue = tslib.__assign({}, currentValue);
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
        return value;
    };
    var config = node.config;
    var options = function () { return (node.options || [{ value: true, desc: node.name }]).map(function (option) { return (React__default['default'].createElement(core.FormControlLabel, tslib.__assign({ key: node.name + "-" + String(option.value), control: React__default['default'].createElement(core.Checkbox, tslib.__assign({ checked: valueChecked(option.value), onChange: updateValue, name: option.desc, value: option.value }, config === null || config === void 0 ? void 0 : config.checkbox)), label: option.desc }, config === null || config === void 0 ? void 0 : config.label))); }); };
    return (React__default['default'].createElement(React__default['default'].Fragment, null,
        React__default['default'].createElement(core.FormControl, { error: errors !== null, fullWidth: true },
            React__default['default'].createElement(core.FormGroup, null, options()),
            errors !== null && (React__default['default'].createElement(core.FormHelperText, { id: "input-" + node.uuid + "-error" }, Object.keys(errors).map(function (error) { return (React__default['default'].createElement("span", { key: node.uuid + "-" + error }, error)); }))))));
}

function CustomNode(_a) {
    var node = _a.node;
    var editorContext = React.useContext(EditorContext);
    var type = node.type;
    var RenderNode = editorContext.getCustomNode(type);
    if (!RenderNode) {
        return React__default['default'].createElement(React__default['default'].Fragment, null);
    }
    return React__default['default'].createElement(RenderNode, { node: node });
}

function LineNode(_a) {
    var node = _a.node;
    var pageContext = React.useContext(EditorContext);
    var _b = React.useState(''), value = _b[0], setValue = _b[1];
    var _c = React.useState(null), errors = _c[0], setErrors = _c[1];
    var _d = React.useState(false); _d[0]; var setTouched = _d[1];
    React.useEffect(function () {
        var uuid = node.uuid, defaultValue = node.value, defaultErrors = node.errors;
        var _a = pageContext.getValue(uuid, defaultValue, defaultErrors), initValue = _a.value, initErrors = _a.errors;
        if (typeof initValue !== 'undefined') {
            setValue(initValue);
        }
        if (typeof initErrors !== 'undefined') {
            setErrors(initErrors);
        }
    }, [node === null || node === void 0 ? void 0 : node.errors]);
    var updateValue = function (change) {
        var newValue = change.target.value;
        var nodeErrors = pageContext.validateNode(node, newValue);
        pageContext.setValue(node.uuid, newValue, nodeErrors);
        setValue(newValue);
        setErrors(nodeErrors);
        setTouched(true);
    };
    var config = node.config;
    return (React__default['default'].createElement(React__default['default'].Fragment, null,
        React__default['default'].createElement(core.FormControl, { error: errors !== null, fullWidth: true },
            React__default['default'].createElement(core.InputLabel, { htmlFor: "input-" + node.uuid }, node.name),
            React__default['default'].createElement(core.Input, tslib.__assign({ id: "input-" + node.uuid, value: value, onChange: updateValue, "aria-describedby": "input-" + node.uuid + "-error" }, config === null || config === void 0 ? void 0 : config.input)),
            errors !== null && (React__default['default'].createElement(core.FormHelperText, { id: "input-" + node.uuid + "-error" }, Object.keys(errors).map(function (error) { return (React__default['default'].createElement("span", { key: node.uuid + "-" + error }, error)); }))))));
}

function RadioNode(_a) {
    var _b;
    var node = _a.node;
    var pageContext = React.useContext(EditorContext);
    var _c = React.useState(''), value = _c[0], setValue = _c[1];
    var _d = React.useState(null), errors = _d[0], setErrors = _d[1];
    React.useEffect(function () {
        var uuid = node.uuid, defaultValue = node.value, defaultErrors = node.errors;
        var _a = pageContext.getValue(uuid, defaultValue, defaultErrors), initValue = _a.value, initErrors = _a.errors;
        if (typeof initValue !== 'undefined') {
            setValue(initValue);
        }
        if (typeof initErrors !== 'undefined') {
            setErrors(initErrors);
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
    return (React__default['default'].createElement(React__default['default'].Fragment, null,
        React__default['default'].createElement(core.FormControl, { error: errors !== null, fullWidth: true },
            React__default['default'].createElement(core.RadioGroup, tslib.__assign({ value: value, onChange: updateValue }, config === null || config === void 0 ? void 0 : config.group), (_b = node === null || node === void 0 ? void 0 : node.options) === null || _b === void 0 ? void 0 : _b.map(function (_a) {
                var optionValue = _a.value, desc = _a.desc;
                return (React__default['default'].createElement(core.FormControlLabel, tslib.__assign({ key: optionValue, value: optionValue, control: React__default['default'].createElement(core.Radio, tslib.__assign({}, config === null || config === void 0 ? void 0 : config.radio)), label: desc }, config === null || config === void 0 ? void 0 : config.label)));
            })),
            errors !== null && (React__default['default'].createElement(core.FormHelperText, { id: "input-" + node.uuid + "-error" }, Object.keys(errors).map(function (error) { return (React__default['default'].createElement("span", { key: node.uuid + "-" + error }, error)); }))))));
}

function SelectNode(_a) {
    var _b;
    var node = _a.node;
    var pageContext = React.useContext(EditorContext);
    var _c = React.useState(''), value = _c[0], setValue = _c[1];
    var _d = React.useState(null), errors = _d[0], setErrors = _d[1];
    React.useEffect(function () {
        var uuid = node.uuid, defaultValue = node.value, defaultErrors = node.errors;
        var _a = pageContext.getValue(uuid, defaultValue, defaultErrors), initValue = _a.value, initErrors = _a.errors;
        if (typeof initValue !== 'undefined') {
            setValue(initValue);
        }
        if (typeof initErrors !== 'undefined') {
            setErrors(initErrors);
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
    return (React__default['default'].createElement(React__default['default'].Fragment, null,
        React__default['default'].createElement(core.FormControl, { error: errors !== null, fullWidth: true },
            React__default['default'].createElement(core.Select, tslib.__assign({ value: value, onChange: updateValue }, node === null || node === void 0 ? void 0 : node.select), (_b = node === null || node === void 0 ? void 0 : node.options) === null || _b === void 0 ? void 0 : _b.map(function (_a) {
                var optionValue = _a.value, desc = _a.desc;
                return React__default['default'].createElement(core.MenuItem, tslib.__assign({ key: optionValue, value: optionValue }, config === null || config === void 0 ? void 0 : config.option), desc);
            })),
            errors !== null && (React__default['default'].createElement(core.FormHelperText, { id: "input-" + node.uuid + "-error" }, Object.keys(errors).map(function (error) { return (React__default['default'].createElement("span", { key: node.uuid + "-" + error }, error)); }))))));
}

function TextareaNode(_a) {
    var node = _a.node;
    var pageContext = React.useContext(EditorContext);
    var _b = React.useState(''), value = _b[0], setValue = _b[1];
    var _c = React.useState(null), errors = _c[0], setErrors = _c[1];
    var _d = React.useState(false); _d[0]; var setTouched = _d[1];
    React.useEffect(function () {
        var uuid = node.uuid, defaultValue = node.value, defaultErrors = node.errors;
        var _a = pageContext.getValue(uuid, defaultValue, defaultErrors), initValue = _a.value, initErrors = _a.errors;
        if (typeof initValue !== 'undefined') {
            setValue(initValue);
        }
        if (typeof initErrors !== 'undefined') {
            setErrors(initErrors);
        }
    }, [node === null || node === void 0 ? void 0 : node.errors]);
    var updateValue = function (change) {
        var newValue = change.target.value;
        var nodeErrors = pageContext.validateNode(node, newValue);
        pageContext.setValue(node.uuid, newValue, nodeErrors);
        setValue(newValue);
        setErrors(nodeErrors);
        setTouched(true);
    };
    var config = node.config;
    return (React__default['default'].createElement(React__default['default'].Fragment, null,
        React__default['default'].createElement(core.FormControl, { error: errors !== null, fullWidth: true },
            React__default['default'].createElement(core.InputLabel, { htmlFor: "input-" + node.uuid }, node.name),
            React__default['default'].createElement(core.Input, tslib.__assign({ value: value, onChange: updateValue, "aria-describedby": "input-" + node.uuid + "-error", multiline: true, rows: 20 }, config === null || config === void 0 ? void 0 : config.input)),
            errors !== null && (React__default['default'].createElement(core.FormHelperText, { id: "input-" + node.uuid + "-error" }, Object.keys(errors).map(function (error) { return (React__default['default'].createElement("span", { key: node.uuid + "-" + error }, error)); }))))));
}

function NodeRenderer(_a) {
    var node = _a.node;
    var type = node.type;
    var context = React.useContext(EditorContext);
    if (context.hasCustomNode(type)) {
        return React__default['default'].createElement(CustomNode, { node: node });
    }
    if (type === 'line') {
        return React__default['default'].createElement(LineNode, { node: node });
    }
    if (type === 'radio') {
        return React__default['default'].createElement(RadioNode, { node: node });
    }
    if (type === 'checkbox') {
        return React__default['default'].createElement(CheckboxNode, { node: node });
    }
    if (type === 'select') {
        return React__default['default'].createElement(SelectNode, { node: node });
    }
    if (type === 'textarea') {
        return React__default['default'].createElement(TextareaNode, { node: node });
    }
    return (React__default['default'].createElement("div", null, "Not implemented!"));
}

function NodeWrapper(_a) {
    var node = _a.node, index = _a.index, path = _a.path, length = _a.length;
    var pageContext = React.useContext(EditorContext);
    var _b = React.useState(false), animate = _b[0], shouldAnimate = _b[1];
    var _c = React.useState(false), collapsed = _c[0], setCollapsed = _c[1];
    var _d = React.useState({
        canAdd: false,
    }), state = _d[0], setState = _d[1];
    var addNode = function () {
        if (node.uuid) {
            pageContext.addNode(path, index);
            return;
        }
        pageContext.addNode(path);
    };
    React.useEffect(function () {
        shouldAnimate(true);
        setState({
            canAdd: pageContext.canAdd(path),
        });
    }, [index, length]);
    if (node.tuuid && !state.canAdd) {
        // Do not render template nodes
        return React__default['default'].createElement(React__default['default'].Fragment, null);
    }
    if (node.tuuid && state.canAdd) {
        // Do not render template nodes
        return (React__default['default'].createElement(core.Box, { display: "flex", flexDirection: "row" },
            React__default['default'].createElement(core.Box, { p: 1, m: 1, mr: 0, bgcolor: "grey.300" },
                React__default['default'].createElement(core.Button, { onClick: addNode, disabled: !state.canAdd, component: "span", color: "primary", size: "small", startIcon: React__default['default'].createElement(icons.AddBox, null) }, "Add " + node.name)),
            React__default['default'].createElement(core.Box, { p: 1, m: 1, ml: 0, bgcolor: "grey.300", flexGrow: 1 }, node.slider && React__default['default'].createElement(SliderControl, { node: node, path: path, index: index, length: length }))));
    }
    if (node.type === 'complex') {
        return (React__default['default'].createElement(React__default['default'].Fragment, null,
            React__default['default'].createElement(core.Box, { display: "flex", flexDirection: "row" },
                React__default['default'].createElement(core.Box, { flex: "100%", p: 1, m: 1, bgcolor: "grey.300" },
                    React__default['default'].createElement(core.Button, { onClick: function () { return setCollapsed(!collapsed); }, component: "span", color: "primary", size: "small", startIcon: collapsed ? React__default['default'].createElement(icons.KeyboardArrowRight, null) : React__default['default'].createElement(icons.KeyboardArrowDown, null) }, index + ".",
                        ' ', "" + node.name)),
                React__default['default'].createElement(core.Box, { flex: "140px", flexShrink: 0, p: 1, m: 1, mr: 1, bgcolor: "grey.300" },
                    React__default['default'].createElement(Controls, { node: node, index: index, path: path, length: length }))),
            !collapsed && (React__default['default'].createElement(core.Box, { display: "flex", flexDirection: "row" },
                React__default['default'].createElement(core.Box, { flex: "150px", p: 1, m: 1, bgcolor: "grey.100" }),
                React__default['default'].createElement(core.Box, { flex: "100%", p: 1, pr: 0, m: 1, mr: 0 }, node.children.map(function (childNode, childIndex) { return (React__default['default'].createElement(NodeWrapper, { node: childNode, index: childIndex, key: childNode.uuid || childNode.tuuid, path: tslib.__spreadArray(tslib.__spreadArray([], path), [childIndex]), length: node.children.length })); }))))));
    }
    return (React__default['default'].createElement(core.Box, { display: "flex", flexDirection: "row" },
        React__default['default'].createElement(core.Box, { flex: "1 0 20%", p: 1, m: 1 }, node.name),
        React__default['default'].createElement(core.Box, { flex: "80%", p: 1, m: 1, bgcolor: "grey.400" },
            React__default['default'].createElement(reactTransitionGroup.CSSTransition, { in: animate, timeout: 3000, classNames: {
                    enter: 'animated',
                    enterActive: 'fadeIn',
                } },
                React__default['default'].createElement(NodeRenderer, { node: node }))),
        React__default['default'].createElement(core.Box, { flex: "140px", flexShrink: 0, p: 1, m: 1, mr: 1, bgcolor: "grey.300" },
            React__default['default'].createElement(Controls, { node: node, index: index, path: path, length: length }))));
}

function Editor(_a) {
    var parser = _a.parser, page = _a.page, customNodes = _a.customNodes;
    var _b = React.useState([]), state = _b[0], setState = _b[1];
    React.useEffect(function () {
        setState(page);
    }, [JSON.stringify(page)]);
    var moveUp = function (path, index) {
        setState(parser.moveUp(path, index));
    };
    var moveDown = function (path, index) {
        setState(parser.moveDown(path, index));
    };
    var canMoveUp = function (path, index, type, name) { return parser.canMoveUp(path, index, type, name); };
    var canMoveDown = function (path, index, type, name) { return parser.canMoveDown(path, index, type, name); };
    var canDelete = function (path) { return parser.canDelete(path); };
    var canAdd = function (path) { return parser.canAdd(path); };
    var addNode = function (path, index, amount) {
        setState(parser.addNode(path, index, amount));
    };
    var deleteNode = function (path, amount) {
        setState(parser.deleteNode(path, amount));
    };
    var setValue = function (id, value, errors) { return parser.setValue(id, value, errors); };
    var getValue = function (id, value, errors) { return parser.getValue(id, value, errors); };
    var validateNode = function (node, value) { return parser.validateNode(node, value); };
    var hasCustomNode = function (type) { return !!customNodes[type]; };
    var getCustomNode = function (type) { return customNodes[type]; };
    var getSiblings = function (path) { return parser.getSiblings(path); };
    return (React__default['default'].createElement(EditorContext.Provider, { value: {
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
        } }, state.map(function (node, index) { return (React__default['default'].createElement(NodeWrapper, { key: node.uuid || node.tuuid, index: index, node: node, path: [index], length: state.length })); })));
}

var Parser = /** @class */ (function () {
    function Parser(validator) {
        this.initPage = [];
        this.valueList = {};
        this.errorsList = {};
        this.validator = validator;
    }
    /**
     *
     * @param template
     * @param page
     */
    Parser.prototype.loadTemplate = function (template, page) {
        this.initPage = this.parse(template, page);
        this.valueList = {};
    };
    /**
     *
     */
    Parser.prototype.getPage = function () {
        return JSON.parse(JSON.stringify(this.initPage));
    };
    /**
     *
     * @param template
     * @param page
     * @param initPage
     * @private
     */
    Parser.prototype.parse = function (template, page, initPage) {
        var _this = this;
        if (page === void 0) { page = []; }
        if (initPage === void 0) { initPage = []; }
        // eslint-disable-next-line consistent-return
        template.forEach(function (templateNode) {
            if (templateNode.type === 'complex') {
                var nodes_1 = Parser.findAllNodes(templateNode, page);
                nodes_1.forEach(function (_a) {
                    var children = _a.children, rest = tslib.__rest(_a, ["children"]);
                    var newChildren = _this.parse(templateNode.children, children !== null && children !== void 0 ? children : []);
                    initPage.push(tslib.__assign(tslib.__assign({}, rest), { children: newChildren }));
                });
                initPage.push(tslib.__assign(tslib.__assign({}, templateNode), { tuuid: uuid.v4() }));
                return initPage;
            }
            var nodes = Parser.findAllNodes(templateNode, page);
            nodes.forEach(function (dataNode) {
                initPage.push(dataNode);
            });
            initPage.push(tslib.__assign(tslib.__assign({}, templateNode), { tuuid: uuid.v4() }));
        });
        return initPage;
    };
    /**
     *
     * @param node
     * @param data
     * @private
     */
    Parser.findAllNodes = function (node, data) {
        var name = node.name, type = node.type;
        var nodes = data.filter(function (dataNode) { return (dataNode.name === name && dataNode.type === type && dataNode.uuid); })
            .map(function (dataNode) { return (tslib.__assign(tslib.__assign({}, node), {
            value: dataNode.value,
            uuid: dataNode.uuid,
            children: dataNode.children,
        })); });
        if (nodes.length > 0) {
            if (!node.multiple) {
                return [nodes.shift()];
            }
            return nodes;
        }
        if (node.mandatory) {
            return [tslib.__assign(tslib.__assign({}, node), { uuid: uuid.v4() })];
        }
        return [];
    };
    /**
     * Move a node 1 position up
     *
     * @param path
     * @param index
     */
    Parser.prototype.moveUp = function (path, index) {
        var clonePath = tslib.__spreadArray([], path);
        var nodeIndex = clonePath.pop();
        var _a = this.getFromPath(clonePath, this.initPage), parent = _a.parent, siblings = _a.siblings;
        var _b = siblings[nodeIndex], name = _b.name, type = _b.type;
        var canMove = Parser.canMoveUpInternal(siblings, nodeIndex, type, name);
        if (canMove) {
            var newIndex = (typeof index !== 'undefined' ? index : nodeIndex - 1);
            siblings.splice(newIndex, 0, siblings.splice(nodeIndex, 1)[0]);
            this.resetIndex(parent, siblings);
        }
        this.resetIndex(parent, siblings);
        return this.getPage();
    };
    /**
     * Move node one position up
     * @param path
     * @param index
     */
    Parser.prototype.moveDown = function (path, index) {
        var clonePath = tslib.__spreadArray([], path);
        var nodeIndex = clonePath.pop();
        var _a = this.getFromPath(clonePath, this.initPage), parent = _a.parent, siblings = _a.siblings;
        var _b = siblings[nodeIndex], name = _b.name, type = _b.type;
        var canMove = Parser.canMoveDownInternal(siblings, nodeIndex, type, name);
        if (canMove) {
            var newIndex = (typeof index !== 'undefined' ? index : nodeIndex + 1);
            siblings.splice(newIndex, 0, siblings.splice(nodeIndex, 1)[0]);
            this.resetIndex(parent, siblings);
        }
        return this.getPage();
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
        var clonePath = tslib.__spreadArray([], path);
        var nodeIndex = clonePath.pop();
        var siblings = this.getFromPath(clonePath, this.initPage).siblings;
        return Parser.canMoveUpInternal(siblings, nodeIndex, type, name);
    };
    /**
     * Check if a node can be added
     *
     * @param path
     */
    Parser.prototype.canAdd = function (path) {
        var clonePath = tslib.__spreadArray([], path);
        var nodeIndex = clonePath.pop();
        var siblings = this.getFromPath(clonePath, this.initPage).siblings;
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
        var clonePath = tslib.__spreadArray([], path);
        var nodeIndex = clonePath.pop();
        var siblings = this.getFromPath(tslib.__spreadArray([], clonePath), this.initPage).siblings;
        var _a = siblings[nodeIndex], name = _a.name, type = _a.type;
        var templateNode = siblings.find(function (node) { return (node.name === name && node.type === type && !node.uuid && node.tuuid); });
        if (!templateNode) {
            // eslint-disable-next-line no-console
            console.error("Template node type: " + type + ", name: " + name + " was not found.");
            return this.getPage();
        }
        if (!amount) {
            var newNode = this.initNode(templateNode);
            var insertIndex = typeof index !== 'undefined' ? index + 1 : nodeIndex;
            siblings.splice(insertIndex, 0, newNode);
            return this.getPage();
        }
        // eslint-disable-next-line no-plusplus
        for (var i = 1; i <= amount; i++) {
            var newNode = this.initNode(templateNode);
            var insertIndex = typeof index !== 'undefined' ? index : nodeIndex;
            siblings.splice(insertIndex, 0, newNode);
        }
        return this.getPage();
    };
    /**
     *
     * @param path
     * @param amount
     */
    Parser.prototype.deleteNode = function (path, amount) {
        var clonePath = tslib.__spreadArray([], path);
        var nodeIndex = clonePath.pop();
        var siblings = this.getFromPath(tslib.__spreadArray([], clonePath), this.initPage).siblings;
        if (!amount) {
            if (!this.canDelete(path)) {
                return this.getPage();
            }
            siblings.splice(nodeIndex, 1);
            return this.getPage();
        }
        // eslint-disable-next-line no-plusplus
        for (var i = 1; i <= amount; i++) {
            if (!this.canDelete(tslib.__spreadArray(tslib.__spreadArray([], clonePath), [nodeIndex - i]))) {
                return this.getPage();
            }
            siblings.splice(nodeIndex - i, 1);
        }
        return this.getPage();
    };
    /**
     *
     * @param path
     */
    Parser.prototype.canDelete = function (path) {
        var clonePath = tslib.__spreadArray([], path);
        var nodeIndex = clonePath.pop();
        var siblings = this.getFromPath(clonePath, this.initPage).siblings;
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
        node.value; var rest = tslib.__rest(node, ["tuuid", "uuid", "value"]);
        var newNode = tslib.__assign(tslib.__assign({}, rest), { uuid: uuid.v4(), value: uuid.v4() });
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
        var clonePath = tslib.__spreadArray([], path);
        var nodeIndex = clonePath.pop();
        var siblings = this.getFromPath(clonePath, this.initPage).siblings;
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
            this.initPage = siblings.filter(function () { return true; });
            return;
        }
        // eslint-disable-next-line no-param-reassign
        parent.children = siblings.filter(function () { return true; });
    };
    /**
     *
     *
     * @param id
     * @param value
     * @param errors
     */
    Parser.prototype.setValue = function (id, value, errors) {
        this.valueList[id] = {
            id: id,
            value: value,
            errors: errors,
        };
        this.initPage = this.updateNode(this.initPage, id, {
            value: value,
            errors: errors,
        });
    };
    /**
     * Return the value for a given node
     *
     * @param id
     * @param defaultValue
     * @param defaultErrors
     */
    Parser.prototype.getValue = function (id, defaultValue, defaultErrors) {
        var _a, _b;
        return (_b = (_a = this.valueList) === null || _a === void 0 ? void 0 : _a[id]) !== null && _b !== void 0 ? _b : {
            value: defaultValue,
            errors: defaultErrors,
        };
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
            var uuid = node.uuid, children = node.children;
            if (uuid === updateUuid) {
                return (tslib.__assign(tslib.__assign({}, node), values));
            }
            if (Array.isArray(children)) {
                return tslib.__assign(tslib.__assign({}, node), { children: _this.updateNode(children, updateUuid, values) });
            }
            return node;
        });
    };
    /**
     * Validate the whole page and return the errors
     */
    Parser.prototype.getPageErrors = function () {
        this.errorsList = {};
        this.initPage = this.validateNodes(this.initPage);
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
            if (!node.uuid) {
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
                return (tslib.__assign(tslib.__assign({}, node), { errors: errors,
                    children: children }));
            }
            return (tslib.__assign(tslib.__assign({}, node), { errors: errors }));
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
    Parser.prototype.getSiblings = function (path) {
        var clonePath = tslib.__spreadArray([], path);
        var nodeIndex = clonePath.pop();
        var siblings = this.getFromPath(clonePath, this.initPage).siblings;
        var _a = siblings[nodeIndex], name = _a.name, type = _a.type;
        return siblings.filter(function (node) { return (node.name === name && node.type === type && node.uuid && !node.tuuid); });
    };
    Parser.prototype.getHash = function (seed) {
        if (seed === void 0) { seed = 0; }
        var str = JSON.stringify(this.initPage);
        var h1 = 0xdeadbeef ^ seed;
        var h2 = 0x41c6ce57 ^ seed;
        // eslint-disable-next-line no-plusplus
        for (var i = 0, ch = void 0; i < str.length; i++) {
            ch = str.charCodeAt(i);
            h1 = Math.imul(h1 ^ ch, 2654435761);
            h2 = Math.imul(h2 ^ ch, 1597334677);
        }
        h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
        h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
        return 4294967296 * (2097151 & h2) + (h1 >>> 0);
    };
    return Parser;
}());

var AbstractValidator = /** @class */ (function () {
    function AbstractValidator() {
    }
    return AbstractValidator;
}());

var Validator = /** @class */ (function (_super) {
    tslib.__extends(Validator, _super);
    function Validator(validatorLib) {
        var _this = _super.call(this) || this;
        _this.validatorLib = validatorLib;
        return _this;
    }
    Validator.prototype.checkInput = function (node, value) {
        var _this = this;
        var validator = node.validator;
        var errors = {};
        if (node.mandatory && !(value !== null && value !== void 0 ? value : node.value) && !node.allowEmpty) {
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
            if (!(_a = _this.validatorLib)[rule].apply(_a, tslib.__spreadArray([String((value !== null && value !== void 0 ? value : node.value))], params))) {
                errors[validationRule] = false;
            }
        });
        return Object.keys(errors).length === 0 ? null : errors;
    };
    return Validator;
}(AbstractValidator));

function AuthGuard(_a) {
    var children = _a.children;
    var storeService = React.useContext(AppContext).storeService;
    if (!storeService.has('AccountsService', 'profile')) {
        return (React__default['default'].createElement("div", null, "unauthorized"));
    }
    return (React__default['default'].createElement(React__default['default'].Fragment, null, children({ x: 'y' })));
}

function RoleGuard(_a) {
    var children = _a.children, _b = _a.expectedRole, expectedRole = _b === void 0 ? [] : _b, rest = tslib.__rest(_a, ["children", "expectedRole"]);
    var accountsService = React.useContext(AppContext).accountsService;
    var access = accountsService.hasAccess(expectedRole);
    if (!access) {
        return React__default['default'].createElement(React__default['default'].Fragment, null);
    }
    return React__default['default'].cloneElement(children, rest);
}

var useStyles$3 = styles.makeStyles(function (_theme) { return ({
    pendingWrapper: {
        position: 'relative',
    },
    pendingLayer: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: colors.grey.A400,
        opacity: '0.1',
    },
}); });
function Pending(_a) {
    var loading = _a.loading, children = _a.children;
    var styles = useStyles$3();
    return (React__default['default'].createElement("div", { className: styles.pendingWrapper },
        loading && React__default['default'].createElement("div", { className: styles.pendingLayer }),
        children));
}

function Alert(props) {
    return React__default['default'].createElement(MuiAlert__default['default'], tslib.__assign({ elevation: 6, variant: "filled" }, props));
}
function Snackbar() {
    var _a = React.useState({
        open: false,
        type: 'info',
        message: null,
    }), snack = _a[0], setSnack = _a[1];
    var snackbarService = React.useContext(AppContext).snackbarService;
    React.useEffect(function () {
        var sub = snackbarService.subject.subscribe(function (next) {
            if (!next) {
                return;
            }
            setSnack(tslib.__assign({ open: true }, next));
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
    return (React__default['default'].createElement(MatSnackbar__default['default'], { open: snack.open, autoHideDuration: 6000, onClose: handleClose },
        React__default['default'].createElement(Alert, { onClose: handleClose, severity: snack.type }, snack.message)));
}

function setQueryParam(query, param, value, prefix) {
    var clone = tslib.__assign({}, query);
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
    var router$1 = router.useRouter();
    var _b = React.useState(null), state = _b[0], setState = _b[1];
    var _c = getPrefixedValues(router$1.query, prefix), order_field = _c.order_field, order_dir = _c.order_dir;
    React.useEffect(function () {
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
        var params = tslib.__assign({}, router$1.query);
        if (state === dir) {
            params = setQueryParam(params, 'order_field', null, prefix);
            params = setQueryParam(params, 'order_dir', null, prefix);
            router$1.push({ query: params });
            return;
        }
        params = setQueryParam(params, 'order_field', column, prefix);
        params = setQueryParam(params, 'order_dir', dir, prefix);
        router$1.push({ query: params });
    };
    return (React__default['default'].createElement(core.Box, { p: 1, alignSelf: "flex-end" },
        React__default['default'].createElement("div", null,
            React__default['default'].createElement(core.IconButton, { size: "small", onClick: function () { return sort('asc'); } },
                React__default['default'].createElement(icons.ArrowDropUp, { color: state === 'asc' ? 'secondary' : 'inherit' })),
            React__default['default'].createElement(core.IconButton, { size: "small", onClick: function () { return sort('desc'); } },
                React__default['default'].createElement(icons.ArrowDropDown, { color: state === 'desc' ? 'secondary' : 'inherit' })))));
}

var useStyles$2 = styles$1.makeStyles(function () { return ({
    form_control: {
        width: '100%'
    }
}); });
function HeaderSearch(_a) {
    var column = _a.column, label = _a.label, prefix = _a.prefix, sortable = _a.sortable;
    var router$1 = router.useRouter();
    var classes = useStyles$2();
    var _b = React.useState(router$1.query[column] || ''), value = _b[0], setValue = _b[1];
    var subject = React.useMemo(function () {
        return new rxjs.Subject();
    }, []);
    React.useEffect(function () {
        var subscription = subject
            .pipe(operators.distinctUntilChanged(), operators.debounceTime(500))
            .subscribe(function (value) {
            var query = router$1.query, pathname = router$1.pathname;
            var params = setQueryParam(query, column, value, prefix);
            params = setQueryParam(params, 'page', 1, prefix);
            return rxjs.from(router$1.push({
                pathname: pathname,
                query: params
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
    return React__default['default'].createElement(core.TableCell, null,
        React__default['default'].createElement(core.Box, { display: "flex" },
            React__default['default'].createElement(core.Box, { p: 1, flexGrow: 1, alignSelf: "flex-end" },
                React__default['default'].createElement(core.FormControl, { className: classes.form_control },
                    React__default['default'].createElement(core.InputLabel, { htmlFor: column + "-" + label }, label),
                    React__default['default'].createElement(core.Input, { id: column + "-" + label, value: value, onChange: onChange, endAdornment: (value && React__default['default'].createElement(core.InputAdornment, { position: "end" },
                            React__default['default'].createElement(core.IconButton, { "aria-label": "remove input", onClick: handleClearInput },
                                React__default['default'].createElement(icons.Backspace, null)))) }))),
            sortable && React__default['default'].createElement(Sortable, { column: column, prefix: prefix })));
}

function Header(_a) {
    var column = _a.column, label = _a.label, prefix = _a.prefix, sortable = _a.sortable;
    return React__default['default'].createElement(core.TableCell, null,
        React__default['default'].createElement(core.Box, { display: "flex" },
            React__default['default'].createElement(core.Box, { p: 1, flexGrow: 1, alignSelf: "flex-end" }, label),
            sortable && React__default['default'].createElement(Sortable, { column: column, prefix: prefix })));
}

function generateChildren(children, record) {
    return React__default['default'].Children.map(children, function (child) {
        if (React__default['default'].isValidElement(child)) {
            return React__default['default'].cloneElement(child, { record: record, value: record });
        }
        return child;
    });
}
var generateHeaders = function (children, prefix) {
    return React__default['default'].Children.map(children, function (child) {
        var _a, _b;
        if (React__default['default'].isValidElement(child)) {
            if ((_a = child === null || child === void 0 ? void 0 : child.props) === null || _a === void 0 ? void 0 : _a.searchable) {
                return React__default['default'].createElement(HeaderSearch, { label: child.props.label, prefix: prefix, column: child.props.column, sortable: child.props.sortable });
            }
            if (typeof ((_b = child === null || child === void 0 ? void 0 : child.props) === null || _b === void 0 ? void 0 : _b.label) !== undefined) {
                return React__default['default'].createElement(Header, { label: child.props.label, prefix: prefix, column: child.props.column, sortable: child.props.sortable });
            }
        }
        return React__default['default'].createElement(core.TableCell, null);
    });
};
var useStyles$1 = styles.makeStyles({
    table: {
        minWidth: 650,
    },
});
function AppTable(_a) {
    var children = _a.children, resource = _a.resource, prefix = _a.prefix;
    var classes = useStyles$1();
    var router$1 = router.useRouter();
    var handlePageChange = function (_event, page) {
        var currentQuery = router$1.query, pathname = router$1.pathname;
        var query = setQueryParam(currentQuery, 'page', page + 1, prefix);
        router$1.push({
            pathname: pathname,
            query: query
        }, undefined, { shallow: true });
    };
    return (React__default['default'].createElement(React__default['default'].Fragment, null,
        React__default['default'].createElement(core.TableContainer, { component: core.Paper },
            React__default['default'].createElement(core.Table, { className: classes.table, "aria-label": "simple table", size: "small" },
                React__default['default'].createElement(core.TableHead, null,
                    React__default['default'].createElement(core.TableRow, null, generateHeaders(children, prefix))),
                React__default['default'].createElement(core.TableBody, null, resource && (resource.data).map(function (record, index) {
                    return (React__default['default'].createElement(core.TableRow, { key: (record === null || record === void 0 ? void 0 : record.id) || index, hover: true }, generateChildren(children, record)));
                })))),
        React__default['default'].createElement(core.TablePagination, { rowsPerPageOptions: [15, 25, 50, 100], component: "div", count: (resource === null || resource === void 0 ? void 0 : resource.total) || 0, rowsPerPage: (resource === null || resource === void 0 ? void 0 : resource.per_page) || 15, page: (resource === null || resource === void 0 ? void 0 : resource.current_page) - 1 || 0, onChangePage: handlePageChange, onChangeRowsPerPage: function () {
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
        return React__default['default'].createElement(core.TableCell, { align: align }, children(getValue(record, column), record));
    }
    return (React__default['default'].createElement(core.TableCell, { align: align }, getValue(record, column)));
}

var useStyles = styles.makeStyles(function (theme) { return ({
    root: {
        '& > *': {
            marginRight: theme.spacing(0.5),
        },
    },
    warning: {
        backgroundColor: colors.amber.A400,
    },
}); });
function ColumnActions(_a) {
    var _b, _c;
    var align = _a.align, record = _a.record, column = _a.column, path = _a.path, handleDelete = _a.handleDelete, requiredRole = _a.requiredRole;
    var styles = useStyles();
    var router$1 = router.useRouter();
    var _d = React.useState(false), open = _d[0], toggleOpen = _d[1];
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
        var pathname = path !== null && path !== void 0 ? path : router$1.pathname;
        router$1.push({
            pathname: pathname + "/" + record[column],
        });
    };
    return (React__default['default'].createElement(core.TableCell, { align: align },
        React__default['default'].createElement("div", { className: styles.root },
            React__default['default'].createElement(RoleGuard, { expectedRole: requiredRole ? [(_b = {}, _b[requiredRole] = 'update', _b)] : [] },
                React__default['default'].createElement(core.Button, { size: "small", variant: "outlined", color: "primary", onClick: navigate, startIcon: React__default['default'].createElement(icons.Edit, null) }, "Edit")),
            handleDelete && (React__default['default'].createElement(RoleGuard, { expectedRole: requiredRole ? [(_c = {}, _c[requiredRole] = 'delete', _c)] : [] },
                React__default['default'].createElement(core.Button, { className: "warning", size: "small", variant: "outlined", color: "secondary", onClick: function () { return toggleOpen(true); } },
                    React__default['default'].createElement(icons.Delete, null))))),
        React__default['default'].createElement(ConfirmDialog, { open: open, handleClose: handleClose, title: "Remove entity?", content: "Are you sure you want to remove this entity?" })));
}

function ColumnBoolean(_a) {
    var align = _a.align, record = _a.record, column = _a.column;
    return (React__default['default'].createElement(core.TableCell, { align: align }, record[column] ? React__default['default'].createElement(icons.Done, null) : null));
}

function ColumnDate(_a) {
    var align = _a.align, record = _a.record, column = _a.column, format = _a.format, locale = _a.locale;
    var globalLocale = React.useContext(AppContext).locale;
    var _b = React.useState(), date = _b[0], setDate = _b[1];
    var value = getValue(record, column);
    React.useMemo(function () {
        if (format === 'fromNow') {
            setDate(moment__default['default'](value)
                .locale(locale || globalLocale)
                .fromNow());
            return;
        }
        setDate(moment__default['default'](value)
            .locale(locale || globalLocale)
            .format(format || 'L HH:mm:ss'));
    }, [value, locale, format]);
    return (React__default['default'].createElement(core.TableCell, { align: align }, date));
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
                resolve((_a = {}, _a[finalForm.FORM_ERROR] = data, _a));
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

exports.AbstractValidator = AbstractValidator;
exports.AppContext = AppContext;
exports.AppTable = AppTable;
exports.AuthGuard = AuthGuard;
exports.Column = Column;
exports.ColumnActions = ColumnActions;
exports.ColumnBoolean = ColumnBoolean;
exports.ColumnDate = ColumnDate;
exports.ConfirmDialog = ConfirmDialog;
exports.Controls = Controls;
exports.Editor = Editor;
exports.EditorContext = EditorContext;
exports.FormResponse = FormResponse;
exports.Header = Header;
exports.HeaderSearch = HeaderSearch;
exports.LineNode = LineNode;
exports.NodeWrapper = NodeWrapper;
exports.Parser = Parser;
exports.Pending = Pending;
exports.RoleGuard = RoleGuard;
exports.Snackbar = Snackbar;
exports.Sortable = Sortable;
exports.Validator = Validator;
exports.getPrefixedValues = getPrefixedValues;
exports.getQueryParam = getQueryParam;
exports.getValue = getValue;
exports.setQueryParam = setQueryParam;
//# sourceMappingURL=index.js.map
