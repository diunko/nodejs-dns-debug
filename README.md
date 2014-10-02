
### dns-debug

Monkey-patches Node.js dns module to add some NODE_DEBUG=dns logging.

#### Usage
```js
var dns = require("dns-debug")
```

Try running `sample.js` like this:
```
$ NODE_DEBUG=dns node sample.js
```
