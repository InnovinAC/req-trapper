import {Request, Response, NextFunction} from "express"
import {RuleSet} from "../interfaces";

/*
# Main class for request trapper.
This class is what initiates the whole process. More like the engine.
 */
class ReqTrapper {
    private req: Request | null = null;
    private res: Response | null = null;
    private next: NextFunction | null = null;
    private errors: {[key: string]: any} = {}
    private rules: RuleSet[] = []
    constructor() {};


    /*
    ## The middleware
    Pass this to your router handler.

    usage:
    ```js
    router.post('/example', reqTrapper.middleware());
    ```
     */
    middleware = (req: Request, res: Response, next: NextFunction) => {
        req && (this.req  ??= req);
        res && (this.res  ??= res);
        next && (this.next  ??= next);

        this.rules.map((rule: RuleSet) => {
            this.handleValidation(rule);
            return;
        });

        if (Object.keys(this.errors)?.length > 0) {
            res.status(400).json({error: this.errors});
        } else {
            next();
        }
    }

    setRules(rulesArray: RuleSet[]) {
        if (!Array.isArray(rulesArray)) {
            throw new Error("Invalid rule set passed")
        } else {
            this.rules = rulesArray;
        }
    }

    private handleValidation(rule: RuleSet) {
        this.errors[rule?.name] = "An error occurred"
    }






}