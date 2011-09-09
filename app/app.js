// **This example illustrates the binding of DOM events to View methods.** //
// _Working example: [2.html](../2.html)._  
// _[Go to Example 3](3.html)_

//
$(document).ready(function(){
  
  // `Backbone.sync`: Overrides persistence storage with dummy function. This enables use of `Model.destroy()` without raising an error.
  Backbone.sync = function(method, model, success, error){ 
    success();
  }
  
    // Globals 
    // TODO: Clean this up
    var apiToken;

 // ******************************************
 // ******************************************
 // ROUTERS 
 // ****************************************** 
 // *****************************************
var AppRouter = Backbone.Router.extend({
    routes: {
        "/events": "events",
        "/events/:id": "showEvent",
        "/events/:id/registrations": "registrations",
        "/events/:id/registration/:rid": "showRegistration",
        "": "index"
    },

    index: function() {
        this.clearSections();
        $("section#user").show();
        var loginView = new LoginView();
    },

    showEvent: function(id) {
        this.clearSections();
        $("section#event").show();
        var eventView = new EventView();
    },

    showRegistration: function(id) {
        this.clearSections();
        $("section#registration").show();
        var registraitonView = new RegistrationView();
    },

    events: function() {
        this.clearSections();
        $("section#events").show();
        var eventCollection = new Events({filter: 'Title.Contains("Testing")', orderBy: ''});
        var eventsView = new EventListView();
    },

    registrations: function() {
        this.clearSections();
        $("section#registrations").show();
        var registrationList = new RegistrationListView();
    },

    clearSections: function() {
        $("section").hide();
        setTimeout("$('.alert-message').fadeOut()", 7000);
    }
});


 // ******************************************
 // ******************************************
 // MODELS
 // ******************************************
 // ******************************************
 var Event = Backbone.Model.extend({
     initialize: function(){
     }
 });

 var Registration = Backbone.Model.extend({
         initialize: function(){
             alert("Registration Init");   
         }
 });
  
 var User = Backbone.Model.extend({
     initialize: function(){

     },

     login: function(username, password){
        
        if (!apiToken) {
            // no API token, login first
            $.ajax(
            {
                url: 'https://www.regonline.com/webservices/default.asmx/Login',
                dataType: 'jsonp',
                data:
                {
                    username: JSON.stringify(username), // Update with your username
                    password: JSON.stringify(password) // Update with your password
                },
                success: function (response) {
                    // TODO: Move this to a callback
                    var vars;
                    if (response.d.Data.Success) {
                        apiToken = response.d.Data.APIToken;
                        vars = {warning_level: "success", warning_message: "Successfully Logged In"};
                        $("section#events").show();
                        $("section#user").slideUp();
                        app_router.navigate("/events", true);
                    }
                    else {
                        vars = {warning_level: "error", warning_message: "Error Logging In"};
                    }
                    
                    var template = _.template( $("#alert_template").html(), vars);
                    $("#alerts").html(template);
                }
            });
        }
        else {

        }

        return apiToken != "";
     }
 });

 
 // ******************************************
 // ******************************************
 // COLLECTIONS
 // ******************************************
 // ******************************************

var Events = Backbone.Collection.extend({ 
    model: Event,
    
    initialize: function(params) {
        $.ajax({
            url: 'https://www.regonline.com/api/default.asmx/GetEvents',
            dataType: 'jsonp',
            data: 
            {
                filter: JSON.stringify(params.filter),
                orderBy: JSON.stringify(params.orderBy),
                APIToken: encodeURI(apiToken)
            },
            success: function (response) {
                // TODO: Move this to a callback
                var vars;
                console.log(response);
                if (response.d.Success) {
                    vars = {warning_level: "success", warning_message: "Got events!"};
                    //$("section#user").slideUp();
                }
                else {
                    vars = {warning_level: "error", warning_message: "Error getting events"};
                }
                
                var template = _.template( $("#alert_template").html(), vars);
                $("#alerts").html(template);

            }
        });
    }
});

var Registrations = Backbone.Collection.extend({

});


 // ******************************************
 // ******************************************
 // VIEWS
 // ******************************************
 // ******************************************

    var EventView = Backbone.View.extend({
        el: $('div#event'),
        // `ItemView`s now respond to two clickable actions for each `Item`: swap and delete.
        
        events: { 
        //   'click span.register':  'register'
        },    
        
        // `initialize()` now binds model change/removal to the corresponding handlers below.
        initialize: function(){
          _.bindAll(this, 'render');
            this.render();
        },
        
        // `render()` now includes two extra `span`s corresponding to the actions swap and delete.
        render: function(){
            var template = _.template( $("#event_template").html(), {});
            this.el.html(template);
        }
    });
  
    var EventListView = Backbone.View.extend({
        el: $('div#events'), // el attaches to existing element
        
        events: {
        //    'click button#add': 'addItem'
        },
        
        initialize: function(){
          _.bindAll(this, 'render');// every function that uses 'this' as the current object should be in here
            this.render();
        },
        
        render: function(){
            var template = _.template( $("#events_template").html(), {});
            this.el.html(template);
        }
    });

    var LoginView = Backbone.View.extend({
        el: $('div.login_content'),
        events: {
            'click input#btnLogin': 'login'
        },
        
        initialize: function() {
            this.render();
        },

        render: function() {
            var template = _.template( $("#login_template").html(), {});
            this.el.html(template);
        },

        login: function() {
            var user = new User();
            user.login($("#username").val(), $("#password").val());
                    //this.el.html(template);
        }
    });

    var RegistrationListView = Backbone.View.extend({
        el: $('div#registrations'),

        initialize: function() {
            this.render();
        },

        render: function() {
            var template = _.template( $("#registrations_template").html(), {});
            this.el.html(template);
        }
    });

    var RegistrationView = Backbone.View.extend({
        el: $('div#registration'),

        initialize: function() {
            this.render();
        },

        render: function() {
            var template = _.template( $("#registration_template").html(), {});
            this.el.html(template);
        }
    });

    function closeAlert() {
        $('a.close').fadeOut();
    }

    var app_router = new AppRouter;
    var started = Backbone.history.start();

});

