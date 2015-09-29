About
=============

Compatibility with browsers
---------------------------
    
    -IE > 10
    -Chrome > 32
    -Firefox > 29
    -Opera > 23 
    -Safari >  7 


Controlling browsers support.

```js
if(_.nav.unsupported){
    //What to do?
}
```
*If there is any browser incompatibility please notify*


Installation
-----------

Using [Bower](http://bower.io/):

`bower install syrup`

Using [Git](http://git-scm.com/docs/git-clone):

`git clone https://github.com/geolffreym/Syrup.git` 


Config
------
Configuration is very simple, you just have to access the folder /config/ and edit the file init.js 

You need to set the APP_PATH, is who is responsible for setting the relative directory of your application, the default is '/' and finally the environment, which can be either development or production.

*Example APP_PATH: (/assets/)*  

  
Joining files
-------------

**Node JS Required**

Blend files is relatively simple, you must first establish the libraries you want to use in environment.

Syrup is modular so you can create your own libraries and integrate the autoloader

```js
//Development
 exports.files = {
        js: {
            output: 'dist/init', //The output
            src: [
                'app/config/init', // Needed do not change
                'system/base/init', // Needed do not change
//              'lib/Form',
//              'lib/Upload' // Add all the necessary scripts for startup
            ]

        }
    }
```

Then you must get packages with `npm install` and finally run `npm start` and you'll have a unified library and .min in folder /dist/

*If you do not have the option of using node, you must manually change the settings in the /dist/init.js and include libs separately*
