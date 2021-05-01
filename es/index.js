import { Box, IconButton, TableCell, FormControl, InputLabel, Input, InputAdornment, TableContainer, Paper, Table, TableHead, TableRow, TableBody, TablePagination, Button as Button$1 } from '@material-ui/core';
import * as React from 'react';
import React__default, { useState, useEffect, useMemo, useContext } from 'react';
import { useRouter } from 'next/router';
import { makeStyles as makeStyles$1 } from '@material-ui/styles';
import { Subject, from } from 'rxjs';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { ArrowDropUp, ArrowDropDown, Backspace, Edit, Delete, Done } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { amber, grey } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import moment from 'moment';
import MatSnackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { FORM_ERROR } from 'final-form';
import validator from 'validator';

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
    const router = useRouter();
    const [state, setState] = useState(null);
    const { order_field, order_dir } = getPrefixedValues(router.query, prefix);
    useEffect(() => {
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
        let params = { ...router.query };
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
            React__default.createElement(IconButton, { size: "small", onClick: () => sort('asc') },
                React__default.createElement(ArrowDropUp, { color: state === 'asc' ? 'secondary' : 'inherit' })),
            React__default.createElement(IconButton, { size: "small", onClick: () => sort('desc') },
                React__default.createElement(ArrowDropDown, { color: state === 'desc' ? 'secondary' : 'inherit' })))));
}

