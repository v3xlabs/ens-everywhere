console.log("ENS Everywhere LOADED");

import "./content/search.js";
import { fetchBatchViaSSE, getName } from "./content/resolve.js";
import { getCache, setCache } from "./content/cache.js";

// Regex that matches any domain name in the format of `luc.eth` `hello.com` `world.luc.xyz` etc.
const name_regex = /([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+/;

// Ethereum Regex
const ethereum_address_regex = /^0x[a-fA-F0-9]{40}$/;

/**
 * Etherscan Address Translation
 * On etherscan addresses are displayed as `0x123...456`
 *
 * Strategy 1:
 *   span.hash-tag.text-truncate + a[data-clipboard-text]
 *   We can then extract the data-clipboard-text, and translate it to an ENS name
 *   We can then replace the text of the span.hash-tag with the ENS name
 *
 * Strategy 2:
 *   a.hash-tag.text-truncate[href]
 *   where the href is for example `/address/0x225f137127d9067788314bc7fcc1f36746a3c3B5`
 *   We can then extract the address from the href, and translate it to an ENS name
 *
 * Strategy 3:
 *   span[data-bs-title]
 *   where data-bs-title matches 0x225f137127d9067788314bc7fcc1f36746a3c3B5
 *   We can then extract the address from the data-bs-title, and translate it to an ENS name
 *
 * Strategy 4:
 *   span.hash-tag.text-truncate
 *   where the text matches an address such as 0x225f137127d9067788314bc7fcc1f36746a3c3B5 (ethereum address regex)
 *   We can then extract the address from the text, and translate it to an ENS name
 *
 * Strategy 5:
 *   span.hash-tag.text-truncase > span[data-highlight-target]
 *   where the [data-highlight-target] matches an address such as 0x225f137127d9067788314bc7fcc1f36746a3c3B5 (ethereum address regex)
 */
async function translateEtherscanAddresses2ENS() {
    // // Get all the address elements
    // const addressElements = document.querySelectorAll(
    //     "td > div > span.hash-tag.text-truncate + a[data-clipboard-text]",
    // );

    // // Loop through them
    // addressElements.forEach((addressElement) => {
    //     // Get the address
    //     const address = addressElement.getAttribute("data-clipboard-text");

    //     getName(address)
    //         .then((data) => {
    //             // Get the ENS name
    //             const name = data["name"];

    //             // If there is no ENS name, return
    //             if (!name) {
    //                 return;
    //             }

    //             // Replace the address with the ENS name
    //             let parent = addressElement.parentElement;
    //             parent.querySelector(
    //                 "span.hash-tag.text-truncate",
    //             ).textContent = name;
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // });

    // // Get all the address elements
    // const addressElements2 = document.querySelectorAll(
    //     "td > div > a.hash-tag.text-truncate[href]",
    // );

    // // Loop through them
    // addressElements2.forEach((addressElement) => {
    //     // Get the href
    //     const href = addressElement.getAttribute("href");

    //     // Get the address from the href
    //     const address = href.split("/")[2];

    //     // Fetch `https://enstate.rs/a/<address>`
    //     getName(address)
    //         .then((data) => {
    //             // Get the ENS name
    //             const name = data["name"];

    //             // If there is no ENS name, return
    //             if (!name) {
    //                 return;
    //             }

    //             // Replace the address with the ENS name
    //             addressElement.textContent = name;
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // });

    // // Strategy 3
    // // Get all the address elements
    // const addressElements3 = document.querySelectorAll(
    //     "td > div > span[data-bs-title]",
    // );

    // // Loop through them
    // addressElements3.forEach((addressElement) => {
    //     // Get the data-bs-title
    //     const dataBsTitle = addressElement.getAttribute("data-bs-title");

    //     // Get the address from the data-bs-title
    //     const address = dataBsTitle;

    //     // Fetch `https://enstate.rs/a/<address>`
    //     getName(address)
    //         .then((data) => {
    //             // Get the ENS name
    //             const name = data["name"];

    //             // If there is no ENS name, return
    //             if (!name) {
    //                 return;
    //             }

    //             // Replace the address with the ENS name
    //             addressElement.textContent = name;
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // });

    // // // Strategy 4
    // // // Get all the address elements
    // // const addressElements4 = document.querySelectorAll(
    // //     ".hash-tag.text-truncate",
    // // );

    // // console.log({ addressElements4 });

    // // // Loop through them
    // // addressElements4.forEach((addressElement) => {
    // //     // Get the text
    // //     const text = addressElement.textContent;

    // //     // If the text is not an ethereum address, return
    // //     if (!text.match(ethereum_address_regex)) {
    // //         return;
    // //     }

    // //     // Get the address from the text
    // //     const address = text;

    // //     // Fetch `https://enstate.rs/a/<address>`
    // //     fetch(`https://enstate.rs/a/${address}`)
    // //         .then((response) => response.json())
    // //         .then((data) => {
    // //             // Get the ENS name
    // //             const name = data["name"];

    // //             // If there is no ENS name, return
    // //             if (!name) {
    // //                 return;
    // //             }

    // //             // Replace the address with the ENS name
    // //             addressElement.textContent = name;
    // //         })
    // //         .catch((error) => {
    // //             console.log(error);
    // //         });
    // // });

    // Strategy 5
    // Get all the address elements
    const addressElements5 = document.querySelectorAll(
        "span[data-highlight-target], a[data-highlight-target]",
    );

    const elements = [];
    for (let element of addressElements5) {
        elements.push(element);
    }

    const addresses = elements.map((addressElement) => {
        // Get the data-highlight-target
        const dataHighlightTarget = addressElement.getAttribute(
            "data-highlight-target",
        );

        // If the data-highlight-target is not an ethereum address, return
        if (!dataHighlightTarget.match(ethereum_address_regex)) {
            console.log(
                "Not updating because not ethereum address",
                dataHighlightTarget,
            );
            return;
        }

        // Get the address from the data-highlight-target
        const address = dataHighlightTarget;
        const truncatedAddress =
            address.slice(0, 8) + "..." + address.slice(-8);
        const truncatedAddress2 =
            address.slice(0, 8) + "..." + address.slice(-9);
        const bodyText = addressElement.innerText;

        // if ([address.toLowerCase(), truncatedAddress.toLowerCase(), truncatedAddress2.toLowerCase()].includes(bodyText.toLowerCase()) === false) {
        //     console.log("Not updating because body mismatch");
        //     return;
        // }

        return address;
    });

    const addresses2 = {};

    for (let i = 0; i < addresses.length; i++) {
        const val = addresses[i].toLowerCase();
        const a = addresses2[val] || [];
        a.push(addressElements5[i]);
        addresses2[val] = a;
    }

    const justAddresses = Object.keys(addresses2);

    function updateNodesForAddress(address, data) {
        const dat = addresses2[address];

        console.log({dat});

        for (let node of dat) {
            node.innerHTML = [
                '<span>',
                data['avatar'] && `<img src="${data['avatar']}" />`,
                data['name'],
                '</span>'
            ].filter(Boolean).join('');
            node.classList.add("ens-everywhere-label");
        }
    }

    for (let address in addresses2) {
        const data = getCache(address.toLowerCase());
        if (data['name']) {
            console.log('cache hit');
            justAddresses.splice(justAddresses.indexOf(address), 1);
            updateNodesForAddress(address, data);
        }
    }

    let chunks = [];
    let chunkSize = 10;
    for (let i = 0; i < justAddresses.length; i += chunkSize) {
        chunks.push(justAddresses.slice(i, i + chunkSize));
    }

    for (let chunk of chunks) {
        await fetchBatchViaSSE(chunk, (data2) => {
            const data = JSON.parse(data2);
            const name = data["response"]?.["name"];
            console.log({data, name});

            if (!name) return;

            const query = data["query"].toLowerCase();

            setCache(query, data["response"]);

            updateNodesForAddress(query, data["response"]);
        });
    }

    // for (let address in addresses2) {
    //     getName(address)
    //         .then((data) => {
    //             // Get the ENS name
    //             const name = data["name"];

    //             // If there is no ENS name, return
    //             if (!name) {
    //                 return;
    //             }

    //             // Replace the address with the ENS name
    //             addresses2[address].forEach((addressElement) => {
    //                 addressElement.textContent = name;
    //                 addressElement.classList.add("ens-everywhere-label");
    //             });
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // }

    // if ([address.toLowerCase(), truncatedAddress.toLowerCase(), truncatedAddress2.toLowerCase()].includes(bodyText.toLowerCase()) === false) {
    //     console.log("Not updating because body mismatch");
    //     return;
    // }

    // // Fetch `https://enstate.rs/a/<address>`
    // getName(address)
    //     .then((data) => {
    //         // Get the ENS name
    //         const name = data["name"];

    //         // If there is no ENS name, return
    //         if (!name) {
    //             return;
    //         }

    //         // Replace the address with the ENS name
    //         addressElement.textContent = name;
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //     });
    // });
}

translateEtherscanAddresses2ENS();
