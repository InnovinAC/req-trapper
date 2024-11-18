"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReqTrapper = void 0;
const ErrorMessages_1 = __importDefault(require("../ErrorMessages"));
const Helpers_1 = __importDefault(require("./Helpers"));
class ReqTrapper {
    constructor({ customValidations = [], helpers } = {}) {
        this.req = null;
        this.res = null;
        this.next = null;
        this.requestBody = null;
        this.errors = {};
        this.rules = [];
        this.customMessages = {};
        this.customValidations = [];
        this.middleware = (req, res, next) => {
            this.req = req;
            this.requestBody = req.body;
            this.res = res;
            this.next = next;
            this.rules.forEach((rule) => this.handleValidation(rule));
            console.log(this.errors);
            if (Object.keys(this.errors).length > 0) {
                res.status(400).json({ errors: this.errors });
            }
            else {
                next();
            }
        };
        this.customValidations = customValidations;
        this.helpers = helpers;
        this.errors = {}; // reset errors
    }
    setRules(rulesArray) {
        if (!Array.isArray(rulesArray)) {
            throw new Error("Invalid rule set passed");
        }
        else {
            this.rules = rulesArray;
        }
    }
    setCustomMessages(messages) {
        this.customMessages = messages;
    }
    validate(rulesArray) {
        const instance = new ReqTrapper({ customValidations: this.customValidations, helpers: new Helpers_1.default() });
        instance.setRules(rulesArray);
        return instance.middleware;
    }
    // TODO: Add to error message
    // addValidation(name: string, callback: (value: string) => any) {
    //     this.customValidations.push({
    //         validation: name,
    //         action: callback,
    //     });
    // }
    handleValidation(rule) {
        var _a;
        const value = (_a = this.requestBody) === null || _a === void 0 ? void 0 : _a[rule === null || rule === void 0 ? void 0 : rule.name];
        const validations = this.explodeValidation(rule === null || rule === void 0 ? void 0 : rule.validation);
        for (let validation of validations) {
            const [validationName, attribute] = validation.split(":");
            const valid = this.isValid(value, validationName, attribute);
            if (!valid) {
                this.errors[rule === null || rule === void 0 ? void 0 : rule.name] = this.getErrorMessage(rule === null || rule === void 0 ? void 0 : rule.name, validationName, attribute);
                break;
            }
        }
    }
    explodeValidation(validation) {
        return (validation === null || validation === void 0 ? void 0 : validation.split("|")) || [];
    }
    isValid(value, validation, attribute) {
        var _a, _b, _c, _d, _e;
        switch (validation) {
            case "required":
                return this.helpers.exists(value);
            case "email":
                return this.helpers.isEmail(value);
            case "min":
                return this.helpers.minimumOf(value, attribute);
            case "max":
                return this.helpers.maximumOf(value, attribute);
            case "in":
                return this.helpers.isInArray(value, attribute);
            case "number":
                return this.helpers.isNumber(value);
            case "greater_than":
                return this.helpers.isGreaterThanNum(value, attribute);
            case "nullable":
                return true;
            case "url":
                return this.helpers.isUrl(value);
            case "boolean":
                return this.helpers.isBoolean(value);
            case "alpha":
                return this.helpers.isAlpha(value);
            case "alpha_num":
                return this.helpers.isAlphaNum(value);
            case "array":
                return Array.isArray(value);
            case "json":
                return this.helpers.isJson(value);
            // case "confirmed":
            //     return value === this.requestBody?.[`${rule.name}_confirmation`];
            case "date":
                return this.helpers.isDate(value);
            case "after":
                return this.helpers.isAfter(value, attribute);
            case "before":
                return this.helpers.isBefore(value, attribute);
            case "unique":
                return this.helpers.isUnique(value, attribute); // I will need to define the database check
            case "digits":
                return this.helpers.isDigits(value, attribute);
            case "digits_between":
                return this.helpers.isDigitsBetween(value, attribute);
            case "exists":
                return this.helpers.existsInDb(value, attribute); // I will need to define the database check
            case "image":
                return this.helpers.isImage(value); // Check for image types
            case "file":
                return this.helpers.isFile(value); // General file validation
            case "mimes":
                return this.helpers.isMimeType(value, attribute); // Check file MIME types
            case "required_if":
                return this.helpers.requiredIf((_a = this.requestBody) === null || _a === void 0 ? void 0 : _a[attribute], value);
            case "required_unless":
                return this.helpers.requiredUnless((_b = this.requestBody) === null || _b === void 0 ? void 0 : _b[attribute], value);
            case "required_with":
                return this.helpers.requiredWith((_c = this.requestBody) === null || _c === void 0 ? void 0 : _c[attribute], value);
            case "required_with_all":
                return this.helpers.requiredWithAll(this.requestBody, attribute, value);
            case "required_without":
                return this.helpers.requiredWithout((_d = this.requestBody) === null || _d === void 0 ? void 0 : _d[attribute], value);
            case "required_without_all":
                return this.helpers.requiredWithoutAll(this.requestBody, attribute, value);
            default:
                const foundCustomValidation = this.customValidations.find((item) => item.validation === validation);
                if (foundCustomValidation) {
                    return (_e = foundCustomValidation.action(value, attribute)) !== null && _e !== void 0 ? _e : false;
                }
                return false;
        }
    }
    getErrorMessage(field, validation, attribute) {
        var _a;
        const customMessageKey = `${field}.${validation}`;
        if (this.customMessages[customMessageKey]) {
            return this.customMessages[customMessageKey];
        }
        const errorMessage = ((_a = ErrorMessages_1.default === null || ErrorMessages_1.default === void 0 ? void 0 : ErrorMessages_1.default[validation.toUpperCase()]) !== null && _a !== void 0 ? _a : "")
            .replace(":field", field)
            .replace(":attribute", attribute);
        return (errorMessage + '.') || "Validation error";
    }
}
exports.ReqTrapper = ReqTrapper;
