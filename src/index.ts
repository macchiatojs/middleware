/**
 * @macchiatojs/middleware
 *
 * Copyright(c) 2021 Imed Jaberi
 * MIT Licensed
 */

'use strict'

/**
 * decalre types.
 */

type Next = () => Promise<any>;

/**
 * modern middleware composition.
 *
 * @param {Object} options
 * @api public
 */
class Middleware <Request = unknown, Response = unknown> extends Array {
  #next (
    request: Request,
    response: Response,
    last?: Next,
    index = 0,
    done = false,
    called = false,
    fn?: (request: Request, response: Response, next: Next) => any
  ) {
    /* istanbul ignore next */
    if ((done = index > this.length)) return

    fn = this[index] || last

    return fn && fn(request, response, () => {
      if (called) throw new Error('next() called multiple times')
      called = true
      return Promise.resolve(this.#next(request, response, last, index + 1))
    })
  }

  compose (request: Request, response: Response, last?: Next) {
    try {
      return Promise.resolve(this.#next(request, response, last))
    } catch (err) {
      return Promise.reject(err)
    }
  }
}

/**
 * Expose `Middleware`.
 */

export default Middleware
