Native Features
==============

Object
------

**Method `{object}.clone()`**

*(Return a cloned object)*

```js

var obj = {a:3},
    cloned = obj.clone();
    

console.log(obj) // {a:3}
console.log(cloned) // {a:3} with another reference

```

**Method `{object}.getIndex(param)`**

*(Return a value of index in object)*

```js

var obj = {a:3},
    index = obj.getIndex('a');
    

console.log(obj) // {a:3}
console.log(index) // 3

```

Function
--------

**Method `{instance}.blend(instance)`**

*(It combines an instance of a "class" or function in javascript, with another instance, creating a kind of heritage)*

```js
function a () {
    this.dataA = 0;
}

function b (){
   this.dataB = 1;
}

console.log((new a).blend((new b))); // {a:{dataA: 0, __proto__: b: {dataB:1}}}


```

**Method `Function.factory(name)`**

*(Return a named Function)*

```js

var custom = Function.factory('myCustomFunction');

console.log(custom); // function myCustomFunction;

```

**Method `{function}.add(func_name, callback)`**

*(Append prototype methods to "class")*

```js

function myClass(){
    this.a = 0;
}

myClass.add('myMethod', function(){
    return this.a;
})

console.log((new myClass).myMethod()); // 0;

```


Nav Status
==========
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


DOM Tools
=======
**Avoid conflicts**

```js

//Returns a _$ object
var S = _.noConflict(),
    element = S('#my-element');

//Using function
(function(alias){
    alias('<div></div>');
    alias('.selector');
})(_$)

```

**Creating a Dom object**

*This method helps you find Nodes objects and generate dom object.*

```js

//You can try many possibilities to find and get dom elements

var my_selector = _$('<div>');
var my_selector = _$('*+'); // All the dom nodes ^_^
var my_selector = _$('.selector');
var my_selector = _$('.selector:pseudo'); //Pseudo codes must follow the CSS syntax
var my_selector = _$('.selector_parent .selector_child');
var my_selector = _$('#selector');

//Example Selector All:
var my_selector = _$('.selector+'); //Get all .selector in DOM
```

Open Closing
--------
*Open to extension, closed for modification*

**Attribute `.$fn` in Syrup**

*You also have the option of creating plugins using the object context using Syrup Core.*

```js

//My Plugin

_.$fn.add('hideOrShowAllPTags', function(params){

    //Reference to object
    //For each element 'a'
    
    this.each(function(v){
        _$(v).listen('hover', function(e){
            if (params.hide){
                _$('p').hide();
            } else {
                _$('p').show();
            }     
        })
    });
    
});


//Usage
_$('a').hideOrShowAllPTags({'hide':true})

```

Methods
--------

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

//Or Just
_$(function(){

})
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
my_selector.prop({'textContent': My Other Example}); // Assign My Other Example. 
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

**Method `.animate([{'prop':'init'},{'prop':'next'}...], {delay:int, duration: int, iterations:1} , callback)`**

