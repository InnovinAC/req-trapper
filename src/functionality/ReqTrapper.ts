import {NextFunction, Request, Response} from "express";
import {RuleSet} from "../interfaces";
import ErrorMessages from "../ErrorMessages";
import Helpers from "./Helpers";

// @Todo Allow custom validation
// @Todo Add in more validations
// Todo - Create means to skip validation if required is not set

/**
 @classdesc Main class for request trapper.
  This class is what initiates the whole process. More like the engine.
 * @member req
 * @member res
 * @member next
 * @member errors
 * @member rules
 * @member helpers
 */
export class ReqTrapper {
    private req: Request | null = null;
    private res: Response | null = null;
    private next: NextFunction | null = null;
    private requestBody: any | null = null;
    private errors: {[key: string]: any} = {};
    private rules: RuleSet[] = [];
    private validations: string[] = [];
    private helpers: any;

    constructor() {
        // this.helpers = new Helpers({validations: null})
    }

    /**

     ## The middleware
     This handles the request

     @param req Express Request
     @param res Express Response
     @param next Express NextFunction
     @returns void
     */
    middleware = (req: Request, res: Response, next: NextFunction) => {
        req && (this.req = req) && (this.requestBody = req.body);
        res && (this.res = res);
        next && (this.next = next);

        this.rules.map((rule: RuleSet) => {
            this.handleValidation(rule);
            return;
        });
        const errors = {...this.errors}
        this.errors = {};
        if (Object.keys(errors)?.length > 0) {
            res.status(400).json({errors, success: false, data: null});
        } else {
            this.next && this.next();
        }
    };

    setRules(rulesArray: RuleSet[]) {
        if (!Array.isArray(rulesArray)) {
            throw new Error("Invalid rule set passed");
        } else {
            this.rules = rulesArray;
        }
    }

    // Helps with multi requests usage
    validate(rulesArray: RuleSet[]) {
        const newInstance = new ReqTrapper();
        newInstance.setRules(rulesArray);
        return newInstance.middleware;
    }

    private handleValidation(rule: RuleSet) {
        try {
            console.log("ln 78 /n",this.errors);
            const value = this.requestBody?.[rule?.name];

            const validations = this.explodeValidation(rule?.validation);
            this.helpers = new Helpers({validations})

            for (let validation of validations) {
                const attribute = validation?.split(":")?.[1];
                validation = validation?.split(":")?.[0];
                if (!this.isValid(value, validation, attribute)) {
                    this.errors[rule?.name] = this.outputError(
                        rule?.name,
                        validation,
                        attribute,
                    );
                    break; // break out of for loop
                }
            }

        } catch (e) {
            console.error(e)
            return e;
        }
    }

    explodeValidation(validation: string): string[] {
        return validation?.split("|") || [];
    }

    private isValid(value: any, validation: string, attribute?: any) {
        switch (validation) {
            case "required":
                return this.helpers.exists(value);
            case "number":
                return this.helpers.isNumber(value);
            case "min":
                return this.helpers.minimumOf(value, attribute);
            case "max":
                return this.helpers.maximumOf(value, attribute);
            case "in_array":
                return this.helpers.isInArray(value, attribute);
            case "nullable":
                return true;
            default:
                return false;
        }
    }

    private outputError(
        field: string,
        validation: string,
        attribute?: string | number,
    ) {
        const errorMessage = ErrorMessages?.[validation.toUpperCase()]
            .replace(":field", field)
            .replace(":attribute", attribute);
        return errorMessage ?? "Error message not yet defined";
    }

}
