Features
========

* [Loose coupling](https://en.wikipedia.org/wiki/Loose_coupling)
* Less Code. Write just enough for your javascript application
* Simple and easy
* [Scalable Js](http://addyosmani.com/largescalejavascript/)
* [DRY](http://c2.com/cgi/wiki?DontRepeatYourself)


MVC or MTV
==========

Controllers
-----------

Controllers are an intermediary between models and views which are classically responsible for two tasks: 
they both update the view when the model changes and update the model when the user manipulates the view. 
In Syrup drivers are handled from a dedicated environment (application modules), not combined application.

The Controllers are located in the folder "app/controller/{app_name}/{file}.is", and are called to our site with script tags right after call Syrup core,
you should not use the controllers on the unification of files, it is a good idea to have separate it for each application.

```html
<script src="YOUR PATH/Syrup/dist/init.min.js"></script>
<script src="YOUR PATH/Syrup/app/controller/contact/init.js"></script>
```

Views
-----

It is the representation of the information with which the system operates, therefore manages all access to 
such information, both queries and updates, also implementing access privileges have been described in the specifications of the application (business logic). 
Renders the model into a form suitable for interaction, typically a user interface element. 

In Syrup the views are locate in the folder "app/controller/{view_name}/{file}.js".
The views are handled by the "controller", and are an interface between the template and the controller. 

Models
------

The domain-specific representation of the information on which the application operates. The model is another name for the domain layer. Domain logic adds meaning to raw data.
Model is where the application’s data objects are stored. The model doesn’t know anything about views and controllers. When a model changes, typically it will notify its observers that a change has occurred.

In Syrup models are data resources, which are obtained through data entry forms, and are handled by the "controller".


Templates
---------

This layer contains presentation-related decisions: how something should be displayed on a Web page or other type of document.

In Syrup, the templates are handled with the help of [Mustache](https://mustache.github.io/). 
The templates are related to views, they make use of the templates to display data.




