export const API_URL = 'https://minnow-stunning-man.ngrok-free.app/api/v1'
const GLOBAL = {
    login: '/login',
    logout: '/logout',
    verify: '/verify-token',
}
const USER = {
    get_profile: '/get-profile',
    get_time_tracking: '/get-time-tracking',
}
const ADMIN = {
    add_gate: '/create-gate',
    get_gate: '/get-gates',
    update_gate: '/update-gate',
    add_employee: '/create-user',
    get_employee: '/get-users',
    update_employee: '/update-forbidden-information',
}
const API = {
    GLOBAL: Object.keys(GLOBAL).reduce((acc, key) => {
        acc[key] = API_URL + GLOBAL[key];
        return acc;
    }, {}),
    USER: Object.keys(USER).reduce((acc, key) => {
        acc[key] = API_URL + '/user' + USER[key];
        return acc;
    }, {}),
    ADMIN: Object.keys(ADMIN).reduce((acc, key) => {
        acc[key] = API_URL + '/admin' + ADMIN[key];
        return acc;
    }, {}),
}
export default API