'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@material-ui/core');
var React = require('react');
var router = require('next/router');
var styles$1 = require('@material-ui/styles');
var rxjs = require('rxjs');
var operators = require('rxjs/operators');
var icons = require('@material-ui/icons');
var styles = require('@material-ui/core/styles');
var colors = require('@material-ui/core/colors');
var Button = require('@material-ui/core/Button');
var Dialog = require('@material-ui/core/Dialog');
var DialogActions = require('@material-ui/core/DialogActions');
var DialogContent = require('@material-ui/core/DialogContent');
var DialogContentText = require('@material-ui/core/DialogContentText');
var DialogTitle = require('@material-ui/core/DialogTitle');
var moment = require('moment');
var MatSnackbar = require('@material-ui/core/Snackbar');
var MuiAlert = require('@material-ui/lab/Alert');
var finalForm = require('final-form');
var validator = require('validator');

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

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var React__namespace = /*#__PURE__*/_interopNamespace(React);
var Button__default = /*#__PURE__*/_interopDefaultLegacy(Button);
var Dialog__default = /*#__PURE__*/_interopDefaultLegacy(Dialog);
var DialogActions__default = /*#__PURE__*/_interopDefaultLegacy(DialogActions);
var DialogContent__default = /*#__PURE__*/_interopDefaultLegacy(DialogContent);
var DialogContentText__default = /*#__PURE__*/_interopDefaultLegacy(DialogContentText);
var DialogTitle__default = /*#__PURE__*/_interopDefaultLegacy(DialogTitle);
var moment__default = /*#__PURE__*/_interopDefaultLegacy(moment);
var MatSnackbar__default = /*#__PURE__*/_interopDefaultLegacy(MatSnackbar);
var MuiAlert__default = /*#__PURE__*/_interopDefaultLegacy(MuiAlert);
var validator__default = /*#__PURE__*/_interopDefaultLegacy(validator);

function setQueryParam(query, param, value, prefix) {
    const clone = { ...query };
    let queryParam = param;
    if (prefix) {
        queryParam = `${prefix}_${param}`;
    }
    clone[queryParam] = value;
    return clone;
}

var setQueryParam$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': setQueryParam
});

function getPrefixedValues(query, prefix) {
    if (!prefix) {
        return query;
    }
    const regexp = new RegExp(`^(${prefix}_)(.*)$`);
    return Object.keys(query).reduce((prev, current) => {
        const match = regexp.exec(current);
        if (match && match.length === 3) {
            const key = match[2];
            prev[key] = query[current];
        }
        return prev;
    }, {});
}

var getPrefixedValues$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': getPrefixedValues
});

function Sortable({ column, prefix }) {
    const router$1 = router.useRouter();
    const [state, setState] = React.useState(null);
    const { order_field, order_dir } = getPrefixedValues(router$1.query, prefix);
    React.useEffect(() => {
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
    const sort = (dir) => {
        let params = { ...router$1.query };
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
            React__default['default'].createElement(core.IconButton, { size: "small", onClick: () => sort('asc') },
                React__default['default'].createElement(icons.ArrowDropUp, { color: state === 'asc' ? 'secondary' : 'inherit' })),
            React__default['default'].createElement(core.IconButton, { size: "small", onClick: () => sort('desc') },
                React__default['default'].createElement(icons.ArrowDropDown, { color: state === 'desc' ? 'secondary' : 'inherit' })))));
}

const useStyles$3 = styles.makeStyles(() => ({
    form_control: {
        width: '100%'
    }
}));
function HeaderSearch({ column, label, prefix, sortable }) {
    const router$1 = router.useRouter();
    const classes = useStyles$3();
    const [value, setValue] = React.useState(router$1.query[column] || '');
    const subject = React.useMemo(() => {
        return new rxjs.Subject();
    }, []);
    React.useEffect(() => {
        const subscription = subject
            .pipe(operators.distinctUntilChanged(), operators.debounceTime(500))
            .subscribe((value) => {
            const { query, pathname } = router$1;
            let params = setQueryParam(query, column, value, prefix);
            params = setQueryParam(params, 'page', 1, prefix);
            return rxjs.from(router$1.push({
                pathname,
                query: params
            }));
        });
        return () => {
            subscription.unsubscribe();
            subject.complete();
        };
    }, []);
    const onChange = (event$) => {
        const value = event$.target.value;
        setValue(value);
        subject.next(value);
    };
    const handleClearInput = (event$) => {
        event$.preventDefault();
        setValue('');
        subject.next('');
    };
    return React__default['default'].createElement(core.TableCell, null,
        React__default['default'].createElement(core.Box, { display: "flex" },
            React__default['default'].createElement(core.Box, { p: 1, flexGrow: 1, alignSelf: "flex-end" },
                React__default['default'].createElement(core.FormControl, { className: classes.form_control },
                    React__default['default'].createElement(core.InputLabel, { htmlFor: `${column}-${label}` }, label),
                    React__default['default'].createElement(core.Input, { id: `${column}-${label}`, value: value, onChange: onChange, endAdornment: (value && React__default['default'].createElement(core.InputAdornment, { position: "end" },
                            React__default['default'].createElement(core.IconButton, { "aria-label": "remove input", onClick: handleClearInput },
                                React__default['default'].createElement(icons.Backspace, null)))) }))),
            sortable && React__default['default'].createElement(Sortable, { column: column, prefix: prefix })));
}