const useStyles$3 = makeStyles(() => ({
    form_control: {
        width: '100%'
    }
}));
function HeaderSearch({ column, label, prefix, sortable }) {
    const router = useRouter();
    const classes = useStyles$3();
    const [value, setValue] = useState(router.query[column] || '');
    const subject = useMemo(() => {
        return new Subject();
    }, []);
    useEffect(() => {
        const subscription = subject
            .pipe(distinctUntilChanged(), debounceTime(500))
            .subscribe((value) => {
            const { query, pathname } = router;
            let params = setQueryParam(query, column, value, prefix);
            params = setQueryParam(params, 'page', 1, prefix);
            return from(router.push({
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
    return React__default.createElement(TableCell, null,
        React__default.createElement(Box, { display: "flex" },
            React__default.createElement(Box, { p: 1, flexGrow: 1, alignSelf: "flex-end" },
                React__default.createElement(FormControl, { className: classes.form_control },
                    React__default.createElement(InputLabel, { htmlFor: `${column}-${label}` }, label),
                    React__default.createElement(Input, { id: `${column}-${label}`, value: value, onChange: onChange, endAdornment: (value && React__default.createElement(InputAdornment, { position: "end" },
                            React__default.createElement(IconButton, { "aria-label": "remove input", onClick: handleClearInput },
                                React__default.createElement(Backspace, null)))) }))),
            sortable && React__default.createElement(Sortable, { column: column, prefix: prefix })));
}

function Header({ column, label, prefix, sortable }) {
    return React__default.createElement(TableCell, null,
        React__default.createElement(Box, { display: "flex" },
            React__default.createElement(Box, { p: 1, flexGrow: 1, alignSelf: "flex-end" }, label),
            sortable && React__default.createElement(Sortable, { column: column, prefix: prefix })));
}

function generateChildren(children, record) {
    return React__default.Children.map(children, (child) => {
        if (React__default.isValidElement(child)) {
            return React__default.cloneElement(child, { record, value: record });
        }
        return child;
    });
}
const generateHeaders = (children, prefix) => {
    return React__default.Children.map(children, (child) => {
        var _a, _b;
        if (React__default.isValidElement(child)) {
            if ((_a = child === null || child === void 0 ? void 0 : child.props) === null || _a === void 0 ? void 0 : _a.searchable) {
                return React__default.createElement(HeaderSearch, { label: child.props.label, prefix: prefix, column: child.props.column, sortable: child.props.sortable });
            }
            if (typeof ((_b = child === null || child === void 0 ? void 0 : child.props) === null || _b === void 0 ? void 0 : _b.label) !== undefined) {
                return React__default.createElement(Header, { label: child.props.label, prefix: prefix, column: child.props.column, sortable: child.props.sortable });
            }
        }
        return React__default.createElement(TableCell, null);
    });
};
const useStyles$2 = makeStyles$1({
    table: {
        minWidth: 650,
    },
});
function AppTable({ children, resource, prefix }) {
    const classes = useStyles$2();
    const router = useRouter();
    const handlePageChange = (_event, page) => {
        const { query: currentQuery, pathname } = router;
        const query = setQueryParam(currentQuery, 'page', page + 1, prefix);
        router.push({
            pathname,
            query
        }, undefined, { shallow: true });
    };
    return (React__default.createElement(React__default.Fragment, null,
        React__default.createElement(TableContainer, { component: Paper },
            React__default.createElement(Table, { className: classes.table, "aria-label": "simple table", size: "small" },
                React__default.createElement(TableHead, null,
                    React__default.createElement(TableRow, null, generateHeaders(children, prefix))),
                React__default.createElement(TableBody, null, resource && (resource.data).map((record, index) => {
                    return (React__default.createElement(TableRow, { key: (record === null || record === void 0 ? void 0 : record.id) || index, hover: true }, generateChildren(children, record)));
                })))),
        React__default.createElement(TablePagination, { rowsPerPageOptions: [15, 25, 50, 100], component: "div", count: (resource === null || resource === void 0 ? void 0 : resource.total) || 0, rowsPerPage: (resource === null || resource === void 0 ? void 0 : resource.per_page) || 15, page: (resource === null || resource === void 0 ? void 0 : resource.current_page) - 1 || 0, onChangePage: handlePageChange, onChangeRowsPerPage: () => {
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
        return React__default.createElement(TableCell, { align: align }, children(getValue(record, column), record));
    }
    return (React__default.createElement(TableCell, { align: align }, getValue(record, column)));
}

function ConfirmDialog({ open, title, content, submitLabel, cancelLabel, handleClose }) {
    return (React__default.createElement(Dialog, { open: open, onClose: () => handleClose(false), "aria-labelledby": "alert-dialog-title", "aria-describedby": "alert-dialog-description" },
        React__default.createElement(DialogTitle, { id: "alert-dialog-title" }, title),
        React__default.createElement(DialogContent, null,
            React__default.createElement(DialogContentText, { id: "alert-dialog-description", dangerouslySetInnerHTML: { __html: content } })),
        React__default.createElement(DialogActions, null,
            React__default.createElement(Button, { onClick: () => handleClose(false), color: "primary" }, cancelLabel !== null && cancelLabel !== void 0 ? cancelLabel : 'Cancel'),
            React__default.createElement(Button, { onClick: () => handleClose(true), color: "primary", autoFocus: true }, submitLabel !== null && submitLabel !== void 0 ? submitLabel : 'Submit'))));
}

var ConfirmDialog$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': ConfirmDialog
});

const AppContext = React.createContext({});
function withAppContext(Component) {
    return (props) => (React.createElement(AppContext.Consumer, null, (context) => (React.createElement(Component, Object.assign({ context: context }, props)))));
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
    const { accountsService } = useContext(AppContext);
    const access = accountsService.hasAccess(expectedRole);
    if (!access) {
        return React__default.createElement(React__default.Fragment, null);
    }
    return React__default.cloneElement(children, rest);
}

var RoleGuard$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': RoleGuard
});

const useStyles$1 = makeStyles$1((theme) => ({
    root: {
        '& > *': {
            marginRight: theme.spacing(0.5),
        },
    },
    warning: {
        backgroundColor: amber.A400,
    },
}));
function ColumnActions({ align, record, column, path, handleDelete, requiredRole, }) {
    const styles = useStyles$1();
    const router = useRouter();
    const [open, toggleOpen] = useState(false);
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
        const pathname = path !== null && path !== void 0 ? path : router.pathname;
        router.push({
            pathname: `${pathname}/${record[column]}`,
        });
    };
    return (React__default.createElement(TableCell, { align: align },
        React__default.createElement("div", { className: styles.root },
            React__default.createElement(RoleGuard, { expectedRole: requiredRole ? [{ [requiredRole]: 'update' }] : [] },
                React__default.createElement(Button$1, { size: "small", variant: "outlined", color: "primary", onClick: navigate, startIcon: React__default.createElement(Edit, null) }, "Edit")),
            handleDelete && (React__default.createElement(RoleGuard, { expectedRole: requiredRole ? [{ [requiredRole]: 'delete' }] : [] },
                React__default.createElement(Button$1, { className: "warning", size: "small", variant: "outlined", color: "secondary", onClick: () => toggleOpen(true) },
                    React__default.createElement(Delete, null))))),
        React__default.createElement(ConfirmDialog, { open: open, handleClose: handleClose, title: "Remove entity?", content: "Are you sure you want to remove this entity?" })));
}

function ColumnBoolean({ align, record, column }) {
    return (React__default.createElement(TableCell, { align: align }, record[column] ? React__default.createElement(Done, null) : null));
}

function ColumnDate({ align, record, column, format, locale, }) {
    const { locale: globalLocale } = useContext(AppContext);
    const [date, setDate] = useState();
    const value = getValue(record, column);
    useMemo(() => {
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
    const { storeService } = useContext(AppContext);
    if (!storeService.has('AccountsService', 'profile')) {
        return (React__default.createElement("div", null, "unauthorized"));
    }
    return (React__default.createElement(React__default.Fragment, null, children({ x: 'y' })));
}

var AuthGuard$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': AuthGuard
});

const useStyles = makeStyles$1((_theme) => ({
    pendingWrapper: {
        position: 'relative'
    },
    pendingLayer: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: grey.A400,
        opacity: '0.1'
    }
}));
function Pending({ loading, children }) {
    const styles = useStyles();
    return (React__default.createElement("div", { className: styles.pendingWrapper },
        loading && React__default.createElement("div", { className: styles.pendingLayer }),
        children));
}

var Pending$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': Pending
});

function Alert(props) {
    return React__default.createElement(MuiAlert, Object.assign({ elevation: 6, variant: "filled" }, props));
}
function Snackbar() {
    const [snack, setSnack] = useState({
        open: false,
        type: 'info',
        message: null,
    });
    const { snackbarService } = useContext(AppContext);
    useEffect(() => {
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
    return (React__default.createElement(MatSnackbar, { open: snack.open, autoHideDuration: 6000, onClose: handleClose },
        React__default.createElement(Alert, { onClose: handleClose, severity: snack.type }, snack.message)));
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
                resolve({ [FORM_ERROR]: data });
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
    if (validator.isEmpty((_a = values[name]) !== null && _a !== void 0 ? _a : '')) {
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
    if (validator.isEmpty((_a = values[name]) !== null && _a !== void 0 ? _a : '')) {
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
    if (validator.isEmpty((_a = values[name]) !== null && _a !== void 0 ? _a : '')) {
        return;
    }
    if (!validator.isEmail(values[name])) {
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
                if (typeof validator === 'object' && Array.isArray(values[name])) {
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

export { AppContext$1 as AppContext, AuthGuard$1 as AuthGuard, ConfirmDialog$1 as ConfirmDialog, FormResponse$1 as FormResponse, Pending$1 as Pending, RoleGuard$1 as RoleGuard, Snackbar$1 as Snackbar, index as Table, Validator, getPrefixedValues$1 as getPrefixedValues, getQueryParam, getValue$1 as getValue, setQueryParam$1 as setQueryParam };
//# sourceMappingURL=index.js.map
