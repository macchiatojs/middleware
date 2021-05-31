import { expect } from 'chai'
import Middleware from '../src'

describe('compose', () => {
  let context

  beforeEach(() => {
    context = new Middleware()
  })

  it('middleware should an array-like object', ()=> {
    const middleware = context
    expect(middleware).to.be.instanceof(Middleware)
    expect(middleware).to.be.instanceof(Array)
  })

  it('middleware compose should return result and not throws', () => {
    const middleware = context
    expect(() => middleware.compose()).to.not.throws()
  })

  it('middleware compose should return result and throws', () => {
    const middleware = context
    middleware.push((req, res, next) => {
      req.a = 1
      next()
      next()
    })

    middleware.compose({}, {}).catch((result) => {
      expect(result).to.be.equal(/next() called multiple times/)
    })     
  })

  it('iterator', async () => {
    const middleware = context
    
    middleware.push((req, res, next) => {
      req.arr.push(1)
      return next().then(() => {
        res.sended = true
        req.arr.push(6)
      })
    })

    middleware.push(async (req, res, next) => {
      req.arr.push(2)
      await next()
      req.arr.push(5)
    })

    middleware.push((req, res, next) => {
      req.arr.push(3)
      next()
      req.arr.push(4)
    })
  
    const iter = middleware[Symbol.iterator]()

    expect(typeof iter.next).to.equal('function')

    const req = { arr: [] }
    const res = {}
  
    await middleware.compose(req, res)
  
    expect(req.arr).to.deep.equal([1, 2, 3, 4, 5, 6])
  })
})