function Header({ column, label, prefix, sortable }) {
    return React__default['default'].createElement(core.TableCell, null,
        React__default['default'].createElement(core.Box, { display: "flex" },
            React__default['default'].createElement(core.Box, { p: 1, flexGrow: 1, alignSelf: "flex-end" }, label),
            sortable && React__default['default'].createElement(Sortable, { column: column, prefix: prefix })));
}

function generateChildren(children, record) {
    return React__default['default'].Children.map(children, (child) => {
        if (React__default['default'].isValidElement(child)) {
            return React__default['default'].cloneElement(child, { record, value: record });
        }
        return child;
    });
}
const generateHeaders = (children, prefix) => {
    return React__default['default'].Children.map(children, (child) => {
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
const useStyles$2 = styles$1.makeStyles({
    table: {
        minWidth: 650,
    },
});
function AppTable({ children, resource, prefix }) {
    const classes = useStyles$2();
    const router$1 = router.useRouter();
    const handlePageChange = (_event, page) => {
        const { query: currentQuery, pathname } = router$1;
        const query = setQueryParam(currentQuery, 'page', page + 1, prefix);
        router$1.push({
            pathname,
            query
        }, undefined, { shallow: true });
    };
    return (React__default['default'].createElement(React__default['default'].Fragment, null,
        React__default['default'].createElement(core.TableContainer, { component: core.Paper },
            React__default['default'].createElement(core.Table, { className: classes.table, "aria-label": "simple table", size: "small" },
                React__default['default'].createElement(core.TableHead, null,
                    React__default['default'].createElement(core.TableRow, null, generateHeaders(children, prefix))),
                React__default['default'].createElement(core.TableBody, null, resource && (resource.data).map((record, index) => {
                    return (React__default['default'].createElement(core.TableRow, { key: (record === null || record === void 0 ? void 0 : record.id) || index, hover: true }, generateChildren(children, record)));
                })))),
        React__default['default'].createElement(core.TablePagination, { rowsPerPageOptions: [15, 25, 50, 100], component: "div", count: (resource === null || resource === void 0 ? void 0 : resource.total) || 0, rowsPerPage: (resource === null || resource === void 0 ? void 0 : resource.per_page) || 15, page: (resource === null || resource === void 0 ? void 0 : resource.current_page) - 1 || 0, onChangePage: handlePageChange, onChangeRowsPerPage: () => {
            } })));
}

function getValue(object, path) {
    return path.replace(/\[/g, '.')
        .replace(/\]/g, '')
        .split('.')
        .reduce((o, k) => (o || {})[k], object);
}

var getValue$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': getValue
});

function Column({ align, record, column, children }) {
    if (children) {
        return React__default['default'].createElement(core.TableCell, { align: align }, children(getValue(record, column), record));
    }
    return (React__default['default'].createElement(core.TableCell, { align: align }, getValue(record, column)));
}

function ConfirmDialog({ open, title, content, submitLabel, cancelLabel, handleClose }) {
    return (React__default['default'].createElement(Dialog__default['default'], { open: open, onClose: () => handleClose(false), "aria-labelledby": "alert-dialog-title", "aria-describedby": "alert-dialog-description" },
        React__default['default'].createElement(DialogTitle__default['default'], { id: "alert-dialog-title" }, title),
        React__default['default'].createElement(DialogContent__default['default'], null,
            React__default['default'].createElement(DialogContentText__default['default'], { id: "alert-dialog-description", dangerouslySetInnerHTML: { __html: content } })),
        React__default['default'].createElement(DialogActions__default['default'], null,
            React__default['default'].createElement(Button__default['default'], { onClick: () => handleClose(false), color: "primary" }, cancelLabel !== null && cancelLabel !== void 0 ? cancelLabel : 'Cancel'),
            React__default['default'].createElement(Button__default['default'], { onClick: () => handleClose(true), color: "primary", autoFocus: true }, submitLabel !== null && submitLabel !== void 0 ? submitLabel : 'Submit'))));
}

var ConfirmDialog$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': ConfirmDialog
});

