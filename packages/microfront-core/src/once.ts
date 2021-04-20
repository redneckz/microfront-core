/**
 * Im afraid of Lodash or Ramda here.
 * Cause both libraries affect resulting bundle size and require additional configuration.
 * Currently, only single function is needed.
 *
 * https://lodash.com/docs#once
 */
export function once<F extends Function>(fun: F): F {
    let done = false;
    let result: any;
    return function (this: any, ...args: any[]) {
        if (done) return result;
        result = fun.apply(this, args);
        done = true;
        return result;
    } as any;
}
