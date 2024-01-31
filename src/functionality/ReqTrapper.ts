import {NextFunction, Request, Response} from "express"
import {RuleSet} from "../interfaces";
import ErrorMessages from "../ErrorMessages";

// @Todo Allow custom validation
// @Todo Add in more validations

/**
@classdesc Main class for request trapper.
This class is what initiates the whole process. More like the engine.
* @member req
* @member res
* @member next
* @member errors
* @member rules
 */
export class ReqTrapper {
    private req: Request | null = null;
    private res: Response | null = null;
    private next: NextFunction | null = null;
    private requestBody: any | null = null;
    private errors: {[key: string]: any} = {}
    private rules: RuleSet[] = []
    constructor() {};


    /**

    ## The middleware
    This handles the request

     @param req Express Request
     @param res Express Response
     @param next Express NextFunction
     @returns void
     */
    middleware = (req: Request, res: Response, next: NextFunction) => {
        req && (this.req  ??= req) && (this.requestBody = req.body);
        res && (this.res  ??= res);
        next && (this.next  ??= next);

        this.rules.map((rule: RuleSet) => {
            this.handleValidation(rule);
            return;
        });

        const errs = {...this.errors};
        this.setRules([]);
        this.errors = {};

        if (Object.keys(errs)?.length > 0) {
            res.status(400).json({error: errs});
        } else {

            this.next && this.next();
        }
    }



    setRules(rulesArray: RuleSet[]) {
        // return  this.next && this.next(new Error("error"), this.req, this.res);
        if (!Array.isArray(rulesArray)) {
            throw new Error("Invalid rule set passed")
        } else {
            this.rules = rulesArray;
        }
    }


    // Helps with multi requests usage
    validate(rulesArray: RuleSet[]) {
        const newInstance = new ReqTrapper()
        newInstance.setRules(rulesArray);
        return newInstance.middleware;
    }

    private handleValidation(rule: RuleSet) {
        try {
            const value = this.requestBody?.[rule?.name];
            const validations = this.helpers.explodeValidation(rule?.validation);
            validations.forEach((validation) => {
                const attribute = validation?.split(':')?.[1];
                if (!this.isValid(value, validation, attribute)) {
                    this.errors[rule?.name] = this.outputError(rule?.name, validation, attribute);
                    throw new Error("Break out of catch")
                } else {
                    return;
                }
            })
        } catch (e) { // catch block to escape out of foreach loop
            return;
        }



    }

    private isValid(value: any, validation: string, attribute?: any) {
        switch (validation) {
            case 'required':
                return this.helpers.exists(value);
            case 'number':
                return this.helpers.isNumber(value);
            case 'min':
                return this.helpers.minimumOf(value, attribute);
            default:
                return false;
        }
    }

    private outputError(field: string, validation: string, attribute?: string | number) {
        return ErrorMessages[(validation.toUpperCase())].replace(':field', field);
    }

    private helpers = {
        explodeValidation: (validation: string): string[] => {
            return validation?.split('|') || [];
        },
        exists: (value: any) => {
            return !!value;
        },
        isNumber: (value: any) => {
            return Number.isInteger(+value); // The plus sign attempts to convert the string to a number
        },
        minimumOf: (value: string, num: number) => {
            if (this.helpers.exists(value)) {
                return value?.length >= num
            }
            return false;
        }
    }






}