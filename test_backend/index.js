var Koa = require('koa');

var Router = require('koa-router');


var app = new Koa();

var router = new Router();

router.get('/', bonjour);

app.use(router.routes());

app.listen(3000);

function bonjour (cnx, next){
    cnx.body = {message: 'hallo'};
}