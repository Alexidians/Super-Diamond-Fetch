async function SuperDiamondFetch(url, options) {
  return new Promise(async (resolve, reject) => {
    try {
      var DefaultOptions = {
        method: "GET",
        body: "",
        headers: {},
        timeout: 10000,
        credentials: "same-origin"
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

      optionsWithDefault.url = url;

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
       responseObj.SuperDiamondFetch = response
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
       }
      } catch(err) {
        const e = new Error("SuperDiamondFetch Could Not Parse The Server Response to Response obj", { cause: err});
        e.name = "SuperDiamondFetch Parse Error";
        e.code = "ERR_FETCH_NETWORK_NOT_OK";
      }

      resolve(responseObj);
    } catch (err) {
      reject(err);
    }
  });
}
