

class ASTElement{
    constructor(name, attr, parent){
        this.name = name;
        this.attr = attr;
        this.parent =parent || this;
    }


    setText(text){
        var text = this._miniValue(text);
        text && (this.text = text);
    }

    _miniValue(str){
        return str && str.replace(/\s+/g,'');
    }
}


module.exports = class AST{
    constructor(tag, attr){
        this.current = new ASTElement(tag, attr);
        this.root = this.current;
    }
    
    leave(){
        var parent = this.current.parent;
        this.current.parent = undefined;
        this.current = parent;
    }

    setText(text){
        this.current.setText(text);
    }

    toString(){
        this.current = undefined;
        return JSON.stringify(this.root);
    }

    addChild(name, attr){
        var element = new ASTElement(name, attr, this.current);
        this.current.childs 
            ? this.current.childs.push(element)
            : this.current.childs = [element];
        
        this.current = element;
    }
}