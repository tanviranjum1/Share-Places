// to manage loading and error state.
// hook reruns when component that uses it reruns.
// useEffect can be run  clean up logic when component unmounts.
import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  // turns it into reference which is  a piece of data that will not change or reinitilize after main code runs.
  /// no now stores data acroose rerender cycles.
  const activeHttpRequests = useRef([]);
  // useRef always wraps data stored in it in an object which has current property.

  // to avoid infinite loop, use useCallback. so that this function never gets recreated when component uses this look rerenders.
  // so never have inefficient rerender cycles or infinite loops.
  // get by default.
  // add activeHttpRequest right where sent request.
  const sendRequest = useCallback(
    async (url, method = 'GET', body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortCtrll = new AbortController(); // api suported in modern browser.
      // add it to activeHttpRequests.
      activeHttpRequests.current.push(httpAbortCtrll);

      try {
        // post request. fetch returns promise.
        const response = await fetch(url, {
          method, // method: method
          body,
          headers,
          signal: httpAbortCtrll.signal, // links abort controller to the request.  use abort controller to cancel this request.
        });

        // parse the response body by. because most api takes in json format data.
        // this iis actual data in response body.
        const responseData = await response.json();

        // keeps every request controller except for the controller which was used in the request.
        // so not having any old request controller.
        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrll) => reqCtrll !== httpAbortCtrll
        );

        // true if 400/500 status code.e lse 200 error code. after this catch statement will execute.
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setIsLoading(false);
        // return data. component that handle can use that data.
        return responseData;
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  //   so that component that uses the hook can use clearhook function.
  // reset error.
  const clearError = () => {
    setError(null);
  };

  // when you return a function in the first function then return function executed as clean up function
  // before next time useEffect runs again or when component that uses useEffect unmounts.
  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  // return as object. isLoading: isLoading and so on.
  return { isLoading, error, sendRequest, clearError };
};
