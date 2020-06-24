const TokenKey = 'token';
const UserKey = 'userKey';
/** token **/
export function getToken () {
  return localStorage.getItem(TokenKey);
}

export function setToken (token) {
  return localStorage.setItem(TokenKey, token);
}

export function removeToken () {
  return localStorage.removeItem(TokenKey);
}
/** userKey **/
export function getUserKey () {
  return localStorage.getItem(UserKey);
}

export function setUserKey (key) {
  return localStorage.setItem(UserKey, key);
}

export function removeUserKey () {
  return localStorage.removeItem(UserKey);
}
