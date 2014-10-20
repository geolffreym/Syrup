Syrup
=======

Give your JS App MVC | MTV pattern with Models, Views, Controllers, Templates, Events, Connections, Real Time Communications, etc...


Description
===========
Scalable? Yes.

**MVC Pattern:**
 - Model
 - View
 - Controller
 
**MTV Pattern:**
 - Model
 - View
 - Template

Concepts
--------

**Loose coupling:**

 *Allows you tu make changes to one module without affecting the others*
 
**Module:**

 *Everything is a module*
 
 *An independently operable unit that is part of the total structure of a space vehicle*


**Architecture:**
    
    Base Library -> Application -> Sandbox -> Module
                                           -> Module
                                           -> Module


**Application:**
 
 *Each part of the architecture is like a puzzle piece*
  
  **Sandbox:**
  
  *Module must stay within their own sandboxes*
    
      Rules:
        - Only call your own methods or those on the syrup_object || _$ object
        - Do not access DOM elements outside of your box
       
       Ask:
        - Anything you need, ask the syrup_object or _$ object

       Strangers:
        - Do not directly reference other modules
       
   
```js

/*Module Login
*@param _ {Syrup object}
*@param _$ {$ object}
*@param scope {object}
*/
var my_module = Module.blend('my_module', []); 
my_module.recipe('my_module', function( _, _$, scope ){
    return {
            //Constructor needed
            init: function(){
                //What to do?
            },

            destroy: function(){
                //What to do?
            }
        }
    })
})

```


**Libs:**

```js

//Defining lib my_lib

//Register Lib
var my_lib = Lib.blend('my_lib', [])
my_lib.make(function(){
    return {
        //Attributes
    }

}) //Constructor


my_lib.supply(function(){
    return {
        //methods
    }
})


```

**Binding random**
```js

function myClass(){
    //code
}
Syrup.blend(myClass);
```

Compatibility with browsers
=======
    
    -IE > 9
    -Chrome > 32
    -Firefox > 28
    -Opera 23 >
    -Safari 6 >


Controlling browsers support.

```js
if(_.nav.unsupported){
    //What to do?
}
```
*If there is any browser incompatibility please notify*


Basic Config
=======

Nav Status
----------
See my browser status

```js
console.log(_.nav);
/*object nav {
    unsupported : true || false; //If the navigator support the framework
    cookies : false || true //Cookies enabled? 
    javascript : false || true //Javascript Enabled?
    online : true || false // Site online ?
    local : String // My local browser complete details;
}*/

```

Config
------
Configuration is very simple, you just have to access the folder /config/ and edit the file init.js 

In init.js need to set the processor ajax either PHP or whatever fence to process your request, if your system does not need a format, just leave it blank. 
You need to set the APP_PATH, is who is responsible for setting the relative directory of your application, the default is '/' and finally the environment, which can be either development or production.

*Example APP_PATH: (/assets/)*  

  
Joining files
-------------

**Node JS Required**

blend files is relatively simple, you must first establish the libraries you want to use in environment.

Syrup Is modular so you can create your own libraries and integrate the autoloader

```js
//Development
 exports.files = {
        js: {
            output: 'app/include/init', //The output default base/include/init
            src: [
                'app/config/init', // Needed do not change
                'system/base/init', // Needed do not change
                'system/base/model/App', // Needed do not change
                'my_own_lib_dir/my_lib',
//              'lib/Form',
//              'lib/Upload' // Add all the necessary scripts for startup
            ]

        }
    }
```

Then you must get packages with `npm install` and finally run `npm start` and you'll have a unified library and .min in folder /app/include/

*If you do not have the option of using node, you must manually change the settings in the /app/include/init.js and include libs separately*


Including Scripts
================

*You should not use the controllers on the unification of files, it is necessary to have separate it for each application*

```html    
<script src="YOUR PATH/Syrup/app/include/init.min.js"></script>
<script src="YOUR PATH/Syrup/controller/YOUR CONTROLLER.min.js"></script>
```
When you need to add libraries to your drivers that were not pre-compiled in the unification, you can call them using the _.include method, as explained later use.

DOM Tools
=======
**Avoid conflicts**

```js
var _alias = _$.noConflict();

//Using function

(function(alias){
    alias('<div></div>');
    alias('.selector');
})(_$)

```

**Creating a $ object**

*This method helps you find Nodes objects and generate $ object*

```js
var my_selector = _$('<div></div>');
var my_selector = _$('.selector');
var my_selector = _$('.selector:pseudo'); //Pseudo codes must follow the CSS syntax
var my_selector = _$('.selector_parent .selector_child');
var my_selector = _$('#selector');

//Example Selector All:
var my_selector = _$('.selector+'); //Get all .selector in DOM
```
    
*You can try many possibilities to find and get dom elements*

*Now we can use it.*

**Attribute `exist`**

*(Verify Node element existence)*
```js
var my_selector = _$('.dom_to_verify');
if(my_selector.exist){
    //TRUE if my_selector exist in DOM tree
}
```
   
**Method `.object()`**

*(Return $ object)*
```js    
var my_selector = _$('.$_to_get');

my_selector.object(); //Return $ object
```

**Method `.ready()`**

