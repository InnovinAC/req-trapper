"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Helpers {
    exists(value) {
        return value !== undefined && value !== null && value !== '';
    }
    isEmail(value) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(value).toLowerCase());
    }
    minimumOf(value, min) {
        if (typeof value === 'string')
            return value.length >= Number(min);
        return value >= Number(min);
    }
    maximumOf(value, max) {
        if (typeof value === 'string')
            return value.length <= Number(max);
        return value <= Number(max);
    }
    isInArray(value, options) {
        const array = options.split(',');
        return array.includes(value);
    }
    isNumber(value) {
        return !isNaN(Number(value));
    }
    isGreaterThanNum(value, minValue) {
        console.log(value);
        console.log(minValue);
        return Number(value) > Number(minValue);
    }
    isUrl(value) {
        const re = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i');
        return re.test(value);
    }
    isBoolean(value) {
        return value === true || value === false || value === 'true' || value === 'false';
    }
    isAlpha(value) {
        return /^[A-Za-z]+$/.test(value);
    }
    isAlphaNum(value) {
        return /^[A-Za-z0-9]+$/.test(value);
    }
    isArray(value) {
        return Array.isArray(value);
    }
    isJson(value) {
        try {
            JSON.parse(value);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    isDate(value) {
        return !isNaN(Date.parse(value));
    }
    isAfter(value, compareDate) {
        return new Date(value) > new Date(compareDate);
    }
    isBefore(value, compareDate) {
        return new Date(value) < new Date(compareDate);
    }
    isDigits(value, digits) {
        return value.length === Number(digits);
    }
    isDigitsBetween(value, minMax) {
        const [min, max] = minMax.split(',');
        return value.length >= Number(min) && value.length <= Number(max);
    }
    isUnique(value, tableColumn) {
        // TODO: Implement a database check here for uniqueness
        return true; // Placeholder: Return true if unique, false otherwise
    }
    existsInDb(value, tableColumn) {
        // TODO: Implement a database check here to see if the value exists
        return true; // Placeholder: Return true if exists, false otherwise
    }
    isImage(value) {
        // Check if the value is a valid image file type (e.g., jpg, png, gif)
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
        return validImageTypes.includes(value.mimetype);
    }
    isFile(value) {
        // General file validation (e.g., check file exists and has a valid type)
        return value instanceof Buffer || value instanceof File;
    }
    isMimeType(value, mimeTypes) {
        const allowedMimeTypes = mimeTypes.split(',');
        return allowedMimeTypes.includes(value.mimetype);
    }
    requiredIf(condition, value) {
        return condition ? this.exists(value) : true;
    }
    requiredUnless(condition, value) {
        return !condition ? this.exists(value) : true;
    }
    requiredWith(condition, value) {
        return this.exists(condition) ? this.exists(value) : true;
    }
    requiredWithAll(requestBody, attributes, value) {
        const conditions = attributes.split(',');
        const allPresent = conditions.every(attr => this.exists(requestBody[attr]));
        return allPresent ? this.exists(value) : true;
    }
    requiredWithout(condition, value) {
        return !this.exists(condition) ? this.exists(value) : true;
    }
    requiredWithoutAll(requestBody, attributes, value) {
        const conditions = attributes.split(',');
        const nonePresent = conditions.every(attr => !this.exists(requestBody[attr]));
        return nonePresent ? this.exists(value) : true;
    }
}
exports.default = Helpers;