*(Animate elements. If callback is passed in second parameters default conf is {delay:300, duration:1000, iterations:1} )*
```js
var my_selector = _$('.selector');

my_selector.animate ( [{opacity: '0'},{opacity: '1'}], {delay: 0, duration: 50}, 
                       function() {
                            //On finish?
                       }
                    );
            	               

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
    
**Method `.hasClass(class)`**

*(Verify Class in element. Return true if the class is founded in element else return false)*
```js
var my_selector = _$('.div');
if(my_selector.hasClass('class2')){
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

*(Return elemnt in position "element")*
    
```html
<ul>
        <li>A</li>
        <li>B</li>
        <li>C</li>
</ul>
```
```js
var my_selector = _$('li+');

my_selector.get(0) // Return <li>A</li>
my_selectot.get() // [<li>A</li>, <li>B</li>, <li>C</li>]
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

my_selector.each(function(v,i){
    v // Element
    i // Index
    this // Loop Control { this.last or this.first}
    
    v (.child)
    i (0)
    this (this.first is TRUE)
    
    v (.child2)
    i (1)
    this (this.first is FALSE and this.last is TRUE)
    
    //Break?
    //Loop break
    if(1==1){
        this.break = true;
    }
        
    
})
```

**Method `.offset(object)`**

*(Assign or return offset element. If object is passed its assigned to element else return the offset)*
```js
var my_selector = _$('.div');

my_selector.offset({top:10,;left:10}) // Assign position left and top to element
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
 
 <ul>
     <li sortby="4">A</li>
     <li sortby="2">D</li>
     <li sortby="1">B</li>
     <li sortby="3">C</li>
 </ul>
 
```
```js
var my_selector = _$('.parent li+'); //All li

my_selector.sort() 
// Sort Element by default innerHtml prop, order asc and 
// return and array with ordered elements

//Using custom sort
my_selector.sort('sortby')
```
```html

<!--Using innerHtml prop-->
<ul class="parent">
   <li>A</li>
   <li>B</li>
   <li>C</li>
   <li>D</li>
</ul>

<!--Using custom attribute-->
<ul>
    <li sortby="1">B</li>
    <li sortby="2">D</li>
    <li sortby="3">C</li>
    <li sortby="4">A</li>
</ul>

```
**Method `.trigger(event, callback)`**

*(Trigger Event. Event and Callback Needed)*
```js
var body = _$('body'),
my_selector = _$('.div');

my_select.listen('click', function(){
    alert('I am clicked');
});

body.listen('click', '.div', function(){
        alert('I am clicked as delegated');
});

body.listen('click', '.div1', function(){
            alert('I am clicked as delegated in div1');
});   


my_selector.trigger('click'); // alert I am Clicked and I am clicked as delegated
_$('.div1').trigger('click') // alert I am clicked as delegated in div1
```
    

Events
--------------

**Method `.listen(event, delegate(optional), callback)`**

*(Add event listener to object)*
```js
var body = _$('body'),
    my_selector = _$('.selector');
    
//Event delegation
body.listen('click', '.selector', function(e){
    
    /*My Code*/
    
}).listen('keydown','textarea', function(e){

    /*My Code*/
    
})

//Event assign
my_selector.listen('click', function(e){
    
    /*My Code*/
    
})
```

**Method `.listenOff(event)`**

*(Remove event listener to object)*
```js
var body = _$('body');

//Event assign
body.listen('click',  function(e){

    /*My Code*/

})

//Remove Event assign
body.listenOff('click')
```
    
Helpers
--------   
      
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
var my_selector = _$('input[type="text"]');

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

*(Validate if param is _$ object.) *
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
 my_bool = TRUE;
 
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
   
   
_.each([1,2,3], function(v,i){
    v // Element
    i // Index or Key
    this // Loop Control { p.last or p.first}
    
    v (1)
    i (0)
    this (this.first is TRUE)
    
    v (2)
    i (1)
    this (this.first is FALSE and this.last is FALSE)
    
    v (3)
    i (2)
    this (this.first is FALSE and this.last is TRUE)
    
    
    //Break?
    //Break the loop
    if(1==1){
        this.break = true;
    }    
    
})

```
**Method `.callbackAudit(callback, param1, param2, ..)`**

*(This verifies that the callback set, if so then runs it with the given parameters)*
```js    
var _my_callback = function(a,b){
    alert(a);
    alert(b);
}       
_.callbackAudit(null);//No callback, no execution and no errors throws, just omitted
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

**Method `.getRegExpGroup(string, regexp, groups)`**

*(Get named groups from regexp match)*
```js    
var _my_target = 'Hi Frank and Mary';

_.getRegExpGroup(_my_target,'Hi ([a-z]+) and ([a-z]+)' , ['a','b']) // {a:'Frank',b:'Mary'}
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
**Method `.replaceInArray(find, replace, haystack)`**

*(Replace the string elements in array)*
```js    
_.replaceInArray('a','b', ['a','b']) // Return ['b','b']
//Using regExp
_.replaceInArray(/a|b/,{a:'z',b:'n'}, ['a','b']) // Return ['z','n']
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
    
**Method `.toObject(String|Array, Array)`**

*(Parse String or Array to Object)*
```js    
_.toObject('Hola') // Return [0=>'H',1=>'o',2=>'l',3=>'a']
_.toObject(['H','o','l','a']) // Return [0=>'H',1=>'o',2=>'l',3=>'a']

//Mix arrays
_.toObject(['a','b'],[1,2]) // {a:1,b:2}

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

*(Watch for object changes. If a change is made the callback is triggered). Check Support*
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

**Method `.oChars(str,find)`**

*(Return 'find' occurrences in 'str')*
```js     
var _string = 'aaaaa'      

_.oChars(_string, 'a'); // 5
```
 
**Method `.replace(string, search, replace)`**

*(Replace search with new value)*
```js     
var _string = 'I need be truncated until here'      

//Simple string replace
_.replace(_string, 'truncated', 'happy'); // 'I need be happy until here' 

//Or using regexp
_.replace(_string, /truncated/, {'truncated': 'new_val'}); // 'I need be new_val until here'
```     

**Method `.objectAsString(string, search, replace)`**
 
*(Return a object with the string type)*
```js  
var _my_object = {a:1,b:2c:3};    

_.objectAsString(_my_object); // Return [Object object]; 
```
  
**Method `.jsonToQueryString(object)`**
 
*(Return a URL query string)*
```js  
var _my_object = {a:1,b:2c:3};    

_.jsonToQueryString(_my_object); // Return a=1&b=2&c=3; 
```

**Method `.queryStringToJson(object)`**
 
*(Return a object from query string)*
```js  
var _my_object = 'a=3&b=6';    

_.queryStringToJson(_my_object); // Return {a:3,b:6}; 

```

**Method `.jsonToString(object)`**

*(Parse object to string Shortcut for JSON.stringify)*
```js
var a = {a:1,b:2};
_.jsonToString(a); // '{"a":"1", "b":"2"}'
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

**Method `.requestAnimationFrame(callback)`**

*(Simple fallback. Gives the browser control over how many frames it renders..)*
```js    

 function render(time){
    console.log(time);
 }
 
 _$('body').listen('click','#startRender', function(){
        _.requestAnimationFrame(render);
 })
```