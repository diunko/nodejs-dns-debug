
var dns = require('./index')
var http = require('http')

var trace = 0

var rq = http.get('http://ya.ru', function(rs){

  var chunks = []

  rs.on('data', function(data){
    trace && console.log(data)
    chunks.push(data)
  })

  rs.on('end', function(){
    body = Buffer.concat(chunks)
    console.log(body.toString('utf8'))
  })
  
})

