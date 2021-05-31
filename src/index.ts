/**
 * @3imed-jaberi/middleware
 *
 * Copyright(c) 2021 Imed Jaberi
 * MIT Licensed
 */

'use strict'

/**
 * modern middleware composition.
 *
 * @param {Object} options
 * @api public
 */
class Middleware extends Array {

  next (request, response, last, index = 0, done = false, called = false, fn?) {
    /* istanbul ignore next */
    if ((done = index > this.length)) return

    fn = this[index] || last

    return fn && fn(request, response, () => {
      if (called) throw new Error('next() called multiple times')
      called = true
      return Promise.resolve(this.next(request, response, last, index + 1))
    })
  }

  compose (request, response, last) {
    try {
      return Promise.resolve(this.next(request, response, last))
    } catch (err) {
      return Promise.reject(err)
    }
  }
}

/**
* Expose `Middleware`.
*/

export default Middleware
