let searchMatches = [
    "input#search-panel",
    "input#txtSearchAddressOrDomainName",
    "input#txtSearchInput",
];

let search = searchMatches.reduce((acc, selector) => {
    let elements = document.querySelectorAll(selector);
    if (elements.length) {
        acc.push(elements);
    }
    return acc;
}, []);

if (search.length > 0) {
    console.log("ENS Everywhere: search panel found");

    // Add a style tag to the page
    const style = document.createElement("style");

    style.textContent = `
      #search-panel {
        background: hotpink !important;
      }
      #txtSearchAddressOrDomainName {
        background: hotpink !important;
      }
      #txtSearchInput {
        background: hotpink !important;
      }
    `;

    document.head.appendChild(style);
}

// Regex that matches any domain name in the format of `luc.eth` `hello.com` `world.luc.xyz` etc.
const name_regex = /([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+/;

// Ethereum Regex
const ethereum_address_regex = /^0x[a-fA-F0-9]{40}$/;

search.forEach((search_elements) => {
    console.log(search_elements);
    search_elements.forEach((search_element) => {
        search_element.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();

                console.log("SUBMITTED " + event.target.value);

                const name = event.target.value;

                if (name.match(name_regex)) {
                    console.log("ENS Everywhere: name matches regex");
                }

                (async () => {
                    // Fetch `https://enstate.rs/n/<name>`
                    const result = await fetch(`https://enstate.rs/n/${name}`);

                    if (result.status !== 200) {
                        console.log("ENS Everywhere: name not found");
                    }

                    const data = await result.json();

                    console.log(data);

                    const address = data["address"];

                    if (!address) {
                        return;
                    }

                    console.log("ENS Everywhere: address found", address);

                    // Redirect to `https://<domain>/address/<address>`
                    const domain = window.location.hostname;

                    window.location.href = `https://${domain}/address/${address}`;
                })();
                return;
            }

            console.log(
                "ENS Everywhere: search input changed",
                event.target.value,
            );
            console.log(event);
        });
    });
});
