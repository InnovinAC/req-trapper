class Helpers {
     validations: any;

    constructor({validations}: any) {
        this.validations = validations
    }



// this function is used to skip validation if not required and field is empty or not present
    canEscapeValidation(value: string) {
        const isRequired = this.validations.includes('required');
        return !value && !isRequired;
    }

    exists(value: any) {
        return !!value;
    }

    isNumber(value: any) {
        return Number.isInteger(+value); // The plus sign attempts to convert the string to a number
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
        if (this.exists(value)) {
            if (String(arrayString)) {
                console.log(arrayString);
                const array = String(arrayString).split(",");
                return array.includes(value);
            }
            return false;
        }
        return this.canEscapeValidation(value); // Return the result of canEscapeValidation
    }


    isGreaterThanNum(value: string | number, num: number) {
        if (this.exists(value)) {
            if (this.isNumber(value)) {
                return +value > num;
            } else {
                return false;
            }
        }
    }
}

export interface IHelpers {

}

export default Helpers