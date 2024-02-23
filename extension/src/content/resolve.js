const GLOBAL_CACHE = new Map();

// export const fetchBatchViaSSE = (addresses) => {
//     const queries_raw = addresses.map(address => `queries[]=${address}`).join('&');
//     const source = new EventSource(`https://enstate.rs/sse/u?${queries_raw}`);
//     for (let i = 0; i < addresses.length; i++) {
//         // const addresses = addresses[i];
//     }

//     let count = 0;

//     source.onmessage = function (event) {
//         console.log('E', event.data);
//         count += 1;
//         if (count > addresses.length) {
//             source.close();
//         }
//     };

//     return addresses.map(address => {});
// };

// fetchBatchViaSSE(['0x2B5c7025998f88550Ef2fEce8bf87935f542C190', '0xD4416b13d2b3a9aBae7AcD5D6C2BbDBE25686401', '0x253553366Da8546fC250F225fe3d25d0C782303b'])

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
