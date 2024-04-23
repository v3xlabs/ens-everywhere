export const getCache = (address) => {
    if (localStorage.getItem(`enstate-` + address)) {
        return localStorage.getItem(`enstate-` + address);
    }

    return null;
};

export const setCache = (address, name) => {
    localStorage.setItem(`enstate-` + address, name);
}
