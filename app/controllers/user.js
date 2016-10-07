  var User = require('../models/user') //引入user模块


  //signup
  exports.showSignup=function(req,res){
            res.render('signup', {
                title: '注册页面'
            })
    }

exports.showSignin=function(req,res){
            res.render('signin', {
                title: '登录页面'
            })
    }


  exports.signup =function(req,res){
        var _user = req.body.user //获取表单的数据
        User.findOne({ name: _user.name }, function(err, user) {
            if (err) { 
                console.log(err)
             }
            if (user) {
                return res.redirect('/signin')
            } else {
                user = new User(_user)

                user.save(function(err, user) {
                    if (err) {
                        console.log(err)
                    }
                    res.redirect('/')
                })
            }
        })
}

 //signin
exports.signin=function(req,res){
        var _user = req.body.user
        var name = _user.name
        var password = _user.password
        User.findOne({ name: name }, function(err, user) {
            if (err) {
                console.log(err)
            }
            if (!user) {
                console.log('请先注册再登录')
                return res.redirect('/signup')
            }

            user.comparePassword(password, function(err, isMatch) {
                if (err) {
                    console.log(err)
                }
                if (isMatch) {
                    console.log('password is matched')
                    req.session.user = user

                    return res.redirect('/')
                } else {
                    console.log('密码错误，请重新输入')
                    return res.redirect('/signin')
                   
                }
            })
        })
    }

    //logout
exports.logout=function(req,res){
        delete req.session.user
        // delete app.locals.user
        res.redirect('/')
}


    //userlist page
exports.list=function(req,res){
        User.fetch(function(err, users) {
            if (err) {
                console.log(err)
            }
            res.render('userlist', {
                title: 'imooc 用户列表页',
                users: users
            })
        })
}

 //midware for userlist
exports.signinRequired=function(req,res,next){
    var user=req.session.user
    if(!user){
        return res.redirect('/signin')
    }
    next()
}

exports.adminRequired=function(req,res,next){
    var user=req.session.user
    if(user.role<=10){
        return res.redirect('/signin')
    }
    next()
}

