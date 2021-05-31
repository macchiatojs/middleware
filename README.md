# agnostic-middleware

The Modern (ES6) and **Express-Style** Middleware Composition.

## `Installation`

```bash
# npm
$ npm install agnostic-middleware
# yarn
$ yarn add agnostic-middleware
```

## `Usage`

```typescript
import Middleware from "agnostic-middleware";

const middleware = new Middleware();

middleware.push((req, res, next) => {
  req.arr.push(1);
  return next().then(() => {
    req.arr.push(6);
  });
});

middleware.push(async (req, res, next) => {
  req.arr.push(2);
  await next();
  req.arr.push(5);
});

middleware.push((req, res, next) => {
  req.arr.push(3);
  next();
  req.arr.push(4);
});

const req = { arr: [] };
const res = {};
await middleware.compose(req, res);
console.log(req.arr.toString() === "1,2,3,4,5,6");
// true
```

## `Support`

If you have any problem or suggestion please open an issue.

#### License

---

[MIT](LICENSE) &copy; [Imed Jaberi](https://github.com/3imed-jaberi)
