const ErrorMessages: any = Object.create({
    REQUIRED: 'The :field is required',
    EMAIL: 'The :field must be a valid email address',
    MIN: 'The :field must be at least :attribute characters',
    MAX: 'The :field must not exceed :attribute characters',
    IN: 'The :field must be one of the following: :attribute',
    NUMBER: 'The :field must be a valid number',
    GREATER_THAN: 'The :field must be greater than :attribute',
    URL: 'The :field must be a valid URL',
    BOOLEAN: 'The :field must be a boolean value',
    ALPHA: 'The :field must contain only alphabetic characters',
    ALPHA_NUM: 'The :field must contain only alphanumeric characters',
    ARRAY: 'The :field must be an array',
    JSON: 'The :field must be a valid JSON string',
    DATE: 'The :field must be a valid date',
    AFTER: 'The :field must be a date after :attribute',
    BEFORE: 'The :field must be a date before :attribute',
    UNIQUE: 'The :field must be unique',
    DIGITS: 'The :field must be :attribute digits',
    DIGITS_BETWEEN: 'The :field must be between :attribute digits',
    EXISTS: 'The :field must exist in the database',
    IMAGE: 'The :field must be an image file',
    FILE: 'The :field must be a valid file',
    MIMES: 'The :field must be a file of type: :attribute',
    REQUIRED_IF: 'The :field is required when :attribute is present',
    REQUIRED_UNLESS: 'The :field is required unless :attribute is present',
    REQUIRED_WITH: 'The :field is required when :attribute is present',
    REQUIRED_WITH_ALL: 'The :field is required when all of :attribute are present',
    REQUIRED_WITHOUT: 'The :field is required when :attribute is not present',
    REQUIRED_WITHOUT_ALL: 'The :field is required when none of :attribute are present',
});

export default ErrorMessages;