*(Used for the execution of our code, when the Document Object ready)*
```js    
var my_selector = _$(document);

//The selector must be a document object
my_selector.ready(function(){
    /* My code */
}); 
``` 
   
**Method `.load()`**

*(Used for the execution of our code, when the the complete page is fully loaded)*
```js    
var my_selector = _$(window);

//The selector must be a window object
my_selector.load(function(){
    /* My code */
});
```    

**Method `.filter(filter, callback, e_handler(optional))`**

*(Filter pattern match)*
```js
var my_selector = _$('.selector');

my_selector.children(function(child){
    _$(child).filter('.child_1', function(){

        /*Is .child_1 inside .selector ?*/
        
    },function(){
        /*Not founded*/
    })
})
```    
   
**Method `.empty(void)`**

*(Empty Node Object)*
```js
var my_selector = _$('.selector');

my_selector.empty(); // Node Empty
```   
   
**Method `.clone(bool)`**

*(Clone Object. Optional clone child's object)*
```js
var my_selector = _$('.selector'),
    _clone_with_child,
    _clone_not_child;

_clone_with_child = my_selector.clone(true); //Clone Childs
_clone_not_child = my_selector.clone();
```    
    
**Method `.data(data_name, data_value)`**

*(Data Object. If data_value is passed, it assigned to object, else it returned )*

```html
<button id="my_button" data-id="5"></button>
```
```js
var my_selector = _$('#my_button');

my_selector.data('id'); // Returns 5
my_selector.data('id', 10); // Assign 10. 
```
```html
//RESULT OF ASSIGN
<button id="my_button" data-id="10"></button>
```    
    
**Method `.prop(prop_value)`**

*(Prop Object. If prop_value object type is passed, it assigned, else if prop_value is string type, then value is returned)*

```html
<button id="my_button">My Example</button>
```
```js
var my_selector = _$('#my_button');

my_selector.prop('textContent'); // Returns My Example
my_selector.data({'textContent': My Other Example}); // Assign My Other Example. 
```
```html
<button id="my_button">My Other Example</button>
```

**Method `.attr(attr_value)`**

*(Attr Object. If attr_value object type is passed, it assigned, else if attr_value is string type, then value is returned)*
```html
<a href="http://out.com">My Link</a>
```
```js
var my_selector = _$('a');

my_selector.attr('href'); // Returns http://out.com
my_selector.attr({'href': 'http://inner.com'}); // Assign http://inner.com. 
```
```html
<a href="http://inner.com">My Link</a>
``` 

**Method `.removeAttr(attr_name)`**

*(Remove Attr from Object. Attr_name needed )*

```html
<a href="http://out.com">My Link</a>
```
```js
var my_selector = _$('a');

my_selector.removeAttr('href'); // Remove href
```
```html
<a>My Link</a>
```

**Method `.css(object | style_name)`**

*(CSS Object. If style_value object type is passed, it assigned, else if css_value is string type, then value is returned)*

```html
<div style="border:none; background-color:#ccc;"></div>
```
```js
var my_selector = _$('div');

my_selector.css('background-color'); // Returns #ccc
my_selector.css({'color': '#666'}); // Assign color:#666 
```
```html    
<div style="border:none; background-color:#ccc; color:#666;"></div>
```

**Method `.after(html || _$ Object)`**

*(Insert Node object after element)*

```js
var my_selector = _$('.first_div'),
    second_div = _$('.second_div');

my_selector.after(second_div);
second_div.after('<div class="third_div"></div>');
```
    
**Method `.before(html || _$ Object)`**

*(Insert Node object before element)*
```js
var my_selector = _$('.third_div'),
    second_div = _$('.second_div');

my_selector.before(second_div);
second_div.before('<div class="first_div"></div>');
```    
    
**Method `.append(html || _$ Object)`**

*(Append Node object)*

```js 
var my_selector = _$('.third_div'),
    second_div = _$('.second_div');

my_selector.append(second_div);
my_selector.append('<div class="first_div"></div>');
```

**Method `.html(html)`**

*(Create HTML in Node object. If html is passed is assigned else is returned)*

```js  
var my_selector = _$('div');

my_selector.html('<div></div>');
my_selector.html('Text'); // Replace div
my_selector.html(); //Return "Text" 
```
    
**Method `.text(text)`**

*(Create Text in Node object. If text is passed is assigned else is returned)*

```js  
var my_selector = _$('div');

my_selector.text('Text'); //Text node created
my_selector.text(); //Return Text
```
    
**Method `.val(text)`**

*(Assign value in Node object. If value is passed is assigned else is returned)*
```html
<input type="text" value="">
```
```js
var my_selector = _$('input[type="text"]');

my_selector.val('My value'); //Value assigned
my_selector.val(); //Return My value
```
```html
<input type="text" value="My value">
```

**Method `.hide(void)`**

*(Hide Node Object)*

```js
var my_selector = _$('div');

my_selector.hide(); //Element display none
```

**Method `.show(void)`**

*(Show Node Object)*

```js
var my_selector = _$('div');

my_selector.show(); //Element display block
```
**Method `.parent(callback)`**

*(Get Node Parent first. Callback Needed)*
```html
<div class="parent">
    <div class="child"></div>
</div>
```
```js
var my_selector = _$('.child');

my_selector.parent(function(parent){
    _$(parent) // Object class parent
}); 
```    
    
**Method `.parents(parent_class, callback)`**

*(Get Node Parent Until. Parent_class and Callback Needed)*

```html
<div class="parent">
    <div class="child">
        <div class="grandson"></div>
    </div>
</div>
```
```js    
var my_selector = _$('.grandson');

my_selector.parents('.parent', function(parent){
    _$(parent) // Object class parent
});
 ```
    
**Method `.children(callback)`**

*(Get Child Nodes. Callback Needed)*
```html
<div class="parent">
    <div class="child"></div>
</div>
```
```js    
var my_selector = _$('.parent');

my_selector.parent(function(child){
    _$(child) // Object class child
});
```
    
    
**Method `.next(callback)`**

*(Get next sibling Node. Callback Needed)*

```html
<div class="parent">
    <div class="child_1"></div>
    <div class="child_2"></div>
</div>
```
```js
var my_selector = _$('child_1');

my_selector.next(function(sibling){
    _$(sibling) // Object class child_2
});
```
       
**Method `.nexts(filter, callback)`**

*(Get next sibling Node. Callback Needed, if filter is passed the child are matched else return all)*

```html
<div class="parent">
    <div class="child_1"></div>
    <div class="child_2"></div>
    <div class="child_2"></div>
    <div class="child_3"></div>
</div>
```
```js    
var my_selector = _$('child_1');

my_selector.nexts('.child_2', function(siblings){
     // Object list class child_2
}); 

 my_selector.nexts(function(siblings){
         // Object list child_2, child_2, child_3 
         // All nexts nodes returned
    }); 
```
    
**Method `.find(filter, callback)`**

*(Get next sibling Node. Filter and Callback Needed)*

```html
<div class="parent">
    <div class="child_1"></div>
    <div class="child_2"></div>
    <div class="child_2"></div>
    <div class="need_be_found"></div>
</div>
```
```js
var my_selector = _$('parent');

my_selector.find('.need_be_found', function(found){
      _$(found) // Object class need_be_found is inside .parent?
});
```
    
**Method `.hasClass(elem, class)`**

*(Verify Class in element. Return true if the class is founded in element else return false)*
```js
var my_selector = _$('.div');
if(_.hasClass(my_selector,'class2')){
    //TRUE IF .div has the class2
}
```
   
**Method `.addClass(class)`**

*(Add a new class to an element)*
```js
var my_selector = _$('.div');

my_selector.addClass('div2') // Add the class div2 to .div
```
```html
//RESULT
<div class="div div2"></div>
```
   
**Method `.toggleClass(class)`**

*(Toggle class in element)*
```js
var my_selector = _$('.div');
    
my_selector.toggleClass('div') // If have the class its removed else is added
```

**Method `.removeClass(class)`**

*(Remove class from element)*
```js
var my_selector = _$('.div');

my_selector.removeClass('div') // If have the class its removed
```
```html
<div></div>
```    
    
**Method `.fadeOut(mseconds)`**

*(Fade Out element. If mseconds is passed it used for time fade else default is 50)*
```js
var my_selector = _$('.div');

my_selector.fadeOut(100)
```

**Method `.fadeIn(mseconds)`**

*(Fade In element. If mseconds is passed it used for time fade else default is 50)*
```js
var my_selector = _$('.div');

my_selector.fadeIn(100)
```

**Method `.width(int)`**

*(Assign or return width of element. If int value is passed its assigned to element else return the width )*
```js
var my_selector = _$('.div');

my_selector.width(100) // Assign 100 to width
my_selector.width() // Return width
```
    
**Method `.height(int)`**

*(Assign or return height of element. If int value is passed its assigned to element else return the height )*
```js
var my_selector = _$('.div');

my_selector.height(100) // Assign 100 to height
my_selector.height() // Return height
```

**Method `.is(class|pseudo-class|prop)`**

*(Verify element. Para needed )*
```js
var my_selector = _$('.div');

if(my_selector.is('.div')){
     //TRUE IF my_selector is .div
}
```   
 
**Method `.get(element)`**

*(Return child element. Param element needed)*
    
```html
<div class="parent">
        <div class="child">
            <div class="grandson"></div>
        </div>
</div>
```
```js
var my_selector = _$('.parent');

my_selector.get('.child') // Return .child
```

**Method `.each(callback)`**

*(Loop childs of element. Param callback needed)*
    
```html
<div class="parent">
    <div class="child"></div>
    <div class="child2"></div>
</div>
```
```js    
var my_selector = _$('.parent');

my_selector.each(function(v,i,p){
    v // Element
    i // Index
    p // Loop Control { p.last or p.first}
    
    v (.child)
    i (0)
    p (p.first is TRUE)
    
    v (.child2)
    i (1)
    p (p.first is FALSE and p.last is TRUE)
    
})
```

**Method `.offset(object)`**

*(Assign or return offset element. If object is passed its assigned to element else return the offset)*
```js
var my_selector = _$('.div');

my_selector.offset({x:10,y:10}) // Assign position x and y to element
my_selector.offset() // return {top:int,left:int,bottom:int,right:int}
```
 
**Method `.sort(prop(optional) , bool (optional), elem(optional))`**

*(Sort elements. If prop is passed is sorted by prop,if bool is true is order desc)*

```html
 <ul class="parent">
   <li>B</li>
   <li>A</li>
   <li>D</li>
   <li>C</li>
 </ul>
```
```js
var my_selector = _$('.parent li');

my_selector.sort() 
// Sort Element by default innerHtml prop, order asc and 
// return and array with ordered elements
```
```html
<ul class="parent">
   <li>A</li>
   <li>B</li>
   <li>C</li>
   <li>D</li>
</ul>
```
**Method `.trigger(event, callback)`**

*(Trigger Event. Event and Callback Needed)*
```js
var body = _$('body'),
my_selector = _$('.div');

my_select.addEventListener('click', function(){
    alert('I am clicked');
});

body.addEventListener('click', '.div', function(){
        alert('I am clicked as delegated');
});

body.addEventListener('click', '.div1', function(){
            alert('I am clicked as delegated in div1');
});   


my_selector.trigger('click'); // alert I am Clicked and I am clicked as delegated
_$('.div1').trigger('click') // alert I am clicked as delegated in div1
```
    

Events
--------------

**Method `.addListener(event, delegate(optional), callback)`**

*(Add event listener to object)*
```js
var body = _$('body'),
    my_selector = _$('.selector');
    
//Event delegation
body.addListener('click', '.selector', function(e){
    
    /*My Code*/
    
}).addListener('keydown','textarea', function(e){

    /*My Code*/
    
})

//Event assign
my_selector('click', function(e){
    
    /*My Code*/
    
})
```

**Method removeListener in dev**
    
Helpers
--------
    
**Method `.limitBoxInput(event Object, max_input_length)`**

*(Validate if input value length is less to max_input_length)*
```js    
_$('input[type="text"]').addListener('keydown', function(e){
    _.limitBoxInput(e,50); // If input times is greater than 50, the event is prevented   

    //Code
})
```      
      
**Method `.cartesianPlane($ Object || Object, all)`**

*(Return the cartesian plane object info. If param all is passed return all selector matches info)*
```js    
var my_selector = _$('input[type="text"]');

_.cartesianPlane(my_selector);
//  return {
               bottom: 565
               left: 0
               right: 346
               top: 0
               height: 565
               width: 366
           }
```

**Method `.getElementIndex(Node Object)`**

*(Return the index position in DOM tree)*
```js    
var my_selector = _$('input[type="text"]').object();

_.getElementIndex(my_selector);
//  return 5 assuming position
```

Syrup Methods
=======

Validation
--------------
**Method `.assert(param, msg)`**

*(Validate if a param is seted). param needed, msg default = Param needed*
```js    
function test (param){
_.assert(param,'Param is needed');
alert(param);
}

test(); //assert is executed
test('Param passed'); //assert is omitted
```      

**Method `.isArray(param)`**

*(Validate if param is Array)*
```js    
var no_array = 'I am not Array', 
 my_array = [1,2,3];
 
_.isArray(no_array) // Return FALSE
_.isArray(my_array) // Return TRUE
```

**Method `.isObject(param)`**

*(Validate if param is Object)*
```js    
var no_object = 'I am not Object', 
 my_object = {a:1,b:2,c:3};
 
_.isObject(no_object) // Return FALSE
_.isObject(my_object) // Return TRUE    
```
  
**Method `.isGlobal(param)`**

*(Validate if param is Global Node element. Example = Window || Document || ...)*
```js    
var no_global = _$('body').object() || document.body, 
 my_global = document;
 
_.isGlobal(no_global) // Return FALSE
_.isGlobal(my_global) // Return TRUE
```
        
**Method `.is$(param)`**

*(Validate if param is $ object.) *
```js    
var no_$ = document, 
 my_$ = _$('body');
 
_.is$(no_$) // Return FALSE
_.is$(my_$) // Return TRUE 
```
      
**Method `.isString(param)`**

*(Validate if param is String.)*
```js    
var no_string = document, 
 my_string = 'String example';
 
_.isString(no_string) // Return FALSE
_.isString(my_string) // Return TRUE
```
      
**Method `.isFunction(param)`**

*(Validate if param is Function.)*
```js    
var no_function = 'String example', 
 my_function = function(){
 
 };
 
_.isFunction(no_function) // Return FALSE
_.isFunction(my_function) // Return TRUE 
```
     
**Method `.isHtml(param)`**

*(Validate if param is Html.)*
```js    
var no_html = 'String example', 
 my_html = '<div>Hello!</div>';
 
_.isHtml(no_html) // Return FALSE
_.isHtml(my_html) // Return TRUE 
```
     
**Method `.isBoolean(param)`**

*(Validate if param is Boolean.)*
```js    
var no_bool = 'String example', 
 my_bool = TRUE';
 
_.isBoolean(no_bool) // Return FALSE
_.isBoolean(my_bool) // Return TRUE
```
     
**Method `.isRegexp(param)`**

*(Validate if param is Regexp.)*
```js    
var no_regexp = 'String example', 
 my_regexp = /[1-9]/g || new RegExp('[1-9]','g');
 
_.isRegexp(no_regexp) // Return FALSE
_.isRegexp(my_regexp) // Return TRUE
```     
     
**Method `.isSet(param)`**

*(Validate if param is set.)*
```js 
var no_set = undefined || NULL || FALSE, 
 my_set = 'Seted' || TRUE || ....;
 
_.isSet(no_set) // Return FALSE
_.isSet(my_set) // Return TRUE
```
     
**Method `.isEmpty(param)`**

*(Validate if param is empty.)*
```js    
var empty = '' || [] || ' ', 
 no_empty = [1,2,3,4] || 'Not Empty';
 
_.isEmpty(no_empty) // Return FALSE
_.isEmpty(empty) // Return TRUE
```
     
**Method `.isUrl(param)`**

*(Validate if param is URL.)*
```js    
var no_url = 'String Example', 
 my_url = 'http://google.com' || 'https://google.com';
 
_.isUrl(no_url) // Return FALSE
_.isUrl(my_url) // Return TRUE
```
     
**Method `.isMail(param)`**

*(Validate if param is mail.)*
```js
var no_email = 'String Example', 
 my_email = 'i_am_mail@gmail.com';
  
_.isMail(no_mail) // Return FALSE
_.isMail(my_mail) // Return TRUE
```

**Method `.isJson(param)`**

*(Validate if param is JSON.)*
```js 
var no_json = {a:1,b:2}, 
 my_json = '{"a":"1","b":"2"}';
  
_.isJson(no_json) // Return FALSE
_.isJson(my_json) // Return TRUE
```

**Method `.isNumber(param)`**

*(Validate if param is Number.)*
```js
var no_number = 'No Number', 
 my_number = '123' || 123;
  
_.isNumber(no_number) // Return FALSE
_.isNumber(my_number) // Return TRUE
```

Helpers
----------

**Method `.warning(msg)`**

*(Show console warning.)*
```js           
_.warning('Field Empty'); // 04:12:05 PM -> Field Empty
```
     
**Method `.error(msg)`**

*(Throw console error.)*
```js           
_.error('No param'); // 04:12:05 PM -> No param
```
  
**Method `.interval(callback, conf)`**

*(Set interval function based in thread process)*
```js           
var conf = {
              delay: 0x32, // Time to wait between each loop 
              limit: 0xA // max iterations if negative value is passed it is descendant
            }
_.interval(function (x) {
         x // each value since 0 to limit
     }, conf);
```
     
**Method `.each(object || array, callback)`**

*(Intuitive objects or tour arrangements)*
```js           
_.each([1,2,3], function(v,i,p){
    v // Element
    i // Index or Key
    p // Loop Control { p.last or p.first}
    
    v (1)
    i (0)
    p (p.first is TRUE)
    
    v (2)
    i (1)
    p (p.first is FALSE and p.last is FALSE)
    
    v (3)
    i (2)
    p (p.first is FALSE and p.last is TRUE)
})
```
**Method `.callbackAudit(callback, param1, param2, ..)`**

*(This verifies that the callback set, if so then runs it with the given parameters)*
```js    
var _my_callback = function(a,b){
    alert(a);
    alert(b);
}       
_.callbackAudit();//No callback, no execution and no errors throws, just omitted
_.callbackAudit(_my_callback, 1, 2);//Callback executed with 1 and 2 parameters 
```

**Method `.extend(target, source, overwrite)`**

*(Extend Object)*
```js    
var _my_target = {a:1,b:5},
    _my_source = {b:2,c:3};
    
_.extend(my_target, _my_source); //Return {a:1,b:5,c:3} not overwrite the target
_.extend(my_target, _my_source, TRUE); //Return {a:1,b:2,c:3}
```    

**Method `include(script, wait, callback)`**

*(Includes scripts in a controlled environment. Using de relative directory set in config)*
*Files must have the extension extension .min.js*
```js    

//FIRST SCENARIO
_.include('app/controller/my_script.js', function(){
    //my_script ready
})

//Again the same inclusion
//In this case the script is not obtained again only callback is executed
_.include('app/controller/my_script', function(){
       //my_script ready again
  })
  
  
//SECOND SCENARIO
//If another script which depends for its execution is necessary we can use wait
//In this case needed.js is called with wait

 _.include('system/lib/needed' or 'app/my_libs/lib');

 _.include('system/lib/i_need_needed_to_work', 'needed', function(){
           //i_need_needed_to_work.js is ready when needed.js is ready
            
            //Registered module _.my_module
                   var module = new _.my_module;
 })
``` 


Array Tools
------------

**Method `.compactArray(array)`**

*(Filter Null, FALSE or empty in array)*
```js    
var _my_array = [1,2,3,NULL,'',FALSE];

_.compactArray(_my_array); // [1,2,3];
```
    
**Method `.specArray(array)`**

*(Speculate Array)*
```js    
var _my_array = //Dinamic value can be [1,2,3] or [1]
   
_.specArray(_my_array); 
// if _my_array length > 1 return array else return first value
``` 
   
**Method `.filterArray(array,callback)`**

*(Filter Array)*
```js    
_.filterArray([1,2,3], function(v){
    return v % 2 === 0;
})
```
    
**Method `.matchInArray(regexp,haystack)`**

*(Verify existence of element in array using regexp)*
```js    
_.matchInArray(/happy/g,['help','up','happy']) // Return TRUE
``` 
   
**Method `.uniqueArray(array)`**

*(Return unique array, with not repeated values)*
```js    
_.uniqueArray([1,2,3,4,1,2]) // Return [1,2,3,4]
```
    
**Method `.toArray(String|Object)`**

*(Parse String or Object to Array)*
```js    
_.toArray('Hola') // Return ['H','o','l','a']
_.toArray({a:1,b:2,c:3}) // Return [1,2,3]
```
    
    
Object Tools
------------

**Method `.inObject(needle, haystack)`**

*(Verify existence of element in object)*

*Array is considered a native type inherited from Object, you can use an array as a parameter haystack*
```js    
_.inObject(5, {a:5,b:6}) //Return TRUE
```
    
**Method `.toObject(String|Array)`**

*(Parse String or Array to Object)*
```js    
_.toObject('Hola') // Return [0=>'H',1=>'o',2=>'l',3=>'a']
_.toObject(['H','o','l','a']) // Return [0=>'H',1=>'o',2=>'l',3=>'a']
```

**Method `.objectDistribute(Object, index)`**

*(Joins the elements of an object in a selected index)*
```js    
_.objectDistribute({a:'Hi',b:'What',c:'MyIndex'},'c') 
// Return {
    MyIndex:{
        a:'Hi',
        b:'What'
    }
}
```

**Method `.objectWatch(Object, callback)`**

*(Watch for object changes. If a change is made the callback is triggered)*
```js    
var obj = {a:'Hi',b:'What',c:'MyIndex'};

_.objectWatch(obj, function(changes){
    //obj has changed. What to do?
}) 

//Callback executed
obj.a = 'New'
```

**Method `.objectImmutable(Object)`**

*(Return a immutable object)*
```js    
var obj = {a:'Hi',b:'What',c:'MyIndex'};

_.objectImmutable(obj) 
```

String Tools
------------
    
**Method `.htmlEntities(str)`**

*(Reformat html to unicode from String)*
```js     
var _string = '<div>I am a html</div>'      

_.htmlEntities(_string); // &lt;div&gt;I am a html&lt;/div&gt;
``` 

**Method `.truncateString(str, limit)`**

*(Truncate string until limit)*
```js     
var _string = 'I need be truncated until here'      

_.truncateString(_string, 9); // 'I need be'
```
 
**Method `.replace(string, search, replace)`**

*(Replace search with new value)*
```js     
var _string = 'I need be truncated until here'      

_.replace(_string, 'truncated', 'happy'); // 'I need be happy until here' 
```     

**Method `.objectAsString(string, search, replace)`**
 
*(Return a object with the string type)*
```js  
var _my_object = {a:1,b:2c:3};    

_.objectAsString(_my_object); // Return [Object object]; 
```
  
**Method `.parseJsonUrl(object)`**
 
*(Return a URL query string)*
```js  
var _my_object = {a:1,b:2c:3};    

_.parseJsonUrl(_my_object); // Return a=1&b=2&c=3; 
```       

**Method `.repeatString(str, times)`**
 
*(Return repeated string)* 
```js  
_.repeatString('Happy!', 4); 
// Return Happy!Happy!Happy!Happy!;
```
     
Getters
----------

**Method `.getDate(date)`**

*(Returns the date on the parameter, if the parameter is not passed, it uses the current date )*
```js     
_.getDate(); 
//If today is 2014-05-12 08:25:02
//Return Example {
        day: 12,
        month: 'May',
        year: 2014,
        hour: 08,
        minutes: 25,
        seconds: 02
        meridian: PM || AM
        
    }
                    
_.getDate('2014-10-13 08:25:02'); 
// Param used
//Return Example {
         day: 13,
         month: 'October',
         year: 2014,
         hour: 08,
         minutes: 25,
         seconds: 02
         meridian: PM || AM
         
     }
```
     
**Method `.getNav()`**

*(Returns the used nav)*
```js     
_.getNav(); 
//Return Example {
        nav: 'Chrome',
        version: '32'
        platform: 'Linux x86_64',
    }
```
            
**Method `.getEncodedId(length(optional))`**

*(Returns a simple encoded id. If length is passed the code is truncated)*
```js     
_.getEncodedId(10); //aA25Gtsht6
```     

**Method `.getObjectKeys(object)`**

*(Returns object keys.)*
```js
var _my_object = {a:1,b:2,c:3};
_.getObjectKeys(_my_object); // Return [a,b,c]
```

**Method `.getObjectValues(object)`**

*(Returns object values.)*
```js
var _my_object = {a:1,b:2,c:3};
_.getObjectValues(_my_object); // Return [1,2,3]
```
     
**Method `.getObjectSize(object)`**

*(Returns the object size.)*
```js
var _my_object = {a:1,b:2,c:3};
_.getObjectSize(_my_object); // Return 3
```
     
**Method `.getCookie(name)`**

*(Returns cookies.)*
```js    
//Cookie my_cookie=asf58as52dsf84e5
//Cookie my_csrf=asdf584a2d48rwefr42

 _.getCookie('my_cookie'); // Return asf58as52dsf84e5
 _.getCookie('my_csrf'); // Return asdf584a2d48rwefr42
```
 
**Method `.getScript(url, callback)`**

*(Get local or remote script.)*
```js    
_.getScript('//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js', function(){
    //Script ready
});
```

Syrup Working
========

Controllers
-------------

Controllers are an intermediary between models and views which are classically responsible for two tasks: 
they both update the view when the model changes and update the model when the user manipulates the view.

*In B drivers are handled from a dedicated environment (application modules), not combined application*

*The Controllers are located in the folder "app/controller/module_name/init.js", and are called to our site with script tags right after call Syrup core*

*Example:*

*In this case the module name is index and contact respectively*
```html
<script src="YOUR PATH/Syrup/app/include/init.min.js"></script>
<script src="YOUR PATH/Syrup/app/controller/index/init.js"></script>
                              **OR IN CASE**
<script src="YOUR PATH/Syrup/app/controller/contact/init.js"></script>
```

```html
<div syrup-controller="bookList">
    <% for |i| in |info| %>
        {i.name}
    <% endfor %>
</div>

<button syrup-event="bookUsers">View</button>
```

Using modules
-------------

```js
 _$ ( function () {

    var libraryStore = Module.blend ( 'libraryStore', ['Ajax'] );
    
    //General service for modules
    libraryStore.service('console', function(){
        console.log("Here is the service");
    })

    libraryStore.recipe ( 'bookList', function ( _, _$, scope ) {
        return {
            init:    function (tools) {
                //Tools object with dependencies
                
                var _self = this;

                scope.bookList = {info: [
                    { name: 'Juan', lastname: 'Rodriguez'},
                    { name: 'Pedro', lastname: 'Martinez'}
                ]};

                //When bookList change
                _self.on ( 'change', function ( changes ) {
                    _self.serve (); // Getting view
                    
                    tools.console();
                } );

            },
            destroy: function () {
                //What to do?
            }
        };
    } );


    libraryStore.recipe ( 'bookUsers', function ( _, _$, scope ) {
        return {
            init:    function (tools) {

                //Changing bookList. This notify to booklist for a new change
                scope.bookList = {info: [
                    { name: 'Carlos', lastname: 'Rodriguez'},
                    { name: 'Pedro', lastname: 'Martinez'}
                ]};
                
                //When bookUsers change
                libraryStore.on ( 'change', 'bookUsers', function () {
                   //What to do?
                } );

            },
            destroy: function () {
                // libraryStore.stopWatch ( )
            }
        };
    } ).addEvent('click', {function || null}); 
    
    //Bind listener for syrup-event="bookUsers"
    //If function is passed it executes, else if not, init is executed, else if string name of function is passed, its executed
    
    libraryStore.taste ( 'bookList' );
});

```

Models
--------
                 
*Pending Documentation*


Views
--------

Views are a visual representation of models that present a filtered view of their current state. 
A view typically observes a model and is notified when the model changes, allowing the view to update itself accordingly. 
Design pattern literature commonly refers to views as 'dumb' given that their knowledge of models and controllers in an application is limited.

*In B views are handled from a dedicated environment (application modules), not combined application*

*The Views are located in the folder "app/views/module_name/init.js", and are called inside the controller*

*Example:*

```js

//Defining View
Template.add('bookList', function (data, callback) {
    var _self = this;
    _self.get('index/bookList', function (template) {
        if (_.isSet(callback)) {
            _self.parse(template, data, callback);
        }
    });
    
});


Using modules
-------------

_$ ( function () {
    var libraryStore = Module.blend ( 'libraryStore', [] );
    libraryStore.recipe ( 'bookList', function ( _, _$, scope ) {
        return {
            
            init:    function () {
                scope.info = [
                    { name: 'Juan', lastname: 'Rodriguez'},
                    { name: 'Pedro', lastname: 'Martinez'}
                ];

            },
            destroy: function () {
                //Destroy module. What to do?
            }
        };
    } );

} );

```  
Templates
-----------

In the context of JavaScript frameworks that support MVC/MV*, 
it is worth briefly discussing JavaScript templating and its relationship to views as we briefly touched upon it in the last section.

*In Syrup templates are handled from a dedicated environment (application modules), not combined application*

*The Templates are located in the folder "app/templates/module_name/tpl_name.html", and are called inside the controller*

*Example:*

```html
<!--Creating Template /templates/libraryStore/bookList.html -->
<div class="books_info">
    <table>
        <tr>
            <th>Books Info</th>
        </tr>
        <% (for |data| in |info|) %>
            <tr>
                <td>
                    <div><strong>Name:</strong> <span>{data.name}</span></div>
                    <div><strong>Lastname:</strong> <span>{data.lastname}</span></div>
                </td>
            </tr>
        <% endfor %>
    </table>
</div>

```

```js

//Defining View /view/libraryStore/init.js
Template.add('bookList', function (data, callback) {
    var _self = this;
    _self.get('libraryStore/bookList', function (template) {
        if (_.isSet(callback)) {
            _self.parse(template, data, callback);
        }
    });
});


Simple way
----------

//The Controller /controller/libraryStore/init.js
_$(document).ready(function(){

    var template = new _.Template,
        data = {info : [
                    { name : 'Juan', lastname : 'Rodriguez'},
                    { name : 'Pedro',lastname : 'Martinez'} 
               ]}; // Data used in the view
        
        
    _.include('app/view/libraryStore/init', function(data){
         template.bookList(data, function(my_html){
                //The parsed Template my_html
                _$('.my_container').html(my_html);
                
          })
    })    
   
    
    //My code
})


Using modules
-------------
//The Controller /controller/libraryStore/init.js
 _$ ( function () {
    var libraryStore = Module.blend ( 'libraryStore', [] );
    libraryStore.recipe ( 'bookList', function ( _, _$, scope ) {
        return {
            init:    function () {

                scope.info = [
                    { name: 'Juan', lastname: 'Rodriguez'},
                    { name: 'Pedro', lastname: 'Martinez'}
                ];

            },
            destroy: function () {
                //Destroy module. What to do?
            }
        };
    } );

} );



```

Syrup Libs
========

Form
-------
The Form library allows rapid processing of forms, with simple and efficient methods.

```html
<form id="my_form">
    
    <!-- If value is empty throw error "empty"-->
    <label for="my_name">Name</label>
    <input type="text" name="name" id="my_name" />
    
    <!-- If value is not valid mail throw error "invalid_mail"-->
    <label for="my_email">Email</label>
    <input type="text" name="email" id="my_email" data-email="true" />
    
    <!-- If value not match with custom throw error "invalid_custom"-->
    <label for="my_phone">Phone</label>
    <input type="text" name="phone" id="my_phone" data-custom="/[0-9]-[0-5]/g" />
    
    <!-- If value is higher to max throw error "overflow_chars"-->
    <label for="my_code">Code</label>
    <input type="text" name="code" id="my_code" data-max="8" />
    
    <!-- Skip validation-->
    <label for="my_zip">Zip-Code</label>
    <input type="text" name="zip" id="my_zip" data-skip="true" />
          
</form>
```
```js

_$(document).ready(function(){
    
    //Include is used if the library is not in the precompiled library 
    //else just instance the class
    
    _.include('setting/lib/Form', function(){

        var my_form = new _.Form;
        
        my_form.on('before', function(XHR){
            //Event executed before send data
        });
        
        my_form.on('complete', function(ajax_response){
             //Event executed on request completed
        });
        
        my_form.on('error', function(error){
             //Event executed on error
             
             error object {
                field: field, // the input that generated the error
                error: error, // the error string (invalid_mail, invalid_custom,..)
                coords: {x:100,y:200} // the position of the input that generated the error
             }
        });
        
        
        _$('#my_form').addListener('submit', function(e){
                my_form.method('POST'); // Set method
                my_form.action('/contact/'); // Set url for Ajax Request
                my_form.pack(e.target); // Pack the input values
                my_form.attach('my_key','my_value'); // Attach additional data to request
                my_form.submit(e) // Submit auto prevent default event
        })

    });

});
```

Ajax
-----
The Ajax library provides simple tools for the execution of asynchronous requests to our application.

```js
//Assuming Ajax lib is in the precompiled library
//Else include the lib with _.include('setting/lib/Ajax')

var _ajax = new _.Ajax,
    _config_object;

_ajax.on('error', function(error_object){
    //If error what to do?
});

_ajax.on('complete', function(XHR){
    //If the request is complete regardless of whether 
    //it was successful or not what to do?
});

_ajax.on('abort', function(XHR){
    //If request aborted what to do?
});

_ajax.on('state', function(readyState,XHR){
    //readyState 
    //UNSENT = 0
    //OPENED = 1
    //HEADERS_RECEIVED = 2
    //LOADING = 3
    //DONE = 4
    
    //If request state change what to do?
});

//Used in the file upload control progress or request
_ajax.on('progress', function(progress_object){
    /*progress_object
    {
        lengthComputable : value
        total: value
        loaded : value
    }*/
})

_ajax.on('timeout', function(XHR){
    //If request timeout what to do?
})

//Requesting Ajax

**Needed in config**
 - url 

config_object = {
 url: '/user/create', 
    // Url to request. No need to use the extension, 
    //if it was already set to /config/init 
 method: 'POST', 
    // Default GET
 data: {name:'Carl',id:'3'}, 
    //Data to send in request. Default {}
 dataType: 'application/json'. Data MIME,
 processor: '.php', 
    //Overwrite ajax_processor in config/init
 token: 'my_token', 
    //Token for request, cookie name for token autoloader. 
    //Default 'csrftoken' assuming exist it.
 timeout: 3000, 
    //Default 4000
 
}

/*
The default header to request is 'application/x-www-form-urlencoded;charset=utf-8'.
If you need the browser automatically get the request header, as in the case of 
needing to process object FormData
Use dataType: 'auto' 
*/

//Additional Headers
_ajax.requestHeader('HEADER', 'VALUE');

//Killing request
_ajax.kill(); // Event abort triggered

//Request
_ajax.request(config_object, function(ajax_response){
    //Callback for success
    //Do something
})

```

*Pending Documentation*
