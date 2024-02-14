var SuperDiamondFetchCacheStorage = null

async function initSuperDiamondFetchLocalCache() {
   return new Promise((resolve, reject) => {
    SuperDiamondFetchCacheStorage = new SuperDiamondStoreConst()
    SuperDiamondFetchCacheStorage.dbName = "SuperDiamondFetchCacheStorage"
    SuperDiamondFetchCacheStorage.name = "local"
    SuperDiamondFetchCacheStorage.async.reload()
     .then(() => {
      resolve(SuperDiamondFetchCacheStorage)
     })
     .catch(err => {
      resolve(err)
     })
  });
}

function initSuperDiamondFetchAutoRetryAPI() {
 var elem = document.createElement("script")
 elem.src = "https://alexidians.github.io/Super-Diamond-Fetch/Extensions/Retry-API/SuperDiamondFetch.js"
 document.body.appendChild(elem)
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

      var optionsWithDefault = { ...DefaultOptions };

      if ("method" in options) {
        optionsWithDefault.method = options.method;
      }
      if ("body" in options) {
        optionsWithDefault.body = options.body;
      }
      if ("headers" in options) {
        optionsWithDefault.headers = options.headers;
      }
      if ("timeout" in options) {
        optionsWithDefault.timeout = options.timeout;
      }
      if ("credentials" in options) {
        optionsWithDefault.credentials = options.credentials;
      }
      if ("redirects" in options) {
        if("follow" in options.redirects) {
         optionsWithDefault.redirects.follow = options.redirects.follow;
        }
        if("follow_amount" in options.redirects) {
         optionsWithDefault.redirects.follow_amount = options.redirects.follow_amount;
        }
      }
      if ("caching" in options) {
        if("read" in options.caching) {
         optionsWithDefault.caching.read = options.caching.read;
        }
        if("write" in options.caching) {
         optionsWithDefault.caching.write = options.caching.write;
        }
        if("type" in options.caching) {
         optionsWithDefault.caching.type = options.caching.type;
        }
      }
      if ("AutoRetry" in options) {
        if("enable" in options.AutoRetry) {
         optionsWithDefault.AutoRetry.enable = options.AutoRetry.enable;
        }
        if("MaxRetry" in options.AutoRetry) {
         optionsWithDefault.AutoRetry.MaxRetry = options.AutoRetry.MaxRetry;
        }
      }

      optionsWithDefault.url = url;
      if(optionsWithDefault.caching.read) {
       if(optionsWithDefault.caching.type == "local") {
        var responseObj = JSON.parse(await SuperDiamondFetchCacheStorage.getItem(url));
        resolve(CompleteSuperDiamondFetchResponseObject(responseObj));
       }
      }

      var response = await fetch("https://alexidians.com/Super-Diamond-Fetch/SuperDiamondFetch.php", {
        method: "POST",
        body: JSON.stringify(optionsWithDefault),
        credentials: "include"
      });

      if (!response.ok) {
        const e = new Error("Fetch Has Failed due to not ok network response. Status Code: " + response.status);
        e.name = "SuperDiamondFetch Failed";
        e.code = "ERR_FETCH_NETWORK_NOT_OK";
        
        reject(e);
      }
      try {
       var responseObj = await response.json();
       if(optionsWithDefault.caching.write) {
        if(optionsWithDefault.caching.type == "local") {
         await SuperDiamondFetchCacheStorage.setItem(url, JSON.stringify(await SuperDiamondFetchCacheStorage.getItem(url)))
        }
       }
       responseObj.SuperDiamondFetch = response
       resolve(CompleteSuperDiamondFetchResponseObject(responseObj));
    } catch (err) {
      reject(err);
    }
  });
}

function UpdateSuperDiamondFetch() {
 var elem = document.createElement("script")
 elem.src = "https://alexidians.github.io/Super-Diamond-Fetch/SuperDiamondFetch.js"
 document.body.appendChild(elem)
}

function CompleteSuperDiamondFetchResponseObject(responseObj) {
       responseObj.reader.text = async function() {
         return new Promise((resolve, reject) => {
          try {
           var text = responseObj.body
           resolve(text)
          } catch(err) {
           reject(err)
          }
         });
        }
       responseObj.reader.json = async function() {
         return new Promise((resolve, reject) => {
          try {
           var json = JSON.parse(responseObj.body)
           resolve(json)
          } catch(err) {
           reject(err)
          }
         });
        }
        responseObj.reader.blob = async function() {
         return new Promise((resolve, reject) => {
          try {
           var blob = new Blob([responseObj.body], { type: responseObj.headers["Content-Type"] });
           resolve(blob)
          } catch(err) {
           reject(err)
          }
         });
        }
        responseObj.reader.customBlob = async function(type) {
         return new Promise((resolve, reject) => {
          try {
           var customBlob = new Blob([responseObj.body], { type: type });
           resolve(customBlob)
          } catch(err) {
           reject(err)
          }
         });
        }
        responseObj.reader.arrayBuffer = async function() {
         return new Promise((resolve, reject) => {
          try {
           var encoder = new TextEncoder();
           var encodedData = encoder.encode(responseObj.body);
           var arrayBuffer = encodedData.buffer;
           resolve(arrayBuffer)
          } catch(err) {
           reject(err)
          }
         });
        }
        responseObj.reader.formData = async function() {
         return new Promise((resolve, reject) => {
          try {
           var keyValuePairs =  responseObj.body.split('&');
           var formData = new FormData();
           keyValuePairs.forEach(function(keyValuePair) {
               var pair = keyValuePair.split('=');
               var key = pair[0];
               var value = pair[1];
               formData.append(key, decodeURIComponent(value));
           });
           resolve(formData)
          } catch(err) {
           reject(err)
          }
         });
        }
        return responseObj;
}
