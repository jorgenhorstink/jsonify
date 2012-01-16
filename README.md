# Introduction

With jsonify you are able to convert a DOM Tree into a serialized JSON object by just
adding [HTML5 data attributes](http://ejohn.org/blog/html-5-data-attributes/) to your HTML. The current version is still very basic, but it covers the most parts I need to use at the moment.

## Data attributes

 - **data-jsonify-name**: Use the JavaScript dot-notation for the element
 - **data-jsonify-getter**: The name of a custom renderer, specified by the plugin getters-object.

## Example

    ```html
    <!DOCTYPE html>
    <html>
        <head>
            <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
        
            <script type="text/javascript" src="../src/jquery.jsonify-0.1.js"></script>
            <script type="text/javascript">
            
            (function ($, undefined) {
                $(function () {
                
                    // create a jsonify fruit getter plugin, it just returns the HTML converted to lowercase
                    $.jsonify({
                        getters : {
                            fruit : function () {
                                return this.html().toLowerCase();   
                            }
                        }
                    });
    
                    $('.submit').click(function () {
                        var object, json;

                        object = $('form').jsonify(), 
                        json = JSON.stringify(object, null, 4);
                    
                        alert(json);
                        
                        return false;
                    });
                });
            }(jQuery));
            
            </script>
        </head>
        <body>
        
            <form>
                <fieldset>
                    <legend>Person:</legend>
                
                    <label>Name:</label>
                    <input type="text" data-jsonify-name="person.name" value="Jorgen Horstink"><br>
                    
                    <label>City:</label>
                    <input type="text" data-jsonify-name="person.city" value="UTRECHT"><br>
    
                </fieldset>
                
                <fieldset>
                    <legend>Favorite food</legend>
                    
                    <label>Fruit:</label><br>
                    
                    <span data-jsonify-name="food.fruit[0].name" data-jsonify-getter="fruit">Orange</span>: 
                    <input type="checkbox" data-jsonify-name="food.fruit[0].value" value="yes"><br>
                    
                    <span data-jsonify-name="food.fruit[1].name" data-jsonify-getter="fruit">Banana</span>: 
                    <input type="checkbox" data-jsonify-name="food.fruit[1].value" value="yes"><br>
                    
                    <span data-jsonify-name="food.fruit[2].name" data-jsonify-getter="fruit">Strawberry</span>: 
                    <input type="checkbox" data-jsonify-name="food.fruit[2].value" value="yes"><br>
                    
                </fieldset>
    
                <button class="submit">Get the JSON object!</button>
    
            </form>
    
        </body>
    </html>
    ```
    
## Author

Jorgen Horstink (jorgenhorstink [at] gmail [dot] com)

## TODO

TBD

## Licence

TBD