const createError = (statusCode, errorMessage) => {
    const error = new Error(errorMessage);
    error.statusCode = statusCode;
    return error;
}

export default {createError}
