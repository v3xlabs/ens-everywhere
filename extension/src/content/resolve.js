const GLOBAL_CACHE = new Map();

export const getName = async (address) => {
    // Check if a promise for the address is already in the cache
    if (GLOBAL_CACHE.has(address)) {
        // Wait for the existing promise to resolve and return its value
        return await GLOBAL_CACHE.get(address);
    }

    // Immediately store the promise in the cache before the asynchronous operation begins
    const namePromise = fetch(`https://enstate.rs/a/${address}`).then((response) =>
        response.json(),
    ).then(data => {
        // Optionally process the data here
        return data;
    });

    GLOBAL_CACHE.set(address, namePromise);

    // Wait for the promise to resolve and return its value
    return await namePromise;
};
