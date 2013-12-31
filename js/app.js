"use strict";var dialogCtrls,resolvables;resolvables={},dialogCtrls={},angular.module("config",[]),angular.module("fork",[]),angular.module("account",[]),angular.module("admin",[]),angular.module("dashboard",["ui.map"]),angular.module("pages",[]),angular.module("platform",[]),angular.module("common",["ui.route","ui.event","ui.keypress","ui.calendar","config","fork","ngCookies","restangular","ui.bootstrap","ui.select2"]),angular.module("app",["config","common","dashboard","admin","account","pages","platform"]),angular.element(document).ready(function(){return angular.bootstrap(document,["app"])}),angular.module("account").config(["$routeProvider","WardenProvider",function(e,t){return t.simplify(e).set_template_prefix("views/account").omit_controller()}]),angular.module("account").controller("AccountEmailConfirmationCtrl",["$scope","$routeParams","Auth","User",function(e,t,r,o){return o.activate_with_token(t.userId,t.token).then(function(t){return e.notify_success("Your email has been verified"),r.create_session({user_type:t.user_type,auth_id:t.auth_id,auth_provider:t.auth_provider,token:t.token})},function(){return e.notify_error("We are unable to activate this account.")}),e.$on("session:created",function(t,r){return e.attemptLogin().then(function(){return"Vendor"===r.user_type?e.redirect_to("dashboard.vendor.listing",{success:"Please proceed to make your payment."}):e.redirect_to("dashboard."+r.user_type.toLowerCase()+".profile",{success:"Please proceed to furnish your account information"})},function(){return e.notify_error("Unable to log you in")})})}]),angular.module("account").controller("AccountResetPasswordCtrl",["$scope","$routeParams","User",function(e,t,r){return e.user={new_password:""},e.submitForm=function(){return r.reset_password_with_token(t.userId,t.token,e.user.new_password).then(function(){return e.redirect_to("home",{success:"Your password is changed successfully. Please login"})},function(){return e.notify_error("Unable to reset password. Token is invalid.")})}}]),angular.module("account").run(["$rootScope","Auth","$q","SiteName","$cookieStore","$http","Session",function(e,t,r,o,n,i,u){return e.logout=function(){return t.logout(),e.$broadcast("logged_out"),e.redirect_to("",{success:"You are logged out"})},e.attemptLogin=function(o){var n,a;return null==o&&(o={}),a=r.defer(),null!=e.authenticated&&e.authenticated?a.resolve(e.current_user):(n=t.user({delegate:!0}),n.then(function(t){return i.defaults.headers.common["User-Authorization"]=u.as_json(),e.current_user=t,e.authenticated=!0,e.user_class=t.user_type,e.user_type=t.user_type.toLowerCase(),"function"==typeof o.successHandler&&o.successHandler(t),e.$broadcast("user_ready",t),a.resolve(t)},function(){return e.authenticated||(e.current_user=null,e.authenticated=!1,e.user_class="User",e.user_type="guest"),"function"==typeof o.failedHandler&&o.failedHandler(user),a.reject("user is not logged in")})),a.promise},angular.forEach(["logged_out","login:started"],function(t){return e.$on(t,function(){return e.current_user=null,e.authenticated=!1,e.user_class="User",e.user_type="guest"})}),e.$on("authenticate:success",function(t,r){return e.attemptLogin({successHandler:function(){var t;return t=r.register?"Welcome to "+o+"!":"You are logged in!","Admin"===e.user_class?e.redirect_to("admin.users",{success:t}):void 0}})}),e.attemptLogin()}]),angular.module("account").directive("loginForm",[function(){return{restrict:"EA",replace:!0,scope:{},templateUrl:"forms/account/login.form.html",controller:["$scope","$rootScope","$routeParams","Auth",function(e,t,r,o){var n;return e.hasError=function(t){return!t.$valid&&(t.$dirty||e.submitted)},e.loginAsMember=function(){return e.submitted=!0,e.form.$valid?(t.clear_notifications(),o.authenticate("Member",e.user.email,"local",e.user.password)):void 0},n=function(){return e.user={},e.submitted=!1},n()}]}}]);var __hasProp={}.hasOwnProperty,__extends=function(e,t){function r(){this.constructor=e}for(var o in t)__hasProp.call(t,o)&&(e[o]=t[o]);return r.prototype=t.prototype,e.prototype=new r,e.__super__=t.prototype,e};angular.module("account").factory("Member",["Restangular","$rootScope","$filter",function(e,t,r){var o,n;return o=function(e){function t(){return n=t.__super__.constructor.apply(this,arguments)}return __extends(t,e),t}(BaseModel),new o(e,t,r,"member","members")}]);var __hasProp={}.hasOwnProperty,__extends=function(e,t){function r(){this.constructor=e}for(var o in t)__hasProp.call(t,o)&&(e[o]=t[o]);return r.prototype=t.prototype,e.prototype=new r,e.__super__=t.prototype,e};angular.module("account").factory("User",["Restangular","$rootScope","$filter",function(e,t,r){var o,n;return o=function(t){function r(){return n=r.__super__.constructor.apply(this,arguments)}return __extends(r,t),r.prototype.get_from_account=function(t,r,o){return this.before_operation({user_type:t,auth_id:r,auth_provider:o}),e.all("users").customGET("get_from_account",{user_type:t,auth_id:r,auth_provider:o})},r.prototype.authenticate_with_token=function(t){return this.before_operation({session:t}),e.all("users").customGET("authenticate_with_token",t)},r.prototype.register=function(t,r,o,n,i,u){var a;return a={user_type:t,auth_id:r,auth_provider:o,email:n,password:i,additional_fields:u},this.before_operation(a),e.all("users").customPOST("register",{},{},a)},r.prototype.authenticate=function(t,r,o,n){var i;return i={user_type:t,auth_id:r,auth_provider:o,password:n},this.before_operation(i),e.all("users").customGET("authenticate",i)},r.prototype.activate_with_token=function(t,r){var o;return o={token:r},this.before_operation(o),e.one("users",t).customGET("activate_with_token",o)},r.prototype.forgot_password=function(t,r,o){var n;return n={user_type:t,auth_id:r,auth_provider:o},this.before_operation(n),e.all("users").customPOST("forgot_password",{},{},n)},r.prototype.reset_password_with_token=function(t,r,o){var n;return n={token:r,new_password:o},console.log(n),this.before_operation(n),e.one("users",t).customPOST("reset_password_with_token",{},{},n)},r.prototype.block_account=function(t){return e.one("users",t).customPOST("block_account",{},{})},r.prototype.activate_account=function(t){return e.one("users",t).customPOST("activate_account",{},{})},r.prototype.clear_notifications=function(t){return e.one("users",t).customPOST("clear_notifications",{},{})},r}(BaseModel),new o(e,t,r,"user","users")}]),resolvables.admin=["Auth","$q","$rootScope",function(e,t,r){var o;return o=e.user({delegate:!0}),o.then(function(e){return r.current_user=e,r.authenticated=!0,r.user_class=e.user_type,r.user_type=e.user_type.toLowerCase(),"admin"===r.user_type?e:(r.notify_error("Please login as admin",!1),t.reject("Access not allowed"))},function(){return r.current_user=null,r.authenticated=!1,r.user_class="User",r.user_type="guest",r.notify_error("Please login first",!1),t.reject("Access not allowed")})}],resolvables.current_user=["Auth","$q","$rootScope",function(e,t,r){var o;return o=e.user({delegate:!0}),o.then(function(e){return r.current_user=e,r.authenticated=!0,r.user_class=e.user_type,r.user_type=e.user_type.toLowerCase(),e},function(){return r.current_user=null,r.authenticated=!1,r.user_class="User",r.user_type="guest",r.notify_error("Please login first",!1),t.reject("Access not allowed")})}],angular.module("account").service("Auth",["$rootScope","$http","ErrorProcessor","Session","User","$q",function(e,t,r,o,n,i){return this.create_session=function(r){return o.set(r.user_type,r.auth_id,r.auth_provider,r.token),t.defaults.headers.common["User-Authorization"]=o.as_json(),console.log(r),e.$broadcast("session:created",r)},this.user=function(e){var t;return null==e&&(e={}),o.isEmpty()?i.reject("Session does not exist"):(t=this.authenticate_with_token(o.attributes()),null!=e.delegate&&e.delegate?t:t.then(function(e){return e},function(e){return r.process_login(e)}))},this.register=function(t,o,i,u,a,s){var l=this;return n.register(t,o,i,u,a,s).then(function(r){return r.email_confirmation?e.redirect_to("/check_email"):l.authenticate(t,o,i,a,!0)},function(e){return console.log(e),r.process_registration(e)})},this.authenticate=function(t,i,u,a,s,l){var c=this;return null==a&&(a=null),null==s&&(s=!1),null==l&&(l={}),o.destroy(),e.$broadcast("login:started"),n.authenticate(t,i,u,a).then(function(t){return c.create_session(t),e.$broadcast("authenticate:success",{authenticated:t,register:s}),"function"==typeof l.successHandler?l.successHandler(t):void 0},function(e){return r.process_login(e),"function"==typeof l.errorHandler?l.errorHandler(e):void 0})},this.authenticate_with_token=function(e){return n.authenticate_with_token(e)},this.logout=function(){return o.destroy()},this.forgot_password=function(t,o,i,u){return null==u&&(u={}),n.forgot_password(t,o,i).then(function(t){return e.notify_success("An email has been sent to you to reset your password"),"function"==typeof u.successHandler?u.successHandler(t):void 0},function(e){return console.log(e),r.process_forgot_password(e),"function"==typeof u.errorHandler?u.errorHandler(e):void 0})},this}]),angular.module("account").factory("CustomProvider",["Auth","User","$rootScope","MemoryStore","$timeout",function(e,t,r,o,n){var i;return i=function(){function e(){}var i,u,a,s;return u=function(){return r.notify_error("You need to authorize this app in order to log in")},i=function(e){return n(function(){var n;return n=t.get_from_account(e.user_class,e.auth_id,e.auth_provider),n.then(function(){return o.set("auth_info",e),r.redirect_to(""+e.user_type+".login.custom_provider")},function(){return o.set("auth_info",e),r.redirect_to(""+e.user_type+".register.custom_provider")})},100)},a=function(e,t,r){return e.authResponse?FB.api("/me",function(e){var o;return i({user_class:t,user_type:r,auth_id:e.id,auth_provider:"facebook",email:e.email,additional_fields:{first_name:e.first_name,last_name:e.last_name,location:null!=(o=e.location)?o.name:void 0,photo_url:"http://graph.facebook.com/"+e.id+"/picture"}})}):u()},s=function(e,t){return IN.API.Profile("me").fields("id","email-address","first-name","last-name","location","summary","specialties","positions","picture-url","public-profile-url","skills","certifications","educations","date-of-birth","three-current-positions").result(function(r){var o,n,u,a,s,l,c,d;return o={user_class:e,user_type:t,auth_id:r.values[0].emailAddress,auth_provider:"linkedin",email:r.values[0].emailAddress,additional_fields:{first_name:r.values[0].firstName,last_name:r.values[0].lastName,photo_url:r.values[0].pictureUrl,location:null!=(n=r.values[0].location)?n.name:void 0}},"freelancer"===t&&(o.additional_fields.job_title=null!=(u=r.values[0].threeCurrentPositions)?null!=(a=u.values)?null!=(s=a[0])?s.title:void 0:void 0:void 0,o.additional_fields.professional_history=null!=(l=r.values[0].threeCurrentPositions)?null!=(c=l.values)?null!=(d=c[0])?d.summary:void 0:void 0:void 0,o.additional_fields.other_information=r.values[0].summary),IN.API.Raw("/people/~/picture-urls::(original)").result(function(e){return o.additional_fields.photo_url=e.values[0]}),i(o)})},e.prototype.connect=function(e,t,o){return r.start_ajax(),n(function(){var r;switch(e){case"facebook":return FB.login(function(e){return a(e,t,o)},{scope:"email, user_about_me, user_location, publish_actions"});case"linkedin":return(null!=(r=IN.User)?r.isAuthorized():void 0)?s(t,o):(IN.User.authorize(),IN.Event.on(IN,"auth",function(){return s(t,o)}))}},100)},e}(),new i}]),angular.module("account").factory("Session",["$cookieStore",function(e){var t;return t=function(){function t(){this._init()}return t.prototype._init=function(){var t;return t=e.get("AuthSession"),this.user_type=null!=t?t.user_type:void 0,this.auth_id=null!=t?t.auth_id:void 0,this.auth_provider=null!=t?t.auth_provider:void 0,this.token=null!=t?t.token:void 0},t.prototype.attributes=function(){return{user_type:this.user_type,auth_id:this.auth_id,auth_provider:this.auth_provider,token:this.token}},t.prototype.set=function(t,r,o,n){return this.user_type=t,this.auth_id=r,this.auth_provider=o,this.token=n,e.put("AuthSession",this.attributes())},t.prototype.destroy=function(){return this.user_type=null,this.auth_id=null,this.auth_provider=null,this.token=null,e.remove("AuthSession")},t.prototype.as_json=function(){return JSON.stringify(this.attributes())},t.prototype.isEmpty=function(){return"{}"===this.as_json},t}(),new t}]),angular.module("admin").config(["$routeProvider","WardenProvider",function(e,t){return t.simplify(e).require_admin().set_template_prefix("views/admin").when("admin.login",{omitController:!0,admin:!1}).when("admin.users").when("admin.member.show/:id",{resolves:["member"]}).when("admin.bookings_calendar").when("admin.services").when("admin.services.new",{omitController:!0}).when("admin.services.edit/:id",{omitController:!0})}]),angular.module("admin").controller("AdminBookingsCalendarCtrl",["$scope","$rootScope","Booking",function(e,t,r){var o,n;return e.safeApply=function(e){var t;return t=this.$root.$$phase,"$apply"!==t&&"$digest"!==t?this.$apply(e):e&&"function"==typeof e?e():void 0},o=[],e.eventGetter=function(t,n,i){return console.log(t),console.log(n),r.get_all_for_period(t,n).then(function(e){var t;return t=[],angular.forEach(e.bookings,function(e,r){return o.push(e),t.push({title:""+e.first_name+" "+e.last_name,start:e.start_time,end:e.end_time,allDay:!1,className:[r,"booking_event_box"]})}),i(t)}),e.safeApply()},e.eventSources=[e.eventGetter],n=function(t){return e.$apply(function(){return console.log(t.className[0]),console.log(o),console.log(o[t.className[0]]),e.booking=o[t.className[0]]})},e.uiConfig={calendar:{height:800,editable:!1,header:{left:"agendaDay,agendaWeek,month",center:"title",right:"today prev,next"},eventClick:n}}}]),angular.module("admin").controller("AdminServicesCtrl",["$scope","$rootScope","Service",function(e,t,r){return e.models=r.all({order:"updated_at DESC"})}]),angular.module("admin").controller("AdminUsersCtrl",["$scope","$rootScope","User",function(e,t,r){return e.users=r.all({order:"updated_at DESC"}),e.block_account=function(e){return r.block_account(e.id).then(function(){return e.account_status="blocked",t.notify_success("Account blocked")})},e.activate_account=function(e){return r.activate_account(e.id).then(function(){return e.account_status="active",t.notify_success("Account activated")})}}]),angular.module("admin").directive("adminDashboardSidebar",[function(){return{restrict:"EA",replace:!0,templateUrl:"partials/admin/admin_dashboard_sidebar.html"}}]),angular.module("admin").directive("adminLoginForm",[function(){return{restrict:"EA",replace:!0,scope:{},templateUrl:"forms/admin/login.form.html",controller:["$scope","$rootScope","$routeParams","Auth",function(e,t,r,o){var n;return e.hasError=function(t){return!t.$valid&&(t.$dirty||e.submitted)},e.login=function(){return e.submitted=!0,e.form.$valid?(t.clear_notifications(),o.authenticate("Admin",e.user.email,"local",e.user.password)):void 0},n=function(){return e.submitted=!1},n()}]}}]),angular.module("admin").directive("adminServicesForm",[function(){return{restrict:"EA",replace:!0,scope:{type:"@"},templateUrl:"forms/admin/services.form.html",controller:["$scope","$rootScope","$routeParams","FormHandler","Service",function(e,t,r,o,n){var i,u,a;return i="Service",a="admin.services",e.removeTimeslot=function(t){return e.form_object.time_slots.splice(t,1)},e.addTimeslot=function(){return console.log(e.form_object.time_slots),e.form_object.time_slots.push({day:"Monday"}),console.log(e.form_object.time_slots)},e.submitForm=function(){var r,u;if(e.submitted=!0,!e.form.$valid)return o.validate(e.form.$error);switch(t.clear_notifications(),e.type){case"new":return n.create(e.form_object,{redirect_to:a,process_error:!0});case"edit":return r=e.form_object.put(),u=""+i+" updated successfully",r.then(function(e){return console.log(e),t.redirect_to(a,{success:u})},function(){return t.notify_error("Form has missing or invalid values")})}},u=function(){switch(o.formify(e),e.type){case"new":return e.form_object={time_slots:[]};case"edit":return n.find(r.id).then(function(t){var r;return e.form_object=t,!(null!=(r=e.form_object.time_slots)?r.length:void 0)>0?e.form_object.time_slots=[]:void 0})}},u()}]}}]),resolvables.member=["Member","$route",function(e,t){var r;return r=t.current.params.id,e.find(r)}],angular.module("account").config(["$routeProvider","$locationProvider",function(e,t){return e.when("",{templateUrl:"views/pages/home.html",controller:"HomeCtrl"}),e.otherwise({redirectTo:"/page_not_found"}),t.html5Mode(!1)}]),angular.module("common").config(["$httpProvider",function(e){var t;return t=["$q","$injector","$rootScope",function(e,t,r){var o,n;return n=function(e){var o;return o=t.get("$http"),1>o.pendingRequests.length&&r.$broadcast("ajax_loading:stopped"),e},o=function(o){var n;return n=t.get("$http"),1>n.pendingRequests.length&&r.$broadcast("ajax_loading:stopped"),e.reject(o)},function(e){return r.$broadcast("ajax_loading:started"),e.then(n,o)}}],e.responseInterceptors.push(t)}]),angular.module("common").config(["RestangularProvider","ServiceEndpoint",function(e,t){return e.setBaseUrl(t),e.setListTypeIsArray(!0),e.setFullRequestInterceptor(function(e,t,r,o,n,i){var u,a,s,l;if(null!=(null!=e?e._deny_fields:void 0))for(l=e._deny_fields,a=0,s=l.length;s>a;a++)u=l[a],delete e[u];return{element:e,operation:t,route:r,url:o,headers:n,params:i}}),e.setResponseExtractor(function(e){return e})}]),angular.module("common").directive("header",[function(){return{restrict:"EA",replace:!0,templateUrl:"partials/common/header.html"}}]),angular.module("common").directive("serviceCategories",[function(){return{restrict:"EA",replace:!0,scope:{},templateUrl:"partials/common/service_categories.html",controller:["$scope","$rootScope","$location",function(e,t,r){return e.goTo=function(e){return r.path("/services/"+e)}}]}}]),angular.module("common").directive("sidebar",[function(){return{restrict:"EA",replace:!0,scope:{},templateUrl:"partials/common/sidebar.html",controller:["$scope","$rootScope","Service","$location",function(e,t,r,o){return e.services=r.all({order:"created_at ASC"}),e.goTo=function(e){return o.path("/services/"+e)}}]}}]),angular.module("common").directive("spinner",[function(){return{restrict:"E",replace:!0,templateUrl:"partials/common/spinner.html",controller:["$scope",function(e){return e.$on("ajax_loading:started",function(){return e.isLoading=!0}),e.$on("ajax_loading:stopped",function(){return e.isLoading=!1})}],link:function(){var e,t;return e={lines:12,length:7,width:5,radius:10,color:"#fff",speed:1,trail:66,shadow:!0,left:"78px",top:"78px"},t=document.getElementById("spin"),new Spinner(e).spin(t)}}}]),angular.module("common").directive("tagsinput",[function(){return{restrict:"A",require:"?ngModel",link:function(e,t,r,o){var n,i,u;if(o)return n=!1,i={onChange:function(){return u()}},u=function(){return o.$setViewValue(t.val())},o.$render=function(){return angular.isString(o.$viewValue)&&(t.val(o.$viewValue),t.attr("value",o.$viewValue)),n?void 0:(t.tagsInput(i),n=!0)}}}}]),angular.module("common").directive("alerter",[function(){return{restrict:"E",replace:!0,scope:{closeCountDown:"@"},controller:["$scope","$timeout",function(e,t){var r,o;return e.alerts=[],$.pnotify.defaults.history=!1,o={dir1:"down",dir2:"left",push:"top",spacing1:25,spacing2:25,firstpos1:125,firstpos2:25},r=null,e.addAlert=function(n,i){var u,a,s;return a=function(){var t,r,o,n;for(o=e.alerts,n=[],t=0,r=o.length;r>t;t++)u=o[t],n.push(u.msg);return n}(),a.indexOf(i)>=0?void 0:(e.alerts.push({type:n,msg:i}),$.pnotify({text:i,type:n,stack:o}),null!=r&&t.cancel(r),s=5e3,angular.isDefined(e.closeCountDown)&&(s=e.closeCountDown),r=t(function(){return e.clearAlerts()},s))},e.clearAlerts=function(){return e.alerts=[],$.pnotify_remove_all()},e.$on("notification:info",function(t,r){return e.addAlert("info",r)}),e.$on("notification:success",function(t,r){return e.addAlert("success",r)}),e.$on("notification:error",function(t,r){return e.addAlert("error",r)}),e.$on("notification:clear",function(){return e.clearAlerts()})}]}}]),angular.module("common").directive("fileupload",[function(){return{restrict:"A",scope:{uploaderId:"@",serverDomain:"@",servicePath:"@"},link:function(e,t,r){var o;return o={url:""+r.serverDomain+"/"+r.servicePath,dataType:"json",add:function(t,o){return e.$emit("fileupload:add",{id:r.uploaderId,domain:r.serverDomain,path:r.servicePath,data:o}),o.submit()},done:function(t,o){return e.$emit("fileupload:done",{id:r.uploaderId,domain:r.serverDomain,path:r.servicePath,data:o})},progress:function(t,o){return e.$emit("fileupload:progress",{id:r.uploaderId,domain:r.serverDomain,path:r.servicePath,data:o})},fail:function(t,o){return e.$emit("fileupload:fail",{id:r.uploaderId,domain:r.serverDomain,path:r.servicePath,data:o})}},t.fileupload(o)}}}]),angular.module("common").directive("match",function(){return{require:"ngModel",scope:{match:"="},link:function(e,t,r,o){return e.$watch(function(){var t;return t=void 0,(e.match||o.$viewValue)&&(t=e.match+"_"+o.$viewValue),t},function(t){return t?o.$parsers.unshift(function(t){var r;return r=e.match,r!==t?(o.$setValidity("match",!1),void 0):(o.$setValidity("match",!0),t)}):void 0})}}}),angular.module("common").directive("nailthumb",[function(){return{restrict:"A",scope:{method:"@",width:"@",height:"@",replaceAnimation:"@",ngSrc:"@"},link:function(e,t,r){var o;return o={method:"crop",width:"125",height:"125",replaceAnimation:"fade"},null!=r.method&&(o.method=r.method),null!=r.width&&(o.width=r.width),null!=r.height&&(o.height=r.height),null!=r.replaceAnimation&&(o.replaceAnimation=r.replaceAnimation),r.$observe("ngSrc",function(){return t.nailthumb(o)})}}}]),angular.module("common").run(["$rootScope",function(e){return e.start_ajax=function(){return e.$broadcast("ajax_loading:started")},e.stop_ajax=function(){return e.$broadcast("ajax_loading:stopped")}}]),angular.module("common").run(["$rootScope","$log",function(e,t){return e.alert=function(e){return alert(e)},e.log=function(e){return t.log(e)},e.warn=function(e){return t.warn(e)},e.error=function(e){return t.error(e)}}]),angular.module("common").run(["$rootScope",function(e){return e.notify_info=function(t,r){return null==r&&(r=!1),r||e.$broadcast("notification:clear"),e.$broadcast("notification:info",t)},e.notify_error=function(t,r){return null==r&&(r=!0),r||e.$broadcast("notification:clear"),e.$broadcast("notification:error",t)},e.notify_success=function(t,r){return null==r&&(r=!1),r||e.$broadcast("notification:clear"),e.$broadcast("notification:success",t)},e.clear_notifications=function(){return e.$broadcast("notification:clear")}}]),angular.module("common").run(["$rootScope","$location",function(e,t){return e.redirect_to=function(r,o){return null==o&&(o={}),r=r.replace(/^\//,""),null!=o.success&&e.notify_success(o.success),null!=o.info&&e.notify_info(o.info),null!=o.error&&e.notify_error(o.error),t.path("/"+r)}}]),angular.module("common").run(["$rootScope","$location",function(e,t){return e.$current_route="/",e.$on("$routeChangeSuccess",function(){return e.$current_route=t.path()})}]),angular.module("common").run(["$rootScope",function(e){return e._=_}]),angular.module("common").filter("inflector",function(){var e,t,r;return r=function(e){return e.replace(/^([a-z])|\s+([a-z])/g,function(e){return e.toUpperCase()})},e=function(e,t){return e.replace(/[A-Z]/g,function(e){return t+e})},t={humanize:function(t){return r(e(t," ").split("_").join(" "))},underscore:function(t){return t.substr(0,1).toLowerCase()+e(t.substr(1),"_").toLowerCase().split(" ").join("_")},variable:function(e){return e=e.substr(0,1).toLowerCase()+r(e.split("_").join(" ")).substr(1).split(" ").join("")}},function(e,r){return r!==!1&&angular.isString(e)?(r=r||"humanize",t[r](e)):e}});var BaseModel,ModelErrorProcessor;ModelErrorProcessor=function(){function e(e,t){this.response=e,this.$rootScope=t}return e.prototype.process=function(){var e,t,r,o,n;switch(this.response.status){case 422:o=this.response.data,n=[];for(r in o)t=o[r],n.push(function(){var o,n,i;for(i=[],o=0,n=t.length;n>o;o++)e=t[o],i.push(this.$rootScope.notify_error(""+r+" "+e));return i}.call(this));return n;case 400:return this.$rootScope.notify_error("Resource not found");case 401:return this.$rootScope.notify_error("You do not have the permission to modify resource")}},e}(),BaseModel=function(){function e(e,t,r,o,n){this.Restangular=e,this.$rootScope=t,this.$filter=r,this.singularName=o,this.pluralName=n,this.humanizedSingularName=this.$filter("inflector")(this.singularName,"humanize"),this.humanizedPluralName=this.$filter("inflector")(this.pluralName,"humanize")}return e.prototype.before_operation=function(){return this.$rootScope.$broadcast("ajax_loading:started")},e.prototype.operation_success=function(){return this.$rootScope.$broadcast("ajax_loading:stopped")},e.prototype.operation_failed=function(){return this.$rootScope.$broadcast("ajax_loading:stopped")},e.prototype.create=function(e,t){var r,o,n=this;return null==t&&(t={}),this.before_operation({model:e,options:t}),o=this.Restangular.all(this.pluralName).post(e),null!=t.delegate&&t.delegate?o:(r={notify_success:!0,notify_error:!0,process_error:!1},null!=t.notify_success&&(r.notify_success=t.notify_success),null!=t.notify_error&&(r.notify_error=t.notify_error),null!=t.process_error&&(r.process_error=t.process_error),o.then(function(e){return n.operation_success({item:e}),r.notify_success&&n.$rootScope.notify_success(""+n.humanizedSingularName+" created successfully"),null!=t.redirect_to&&n.$rootScope.redirect_to(t.redirect_to),e},function(o){var i;return n.operation_failed({response:o,model:e,options:t}),i=new ModelErrorProcessor(o,n.$rootScope),r.process_error&&i.process(),r.notify_error&&n.$rootScope.notify_error("Failed to create "+n.humanizedSingularName),console.log("@create error: "),console.log(o)}))},e.prototype.count=function(e){var t,r,o=this;return null==e&&(e={}),this.before_operation({options:e}),r={},null!=e.conditions&&(r.conditions=JSON.stringify(e.conditions)),null!=e.any_in&&(r.any_in=JSON.stringify(e.any_in)),null!=e.search&&(r.search=e.search),t=this.Restangular.all(this.pluralName).customGET("count",r),null!=e.delegate&&e.delegate?t:t.then(function(e){return o.operation_success({count:e}),e},function(t){return o.operation_failed({response:t,options:e}),console.log("@count error:"),console.log(t)})},e.prototype.all=function(e){var t,r,o=this;return null==e&&(e={}),this.before_operation({options:e}),r={limit:1e3,offset:0,order:"updated_at DESC",page:1,per_page:100},null!=e.limit&&(r.limit=e.limit),null!=e.offset&&(r.offset=e.offset),null!=e.order&&(r.order=e.order),null!=e.page&&(r.page=e.page),null!=e.per_page&&(r.per_page=e.per_page),null!=e.includes&&(r.includes=JSON.stringify(e.includes)),null!=e.conditions&&(r.conditions=JSON.stringify(e.conditions)),null!=e.any_in&&(r.any_in=JSON.stringify(e.any_in)),null!=e.search&&(r.search=e.search),t=this.Restangular.all(this.pluralName).getList(r),null!=e.delegate&&e.delegate?t:t.then(function(e){return o.operation_success({list:e}),e},function(t){return o.operation_failed({response:t,options:e}),console.log("@all error:"),console.log(t)})},e.prototype.find=function(e,t){var r,o,n=this;return null==t&&(t={}),this.before_operation({id:e,options:t}),o={},null!=t.includes&&(o.includes=JSON.stringify(t.includes)),r=this.Restangular.one(this.pluralName,e).get(o),null!=t.delegate&&t.delegate?r:r.then(function(e){return n.operation_success({item:e}),e},function(e){return n.operation_failed({response:e}),n.$rootScope.notify_error("Unable to find "+n.humanizedSingularName),console.log("@find error"),console.log(e)})},e.prototype.destroy=function(e,t){var r,o=this;return null==t&&(t={}),this.before_operation({id:e,options:t}),console.log(e),console.log(this.Restangular.one(this.pluralName,e).remove),r=this.Restangular.one(this.pluralName,e).remove(),null!=t.delegate&&t.delegate?r:r.then(function(e){return o.operation_success({item:e})},function(e){return o.operation_failed({response:e}),o.$rootScope.notify_error("Unable to delete "+o.humanizedSingularName),console.log("@destroy error"),console.log(e)})},e}(),angular.module("common").provider("Warden",function(){var e;return e=function(){function e(){}return e.prototype.$get=function(){},e.prototype.simplify=function(e){return this.routeProvider=e,this.requireUser=!1,this.requireAdmin=!1,this.omitView=!1,this.omitController=!1,this},e.prototype.set_template_prefix=function(e){return this.templatePrefix=e,"/"!==e.slice(-1)&&(this.templatePrefix+="/"),this},e.prototype.require_user=function(){return this.requireUser=!0,this},e.prototype.require_admin=function(){return this.requireAdmin=!0,this},e.prototype.omit_view=function(){return this.omitView=!0,this},e.prototype.omit_controller=function(){return this.omitController=!0,this},e.prototype.when=function(e,t){var r,o,n,i,u,a,s,l,c,d,f,p;if(null==t&&(t={}),"/"===e.slice(0,1)&&(e=e.slice(1)),r=e.split("/")[0],n=function(){var e,t,o,n;for(o=r.split(/\.|_/),n=[],e=0,t=o.length;t>e;e++)l=o[e],n.push(l.capitalize());return n}(),a=t.route||"/"+e,o=""+n.join("")+"Ctrl",s=""+this.templatePrefix+r+".html",u={},null==t.user&&(t.user=this.requireUser),null==t.admin&&(t.admin=this.requireAdmin),null==t.omitView&&(t.omitView=this.omitView),null==t.omitController&&(t.omitController=this.omitController),t.user&&(u.current_user=resolvables.current_user),t.admin&&(u.admin=resolvables.admin),null!=t.resolves)for(p=t.resolves,d=0,f=p.length;f>d;d++)i=p[d],u[i]=resolvables[i];return t.omitView&&(s="views/pages/empty.html"),null!=t.templateUrl&&(s=t.templateUrl),c="1.05",s+="?v="+c,t.omitController?this.routeProvider.when(a,{templateUrl:s,resolve:u}):this.routeProvider.when(a,{templateUrl:s,controller:o,resolve:u}),this},e}(),new e}),angular.module("common").service("ErrorProcessor",["$rootScope","$log",function(e,t){return this.process_save=function(r,o){var n,i,u,a,s;switch(r.status){case 422:a=r.data,s=[];for(u in a)i=a[u],s.push(function(){var r,o,a;for(a=[],r=0,o=i.length;o>r;r++)n=i[r],t.error(n),a.push(e.notify_error(""+u+" "+n));return a}());return s;default:return null!=o?o():e.notify_error("Unable to complete your request. Please contact the administrator.")}},this.process_login=function(t,r){switch(t.status){case 401:if("message"in t.data)return e.notify_error(t.data.message);break;default:return null!=r?r():e.notify_error("Sorry, we are unable to log you in. Please contact the administrator.")}},this.process_registration=function(t,r){switch(t.status){case 401:if("message"in t.data)return e.notify_error(t.data.message);break;default:return null!=r?r():e.notify_error("Sorry, we are unable to proceed with registration. Please contact the administrator.")}},this.process_forgot_password=function(t,r){switch(t.status){case 401:if("message"in t.data)return e.notify_error(t.data.message);break;default:return null!=r?r():e.notify_error("Sorry, we are unable to reset your password. Please contact the administrator")}},this}]),angular.module("common").service("FormHandler",["$rootScope",function(e){return this.formify=function(e){return e.submitted=!1,e.form_object={},e.hasError=function(t){return!t.$valid&&(t.$dirty||e.submitted)},e.removeAssoc=function(e,t){return null!=e[t].id?e[t]._destroy=!0:e.splice(t,1)}},this.validate=function(t){var r;return window.scrollTo(0),r=0,angular.forEach(t,function(t,o){return angular.forEach(t,function(t){var n;if(r+=1,4>r)switch(o){case"required":if(t.$error.required===!0){if(null!=t.$name)return e.notify_error(""+(null!=(n=t.$name)?n.humanize():void 0)+" is missing.")}else if(angular.isArray(t.$error.required)&&null!=t.$error.required[0].$name)return e.notify_error(""+t.$error.required[0].$name.humanize()+" is missing");break;case"email":if(t.$error.email===!0){if(null!=t.$viewValue)return e.notify_error(""+t.$viewValue+" is not a valid email.")}else if(angular.isArray(t.$error.email)&&null!=t.$error.email[0].$viewValue)return e.notify_error(""+t.$error.email[0].$viewValue+" is not a valid email.");
break;case"url":if(t.$error.url===!0){if(null!=t.$viewValue)return e.notify_error(""+t.$viewValue+" is not a valid url.")}else if(angular.isArray(t.$error.url)&&null!=t.$error.url[0].$viewValue)return e.notify_error(""+t.$error.url[0].$viewValue+" is not a valid url.")}})})},this.handleImage=function(t,r,o,n,i){return null==n&&(n="Uploading.."),null==i&&(i="Failed to upload picture."),t.$on("fileupload:add",function(e,o){return t.$apply(function(){switch(o.id){case r:return t[""+r+"_state"]=n}})}),t.$on("fileupload:done",function(e,n){return t.$apply(function(){var e,i,u,a,s,l,c,d,f,p,m,_;if(u=null!=(a=n.data.result)?null!=(s=a.data)?null!=(l=s.content)?l.url:void 0:void 0:void 0,e=null!=(c=n.data.result)?null!=(d=c.data)?null!=(f=d.avatar)?f.url:void 0:void 0:void 0,i=null!=(p=n.data.result)?null!=(m=p.data)?null!=(_=m.thumb)?_.url:void 0:void 0:void 0,null!=u)switch(n.id){case r:return t[""+r+"_state"]="",o.push({url:n.domain+u,avatar_url:n.domain+e,thumb_url:n.domain+i})}})}),t.$on("fileupload:failed",function(){return e.notify_error(i,!1)})},this}]),angular.module("common").service("MemoryStore",[function(){var e;return e={},this.set=function(t,r){return e[t]=r},this.get=function(t){return e[t]},this.del=function(t){return delete e[t]},this.inspect=function(){return e},this.clear=function(){return e={}},this}]),angular.module("config").constant("ServiceEndpoint","http://162.243.15.77:3000"),angular.module("config").constant("SiteName","AutoTechnica"),angular.module("config").constant("SiteUrl","http://162.243.15.77"),angular.module("pages").controller("ContactCtrl",["$scope","Mailer",function(e,t){return e.submitForm=function(){return console.log(e.contact),t.contact_us(e.contact).then(function(){return e.notify_success("Thank you for contacting us. We will get back to you shortly")})}}]),angular.module("pages").controller("HomeCtrl",["$scope","$rootScope","Service","Booking","FormHandler","$location",function(e,t,r,o,n,i){var u,a,s;return e.startBooking=!1,e.bookableSlots=[],e.slot_select={index:null},e.changeSlot=function(){return e.selected_slot=e.bookableSlots[e.slot_select.index]},e.confirmSlot=function(){return e.startBooking=!0,window.scrollTo(0,500)},a=function(e,t,r){return r([])},e.eventSources=[a],u=function(t){var o;return o=r.get_time_slots_from_date("repair",t.getFullYear(),t.getMonth()+1,t.getDate()),e.$apply(function(){return e.selected_date=t,o.then(function(t){return e.bookableSlots=t.time_slots})})},e.uiConfig={calendar:{height:400,editable:!1,header:{left:"",center:"title",right:"today prev,next"},dayClick:u}},s=function(){var t;return e.selected_date=new Date,t=r.get_time_slots_from_date("repair",e.selected_date.getFullYear(),e.selected_date.getMonth()+1,e.selected_date.getDate()),t.then(function(t){return e.bookableSlots=t.time_slots})},s(),n.formify(e),e.new_user=!0,e.$on("user_ready",function(t,r){return"Member"===r.user_type?(e.new_user=!1,e.form_object.member_id=r.id,e.form_object.email=r.email,e.form_object.first_name=r.first_name,e.form_object.last_name=r.last_name,e.form_object.mobile=r.mobile,e.form_object.postcode=r.postcode,e.form_object.address=r.address):void 0}),e.submitForm=function(){return e.submitted=!0,e.form.$valid?(t.clear_notifications(),e.form_object.start_time=e.selected_slot.start_time,e.form_object.end_time=e.selected_slot.end_time,r.get_from_name("repair").then(function(t){return e.form_object.service_id=t.id,console.log(e.form_object),e.new_user?o.new_user_submit_booking_form(e.form_object).then(function(e){return console.log(e),i.path("check_email")}):o.existing_user_submit_booking_form(e.form_object).then(function(e){return console.log(e),i.path("check_email")})})):n.validate(e.form.$error)}}]),angular.module("pages").factory("Mailer",["Restangular","$rootScope",function(e){var t;return t=function(){function t(){}return t.prototype.contact_us=function(t){return e.all("mailer").customPOST("contact_us",{form_values:t})},t}(),new t}]);var __hasProp={}.hasOwnProperty,__extends=function(e,t){function r(){this.constructor=e}for(var o in t)__hasProp.call(t,o)&&(e[o]=t[o]);return r.prototype=t.prototype,e.prototype=new r,e.__super__=t.prototype,e};angular.module("platform").factory("Booking",["Restangular","$rootScope","$filter",function(e,t,r){var o,n;return o=function(t){function r(){return n=r.__super__.constructor.apply(this,arguments)}return __extends(r,t),r.prototype.new_user_submit_booking_form=function(t){return this.before_operation(t),e.all("bookings").customPOST("new_user_submit_booking_form",{},{},t)},r.prototype.existing_user_submit_booking_form=function(t){return this.before_operation(t),e.all("bookings").customPOST("existing_user_submit_booking_form",{},{},t)},r.prototype.get_all_for_period=function(t,r){return this.before_operation({start_time:t,end_time:r}),e.all("bookings").customGET("get_all_for_period",{start_time:t,end_time:r})},r}(BaseModel),new o(e,t,r,"booking","bookings")}]);var __hasProp={}.hasOwnProperty,__extends=function(e,t){function r(){this.constructor=e}for(var o in t)__hasProp.call(t,o)&&(e[o]=t[o]);return r.prototype=t.prototype,e.prototype=new r,e.__super__=t.prototype,e};angular.module("platform").factory("Service",["Restangular","$rootScope","$filter",function(e,t,r){var o,n;return o=function(t){function r(){return n=r.__super__.constructor.apply(this,arguments)}return __extends(r,t),r.prototype.get_from_name=function(t){return e.all("services").customGET("get_from_name",{name:t})},r.prototype.get_time_slots_from_date=function(t,r,o,n,i){return null==i&&(i="+8"),e.all("services").customGET("get_time_slots_from_date",{name:t,day:n,month:o,year:r,timezone:i})},r}(BaseModel),new o(e,t,r,"service","services")}]),angular.module("platform").config(["$routeProvider","WardenProvider",function(e,t){return t.simplify(e).set_template_prefix("views/platform")}]),resolvables.service=["Service","$route",function(e,t){var r;return r=t.current.params.service_name,r?e.get_from_name(r):null}],resolvables.services=["Service",function(e){return e.all()}];