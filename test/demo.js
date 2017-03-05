const HtmlScanner =new require('../');
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