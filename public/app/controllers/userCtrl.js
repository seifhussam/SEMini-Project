angular.module ('userControllers', ['userServices'] ) .controller('regCtrl',function ($http,$location,$timeout,User) {
  var app = this ;
this.regUser = function (regData) {
  app.Emsg = false ;
  app.Smsg = false  ;
  app.loading = true ;
User.create(app.regData).then (function (data) {
  if (data.data.success) {
    $timeout(function () {
      $location.path('/login') ;
    }, 2000);
    app.loading = false ;
    app.Smsg = data.data.message ;


  }
  else {
    app.loading = false ;
  app.Emsg = data.data.message ;
  }
});
};

}) ;
