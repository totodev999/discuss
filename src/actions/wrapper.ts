import { headers } from 'next/headers';

/**
 * createServerActionsWrapper returns a function that wraps a server action function with logging.
 * @param funcName string fucneName is used for logging
 * @returns function
 */
export function createServerActionsWrapper<T>(funcName: string) {
  /**
   * Important: This function should used with createResponseData function.
   * Important: When you use server actions, you should use this function to wrap your server action.
   * This function wraps a server action function with logging.
   * The server action is implemented in this function.
   * In this function, it logs the start and end of the server action.
   * When unexpected error happens, it throws error and let next.js's error page catch it after logging.
   * @param func Function
   *
   */
  return async function (func: Function): Promise<T> {
    // If you want to see headers, you can use this code
    // const aaa = Array.from(headers().entries());
    // aaa.forEach((s) => console.log(s));

    const ip = headers().get('x-forwarded-for');
    const logId = headers().get('x-log-id');

    console.log(
      `[server-action-start]-[${new Date().toLocaleString()}]-[${funcName}]-[${ip}]-[${logId}]`
    );
    let resultData: T | undefined;
    let resultStatus: number;
    let resultRedirect: undefined | (() => never);
    let resultError: Error | undefined;
    try {
      const res = await func();
      const { data, status, redirect, error } = res;
      resultData = data;
      resultStatus = status;
      resultRedirect = redirect;
      resultError = error;

      if (resultError) {
        console.error(
          `[server-action-error]-[${new Date().toLocaleString()}]-[${funcName}]-[${ip}]-[${logId}]-[${
            resultError.message
          }]-[${resultError.stack}]`
        );
      }
    } catch (err: any) {
      // When unexpected error happens, throw error and let next.js's error page catch it after logging
      const stack = err.stack;
      if (stack) {
        console.error(stack);
      } else {
        console.error(JSON.stringify(err));
      }
      throw err;
    }

    console.log(
      `[server-action-end]-[${new Date().toLocaleString()}]-[${funcName}]-[${ip}]-[${logId}]`
    );
    if (resultData && resultRedirect) {
      resultRedirect();
      return resultData;
    } else if (resultRedirect) {
      return resultRedirect();
    } else {
      return resultData as T;
    }
  };
}

/**
 * important:data or redirect is nessasary.
 * If you set data and redirect, first redirect will be executed after that data will be returned.
 * If you set error, error log will be shown.
 * status is used for judging request is success or not.(Maybe in server action, http-status is not importnt). And not used for judging log level.
 * @param data
 * @param redirect
 * @param status
 * @param error
 *
 * @returns
 */
export async function createResponseData<T>({
  data,
  redirect,
  status,
  error,
}: {
  data?: T;
  redirect?: () => void;
  status: number;
  error?: Error;
}): Promise<{
  data?: T;
  redirect?: () => void;
  status: number;
  error?: Error;
}> {
  return {
    data,
    redirect,
    status,
    error,
  };
}
