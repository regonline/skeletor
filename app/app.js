// **This example illustrates the binding of DOM events to View methods.**
//
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
 // CONTROLLERS
 // ******************************************
 /******************************************
var EventsController = Backbone.Controller.extend({
    routes: {
        "events/:id": "show",
        "": "index"
    },

    index: function() {
        alert("Need to load the list of events");
    },

    show: function(id) {


    }
});
*/


 // ******************************************
 // ******************************************
 // MODELS
 // ******************************************
 // ******************************************
 var Event = Backbone.Model.extend({
    defaults: {
      Title: 'hello',
      URL: 'world'
    },

         initialize: function(){
             alert("Registration Init");   
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
        model: Event 
});

var Registrations = Backbone.Collection.extend({

});


 // ******************************************
 // ******************************************
 // VIEWS
 // ******************************************
 // ******************************************

  var EventView = Backbone.View.extend({
    tagName: 'li', // name of tag to be created        
    // `ItemView`s now respond to two clickable actions for each `Item`: swap and delete.
    events: { 
      'click span.register':  'register'
    },    
    // `initialize()` now binds model change/removal to the corresponding handlers below.
    initialize: function(){
      _.bindAll(this, 'render', 'unrender', 'register'); // every function that uses 'this' as the current object should be in here

      this.model.bind('change', this.render);
      this.model.bind('remove', this.unrender);
    },
    // `render()` now includes two extra `span`s corresponding to the actions swap and delete.
    render: function(){
      $(this.el).html('<span style="color:black;">'+this.model.get('Title')+' '+this.model.get('URL')+'</span> &nbsp; &nbsp; <span class="swap" style="font-family:sans-serif; color:blue; cursor:pointer;">[swap]</span> <span class="delete" style="cursor:pointer; color:red; font-family:sans-serif;">[delete]</span>');
      return this; // for chainable calls, like .render().el
    },
    // `unrender()`: Makes Model remove itself from the DOM.
    unrender: function(){
      $(this.el).remove();
    },
    // `swap()` will interchange an `Item`'s attributes. When the `.set()` model function is called, the event `change` will be triggered.
    register: function(){
      var swapped = {
        Title: this.model.get('URL'), 
        URL: this.model.get('Title')
      };
      this.model.set(swapped);
    },
    // `remove()`: We use the method `destroy()` to remove a model from its collection. Normally this would also delete the record from its persistent storage, but we have overridden that (see above).
    remove: function(){
      this.model.destroy();
    }
  });
  
  // Because the new features (swap and delete) are intrinsic to each `Item`, there is no need to modify `ListView`.
  var EventList = Backbone.View.extend({
    el: $('body'), // el attaches to existing element
    events: {
      'click button#add': 'addItem'
    },
    initialize: function(){
      _.bindAll(this, 'render', 'addItem', 'appendItem'); // every function that uses 'this' as the current object should be in here
      
      this.collection = new List();
      this.collection.bind('add', this.appendItem); // collection event binder

      this.counter = 0;
      this.render();
    },
    render: function(){
      $(this.el).append("<button id='add'>Add list item</button>");
      $(this.el).append("<ul></ul>");
      _(this.collection.models).each(function(item){ // in case collection is not empty
        appendItem(item);
      }, this);
    },
    addItem: function(){
      this.counter++;
      var item = new Item();
      item.set({
        URL: item.get('URL') + this.counter // modify item defaults
      });
      this.collection.add(item);
    },
    appendItem: function(item){
      var itemView = new ItemView({
        model: item
      });
      $('ul', this.el).append(itemView.render().el);
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

  //var eventView = new EventView();
  var loginView = new LoginView();
});

