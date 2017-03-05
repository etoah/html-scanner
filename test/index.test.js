const HtmlScanner =new require('../');

describe('HtmlScanner', () => {

    it('should be parse attr', () => {
        var  instance =new HtmlScanner();
       var result = instance.parse(`<div id = "idstr" title = "这是个title">test</div>`);
        result.name.should.be.eql('div');
        result.attr.id.should.be.eql("idstr");
        result.attr.title.should.be.eql("这是个title");

    });

    it('should be parse nest tag', () => {
        var  instance =new HtmlScanner();
       var result = instance.parse(`
       <div>
            <div id='idstr' >
                <ul class="haha">
                    <li>123</li>
                    <li>456</li>
                </ul>
            </div>
            <ul class="hehe">
                    <li>567</li>
                    <li>987</li>
            </ul>
        </div>
       `)
        result.name.should.be.eql('div');
        result.childs[1].name.should.be.eql('ul');
        result.childs[1].attr.class.should.be.eql('hehe');
    });

     it('UTF8 should be ok', () => {
        var  instance =new HtmlScanner();
       var result = instance.parse(`
       <div>
            <div id='idstr' >
            你好
               <h1>编程</h1>
        </div>
       `)

        result.childs[0].text.should.be.eql('你好');
        result.childs[0].childs[0].text.should.be.eql('编程');
        result.childs[0].childs[0].name.should.be.eql('h1');
    });

     it('invisible  char  should be discard', () => {
        var  instance =new HtmlScanner();
       var result = instance.parse(`
       <div>
            abc     
                123
                       %^*
        </div>
       `)

        result.text.should.be.eql('abc123%^*');
    });
});