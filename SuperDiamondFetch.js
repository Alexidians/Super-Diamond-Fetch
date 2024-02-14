var SuperDiamondFetchCacheStorage = null;

async function initSuperDiamondFetchLocalCache() {
    return new Promise((resolve, reject) => {
        SuperDiamondFetchCacheStorage = new SuperDiamondStoreConst();
        SuperDiamondFetchCacheStorage.dbName = "SuperDiamondFetchCacheStorage";
        SuperDiamondFetchCacheStorage.name = "local";
        SuperDiamondFetchCacheStorage.async.reload()
            .then(() => {
                resolve(SuperDiamondFetchCacheStorage);
            })
            .catch(err => {
                reject(err);
            });
    });
}

async function initSuperDiamondFetchAutoRetryAPI() {
    const elem = document.createElement("script");
    elem.src = "https://alexidians.github.io/Super-Diamond-Fetch/Extensions/Retry-API/SuperDiamondFetch.js";
    document.body.appendChild(elem);
}

async function SuperDiamondFetch(url, options) {
    return new Promise(async (resolve, reject) => {
        try {
            const DefaultOptions = {
                method: "GET",
                body: "",
                headers: {},
                timeout: 10000,
                credentials: "same-origin",
                hide_ip: false,
                redirects: {
                    follow: false,
                    follow_amount: -1
                },
                caching: {
                    read: false,
                    write: false,
                    type: "origin"
                },
                AutoRetry: {
                    enable: false,
                    MaxRetry: Infinity
                }
            };

            const optionsWithDefault = { ...DefaultOptions, ...options };
            optionsWithDefault.url = url;

            if (optionsWithDefault.AutoRetry.enable) {
                const optionsAutoRetry = { ...options };
                optionsAutoRetry.AutoRetry.enable = false;
                resolve(await SuperDiamondFetchAutoRetry(url, optionsAutoRetry));
                return;
            }

            if (optionsWithDefault.caching.read && optionsWithDefault.caching.type === "local") {
                const responseObj = JSON.parse(await SuperDiamondFetchCacheStorage.getItem(url));
                resolve(CompleteSuperDiamondFetchResponseObject(responseObj));
                return;
            }

            const response = await fetch("https://alexidians.com/Super-Diamond-Fetch/SuperDiamondFetch.php", {
                method: "POST",
                body: JSON.stringify(optionsWithDefault),
                credentials: "include"
            });

            if (!response.ok) {
                const e = new Error("Fetch Has Failed due to not ok network response. Status Code: " + response.status);
                e.name = "SuperDiamondFetch Failed";
                e.code = "ERR_FETCH_NETWORK_NOT_OK";
                reject(e);
                return;
            }

            const responseObj = await response.json();

            if (optionsWithDefault.caching.write && optionsWithDefault.caching.type === "local") {
                await SuperDiamondFetchCacheStorage.setItem(url, JSON.stringify(await SuperDiamondFetchCacheStorage.getItem(url)));
            }

            responseObj.SuperDiamondFetch = response;
            resolve(CompleteSuperDiamondFetchResponseObject(responseObj));
        } catch (err) {
            reject(err);
        }
    });
}

async function UpdateSuperDiamondFetch() {
    const elem = document.createElement("script");
    elem.src = "https://alexidians.github.io/Super-Diamond-Fetch/SuperDiamondFetch.js";
    document.body.appendChild(elem);
}

function CompleteSuperDiamondFetchResponseObject(responseObj) {
    const reader = {
        text: async () => {
            try {
                return responseObj.body;
            } catch(err) {
                throw err;
            }
        },
        json: async () => {
            try {
                return JSON.parse(responseObj.body);
            } catch(err) {
                throw err;
            }
        },
        blob: async () => {
            try {
                return new Blob([responseObj.body], { type: responseObj.headers["Content-Type"] });
            } catch(err) {
                throw err;
            }
        },
        customBlob: async (type) => {
            try {
                return new Blob([responseObj.body], { type });
            } catch(err) {
                throw err;
            }
        },
        arrayBuffer: async () => {
            try {
                const encoder = new TextEncoder();
                const encodedData = encoder.encode(responseObj.body);
                return encodedData.buffer;
            } catch(err) {
                throw err;
            }
        },
        formData: async () => {
            try {
                const keyValuePairs = responseObj.body.split('&');
                const formData = new FormData();
                keyValuePairs.forEach(keyValuePair => {
                    const [key, value] = keyValuePair.split('=');
                    formData.append(key, decodeURIComponent(value));
                });
                return formData;
            } catch(err) {
                throw err;
            }
        }
    };
    responseObj.reader = reader
    return responseObj;
}
