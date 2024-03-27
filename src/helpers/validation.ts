const passwordRegExp = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/);

export function checkPassword(password: string) {
    return passwordRegExp.test(password);
}