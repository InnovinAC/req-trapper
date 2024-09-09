import { NextFunction, Request, Response } from "express";
import { RuleSet } from "../interfaces";
import ErrorMessages from "../ErrorMessages";
import Helpers from "./Helpers";

type TCustomValidation = {
    action: (value: string, args?: any) => any,
    validation: string
};

interface IReqTrapperConstructor {
    customValidations?: TCustomValidation[],
    helpers?: Helpers
}

export class ReqTrapper {
    private req: Request | null = null;
    private res: Response | null = null;
    private next: NextFunction | null = null;
    private requestBody: any | null = null;
    private errors: { [key: string]: any } = {};
    private rules: RuleSet[] = [];
    private customMessages: { [key: string]: string } = {};
    private readonly customValidations: TCustomValidation[] = [];
    private helpers: Helpers;

    constructor({customValidations = [], helpers}: IReqTrapperConstructor = {}) {
        this.customValidations = customValidations;
        this.helpers = helpers!;
        this.errors = {}; // reset errors
    }

    private middleware = (req: Request, res: Response, next: NextFunction) => {
        this.req = req;
        this.requestBody = req.body;
        this.res = res;
        this.next = next;



        this.rules.forEach((rule) => this.handleValidation(rule));
        console.log(this.errors)
        if (Object.keys(this.errors).length > 0) {
            res.status(400).json({ errors: this.errors });
        } else {

            next();
        }
    };

    setRules(rulesArray: RuleSet[]) {
        if (!Array.isArray(rulesArray)) {
            throw new Error("Invalid rule set passed");
        } else {
            this.rules = rulesArray;
        }
    }

    setCustomMessages(messages: { [key: string]: string }) {
        this.customMessages = messages;
    }

    validate(rulesArray: RuleSet[]) {
        const instance = new ReqTrapper({customValidations: this.customValidations, helpers: new Helpers()});
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

    private handleValidation(rule: RuleSet) {
        const value = this.requestBody?.[rule?.name];
        const validations = this.explodeValidation(rule?.validation);

        for (let validation of validations) {
            const [validationName, attribute] = validation.split(":");
            const valid = this.isValid(value, validationName, attribute);

            if (!valid) {
                this.errors[rule?.name] = this.getErrorMessage(rule?.name, validationName, attribute);
                break;
            }
        }
    }

    private explodeValidation(validation: string): string[] {
        return validation?.split("|") || [];
    }

    private isValid(value: any, validation: string, attribute?: any): boolean {
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
                return this.helpers.requiredIf(this.requestBody?.[attribute], value);
            case "required_unless":
                return this.helpers.requiredUnless(this.requestBody?.[attribute], value);
            case "required_with":
                return this.helpers.requiredWith(this.requestBody?.[attribute], value);
            case "required_with_all":
                return this.helpers.requiredWithAll(this.requestBody, attribute, value);
            case "required_without":
                return this.helpers.requiredWithout(this.requestBody?.[attribute], value);
            case "required_without_all":
                return this.helpers.requiredWithoutAll(this.requestBody, attribute, value);
            default:
                const foundCustomValidation = this.customValidations.find((item) => item.validation === validation);
                if (foundCustomValidation) {
                    return foundCustomValidation.action(value, attribute) ?? false;
                }
                return false;
        }
    }

    private getErrorMessage(field: string, validation: string, attribute?: any) {
        const customMessageKey = `${field}.${validation}`;
        if (this.customMessages[customMessageKey]) {
            return this.customMessages[customMessageKey];
        }
        const errorMessage = (ErrorMessages?.[validation.toUpperCase()] ?? "")
            .replace(":field", field)
            .replace(":attribute", attribute);
        return errorMessage || "Validation error";
    }
}
