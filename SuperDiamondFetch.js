var SuperDiamondFetchCacheStorage = null;

async function initSuperDiamondFetchLocalCache() {
    return new Promise((resolve, reject) => {
        SuperDiamondFetchCacheStorage = new SuperDiamondStoreConst();
        SuperDiamondFetchCacheStorage.dbName = "SuperDiamondFetchCacheStorage";
        SuperDiamondFetchCacheStorage.storeName = "local";
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
     var elem = document.createElement("script");
    elem.src = "https://alexidians.github.io/Super-Diamond-Fetch/Extensions/Retry-API/SuperDiamondFetch.js";
    document.body.appendChild(elem);
}

async function SuperDiamondFetch(url, options) {
    return new Promise(async (resolve, reject) => {
        try {
             var DefaultOptions = {
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

            var optionsWithDefault = { ...DefaultOptions, ...options };
            optionsWithDefault.url = url;

            if (optionsWithDefault.AutoRetry.enable) {
                var optionsAutoRetry = options;
                optionsAutoRetry.AutoRetry.enable = false;
                resolve(await SuperDiamondFetchAutoRetry(url, optionsAutoRetry));
                return;
            }

            if (optionsWithDefault.caching.read) {
              if(optionsWithDefault.caching.type == "SuperDiamondStore" || optionsWithDefault.caching.type == "IndexedDB") {
                var responseObj = JSON.parse(await SuperDiamondFetchCacheStorage.async.getItem(url));
                resolve(CompleteSuperDiamondFetchResponseObject(responseObj));
                return;
              }
              if(optionsWithDefault.caching.type == "local") {
                var responseObj = await fetch("http://localhost:4001/Cache/Local/get.php", { method: "POST", body: JSON.stringify({ key: url})})
                resolve(CompleteSuperDiamondFetchResponseObject(responseObj));
                return;
              }
              if(optionsWithDefault.caching.type == "origin-local") {
                var responseObj = await fetch("http://localhost:4001/Cache/Origin-Local/get.php", { method: "POST", body: JSON.stringify({ key: url})})
                resolve(CompleteSuperDiamondFetchResponseObject(responseObj));
                return;
              }
            }

            var response = await fetch("https://alexidians.com/Super-Diamond-Fetch/SuperDiamondFetch.php", {
                method: "POST",
                body: JSON.stringify(optionsWithDefault),
                credentials: "include"
            });

            if (!response.ok) {
                var e = new Error("Fetch Has Failed due to not ok network response. Status Code: " + response.status);
                e.name = "SuperDiamondFetch Failed";
                e.code = "ERR_FETCH_NETWORK_NOT_OK";
                reject(e);
                return;
            }

            var responseObj = await response.json();

            if (optionsWithDefault.caching.write) {
              if(optionsWithDefault.caching.type == "SuperDiamondStore" || optionsWithDefault.caching.type == "IndexedDB") {
                await SuperDiamondFetchCacheStorage.async.setItem(url, JSON.stringify(responseObj));
              }
              if(optionsWithDefault.caching.type == "local") {
                await fetch("http://localhost:4001/Cache/Local/get.php", { method: "POST", body: JSON.stringify({ key: url, value: JSON.stringify(responseObj)})})
              }
              if(optionsWithDefault.caching.type == "origin-local") {
                await fetch("http://localhost:4001/Cache/Origin-Local/get.php", { method: "POST", body: JSON.stringify({ key: url, value: JSON.stringify(responseObj)})})
              }
            }

            responseObj.SuperDiamondFetch = response;
            resolve(CompleteSuperDiamondFetchResponseObject(responseObj));
        } catch (err) {
            reject(err);
        }
    });
}

async function UpdateSuperDiamondFetch() {
     var elem = document.createElement("script");
    elem.src = "https://alexidians.github.io/Super-Diamond-Fetch/SuperDiamondFetch.js";
    document.body.appendChild(elem);
}

function CompleteSuperDiamondFetchResponseObject(responseObj) {
     var reader = {
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
                var encoder = new TextEncoder();
                var encodedData = encoder.encode(responseObj.body);
                return encodedData.buffer;
            } catch(err) {
                throw err;
            }
        },
        formData: async () => {
            try {
                var keyValuePairs = responseObj.body.split('&');
                var formData = new FormData();
                keyValuePairs.forEach(keyValuePair => {
                    var [key, value] = keyValuePair.split('=');
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
