import {Request, Response, NextFunction} from "express"

/*
# Main class for request trapper.
This class is what initiates the whole process. More like the engine.
 */
class ReqTrapper {
    private req: Request | null = null;
    private res: Response | null = null;
    private next: NextFunction | null = null;
    constructor() {};


    /*
    ## The middleware
    Pass this to your router handler.

    usage:
    ```js
    router.post('/example', reqTrapper.middleware());
    ```
     */
    middleware(req: Request, res: Response, next: NextFunction) {
        req && (this.req  ??= req);
        res && (this.res  ??= res);
        next && (this.next  ??= next);


    }




}