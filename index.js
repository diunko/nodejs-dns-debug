
var util = require('util')

function __uuid(){
  return (Math.random()*0x100000000).toString(36)
}

function hrTimeDiff(t1,t0){
   return (t1[0] - t0[0])*1000000000 + (t1[1] - t0[1])
}

var debug;
if (process.env.NODE_DEBUG && /dns/.test(process.env.NODE_DEBUG)) {
  var pid = process.pid;
  debug = function(x) {
    // if console is not set up yet, then skip this.
    if (!console.error)
      return;
    console.error('DNS: %d', pid,
                  util.format.apply(util, arguments).slice(0, 500));
  };
} else {
  debug = function() { };
}

var dns = require('dns')
var dnsLookup = dns.lookup
var dnsResolve = dns.resolve

// lookup(domain, [family], callback)

function lookup(domain, family, callback) {
  var rqId = __uuid()
  var t0 = process.hrtime()

  if(arguments.length === 2 || !family){
    debug('lookup[%s].enter(domain: %s)', rqId, domain)
    callback = family
    return dnsLookup(domain, _cb)
  } else {
    debug('lookup[%s].enter(domain: %s, family: %s)', rqId, domain, family)
    return dnsLookup(domain, family, _cb)
  }

  function _cb(err, address, family){
    var t1 = process.hrtime()
    var dt = hrTimeDiff(t1, t0)

    debug('lookup[%s].done(%s, %s, %s) [%s ns]', rqId, err, address, family, dt)

    callback.apply(null, arguments)
  }
  
}

function resolve(domain, rrtype, callback) {
  var rqId = __uuid()
  var t0 = process.hrtime()

  if (typeof rrtype == 'string') {
    debug('resolve[%s].enter(domain: %, rrtype: %s)', rqId, domain, rrtype)
    dnsResolve(domain, rrtype, _cb)
  } else {
    callback = rrtype
    debug('resolve[%s].enter(domain: %)', rqId, domain)
    dnsResolve(domain, _cb)
  }

  function _cb(err, addresses){
    var t1 = process.hrtime()
    var dt = hrTimeDiff(t1, t0)

    debug('lookup[%s].done(%s, %s, %s) [%s ns]', rqId, err, addresses, dt)

    callback.apply(null, arguments)
  }

}

dns.lookup = lookup
module.exports = dns

