export const getCache = (address) => {
    if (localStorage.getItem(`enstate-` + address)) {
        return JSON.parse(localStorage.getItem(`enstate-` + address));
    }

    return null;
};

export const setCache = (address, data) => {
    localStorage.setItem(`enstate-` + address, JSON.stringify(data));
}
