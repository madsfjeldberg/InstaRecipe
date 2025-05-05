function makeOption(httpMethod, body) {

    const methods = ["GET", "POST", "PUT", "PATCH", "DELETE"];
    if(!methods.includes(httpMethod)) {
        throw Error(httpMethod + " is not a vallid http method / verb")
    }

    const option = {
        method: httpMethod.toUpperCase(),
        credentials: "include",
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json"
        }
    }

    if (body) {
        option.body = JSON.stringify(body);
    }
    
    return option;
}

export { makeOption }