import { answerItems } from "./answerItem";

export const getCookie = (name) => {
    let matches = document.cookie.match(
        new RegExp(
            '(?:^|; )' +
                name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
                '=([^;]*)'
        )
    );
    return matches ? decodeURIComponent(matches[1]) : undefined;
};

export const setCookie = (name, value, attributes = {}) => {
    attributes = {
        path: '/',
        // add other defaults here if necessary
        ...attributes,
    };

    if (attributes.expires instanceof Date) {
        attributes.expires = attributes.expires.toUTCString();
    }

    let updatedCookie =
        encodeURIComponent(name) + '=' + encodeURIComponent(value);

    for (let attributeKey in attributes) {
        updatedCookie += '; ' + attributeKey;
        let attributeValue = attributes[attributeKey];
        if (attributeValue !== true) {
            updatedCookie += '=' + attributeValue;
        }
    }

    document.cookie = updatedCookie;
};

export const deleteCookie = (name) => {
    setCookie(name, '', {
        'max-age': -1,
    });
};
