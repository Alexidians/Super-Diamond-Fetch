async function SuperDiamondFetchAutoRetry(url, options, maxRetries) {
    return new Promise((resolve, reject) => {
        let retries = 0;

        function attempt() {
            SuperDiamondFetch(url, options)
                .then(resp => {
                  return await resp.json()
                })
                .then(responseObj => {
                  if(responseObj.ok) {
                   resolve(CompleteSuperDiamondFetchResponseObject(responseObj));
                  } else {
                    if (retries < maxRetries) {
                        attempt();
                    } else {
                        var e = new Error("The Result From The Destination Is Not OK.");
                        e.name = "SuperDiamondFetch DestinationResponse Network Error";
                        e.code = "ERR_SUPERDIAMONDFETCH_RESPONSE_FROM_DESTINATION_NOT_OK"
                        reject(e);
                    }
                  }
                })
                .catch(error => {
                    if (retries < maxRetries) {
                        attempt();
                    } else {
                        reject(error);
                    }
                })
                .catch(error => {
                    retries++;
                    if (retries < maxRetries) {
                        attempt();
                    } else {
                        reject(error);
                    }
                });
        }

        attempt();
    });
}