const AppContext = React__namespace.createContext({});
function withAppContext(Component) {
    return (props) => (React__namespace.createElement(AppContext.Consumer, null, (context) => (React__namespace.createElement(Component, Object.assign({ context: context }, props)))));
}
const AppProvider = AppContext.Provider;
const AppConsumer = AppContext.Consumer;

var AppContext$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    withAppContext: withAppContext,
    AppProvider: AppProvider,
    AppConsumer: AppConsumer,
    'default': AppContext
});

function RoleGuard({ children, expectedRole = [], ...rest }) {
    const { accountsService } = React.useContext(AppContext);
    const access = accountsService.hasAccess(expectedRole);
    if (!access) {
        return React__default['default'].createElement(React__default['default'].Fragment, null);
    }
    return React__default['default'].cloneElement(children, rest);
}

var RoleGuard$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': RoleGuard
});

const useStyles$1 = styles$1.makeStyles((theme) => ({
    root: {
        '& > *': {
            marginRight: theme.spacing(0.5),
        },
    },
    warning: {
        backgroundColor: colors.amber.A400,
    },
}));
function ColumnActions({ align, record, column, path, handleDelete, requiredRole, }) {
    const styles = useStyles$1();
    const router$1 = router.useRouter();
    const [open, toggleOpen] = React.useState(false);
    const handleClose = (submit) => {
        toggleOpen(false);
        if (!submit) {
            return;
        }
        if (handleDelete) {
            handleDelete(record);
        }
    };
    const navigate = () => {
        const pathname = path !== null && path !== void 0 ? path : router$1.pathname;
        router$1.push({
            pathname: `${pathname}/${record[column]}`,
        });
    };
    return (React__default['default'].createElement(core.TableCell, { align: align },
        React__default['default'].createElement("div", { className: styles.root },
            React__default['default'].createElement(RoleGuard, { expectedRole: requiredRole ? [{ [requiredRole]: 'update' }] : [] },
                React__default['default'].createElement(core.Button, { size: "small", variant: "outlined", color: "primary", onClick: navigate, startIcon: React__default['default'].createElement(icons.Edit, null) }, "Edit")),
            handleDelete && (React__default['default'].createElement(RoleGuard, { expectedRole: requiredRole ? [{ [requiredRole]: 'delete' }] : [] },
                React__default['default'].createElement(core.Button, { className: "warning", size: "small", variant: "outlined", color: "secondary", onClick: () => toggleOpen(true) },
                    React__default['default'].createElement(icons.Delete, null))))),
        React__default['default'].createElement(ConfirmDialog, { open: open, handleClose: handleClose, title: "Remove entity?", content: "Are you sure you want to remove this entity?" })));
}

function ColumnBoolean({ align, record, column }) {
    return (React__default['default'].createElement(core.TableCell, { align: align }, record[column] ? React__default['default'].createElement(icons.Done, null) : null));
}

function ColumnDate({ align, record, column, format, locale, }) {
    const { locale: globalLocale } = React.useContext(AppContext);
    const [date, setDate] = React.useState();
    const value = getValue(record, column);
    React.useMemo(() => {
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

var index = /*#__PURE__*/Object.freeze({
    __proto__: null,
    AppTable: AppTable,
    Column: Column,
    ColumnActions: ColumnActions,
    ColumnBoolean: ColumnBoolean,
    ColumnDate: ColumnDate,
    Header: Header,
    HeaderSearch: HeaderSearch,
    Sortable: Sortable
});

function AuthGuard({ children }) {
    const { storeService } = React.useContext(AppContext);
    if (!storeService.has('AccountsService', 'profile')) {
        return (React__default['default'].createElement("div", null, "unauthorized"));
    }
    return (React__default['default'].createElement(React__default['default'].Fragment, null, children({ x: 'y' })));
}

var AuthGuard$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': AuthGuard
});

const useStyles = styles$1.makeStyles((_theme) => ({
    pendingWrapper: {
        position: 'relative'
    },
    pendingLayer: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: colors.grey.A400,
        opacity: '0.1'
    }
}));
function Pending({ loading, children }) {
    const styles = useStyles();
    return (React__default['default'].createElement("div", { className: styles.pendingWrapper },
        loading && React__default['default'].createElement("div", { className: styles.pendingLayer }),
        children));
}

