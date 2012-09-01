// My own implementation of a Mootools modal dialog box for asp.net pages.
// Replaces the asp.net javascript postback href with 'javascript:void(0)' and does a postback with the result from the dialog box.

var IE6 = Browser.IE6, MyDialog = new Class({
			Implements : [Options, Events],
			Binds : ["position", "closedialog"],
			options : {
				isOpen : !1,
				showModal : !0,
				title : "",
				content : "",
				postBack : "#",
				resultContainer : null,
				buttons : [],
				styles : {
					background : "#454545",
					border : "solid 4px #aaa",
					"border-radius" : ".5em",
					"box-shadow" : "0 1em 1em rgba(0,0,0,.4)",
					color : "#fff",
					"font-size" : "1.1em",
					width : "300px",
					opacity : "0",
					padding : "1.5em",
					position : IE6 ? "absolute" : "fixed",
					"z-index" : "9999",
					"-ms-border-radius" : ".5em",
					"-ms-box-shadow" : "0 1em 1em rgba(0,0,0,.4)",
					"-moz-border-radius" : ".5em",
					"-moz-box-shadow" : "0 1em 1em rgba(0,0,0,.4)",
					"-webkit-border-radius" : ".5em",
					"-webkit-box-shadow" : "0 1em 1em rgba(0,0,0,.4)",
					filter : "progid:DXImageTransform.Microsoft.Shadow(color=#333333,direction=135,strength=5)"
				}
			},
			initialize : function (a) {
				this.setOptions(a);
				this.options.isOpen || this.render(this)
			},
			render : function (a) {
				this.myMask = new Element("div", {
							id : "myMask",
							styles : {
								background : "#000",
								height : "100%",
								left : "0",
								opacity : "0",
								position : IE6 ? "absolute" : "fixed",
								top : "0",
								width : "100%",
								"z-index" : "9998"
							},
							events : {
								click : function (c) {
									c.stop();
									a.closedialog(!1)
								}
							}
						});
				$(document.body).grab(this.myMask);
				this.dialog = new Element("div", {
							id : "dialog",
							title : this.options.title,
							html : '<h4 id="dialogtitle" style="clear:both;color:#eb9d31;font-size:1.2em;margin:.6em 0;text-align:center">' + this.options.title + '</h4><p id="dialogcontent">' + this.options.content + "</p>",
							styles : this.options.styles
						});
				this.dclose = (new Element("img", {
							id : 'dialogclose"',
							src : "http://img1.call2call.co.uk/close.png",
							alt : "cancel",
							styles : {
								cursor : "pointer",
								display : "inline",
								"float" : "right",
								margin : "-1em -1em 0 0"
							},
							events : {
								click : function (c) {
									c.stop();
									a.closedialog(!1)
								}
							}
						})).inject(this.dialog, "top");
				if (this.options.buttons.length) {
					this.btns = new Element("div", {
								id : "dialogbtns",
								styles : {
									clear : "both",
									margin : "1em 0",
									"text-align" : "center",
									width : "100%"
								}
							});
					for (b in this.options.buttons)
						if (this.options.buttons.hasOwnProperty(b))
							this.btnsAdd = new Element("span", {
										id : this.options.buttons[b].text,
										title : this.options.buttons[b].title,
										html : this.options.buttons[b].text,
										styles : {
											background : this.options.buttons[b].background,
											"border-radius" : ".3em",
											color : "#fff",
											cursor : "pointer",
											display : "inline-block",
											height : "30px",
											"line-height" : "30px",
											margin : "0 .5em",
											"text-align" : "center",
											padding : ".2em",
											width : "80px",
											"-ms-border-radius" : ".2em",
											"-moz-border-radius" : ".2em",
											"-webkit-border-radius" : ".2em",
											"-khtml-border-radius" : ".2em"
										},
										events : {
											click : function (c) {
												c.stop();
												a.closedialog(!1)
											}
										}
									}), this.options.buttons[b].action ? this.btnsAdd.addEvent("click", function (c) {
									c.stop();
									a.closedialog(!0)
								}) : this.btnsAdd.addEvent("click", function (c) {
									c.stop();
									a.closedialog(!1)
								}), this.btnsAdd.inject(this.btns, "bottom");
					this.btns.inject(this.dialog, "bottom")
				}
				$(document.body).grab(this.dialog);
				return this
			},
			position : function () {
				var a = window.getSize(),
				c = window.getScroll(),
				d = this.dialog.getSize();
				this.dialog.setStyles({
						left : a.x / 2 - d.x / 2 + (IE6 ? c.x : 0),
						top : a.y / 2 - d.y / 2 + (IE6 ? c.y : 0)
					});
				IE6 && this.myMask.setStyles({
						height : a.y,
						left : c.x,
						top : c.y,
						width : a.x
					});
				return this
			},
			show : function () {
				this.position();
				window.addEvents({
						resize : this.position,
						scroll : this.position
					});
				this.myMask.set("tween", {
						duration : 300
					}).fade(".4");
				this.dialog.set("tween", {
						duration : 400
					}).fade("in");
				this.setOptions({
						isOpen : !0
					});
				return this
			},
			closedialog : function (a) {
				this.setOptions({
						isOpen : !1
					});
				this.myMask.set("tween", {
						duration : 400
					}).fade("out");
				this.dialog.set("tween", {
						duration : 300
					}).fade("out");
				a && (this.options.resultContainer.set("value", "yes"), (new Function(this.options.postBack))());
				return this
			}
		})

// Implementation:
// Adds click event to elements with class ending 'showdialog' e.g. class="showdialog".
// Puts result of closedialog function into resultContainer - the element with id ending 'dialogresult' e.g. id="ctl00_cph_main_dialogresult".
// Using selectors where id or class ends with the string allows for the use of Master pages or not.

window.addEvent("domready", function () {
		$$("[class$=showdialog]") && $$("[class$=showdialog]").each(function (a) {
				var c = a.get("title"),
				d = a.get("rel"),
				e = a.get("href"),
				f = new MyDialog({
							title : c,
							content : d,
							postBack : e,
							resultContainer : $$("[id$=dialogresult]")[0],
							buttons : [{
									text : "yes",
									title : "confirm action",
									background : "#2f8d34",
									action : !0
								}, {
									text : "no",
									title : "cancel action",
									background : "#DB4A37",
									action : !1
								}
							]
						});
				a.set("href", "javascript: void(0);");
				a.removeEvent("click").addEvent("click", function () {
						f.options.isOpen || f.show()
					})
			})
	});