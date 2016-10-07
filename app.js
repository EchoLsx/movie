var express = require('express')
var path = require('path')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('cookie-session')

var multipart=require('connect-multiparty')

var morgan = require('morgan')
// var serveStatic=require('serve-static')
var port = process.env.PORT || 3000
var app = express()
var fs=require('fs')
var dbUrl = 'mongodb://localhost/imooc'


mongoose.connect(dbUrl)


//models loading 
var models_path=__dirname+'/app/models'
var walk=function(path){
	fs
		.readdirSync(path)
		.forEach(function(file){
			var newPath=path+''+file
			var stat=fs.statSync(path)
			if(stat.isFile()){
				if(/(.*)\.(js|coffee)/.test(file)){
					require(newPath)
				}
			}
			else if(stat.isDirectory()){
				walk(newPath)
			}
		})
}


app.set('views', './app/views/pages')
app.set('view engine', 'jade')
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, 'public'))) //静态文件配置的目录
app.use(cookieParser())
app.use(multipart())
app.use(session({
	secret:'imooc',
	resave: false,
    saveUninitialized: true
}))

var env =process.env.NODE_ENV||'development'
if('development'===app.get('env')){
	app.set('showStackError',true)
	app.use(morgan(':method :url :status'))
	app.locals.pretty=true
	mongoose.set('debug',true)
}

require('./config/routes')(app)
app.locals.moment = require('moment')
app.listen(port)
mongoose.Promise = require('bluebird');
console.log('imooc started on port ' + port)
