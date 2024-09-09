export default class Helpers {
    exists(value: any) {
        return value !== undefined && value !== null && value !== '';
    }

    isEmail(value: string) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(value).toLowerCase());
    }

    minimumOf(value: string | number, min: string | number) {
        if (typeof  value === 'string') return value.length >= Number(min)
        return value >= Number(min)
    }

    maximumOf(value: string | number, max: number) {
        if (typeof  value === 'string') return value.length <= Number(max)
        return value <= Number(max)
    }

    isInArray(value: string, options: string) {
        const array = options.split(',');
        return array.includes(value);
    }

    isNumber(value: any) {
        return !isNaN(Number(value));
    }

    isGreaterThanNum(value: any, minValue: string | number) {
        console.log(value)
        console.log(minValue)
        return Number(value) > Number(minValue);
    }

    isUrl(value: string) {
        const re = new RegExp(
            '^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'
        );
        return re.test(value);
    }

    isBoolean(value: any) {
        return value === true || value === false || value === 'true' || value === 'false';
    }

    isAlpha(value: string) {
        return /^[A-Za-z]+$/.test(value);
    }

    isAlphaNum(value: string) {
        return /^[A-Za-z0-9]+$/.test(value);
    }

    isArray(value: any) {
        return Array.isArray(value);
    }

    isJson(value: string) {
        try {
            JSON.parse(value);
            return true;
        } catch (e) {
            return false;
        }
    }

    isDate(value: string) {
        return !isNaN(Date.parse(value));
    }

    isAfter(value: string, compareDate: string) {
        return new Date(value) > new Date(compareDate);
    }

    isBefore(value: string, compareDate: string) {
        return new Date(value) < new Date(compareDate);
    }

    isDigits(value: string, digits: string | number) {
        return value.length === Number(digits);
    }

    isDigitsBetween(value: string, minMax: string) {
        const [min, max] = minMax.split(',');
        return value.length >= Number(min) && value.length <= Number(max);
    }

    isUnique(value: string, tableColumn: string) {
        // TODO: Implement a database check here for uniqueness
        return true; // Placeholder: Return true if unique, false otherwise
    }

    existsInDb(value: string, tableColumn: string) {
        // TODO: Implement a database check here to see if the value exists
        return true; // Placeholder: Return true if exists, false otherwise
    }

    isImage(value: any) {
        // Check if the value is a valid image file type (e.g., jpg, png, gif)
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
        return validImageTypes.includes(value.mimetype);
    }

    isFile(value: any) {
        // General file validation (e.g., check file exists and has a valid type)
        return value instanceof Buffer || value instanceof File;
    }

    isMimeType(value: any, mimeTypes: string) {
        const allowedMimeTypes = mimeTypes.split(',');
        return allowedMimeTypes.includes(value.mimetype);
    }

    requiredIf(condition: any, value: any) {
        return condition ? this.exists(value) : true;
    }

    requiredUnless(condition: any, value: any) {
        return !condition ? this.exists(value) : true;
    }

    requiredWith(condition: any, value: any) {
        return this.exists(condition) ? this.exists(value) : true;
    }

    requiredWithAll(requestBody: any, attributes: string, value: any) {
        const conditions = attributes.split(',');
        const allPresent = conditions.every(attr => this.exists(requestBody[attr]));
        return allPresent ? this.exists(value) : true;
    }

    requiredWithout(condition: any, value: any) {
        return !this.exists(condition) ? this.exists(value) : true;
    }

    requiredWithoutAll(requestBody: any, attributes: string, value: any) {
        const conditions = attributes.split(',');
        const nonePresent = conditions.every(attr => !this.exists(requestBody[attr]));
        return nonePresent ? this.exists(value) : true;
    }
}