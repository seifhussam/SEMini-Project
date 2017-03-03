var User = require ('../models/user') ;
var jwt = require ('jsonwebtoken') ;
var secret = "harrypotter" ;
module.exports= function (router) {
router.post('/users' , function (req , res) {
    var user = new User() ;

    user.username = req.body.username ;
    user.password= req.body.password ;
    user.sid = req.body.email ;
    user.pname = req.body.pname;
    if (req.body.username == null || req.body.username == "" || req.body.email == null || req.body.email == "" ||
  req.body.password == null || req.body.password == "") {
      res.json({success : false , message : "Ensure username , password and email is provided " });
    } else {
      user.save(function(err){
        if(err)
        res.json({success : false , message : "Username or password already exsists" });

        else{
            res.json ({success:true , message :"user created"}) ;
        }

      }) ;

    }

  }) ;

  router.post ('/authenticate', function (req,res) {
    User.findOne({ username: req.body.username}).select ('sid username password pname Work').exec(function (err ,user){
      if (err) throw err ;

      if (!user) {
        res.json({ success :false , message : "Could not authenticate user"});
      }
      else if (user){
        if (req.body.password)
    var validpass = user.comparePassword (req.body.password) ;
    else {
      res.json({success:false , message :"no password provided"}) ;
    }
    if (!validpass) {
    res.json({success:false , message :"could not authenticate password"})  ;
    }
    else {
      var token = jwt.sign({username:user.username , sid:user.sid, pname :user.pname , Work :user.Work }, secret , {expiresIn :'24h'});
        res.json({success:true , message :"success",token:token})  ;
    }
      }
    }) ;
  } );

router.use(function (req,res,next) {

  var token = req.body.token || req.body.query || req.headers['x-access-token'] ;
  if (token) {
    jwt.verify(token, secret , function (err,decoded){
      if (err) res.json({success:'false' , message :'token invaild'});
      else {
          req.decoded = decoded ;
        next() ;
      }
    });
  }
  else {
    res.json({success:'false' , message :'No token provided'});
  }

}) ;
router.post('/me',function (req,res) {
res.send(req.decoded) ;
});

router.post('/addWork',function (req,res){
var newWork = {
"username" : req.body.username,
"type":  req.body.type,
"details":  req.body.details,
"codeSource" : req.body.codeSource
} ;

User.update({username:req.body.username}, {$push: { Work: newWork } }, function (err) {
  if (err) throw err ;else   res.json ({success : 'true'});
} );

});

router.get('/allWork', function(req, res){
	User.find(function(req,allusers){
		res.json({allusers: allusers});
	})

});


  return router ;
}
