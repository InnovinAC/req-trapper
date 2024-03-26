class Helpers implements IHelpers {
    validations: any;

    constructor({validations}: any) {
        this.validations = validations
    }


    // This function is used to skip validation if not required and field is empty or not present
    private canEscapeValidation(value: any) {
        const isRequired = this.validations.includes('required');
        return !value && !isRequired;
    }

    exists(value: any) {
        return !!value;
    }

    isNumber(value: any) {
        return Number.isInteger(+value) || this.canEscapeValidation(value); // The plus sign attempts to convert the string to a number
    }

    minimumOf(value: string, num: number) {
        if (this.exists(value)) {
            return value?.length >= num;
        }
        return this.canEscapeValidation(value);
    }

    maximumOf(value: string, num: number) {
        if (this.exists(value)) {
            return value?.length <= num;
        }
        return this.canEscapeValidation(value);
    }

    isInArray(value: string, arrayString: string) {
        return this.exists(value) ?
            (() => {
                return String(arrayString) ? (() => {
                    const array = String(arrayString).split(",");
                    return array.includes(value)
                })() : false
            })() : this.canEscapeValidation(value);
    }


    isGreaterThanNum(value: string | number, num: number) {
        if (this.exists(value)) {
            if (this.isNumber(value)) {
                return +value > num;
            } else {
                return false;
            }
        }
        return this.canEscapeValidation(value as any)
    }
}

export interface IHelpers {
    // canEscapeValidation: (value: any) => boolean;
    exists: (value: any) => boolean;
    isNumber: (value: any) => boolean;
    minimumOf: (value: any, num: number) => boolean;
    maximumOf: (value: any, num: number) => boolean;
    isInArray: (value: any, arrayString: any) => boolean;
    isGreaterThanNum: (value: string | number, num: number) => boolean;
}

export default Helpers