async function SuperDiamondFetch(url, options) {
 return new Promise((resolve, reject) => {
  try {
   var DefaultOptions = {
    method: "GET",
    body: "",
    headers: {},
    timeout: 10000,
    credentials: "same-origin"
   }
   var optionsWithDefault = DefaultOptions
   if("method" in options) {
    optionsWithDefault.method = options.method
   }
   if("body" in options) {
    optionsWithDefault.body = options.body
   }
   if("headers" in options) {
    optionsWithDefault.method = options.headers
   }
   if("timeout" in options) {
    optionsWithDefault.timeout = options.timeout
   }
   if("credentials" in options) {
    optionsWithDefault.credentials = options.credentials
   }
   optionsWithDefault.url = url
   var response = await fetch("https://alexidians.com/Super-Diamond-Fetch/SuperDiamondFetch.php", {
    method: "POST",
    body: JSON.stringify(optionsWithDefault)
   });
   if (!response.ok) {
    const e = new Error("Fetch Has Failed due to not ok network response. Status Code: " + response.status);
    e.name = "SuperDiamondFetch Failed";
    e.code = "ERR_FETCH_NETWORK_NOT_OK"
    
    reject(e);
   }
   var responseObj = {
    original: response,
    text: function() {
     return response.text();
    },
    JSON: function() {
     return response.json();
    }
   }
   resolve(responseObj);
  } catch(err) {
   reject(err);
  }
 });
}
