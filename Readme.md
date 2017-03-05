# html-scanner
HTML Parser in JS for Node and Browsers.


## Usage

```javascript
const HtmlScanner =new require('html-scanner');
const  instance =new HtmlScanner();
const result = instance.parse(`
         <div id="idstr" >
                <ul class="haha">
                    <li @if="isShow">123</li>
                    <li>456</li>
                </ul>
            </div>
`);
 console.log(instance.AST.toString());
/*
{
    "name": "div", 
    "attr": {
        "id": "idstr"
    }, 
    "childs": [
        {
            "name": "ul", 
            "attr": {
                "class": "haha"
            }, 
            "childs": [
                {
                    "name": "li", 
                    "attr": {
                        "@if": "isShow"
                    }, 
                    "text": "123"
                }, 
                {
                    "name": "li", 
                    "text": "456"
                }
            ]
        }
    ]
}
*/
```
## Hooks

```javascript

instance.on('startTag', (sTagName, oAttrs)=>{
   
});

instance.on('endTag', (sTagName)=>{

});

instance.on('characters', (s)=>{

});
instance.on('comment', (s)=>{

});

```


