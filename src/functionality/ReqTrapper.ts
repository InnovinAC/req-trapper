import { NextFunction, Request, Response } from "express";
import { RuleSet } from "../interfaces";
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
  private errors: { [key: string]: any } = {};
  private rules: RuleSet[] = [];
  constructor() {}

  /**

  ## The middleware
  This handles the request

   @param req Express Request
   @param res Express Response
   @param next Express NextFunction
   @returns void
   */
  middleware = (req: Request, res: Response, next: NextFunction) => {
    req && (this.req ??= req) && (this.requestBody = req.body);
    res && (this.res ??= res);
    next && (this.next ??= next);

    this.rules.map((rule: RuleSet) => {
      this.handleValidation(rule);
      return;
    });

    if (Object.keys(this.errors)?.length > 0) {
      res.status(400).json({ error: this.errors });
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
      const value = this.requestBody?.[rule?.name];
      const validations = this.helpers.explodeValidation(rule?.validation);
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
      console.log(e)
      return;
    }
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
    return ErrorMessages[validation.toUpperCase()]
      .replace(":field", field)
      .replace(":attribute", attribute);
  }

  private helpers = {
    explodeValidation: (validation: string): string[] => {
      return validation?.split("|") || [];
    },
    exists: (value: any) => {
      return !!value;
    },
    isNumber: (value: any) => {
      return Number.isInteger(+value); // The plus sign attempts to convert the string to a number
    },
    minimumOf: (value: string, num: number) => {
      if (this.helpers.exists(value)) {
        return value?.length >= num;
      }
      return false;
    },
    maximumOf: (value: string, num: number) => {
      if (this.helpers.exists(value)) {
        return value?.length <= num;
      }
      return false;
    },
    isInArray: (value: string, arrayString: string) => {
      return this.helpers.exists(value)
        ? (() => {
            if (String(arrayString)) {
              const array = arrayString.split(",");
              return array.includes(value);
            }
          })()
        : false;
    },
  };
}