var Pending$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': Pending
});

function Alert(props) {
    return React__default['default'].createElement(MuiAlert__default['default'], Object.assign({ elevation: 6, variant: "filled" }, props));
}
function Snackbar() {
    const [snack, setSnack] = React.useState({
        open: false,
        type: 'info',
        message: null,
    });
    const { snackbarService } = React.useContext(AppContext);
    React.useEffect(() => {
        const sub = snackbarService.subject.subscribe((next) => {
            if (!next) {
                return;
            }
            setSnack({ open: true, ...next });
        });
        return () => {
            sub.unsubscribe();
        };
    }, []);
    const handleClose = (_event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnack({ open: false, type: 'info', message: null });
    };
    return (React__default['default'].createElement(MatSnackbar__default['default'], { open: snack.open, autoHideDuration: 6000, onClose: handleClose },
        React__default['default'].createElement(Alert, { onClose: handleClose, severity: snack.type }, snack.message)));
}

var Snackbar$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': Snackbar
});

class FormResponse {
    static handleRequest(res, resolve, callback) {
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
    }
    static handleError(res, resolve, callback) {
        if (typeof callback === 'function') {
            callback(res);
        }
        if (typeof res.response !== 'undefined') {
            const { response: { data } } = res;
            if (typeof data === 'string') {
                resolve({ [finalForm.FORM_ERROR]: data });
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
    }
    static finalFormResponse(promise, callback) {
        return new Promise(resolve => {
            promise
                .toPromise()
                .then((res) => this.handleRequest(res, resolve, callback))
                .catch((res) => this.handleError(res, resolve, callback));
        });
    }
}

var FormResponse$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    FormResponse: FormResponse
});

function getCurrentValue(query, param, prefix) {
    if (prefix && !query[prefix]) {
        query[prefix] = {};
    }
    return prefix ? query[`${prefix}_${param}`] : query[param];
}

var getQueryParam = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getCurrentValue: getCurrentValue
});

class Validators {
}
Validators.required = (errors, name, values) => {
    var _a;
    if (validator__default['default'].isEmpty((_a = values[name]) !== null && _a !== void 0 ? _a : '')) {
        errors[name] = `${name} is required`;
    }
};
Validators.boolean = (errors, name, values) => {
    if (values[name] !== false && values[name] !== true) {
        errors[name] = `${name} should be true or false.`;
    }
};
Validators.password = (errors, name, values) => {
    var _a;
    if (validator__default['default'].isEmpty((_a = values[name]) !== null && _a !== void 0 ? _a : '')) {
        errors[name] = `${name} is required`;
        return;
    }
    const regex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})');
    if (!regex.test(values[name])) {
        errors[name] = `${name} is not a strong enough. At least 1 uppercase character, 1 numeric character and 1 special character.`;
    }
    if (values[name] !== values[`${name}_repeat`]) {
        errors[name] = 'passwords do not match.';
    }
};
Validators.email = (errors, name, values) => {
    var _a;
    if (validator__default['default'].isEmpty((_a = values[name]) !== null && _a !== void 0 ? _a : '')) {
        return;
    }
    if (!validator__default['default'].isEmail(values[name])) {
        errors[name] = 'Not a valid e-mailaddress ';
    }
};
Validators.test = (values, requirements) => {
    const errors = {};
    Object.keys(requirements).forEach((name) => {
        const validators = requirements[name];
        if (Array.isArray(validators)) {
            validators.forEach((validate) => {
                if (typeof validate === 'function') {
                    validate(errors, name, values);
                }
                if (typeof validator__default['default'] === 'object' && Array.isArray(values[name])) {
                    values[name].forEach((value, index) => {
                        const error = Validators.test(value, validate);
                        if (Object.keys(error).length > 0) {
                            if (!errors[name]) {
                                errors[name] = [];
                            }
                            errors[name][index] = error;
                        }
                    });
                }
            });
        }
    });
    return errors;
};

var Validator = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': Validators
});

exports.AppContext = AppContext$1;
exports.AuthGuard = AuthGuard$1;
exports.ConfirmDialog = ConfirmDialog$1;
exports.FormResponse = FormResponse$1;
exports.Pending = Pending$1;
exports.RoleGuard = RoleGuard$1;
exports.Snackbar = Snackbar$1;
exports.Table = index;
exports.Validator = Validator;
exports.getPrefixedValues = getPrefixedValues$1;
exports.getQueryParam = getQueryParam;
exports.getValue = getValue$1;
exports.setQueryParam = setQueryParam$1;
//# sourceMappingURL=index.js.map
