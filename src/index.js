

/*
  	this.contentHandler = {
		startTagHandler:   function (sTagName, oAttrs) {},
		onEndTagHandler:     function (sTagName) {},
		onCharactersHandler:		function (s) {},
		onCommentHandler:		function (s) {}
	}
*/
var AST = require('./AST');

const START_TAG_RE = /^<([^>\s\/]+)((\s+[^=>\s]+(\s*=\s*((\"[^"]*\")|(\'[^']*\')|[^>\s]+))?)*)\s*\/?\s*>/m;
const	END_TAG_RE = /^<\/([^>\s]+)[^>]*>/m;
const ATTR_RE = /([^=\s]+)(\s*=\s*((\"([^"]*)\")|(\'([^']*)\')|[^>\s]+))?/gm;

class SimpleHtmlParser
{
	constructor(){
		this.contentHandler = {
			startTagHandlers:   [],
			endTagHandlers:     [],
			charactersHandlers: [],
			commentHandlers:	[]
		}

		this.AST = false;
		this._initAST();
	}

	
	parse(s)
	{

		var i = 0;
		var res, lc, lm, rc, index;
		var treatAsChars = false;
		var oThis = this;
		while (s.length > 0)
		{
			// Comment
			if (s.substring(0, 4) == "<!--")
			{
				index = s.indexOf("-->");
				if (index != -1)
				{
					this.contentHandler.commentHandlers.map(f=>f(s.substring(4, index)));
					s = s.substring(index + 3);
					treatAsChars = false;
				}
				else
				{
					treatAsChars = true;
				}
			}

			// end tag
			else if (s.substring(0, 2) == "</")
			{
				if (END_TAG_RE.test(s))
				{
					lc = RegExp.leftContext;
					lm = RegExp.lastMatch;
					rc = RegExp.rightContext;

					lm.replace(END_TAG_RE, function ()
					{
						return oThis.parseEndTag.apply(oThis, arguments);
					});

					s = rc;
					treatAsChars = false;
				}
				else
				{
					treatAsChars = true;
				}
			}
			// start tag
			else if (s.charAt(0) == "<")
			{
				if (START_TAG_RE.test(s))
				{
					lc = RegExp.leftContext;
					lm = RegExp.lastMatch;
					rc = RegExp.rightContext;

					lm.replace(START_TAG_RE, function ()
					{
						return oThis.parseStartTag.apply(oThis, arguments);
					});

					s = rc;
					treatAsChars = false;
				}
				else
				{
					treatAsChars = true;
				}
			}

			if (treatAsChars)
			{
				index = s.indexOf("<");
				if (index == -1)
				{
					 this.contentHandler.charactersHandlers.map(f=>f(s));
					s = "";
				}
				else
				{
					this.contentHandler.charactersHandlers.map(f=>f(s.substring(0, index)));
					s = s.substring(index);
				}
			}

			treatAsChars = true;
		}

		return this.AST.root;
	}

	parseStartTag(sTag, sTagName, sRest)
	{
		var attrs = this.parseAttributes(sTagName, sRest);
		this.contentHandler.startTagHandlers.map(f=>f(sTagName, attrs));
	}

	parseEndTag(sTag, sTagName)
	{
		this.contentHandler.endTagHandlers.map(f=>f(sTagName));
	}

	parseAttributes(sTagName, s)
	{
		var oThis = this;
		var attrs = {};
		var has =false;
		s.replace(ATTR_RE, function (a0, a1, a2, a3, a4, a5, a6)
		{
			var a = oThis.parseAttribute(sTagName, a0, a1, a2, a3, a4, a5, a6);
			attrs[a.name] = a.value;
			has = true;
		});
		return has ? attrs : undefined;
	}

	parseAttribute(sTagName, sAttribute, sName)
	{
		var value = "";
		if (arguments[7])
			value = arguments[8];
		else if (arguments[5])
			value = arguments[6];
		else if (arguments[3])
			value = arguments[4];

		var empty = !value && !arguments[3];
		return {name: sName, value: empty ? null : value};
	}

	/**
	 * 
	 * 
	 * @param {string} type : comment, startTag, endTag, characters
	 * @param {function} handler
	 * 
	 * @memberOf SimpleHtmlParser
	 */
	on(type, handler){
		this.contentHandler[type+'Handlers'].push(handler);
	}

	_initAST(){
		this.on('startTag', (tagName, oAttrs)=>{
            this.AST?this.AST.addChild(tagName, oAttrs) : this.AST = new AST(tagName, oAttrs);
        });

        this.on('endTag', (tagName)=>{
            this.AST.leave();
        });

		this.on('characters', (s)=>{
			this.AST&&this.AST.setText(s);
        });
	}
}


module.exports = SimpleHtmlParser;