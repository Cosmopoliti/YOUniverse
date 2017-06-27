/*!
 * http://suyati.github.io/line-control
 * LineControl 1.1.0
 * Copyright (C) 2014, Suyati Technologies
 * This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 2 of the License, or (at your option) any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
You should have received a copy of the GNU General Public License along with this library; if not, write to the Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA
 *
*/

angular.module("myApp.Editor", ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/Editor', {
            templateUrl: 'texteditor/editor.html',
            controller: 'EditorCtrl',
            resolve: {
                // controller will not be loaded until $requireSignIn resolves
                // Auth refers to our $firebaseAuth wrapper in the factory below
                "currentAuth": ["Auth", function(Auth) {
                    // $requireSignIn returns a promise so the resolve waits for it to complete
                    // If the promise is rejected, it will throw a $routeChangeError (see above)
                    return Auth.$requireSignIn();
                }]

            }
		})
    }])

	.controller("EditorCtrl", ['$scope', 'currentAuth',

function( $scope, currentAuth ){
		$scope.dati = {};
    var jq = $.noConflict();
	var editorObj;
	var methods = {
		saveSelection: function() {
			//Function to save the text selection range from the editor
			jq(this).data('editor').focus();
		    if (window.getSelection) {
		        sel = window.getSelection();
		        if (sel.getRangeAt && sel.rangeCount) {
		            jq(this).data('currentRange', sel.getRangeAt(0));
		        }
		    } else if (document.selection && document.selection.createRange) {
		        jq(this).data('currentRange',document.selection.createRange());
		    }
		    else
		    	jq(this).data('currentRange', null);
		},

		restoreSelection: function(text,mode) {
			//Function to restore the text selection range from the editor
			var node;
			typeof text !== 'undefined' ? text : false;
			typeof mode !== 'undefined' ? mode : "";
			var range = jq(this).data('currentRange');
		    if (range) {
		        if (window.getSelection) {
		        	if(text){
		            	range.deleteContents();
		            	if(mode=="html")
	            		{
    			            var el = document.createElement("div");
				            el.innerHTML = text;
				            var frag = document.createDocumentFragment(), node, lastNode;
				            while ( (node = el.firstChild) ) {
				                lastNode = frag.appendChild(node);
				            }
				            range.insertNode(frag);
	            		}
		            	else
            				range.insertNode( document.createTextNode(text) );

		            }
		            sel = window.getSelection();
		            sel.removeAllRanges();
		            sel.addRange(range);
		        }
		        else if (document.selection && range.select) {
		            range.select();
		            if(text)
		            {
		            	if(mode=="html")
		            		range.pasteHTML(text);
		            	else
		            		range.text = text;
		            }
		        }
		    }
		},

		restoreIESelection:function() {
			//Function to restore the text selection range from the editor in IE
			var range = jq(this).data('currentRange');
		    if (range) {
		        if (window.getSelection) {
		            sel = window.getSelection();
		            sel.removeAllRanges();
		            sel.addRange(range);
		        } else if (document.selection && range.select) {
		            range.select();
		        }
		    }
		},

		insertTextAtSelection:function(text,mode) {
		    var sel, range, node ;
		    typeof mode !== 'undefined' ? mode : "";
		    if (window.getSelection) {
		        sel = window.getSelection();
		        if (sel.getRangeAt && sel.rangeCount) {
		            range = sel.getRangeAt(0);
		            range.deleteContents();
		            var textNode = document.createTextNode(text);

		            if(mode=="html")
		            {
		                var el = document.createElement("div");
		                el.innerHTML = text;
		                var frag = document.createDocumentFragment(), node, lastNode;
		                while ( (node = el.firstChild) ) {
		                    lastNode = frag.appendChild(node);
		                }
		                range.insertNode(frag);
		            }
		            else
		            {
		            	range.insertNode(textNode);
		            	range.selectNode(textNode);
		            }
		            sel.removeAllRanges();
		            range = range.cloneRange();
		            range.collapse(false);
		            sel.addRange(range);
		        }
		    } else if (document.selection && document.selection.createRange) {
		        range = document.selection.createRange();
		        range.pasteHTML(text);
		        range.select();
		    }
		},

		imageWidget: function(){
			//Class for Widget Handling the upload of Files
			var row = jq('<div/>',{
				"class":"row"
			}).append(jq('<div/>',{
				id :"imgErrMsg"
			}));
			var container = jq('<div/>',{'class':"tabbable tabs-left"});
			var navTabs = jq('<ul/>',
									{ class: "nav nav-tabs"
							}).append(jq('<li/>',
										{ class:"active"
									}).append(jq('<a/>',{
											"href":"#uploadImageBar",
											"data-toggle":"tab"
										}).html("From Computer")
							)).append(jq('<li/>').append(jq('<a/>',{
											"href":"#imageFromLinkBar",
											"data-toggle":"tab"
										}).html("From URL")));

			var tabContent 		= jq("<div/>", {class:"tab-content"});
			var uploadImageBar  = jq("<div/>",{
				id: "uploadImageBar",
				class: "tab-pane active"
			});

			handleFileSelect = function(evt) {
    			var files = evt.target.files; // FileList object
				var output = [];
				for (var i = 0, f; f = files[i]; i++) {
					//Loop thorugh all the files
					if(!f.type.match('image.*') || !f.name.match(/(?:gif|jpg|png|jpeg)jq/)){ //Process only Images
						methods.showMessage.apply(this,["imgErrMsg","Invalid file type"]);
						continue;
					}
					var reader = new FileReader();
					reader.onload = (function(imageFile){
						return function(e){
							//Render Thumnails
							var li = jq('<li/>',{class:"col-xs-12 col-sm-6 col-md-3 col-lg-3"});
							var a = jq('<a/>',{
								href:"javascript:void(0)",
								class:"thumbnail"
							});
							var image = jq('<img/>',{
								src:e.target.result,
								title:escape(imageFile.name)
							}).appendTo(a).click(function(){
								jq('#imageList').data('current', jq(this).attr('src'));
								});
							li.append(a).appendTo(jq('#imageList'));
						}
					})(f);
					reader.readAsDataURL(f);
				}
			}
			var chooseFromLocal = jq('<input/>',{
				type: "file",
				class:"inline-form-control",
				multiple: "multiple"
			});
			chooseFromLocal.on('change', handleFileSelect);
			uploadImageBar.append(chooseFromLocal);
			var imageFromLinkBar = jq("<div/>",{
				id: "imageFromLinkBar",
				class: "tab-pane"
			});
			var getImageURL = jq("<div/>", {class:"input-group"});
			var imageURL = jq('<input/>',{
				type: "url",
				class:'form-control',
				id:"imageURL",
				placeholder: "Enter URL"
			}).appendTo(getImageURL);
			var getURL = jq("<button/>",{
				class:"btn btn-success",
				type:"button"
			}).html("Go!").click(function(){
				var url = jq('#imageURL').val();
				if(url ==''){
					methods.showMessage.apply(this,["imgErrMsg","Please enter image url"]);
					return false;
				}
				var li = jq('<li/>',{class:"span6 col-xs-12 col-sm-6 col-md-3 col-lg-3"});
				var a = jq('<a/>',{
					href:"javascript:void(0)",
					class:"thumbnail"
				});
				var image = jq('<img/>',{
					src:url,
				}).error(function(){
				  	methods.showMessage.apply(this,["imgErrMsg","Invalid image url"]);
				  	return false;
				}).load( function() { jq(this).appendTo(a).click(function(){
					jq('#imageList').data('current', jq(this).attr('src'));
				});
				li.append(a).appendTo(jq('#imageList'));
			});
			}).appendTo(jq("<span/>", {class:"input-group-btn form-control-button-right"}).appendTo(getImageURL));

			imageFromLinkBar.append(getImageURL);
			tabContent.append(uploadImageBar).append(imageFromLinkBar);
			container.append(navTabs).append(tabContent);

			var imageListContainer = jq("<div/>",{'class': 'col-xs-12 col-sm-12 col-md-12 col-lg-12'});
			var imageList = jq('<ul/>',{"class":"thumbnails padding-top list-unstyled",
										"id": 'imageList'
			}).appendTo(imageListContainer);
			row.append(container).append(imageListContainer);
			return row;
		},

		tableWidget: function(mode){
			//Function to generate the table input form
			var idExtn ='';
			if(typeof mode!=='undefined')
				idExtn = "Edt";

			var tblCntr = jq('<div/>',{ //Outer Container Div
				class:"row-fluid"
				}).append(jq('<div/>',{ //Err Message Div
				 	id :"tblErrMsg"+idExtn
				})).append(jq('<form/>',{ //Form
					id:"tblForm"+idExtn
					}).append(jq('<div/>',{ //Inner Container Div
						class:"row"
						}).append(jq('<div/>',{ //Left input Container Div
							id :"tblInputsLeft"+idExtn,
							class:"col-xs-12 col-sm-6 col-md-6 col-lg-6"
							}).append(jq('<label/>',{ for:"tblRows"+idExtn,	text:"Rows"}
							)).append(jq('<input/>',{
								id:"tblRows"+idExtn,
								type:"text",
								class:"form-control form-control-width",
								value:2
							})).append(jq('<label/>',{ for:"tblColumns"+idExtn,	text:"Columns"}
							)).append(jq('<input/>',{
								id:"tblColumns"+idExtn,
								type:"text",
							 	class:"form-control form-control-width",
							 	value:2
							})).append(jq('<label/>',{ for:"tblWidth"+idExtn, text:"Width"}
							)).append(jq('<input/>',{
								id:"tblWidth"+idExtn,
								type:"text",
								class:"form-control form-control-width",
								value:400
							})).append(jq('<label/>',{ for:"tblHeight"+idExtn, text:"Height"}
							)).append(jq('<input/>',{
								id:"tblHeight"+idExtn,
								type:"text",
								class:"form-control form-control-width",
							}))
						).append(jq('<div/>',{ //Right input Container Div
							id :"tblInputsRight"+idExtn,
							class:"col-xs-12 col-sm-6 col-md-6 col-lg-6"
							}).append(jq('<label/>',{ for:"tblAlign"+idExtn, text:"Alignment"}
							)).append(jq('<select/>',{ id:"tblAlign"+idExtn, class:"form-control form-control-width"}
								).append(jq('<option/>',{ text:"Choose", value:""}
								)).append(jq('<option/>',{ text:"Left", value:"left"}
								)).append(jq('<option/>',{ text:"Center", value:"center"}
								)).append(jq('<option/>',{ text:"Right",	value:"right"}))
							).append(jq('<label/>',{	for:"tblBorder"+idExtn, text:"Border size"}
							)).append(jq('<input/>',{
								id:"tblBorder"+idExtn,
								type:"text",
								class:"form-control form-control-width",
								value:1
							})).append(jq('<label/>',{ for:"tblCellspacing"+idExtn,	text:"Cell spacing"}
							)).append(jq('<input/>',{
								id:"tblCellspacing"+idExtn,
								type:"text",
								class:"form-control form-control-width",
								value:1
							})).append(jq('<label/>',{ for:"tblCellpadding"+idExtn,	text:"Cell padding"}
							)).append(jq('<input/>',{
								id:"tblCellpadding"+idExtn,
								type:"text",
								class:"form-control form-control-width",
								value:1
							}))
						)
					)
				)
			return tblCntr;
		},

		imageAttributeWidget: function(){

			var edtTablecntr=jq('<div/>',{
				class:"row-fluid"}
				).append(jq('<div/>',{ //Err Message Div
				 	id :"imageErrMsg"
				})).append(jq('<input/>',{
						id:"imgAlt",
						type:"text",
						class:"form-control form-control-link ",
						placeholder:"Alt Text",
					})).append(jq('<input/>',{
						id:"imgTarget",
						class:"form-control form-control-link ",
						type:"text",
						placeholder:"Link Target"
					})).append(jq('<input/>',{
						id:"imgHidden",
						type:"hidden"
					}))

				return edtTablecntr;

		},

		getHTMLTable: function(tblRows,tblColumns,attributes){
			//Function to generate html table. Supplied arguments: tablerows-no.of rows, no.of columns, table attributes.
			var tableElement = jq('<table/>',{ class:"table" });
			for (var i = 0; i < attributes.length; i++){
				if(attributes[i].value!=''){
					if(attributes[i].attribute=="width" || attributes[i].attribute=="height")
	                  	tableElement.css(attributes[i].attribute,attributes[i].value);
					else
						tableElement.attr(attributes[i].attribute,attributes[i].value);
				}
			}
			for(var i=1; i<=tblRows; i++){
				var tblRow = jq('<tr/>');
			 	for(var j=1; j<=tblColumns; j++){
			 		var tblColumn = jq('<td/>').html('&nbsp;');
			 		tblColumn.appendTo(tblRow);
			 	}
				tblRow.appendTo(tableElement);
			}
			return tableElement;
		},

		init : function( options )
		{
			var fonts = { "Sans serif"	 : "arial,helvetica,sans-serif",
						  "Serif"	 	 : "times new roman,serif",
						  "Wide"	 	 : "arial black,sans-serif",
						  "Narrow"	 	 : "arial narrow,sans-serif",
						  "Comic Sans MS": "comic sans ms,sans-serif",
						  "Courier New"  : "courier new,monospace",
						  "Garamond"	 : "garamond,serif",
						  "Georgia"	 	 : "georgia,serif",
						  "Tahoma" 		 : "tahoma,sans-serif",
						  "Trebuchet MS" : "trebuchet ms,sans-serif",
						  "Verdana" 	 : "verdana,sans-serif"};

			var styles = {  "Heading 1":"<h1>",
							"Heading 2":"<h2>",
							"Heading 3":"<h3>",
							"Heading 4":"<h4>",
							"Heading 5":"<h5>",
							"Heading 6":"<h6>",
							"Paragraph":"<p>" };

			var fontsizes = {	"Small"	:"2",
								"Normal":"3",
								"Medium":"4",
								"Large"	:"5",
								"Huge"	:"6" };

			var colors = [	{ name: 'Black', hex: '#000000' },
							{ name: 'MediumBlack', hex: '#444444' },
							{ name: 'LightBlack', hex: '#666666' },
							{ name: 'DimBlack', hex: '#999999' },
							{ name: 'Gray', hex: '#CCCCCC' },
							{ name: 'DimGray', hex: '#EEEEEE' },
							{ name: 'LightGray', hex: '#F3F3F3' },
							{ name: 'White', hex: '#FFFFFF' },

							{ name: 'libreak', hex: null },

							{ name: 'Red', hex: '#FF0000' },
							{ name: 'Orange', hex: '#FF9900' },
							{ name: 'Yellow', hex: '#FFFF00' },
							{ name: 'Lime', hex: '#00FF00' },
							{ name: 'Cyan', hex: '#00FFFF' },
							{ name: 'Blue', hex: '#0000FF' },
							{ name: 'BlueViolet', hex: '#8A2BE2' },
							{ name: 'Magenta', hex: '#FF00FF' },

							{ name: 'libreak', hex: null },

							{ name: 'LightPink', hex: '#FFB6C1'},
							{ name: 'Bisque', hex: '#FCE5CD'},
							{ name: 'BlanchedAlmond', hex: '#FFF2CC'},
							{ name: 'LightLime', hex: '#D9EAD3'},
							{ name: 'LightCyan', hex: '#D0E0E3'},
							{ name: 'AliceBlue', hex: '#CFE2F3'},
							{ name: 'Lavender', hex: '#D9D2E9'},
							{ name: 'Thistle', hex: '#EAD1DC'},

							{ name: 'LightCoral', hex: '#EA9999' },
							{ name: 'Wheat', hex: '#F9CB9C' },
							{ name: 'NavajoWhite', hex: '#FFE599' },
							{ name: 'DarkSeaGreen', hex: '#B6D7A8' },
							{ name: 'LightBlue', hex: '#A2C4C9' },
							{ name: 'SkyBlue', hex: '#9FC5E8' },
							{ name: 'LightPurple', hex: '#B4A7D6' },
							{ name: 'PaleVioletRed', hex: '#D5A6BD' },

							{ name: 'IndianRed', hex: '#E06666' },
							{ name: 'LightSandyBrown', hex: '#F6B26B' },
							{ name: 'Khaki', hex: '#FFD966' },
							{ name: 'YellowGreen', hex: '#93C47D' },
							{ name: 'CadetBlue', hex: '#76A5AF' },
							{ name: 'DeepSkyBlue', hex: '#6FA8DC' },
							{ name: 'MediumPurple', hex: '#8E7CC3' },
							{ name: 'MediumVioletRed', hex: '#C27BA0' },

							{ name: 'Crimson', hex: '#CC0000' },
							{ name: 'SandyBrown', hex: '#E69138' },
							{ name: 'Gold', hex: '#F1C232' },
							{ name: 'MediumSeaGreen', hex: '#6AA84F' },
							{ name: 'Teal', hex: '#45818E' },
							{ name: 'SteelBlue', hex: '#3D85C6' },
							{ name: 'SlateBlue', hex: '#674EA7' },
							{ name: 'VioletRed', hex: '#A64D79' },

							{ name: 'Brown', hex: '#990000' },
							{ name: 'Chocolate', hex: '#B45F06' },
							{ name: 'GoldenRod', hex: '#BF9000' },
							{ name: 'Green', hex: '#38761D' },
							{ name: 'SlateGray', hex: '#134F5C' },
							{ name: 'RoyalBlue', hex: '#0B5394' },
							{ name: 'Indigo', hex: '#351C75' },
							{ name: 'Maroon', hex: '#741B47' },

							{ name: 'DarkRed', hex: '#660000' },
							{ name: 'SaddleBrown', hex: '#783F04' },
							{ name: 'DarkGoldenRod', hex: '#7F6000' },
							{ name: 'DarkGreen', hex: '#274E13' },
							{ name: 'DarkSlateGray', hex: '#0C343D' },
							{ name: 'Navy', hex: '#073763' },
							{ name: 'MidnightBlue', hex: '#20124D' },
							{ name: 'DarkMaroon', hex: '#4C1130' } ];

			var specialchars = [{ name:"Exclamation ", text:"!"},
								{ name:"At", text:"@"},
								{ name:"Hash", text:"#"},
								{ name:"Percentage", text:"%"},
								{ name:"Uppercase", text:"^"},
								{ name:"Ampersand", text:"&"},
								{ name:"Asterisk", text:"*"},
								{ name:"OpenBracket", text:"("},
								{ name:"CloseBracket", text:")"},
								{ name:"Underscore", text:"_"},
								{ name:"Hiphen", text:"-"},
								{ name:"Plus", text:"+"},
								{ name:"Equalto", text:"="},
								{ name:"OpenSquareBracket", text:"["},
								{ name:"CloseSquareBracket", text:"]"},
								{ name:"OpenCurly", text:"{"},
								{ name:"CloseCurly", text:"}"},
								{ name:"Pipe", text:"|"},
								{ name:"Colon", text:":"},
								{ name:"Semicolon", text:";"},
								{ name:"Single quote", text:"&#39;"},
								{ name:"Double quote", text:"&#34;"},
								{ name:"Left single curly quote", text:"&lsquo;"},
								{ name:"right single curly quote", text:"&rsquo;"},
								{ name:"Forward-slash", text:"&#47;"},
								{ name:"Back-slash", text:"&#92;"},
								{ name:"LessThan", text:"<"},
								{ name:"GreaterThan", text:">"},
								{ name:"QuestionMark", text:"?"},
								{ name:"Tilda", text:"~"},
								{ name:"Grave accent", text:"`"},
								{ name:"Micron", text:"&micro;"},
								{ name:"Paragraph sign", text:"&para;"},
								{ name:"Plus/minus", text:"&plusmn;"},
								{ name:"Trademark", text:"&trade;"},
								{ name:"Copyright", text:"&copy;"},
								{ name:"Registered", text:"&reg;"},
								{ name:"Section", text:"&sect;"},
								{ name:"right double angle quotes", text:"&#187;"},
								{ name:"fraction one quarter", text:"&#188;"},
								{ name:"fraction one half", text:"&#189;"},
								{ name:"fraction three quarters", text:"&#190;"},
								{ name:"Dollar", text:"jq"},
								{ name:"Euro", text:"&euro;"},
								{ name:"Pound", text:"&pound;"},
								{ name:"Yen", text:"&yen;"},
								{ name:"Cent", text:"&#162;"},
								{ name:"IndianRupee", text:"&#8377;"},];

			var menuItems = { 'fonteffects': true,
							  'texteffects': true,
							  'aligneffects': true,
							  'textformats':true,
							  'actions' : true,
							  'insertoptions' : true,
							  'extraeffects' : true,
							  'advancedoptions' : true,
							  'screeneffects':true,

							  'fonts'	: { "select":true,
											"default": "Font",
											"tooltip": "Fonts",
											"commandname": "fontName",
											"custom":null },

							  'styles'	: { "select":true,
											"default": "Formatting",
											"tooltip": "Paragraph Format",
											"commandname": "formatBlock",
												"custom":null },

							 'font_size': {	"select":true,
											"default": "Font size",
											"tooltip": "Font Size",
											"commandname":"fontSize",
											"custom":null },

							  'color'	: { "text":"A",
											"icon": "fa fa-font",
											"tooltip": "Text/Background Color",
											"commandname":null,
											"custom":function(button){
													var editor = jq(this);
													var flag = 0;
													var paletteCntr   = jq('<div/>',{id:"paletteCntr",class:"activeColour", css :{"display":"none","width":"335px"}}).click(function(event){event.stopPropagation();});
													var paletteDiv    = jq('<div/>',{id:"colorpellete"});
													var palette       = jq('<ul />',{id:"color_ui"}).append(jq('<li />').css({"width":"145px","display":"Block","height":"25px"}).html('<div>Text Color</div>'));
													var bgPalletteDiv = jq('<div/>',{id:"bg_colorpellete"});
													var bgPallette    = jq('<ul />',{id:"bgcolor_ui"}).append(jq('<li />').css({"width":"145px","display":"Block","height":"25px"}).html('<div>Background Color</div>'));
													if(editor.data("colorBtn")){
														flag = 1;
														editor.data("colorBtn",null);
													}
													else
														editor.data("colorBtn",1);
													if(flag==0){
														for (var i = 0; i < colors.length; i++){
															if(colors[i].hex!=null){
															    palette.append(jq('<li />').css('background-color', colors[i].hex).mousedown(function(event){ event.preventDefault();}).click(function(){
																	var hexcolor = methods.rgbToHex.apply(this,[jq(this).css('background-color')]);
																	methods.restoreSelection.apply(this);
																	methods.setStyleWithCSS.apply(this);
																	document.execCommand('forecolor',false,hexcolor);
																	jq('#paletteCntr').remove();

																	editor.data("colorBtn",null);
																}));

																bgPallette.append(jq('<li />').css('background-color', colors[i].hex).mousedown(function(event){ event.preventDefault();}).click(function(){
																var hexcolor = methods.rgbToHex.apply(this,[jq(this).css('background-color')]);
																methods.restoreSelection.apply(this);
																methods.setStyleWithCSS.apply(this);
																document.execCommand('backColor',false,hexcolor);
																jq('#paletteCntr').remove();
																editor.data("colorBtn",null);
																}));
															}
															else{
																palette.append(jq('<li />').css({"width":"145px","display":"Block","height":"5px"}));
																bgPallette.append(jq('<li />').css({"width":"145px","display":"Block","height":"5px"}));
															}
														}
														palette.appendTo(paletteDiv);
														bgPallette.appendTo(bgPalletteDiv);
														paletteDiv.appendTo(paletteCntr);
														bgPalletteDiv.appendTo(paletteCntr)
														paletteCntr.insertAfter(button);
														jq('#paletteCntr').slideDown('slow');
													}
													else
														jq('#paletteCntr').remove();
												}},

							  'bold'	: { "text": "B",
											"icon": "fa fa-bold",
											"tooltip": "Bold",
											"commandname":"bold",
											"custom":null },

						      'italics'	: { "text":"I",
											"icon":"fa fa-italic",
											"tooltip":"Italics",
											"commandname":"italic",
											"custom":null },

						     'underline': { "text":"U",
											"icon":"fa fa-underline",
											"tooltip":"Underline",
											"commandname":"underline",
											"custom":null },

						     'strikeout': { "text": "Strikeout",
											"icon":"fa fa-strikethrough",
											"tooltip": "Strike Through",
											"commandname":"strikeThrough",
											"custom":null },

						     'ol'		: { "text": "N",
											"icon": "fa fa-list-ol",
											"tooltip": "Insert/Remove Numbered List",
											"commandname":"insertorderedlist",
											"custom":null },

						     'ul'		: { "text": "Bullet",
											"icon": "fa fa-list-ul",
											"tooltip": "Insert/Remove Bulleted List",
											"commandname":"insertunorderedlist",
											"custom":null },

						     'undo'		: { "text": "undo",
											"icon": "fa fa-undo",
											"tooltip": "Undo",
											"commandname":"undo",
											"custom":null },

						     'redo'		: { "text": "redo",
											"icon": "fa fa-repeat",
											"tooltip": "Redo",
											"commandname":"redo",
											"custom":null },

						     'l_align'	: { "text": "leftalign",
											"icon": "fa fa-align-left",
											"tooltip": "Align Left",
											"commandname":"justifyleft",
											"custom":null },

						     'r_align'	: { "text": "rightalign",
											"icon": "fa fa-align-right",
											"tooltip": "Align Right",
											"commandname":"justifyright",
											"custom":null },

						     'c_align'	: { "text": "centeralign",
											"icon": "fa fa-align-center",
											"tooltip": "Align Center",
											"commandname":"justifycenter",
											"custom":null },

						     'justify'	: { "text": "justify",
											"icon": "fa fa-align-justify",
											"tooltip": "Justify",
											"commandname":"justifyfull",
											"custom":null },

							  'unlink'	: { "text": "Unlink",
											"icon": "fa fa-unlink",
											"tooltip": "Unlink",
											"commandname":"unlink",
											"custom":null },

						   'insert_link': { "modal": true,
						   					"modalId": "InsertLink",
											"icon":"fa fa-link",
											"tooltip": "Insert Link",
											"modalHeader": "Insert Hyperlink",
											"modalBody": jq('<div/>',{   class:"form-group"
																	}).append(jq('<div/>',{
																		id :"errMsg"
																	})).append(jq('<input/>',{
																		type:"text",
																		id:"inputText",
																		class:"form-control form-control-link ",
																		placeholder:"Text to Display",
																	})).append(jq('<input/>',{
																		type:"text",
																		id:"inputUrl",
																		required:true,
																		class:"form-control form-control-link",
																		placeholder:"Enter URL"
																	})),
											"beforeLoad":function(){
												editorObj = this;
												jq('#inputText').val("");
												jq('#inputUrl').val("");
												jq(".alert").alert("close");
												if(jq(editorObj).data('currentRange')!=''){
													jq('#inputText').val(jq(editorObj).data('currentRange'));
												}
											},
											"onSave":function(){
												var urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
												var targetText = jq('#inputText').val();
												var targetURL  = jq('#inputUrl').val();
												var range      = jq(editorObj).data('currentRange');
												if(targetURL ==''){
													methods.showMessage.apply(editorObj,["errMsg","Please enter url"]);
													return false;
												}
												if(!targetURL.match(urlPattern)){
													methods.showMessage.apply(editorObj,["errMsg","Enter valid url"]);
													return false;
												}
												if(range=='' && targetText==''){
													targetText =targetURL;
												}
												if(navigator.userAgent.match(/MSIE/i)){
													var targetLink='<a href="'+targetURL+'" target="_blank">'+targetText+'</a>';
													methods.restoreSelection.apply(editorObj,[targetLink,'html']);
												}
												else{
												    methods.restoreSelection.apply(editorObj, [targetText]);
													document.execCommand('createLink',false,targetURL);
												}
												jq(editorObj).data("editor").find('a[href="'+targetURL+'"]').each(function(){ jq(this).attr("target", "_blank"); });
												jq(".alert").alert("close");
												jq("#InsertLink").modal("hide");
												jq(editorObj).data("editor").focus();
												return false;
											}},

						   'insert_img'	: { "modal": true,
						   					"modalId": "InsertImage",
											"icon":"fa fa-picture-o",
											"tooltip": "Insert Image",
											"modalHeader": "Insert Image",
											"modalBody": methods.imageWidget.apply(this),
											"beforeLoad":function(){
												jq('#imageURL').val("");
												jq("#uploadImageBar :input").val("");
												jq('#imageList').data('current',"");
											},
											"onSave": function(){
												methods.restoreSelection.apply(this);
												if(jq('#imageList').data('current')){
													if(navigator.userAgent.match(/MSIE/i)){
														var imageStr = '<img src="'+jq('#imageList').data('current')+'"/>'
														methods.restoreSelection.apply(this,[imageStr,'html'])
													}
													else{
														document.execCommand('insertimage', false, jq('#imageList').data('current'));
													}
												}
												else{
													methods.showMessage.apply(this,["imgErrMsg","Please select an image"]);
													return false;
												}
												jq("#InsertImage").modal("hide");
												jq(this).data("editor").focus();
											}},

						'insert_table'	: { "modal": true,
					   						"modalId": "InsertTable",
											"icon":"fa fa-table",
											"tooltip": "Insert Table",
											"modalHeader": "Insert Table",
											"modalBody":methods.tableWidget.apply(this),
											"beforeLoad":function(){
												jq('#tblForm').each (function(){ this.reset(); });
											},
											"onSave": function(){
												methods.restoreSelection.apply(this);
												var tblRows        = jq('#tblRows').val();
												var tblColumns     = jq('#tblColumns').val();
												var tblWidth       = jq('#tblWidth').val();
												var tblHeight      = jq('#tblHeight').val();
												var tblAlign       = jq('#tblAlign').val();
												var tblBorder      = jq('#tblBorder').val();
												var tblCellspacing = jq('#tblCellspacing').val();
												var tblCellpadding = jq('#tblCellpadding').val();
												var intReg 		   = /^[0-9]+jq/;
												var cssReg 		   = /^autojq|^[+-]?[0-9]+\.?([0-9]+)?(px|em|ex|%|in|cm|mm|pt|pc)?jq/ig;
												var numReg 		   = /^[0-9]+\.?([0-9])?jq/;

												if(!tblRows.match(intReg)){
													methods.showMessage.apply(this,["tblErrMsg","Rows must be a positive number"]);
													return false;
												}
												if(!tblColumns.match(intReg)){
													methods.showMessage.apply(this,["tblErrMsg","Columns must be a positive number"]);
													return false;
												}
												if(tblWidth!="" && !tblWidth.match(cssReg)){
													methods.showMessage.apply(this,["tblErrMsg","Please enter positive number with or without a valid CSS measurement unit (px,em,ex,%,in,cm,mm,pt,pc)"]);
													return false;
												}
												if(tblHeight!="" && !tblHeight.match(cssReg)){
													methods.showMessage.apply(this,["tblErrMsg","Please enter positive number with or without a valid CSS measurement unit (px,em,ex,%,in,cm,mm,pt,pc)"]);
													return false;
												}
												if(tblBorder!="" && !tblBorder.match(numReg)){
													methods.showMessage.apply(this,["tblErrMsg","Border size must be a positive number"]);
													return false;
												}
												if(tblCellspacing!="" && !tblCellspacing.match(numReg)){
													methods.showMessage.apply(this,["tblErrMsg","Cell spacing must be a positive number"]);
													return false;
												}
												if(tblCellpadding!="" && !tblCellpadding.match(numReg)){
													methods.showMessage.apply(this,["tblErrMsg","Cell padding must be a positive number"]);
													return false;
												}

												var htmlTableCntr = jq('<div/>');
												var tblAttributes = [
																		{attribute:"align",value:tblAlign},
																		{attribute:"border",value:tblBorder},
																		{attribute:"cellspacing",value:tblCellspacing},
																		{attribute:"cellpadding",value:tblCellpadding},
																		{attribute:"width",value:tblWidth},
																		{attribute:"height",value:tblHeight},
																	];
												var htmlTable     = methods.getHTMLTable.apply(this, [tblRows, tblColumns, tblAttributes]);
												htmlTable.appendTo(htmlTableCntr);
												if(navigator.userAgent.match(/MSIE/i))
												methods.restoreSelection.apply(this,[htmlTableCntr.html(),'html']);
												else
												document.execCommand('insertHTML', false, htmlTableCntr.html());
												jq("#InsertTable").modal("hide");
												jq(this).data("editor").focus();
											}},

						   'hr_line'	: { "text": "HR",
											"icon":"fa fa-minus",
											"tooltip": "Horizontal Rule",
											"commandname":"insertHorizontalRule",
											"custom":null },

						   'block_quote': { "text": "Block Quote",
											"icon":"fa fa-quote-right",
											"tooltip": "Block Quote",
											"commandname":null,
											"custom":function(){
												methods.setStyleWithCSS.apply(this);
												if(navigator.userAgent.match(/MSIE/i)){
													document.execCommand('indent', false, null);
												}
												else{
													document.execCommand('formatBlock', false, '<blockquote>');
												}
											}},

						   'indent'		: { "text": "Indent",
											"icon":"fa fa-indent",
											"tooltip": "Increase Indent",
											"commandname":"indent",
											"custom":null },

						   'outdent'	: { "text": "Outdent",
											"icon":"fa fa-outdent",
											"tooltip": "Decrease Indent",
											"commandname":"outdent",
											"custom":null },

							'print'		: { "text": "Print",
											"icon":"fa fa-print",
											"tooltip": "Print",
											"commandname":null,
											"custom":function(){
											oDoc = jq(this).data("editor");
											var oPrntWin = window.open("","_blank","width=450,height=470,left=400,top=100,menubar=yes,toolbar=no,location=no,scrollbars=yes");
											oPrntWin.document.open();
											oPrntWin.document.write("<!doctype html><html><head><title>Print</title></head><body onload=\"print();\">" + oDoc.html() + "</body></html>");
											oPrntWin.document.close();
											}},

							'rm_format'	: { "text": "Remove format",
											"icon":"fa fa-eraser",
											"tooltip": "Remove Formatting",
											"commandname":"removeformat",
											"custom":null },

							'select_all': { "text": "Select all",
											"icon":"fa fa-file-text",
											"tooltip": "Select All",
											"commandname":null,
											"custom":function(){
												document.execCommand("selectall", null, null);
											}},

							'togglescreen':{ "text": "Toggle Screen",
											 "icon": "fa fa-arrows-alt",
											 "tooltip": "Toggle Screen",
											 "commandname":null,
											 "custom":function(button, parameters){
												jq(this).data("editor").parent().toggleClass('fullscreen');
												var statusdBarHeight=0;
												if(jq(this).data("statusBar").length)
												{
													statusdBarHeight = jq(this).data("statusBar").height();
												}
												if(jq(this).data("editor").parent().hasClass('fullscreen'))
													jq(this).data("editor").css({"height":jq(this).data("editor").parent().height()-(jq(this).data("menuBar").height()+statusdBarHeight)-13});
						                        else
													jq(this).data("editor").css({"height":""});
						                    }},

							'splchars'	: { "text": "S",
											"icon": "fa fa-asterisk",
											"tooltip": "Insert Special Character",
											"commandname":null,
											"custom":function(button){
													methods.restoreIESelection.apply(this);
													var flag =0;
													var splCharDiv = jq('<div/>',{id:"specialchar", class:"specialCntr", css :{"display":"none"}}).click(function(event) { event.stopPropagation();});
													var splCharUi  = jq('<ul />',{id:"special_ui"});
													var editor_Content = this;
													if(jq(this).data("editor").data("splcharsBtn")){
														flag = 1;
														jq(this).data("editor").data("splcharsBtn", null);
													}
													else
														jq(this).data("editor").data("splcharsBtn", 1);

													if(flag==0){
														for (var i = 0; i < specialchars.length; i++){
															splCharUi.append(jq('<li />').html(specialchars[i].text).attr('title',specialchars[i].name).mousedown(function(event){ event.preventDefault();}).click(function(event){
																if(navigator.userAgent.match(/MSIE/i)){
																	var specCharHtml = jq(this).html();
																	methods.insertTextAtSelection.apply(this,[specCharHtml,'html']);
																}
																else{
																	document.execCommand('insertHTML',false,jq(this).html());
																}
																jq('#specialchar').remove();
																jq(editor_Content).data("editor").data("splcharsBtn", null);
															}));
														}
														splCharUi.prependTo(splCharDiv);
														splCharDiv.insertAfter(button)
														jq('#specialchar').slideDown('slow');
													}
													else
														jq('#specialchar').remove();
											}},

							'source'	: { "text": "Source",
											"icon":"fa fa-code",
											"tooltip": "Source",
											"commandname":null,
											"custom":function(button, params){ methods.getSource.apply(this, [button, params]) } },

							'save'		: { "text": "Save",   //BOTTONE CUSTOMIZZATO
                                			"icon":"fa fa-floppy-o",
                                			"tooltip": "Save",
                                			"commandname":null,
                                			"custom":function(button){ methods.Save.apply(this, button) } },
											"params": {"obj":null},
										   };

			var menuGroups = {'texteffects' : ['bold', 'italics', 'underline', 'color'],
							  'aligneffects': ['l_align','c_align', 'r_align', 'justify'],
							  'textformats': ['indent', 'outdent', 'block_quote', 'ol', 'ul'],
							  'fonteffects' : ['fonts', 'styles', 'font_size'],
							  'actions' : ['undo', 'redo'],
							  'insertoptions' : ['insert_link', 'unlink', 'insert_img', 'insert_table'],
							  'extraeffects' : ['strikeout', 'hr_line', 'splchars'],
							  'advancedoptions' : ['print', 'rm_format', 'select_all', 'source'],
							  'screeneffects' : ['togglescreen']
							};

			var settings = jq.extend({
				'texteffects':true,
				'aligneffects':true,
				'textformats':true,
				'fonteffects':true,
				'actions' : true,
				'insertoptions' : true,
				'extraeffects' : true,
				'advancedoptions' : true,
				'screeneffects':true,
				'bold': true,
				'italics': true,
				'underline':true,
				'ol':true,
				'ul':true,
				'undo':true,
				'redo':true,
				'l_align':true,
				'r_align':true,
				'c_align':true,
				'justify':true,
				'insert_link':true,
				'unlink':true,
				'insert_img':true,
				'hr_line':true,
				'block_quote':true,
				'source':true,
				'strikeout':true,
				'indent':true,
				'outdent':true,
				'fonts':fonts,
				'styles':styles,
				'print':true,
				'rm_format':true,
				'status_bar':true,
				'font_size':fontsizes,
				'color':colors,
				'splchars':specialchars,
				'insert_table':true,
				'select_all':true,
				'togglescreen':true,
				'save': true
			},options);

	       	var containerDiv = jq("<div/>",{ class : "row-fluid Editor-container" });
			var jqthis = jq(this).hide();
	       	jqthis.after(containerDiv);

	       	var menuBar = jq( "<div/>",{ id : "menuBarDiv",
								  		class : "row-fluid"
							}).prependTo(containerDiv);
	       	var editor  = jq( "<div/>",{	class : "Editor-editor",
										css : {overflow: "auto"},
										contenteditable:"true"
						 	}).appendTo(containerDiv);
			var statusBar = jq("<div/>", {	id : "statusbar",
											class: "row-fluid",
											unselectable:"on",
							}).appendTo(containerDiv);
	       	jq(this).data("menuBar", menuBar);
	       	jq(this).data("editor", editor);
	       	jq(this).data("statusBar", statusBar);
	       	var editor_Content = this;
	       	if(settings['status_bar']){
				editor.keyup(function(event){
					var wordCount = methods.getWordCount.apply(editor_Content);
					var charCount = methods.getCharCount.apply(editor_Content);
					jq(editor_Content).data("statusBar").html('<div class="label">'+'Words : '+wordCount+'</div>');
					jq(editor_Content).data("statusBar").append('<div class="label">'+'Characters : '+charCount+'</div>');
            	});
	        }


	       	for(var item in menuItems){
	       		if(!settings[item] ){ //if the display is not set to true for the button in the settings.
	       			if(settings[item] in menuGroups){
	       				for(var each in menuGroups[item]){
	       					settings[each] = false;
	       				}
	       			}
	       			continue;
	       		}
	       		if(item in menuGroups){
	       			var group = jq("<div/>",{class:"btn-group"});
	       			for(var index=0;index<menuGroups[item].length;index++){
	       				var value = menuGroups[item][index];
	       				if(settings[value]){
       						var menuItem = methods.createMenuItem.apply(this,[menuItems[value], settings[value], true]);
       						group.append(menuItem);
       					}
       					settings[value] = false;
	       			}
	       			menuBar.append(group);
	       		}
	       		else{
	       			var menuItem = methods.createMenuItem.apply(this,[menuItems[item], settings[item],true]);
	       			menuBar.append(menuItem);
	       		}
	       	}

	       	//For contextmenu
		    /*jq(document.body).mousedown(function(event) {
		        var target = jq(event.target);
		        if (!target.parents().andSelf().is('#context-menu')) { // Clicked outside
		            jq('#context-menu').remove();
		        }
		        if (!target.parents().andSelf().is('#specialchar') && (target.closest('a').html()!='<i class="fa fa-asterisk"></i>')) { //Clicked outside
		        	if(jq("#specialchar").is(':visible'))
		            {
						jq(editor_Content).data("editor").data("splcharsBtn", null);
						jq('#specialchar').remove();
		           	}
		        }
		        if (!target.parents().andSelf().is('#paletteCntr') && (target.closest('a').html()!='<i class="fa fa-font"></i>')) { //Clicked outside
		        	if(jq("#paletteCntr").is(':visible'))
		            {
						jq(editor_Content).data("editor").data("colorBtn", null);
						jq('#paletteCntr').remove();
		           	}
		        }
		    });*/
		    editor.bind("contextmenu", function(e){
	       		if(jq('#context-menu').length)
	       			jq('#context-menu').remove();
	       		var cMenu 	= jq('<div/>',{id:"context-menu"
	       						}).css({position:"absolute", top:e.pageY, left: e.pageX, "z-index":9999
	       						}).click(function(event){
								    event.stopPropagation();
								});
	       		var cMenuUl = jq('<ul/>',{ class:"dropdown-menu on","role":"menu"});
	       		e.preventDefault();
	       		if(jq(e.target).is('a')){
	       			methods.createLinkContext.apply(this,[e,cMenuUl]);
	       			cMenuUl.appendTo(cMenu);
	       		    cMenu.appendTo('body');
	       		}
	       		else if(jq(e.target).is('td') || jq(e.target).is("th")){
	       			methods.createTableContext.apply(this,[e,cMenuUl]);
	       			cMenuUl.appendTo(cMenu);
	       		    cMenu.appendTo('body');
	       		}
	       		else if(jq(e.target).is('img')){

	       			methods.createImageContext.apply(this,[e,cMenuUl]);
	       			cMenuUl.appendTo(cMenu);
	       			cMenu.appendTo('body');
	       		}
	       	});
		},
		createLinkContext: function(event,cMenuUl){
			var cMenuli = jq('<li/>').append(jq('<a/>',{
				id:"rem_link",
				"href":"javascript:void(0)",
				"text":"RemoveLink"
			}).click(function(e){
				return function(){
				jq(e.target).contents().unwrap();
				jq('#context-menu').remove();
			}}(event)));
			cMenuli.appendTo(cMenuUl);

		},

		createImageContext: function(event,cMenuUl){
			var cModalId="imgAttribute";
			var cModalHeader="Image Attributes";
			var imgModalBody=methods.imageAttributeWidget.apply(this,["edit"]);
			var onSave = function(){
				var urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
				var imageAlt = jq('#imgAlt').val();
				var imageTarget = jq('#imgTarget').val();
				if(imageAlt==""){
					methods.showMessage.apply(this,["imageErrMsg","Please enter image alternative text"]);
					return false;
				}
				if(imageTarget!=""&& !imageTarget.match(urlPattern)){
					methods.showMessage.apply(this,["imageErrMsg","Please enter valid url"]);
					return false;
				}
				if(jq("#imgHidden").val()!=""){
                        var imgId = jq("#imgHidden").val();
	       				jq("#"+imgId).attr('alt',imageAlt);
	       				if(imageTarget!="")
	       				{
	       				 if(jq("#wrap_"+imgId).length)
	       				 jq("#wrap_"+imgId).attr("href",imageTarget);
	       				 else
					     jq("#"+imgId).wrap(jq('<a/>',{ id:"wrap_"+imgId,href:imageTarget,target:"_blank"}));
					    }
					    else
					    {
					    	if(jq("#wrap_"+imgId).length)
					    	jq("#"+imgId).unwrap();
					    }
	       		}
				jq("#imgAttribute").modal("hide");
				jq(this).data("editor").focus();
			};
			methods.createModal.apply(this,[cModalId,cModalHeader, imgModalBody, onSave]);
			var modalTrigger = jq('<a/>',{	href:"#"+cModalId,
       										"text":"Image Attributes",
											"data-toggle":"modal"
			}).click( function(e){
				return function(){
			        jq('#context-menu').remove();
			        var stamp   = (new Date).getTime();
			        jq('#imgAlt').val(jq(e.target).closest("img").attr("alt"));
			        jq('#imgTarget').val('');

			        if(typeof jq(e.target).closest("img").attr("id")!=="undefined"){
			            var identifier = jq(e.target).closest("img").attr("id");
			        	jq('#imgHidden').val(identifier);
			        	if(jq('#wrap_'+identifier).length)
			        		jq('#imgTarget').val(jq('#wrap_'+identifier).attr("href"));
			        	else
			        	 	jq('#imgTarget').val('');
			        }
			    	else{
			    		jq(e.target).closest("img").attr("id","img_"+stamp)
			    		jq('#imgHidden').val("img_"+stamp);
			    	}

			}}(event));
			cMenuUl.append(jq('<li/>').append(modalTrigger))
					.append(jq('<li/>').append(jq('<a/>',{text:"Remove Image"}).click(
						function(e) { return function(){
								jq('#context-menu').remove();
								jq(e.target).closest("img").remove();
						}}(event))));
		},

		createTableContext: function(event,cMenuUl){
			jq('#editProperties').remove();
			var modalId="editProperties";
       		var modalHeader="Table Properties";
       		var tblModalBody= methods.tableWidget.apply(this,["edit"]);
       		var onSave = function(){
       			var tblWidthEdt			= jq('#tblWidthEdt').val();
       			var tblHeightEdt		= jq('#tblHeightEdt').val();
       			var tblBorderEdt		= jq('#tblBorderEdt').val();
       			var tblAlignEdt	        = jq('#tblAlignEdt').val();
       			var tblCellspacingEdt	= jq('#tblCellspacingEdt').val();
       			var tblCellpaddingEdt	= jq('#tblCellpaddingEdt').val();
				var tblEdtCssReg 		= /^autojq|^[+-]?[0-9]+\.?([0-9]+)?(px|em|ex|%|in|cm|mm|pt|pc)?jq/ig;
				var tblEdtNumReg 		= /^[0-9]+\.?([0-9])?jq/;
				if(tblWidthEdt!="" && !tblWidthEdt.match(tblEdtCssReg)){
					methods.showMessage.apply(this,["tblErrMsgEdt","Please enter positive number with or without a valid CSS measurement unit (px,em,ex,%,in,cm,mm,pt,pc)"]);
					return false;
				}
				if(tblHeightEdt!="" && !tblHeightEdt.match(tblEdtCssReg)){
					methods.showMessage.apply(this,["tblErrMsgEdt","Please enter positive number with or without a valid CSS measurement unit (px,em,ex,%,in,cm,mm,pt,pc)"]);
					return false;
				}
				if(tblBorderEdt!="" && !tblBorderEdt.match(tblEdtNumReg)){
					methods.showMessage.apply(this,["tblErrMsgEdt","Border size must be a positive number"]);
					return false;
				}
				if(tblCellspacingEdt!="" && !tblCellspacingEdt.match(tblEdtNumReg)){
					methods.showMessage.apply(this,["tblErrMsgEdt","Cell spacing must be a positive number"]);
					return false;
				}
				if(tblCellpaddingEdt!="" && !tblCellpaddingEdt.match(tblEdtNumReg)){
					methods.showMessage.apply(this,["tblErrMsgEdt","Cell padding must be a positive number"]);
					return false;
				}
				jq(event.target).closest('table').css('width',tblWidthEdt);
				if(tblHeightEdt!="")
				jq(event.target).closest('table').css('height',tblHeightEdt);
			    jq(event.target).closest('table').attr('align',tblAlignEdt);
			    jq(event.target).closest('table').attr('border',tblBorderEdt);
			    jq(event.target).closest('table').attr('cellspacing',tblCellspacingEdt);
			    jq(event.target).closest('table').attr('cellpadding',tblCellpaddingEdt);
			    jq("#editProperties").modal("hide");
				jq(this).data("editor").focus();
       		};
       		methods.createModal.apply(this,[modalId,modalHeader, tblModalBody, onSave]);
       		var modalTrigger = jq('<a/>',{	href:"#"+modalId,
       										"text":"Table Properties",
											"data-toggle":"modal"
			}).click( function(e){ return function(){
			        jq('#context-menu').remove();
					jq('#tblRowsEdt').val(jq(e.target).closest('table').prop('rows').length);
				    jq('#tblColumnsEdt').val(jq(e.target).closest('table').find('tr')[0].cells.length);
				    jq('#tblRowsEdt').attr('disabled','disabled');
				    jq('#tblColumnsEdt').attr('disabled','disabled');
				    jq('#tblWidthEdt').val(jq(e.target).closest('table').get(0).style.width);
				    jq('#tblHeightEdt').val(jq(e.target).closest('table').get(0).style.height);
				    jq('#tblAlignEdt').val(jq(e.target).closest('table').attr("align"));
				    jq('#tblBorderEdt').val(jq(e.target).closest('table').attr("border"));
				    jq('#tblCellspacingEdt').val(jq(e.target).closest('table').attr("cellspacing"));
				    jq('#tblCellpaddingEdt').val(jq(e.target).closest('table').attr("cellpadding"));


			}}(event));

			cMenuUl.append(jq('<li/>',{class:"dropdown-submenu",css:{display:"block"}})
       						.append(jq('<a/>',{"tabindex":"-1", href:"javascript:void(0)","text":"Row"}))
       						.append(jq('<ul/>',{class:"dropdown-menu"})
       								.append(jq('<li/>').append(jq('<a/>',{
											id:"tbl_addrow",
											"href":"javascript:void(0)",
											"text":"Add Row"
											}).click(function(e){
												return function(){
													jq("#context-menu").remove();
													var selectedRow = jq(e.target).closest("tr");
													var newRow = jq("<tr/>");
													selectedRow.children().each(function() {
														var newColumn = jq("<" + jq(this).prop("nodeName") + "/>").html("&nbsp;");
														newRow.append(newColumn);
													});
													selectedRow.after(newRow);
												}
											}(event))))
       								.append(jq('<li/>').append(jq('<a/>',{text:"Remove Row"}).click(
											function(e) { return function(){
													jq('#context-menu').remove();
													jq(e.target).closest("tr").remove();
											}}(event))))
       			)).append(jq('<li/>',{class:"dropdown-submenu",css:{display:"block"}})
   						.append(jq('<a/>',{"tabindex":"-1", href:"javascript:void(0)","text":"Column"}))
   						.append(jq('<ul/>',{class:"dropdown-menu"})
   								.append(jq('<li/>').append(jq('<a/>',{
										id:"tbl_addcolumn",
										"href":"javascript:void(0)",
										"text":"Add Column",
										}).click(function(e){
											return function(){
												jq('#context-menu').remove();
												var selectedCell = jq(e.target);
												var columnIndex = selectedCell.siblings().addBack().index(selectedCell);
												selectedCell.closest("table").find("tr").each(function() {
													var cellInSelectedColumn = jq(this).children(":eq(" + columnIndex + ")");
													var newCell = jq("<" + cellInSelectedColumn.prop("nodeName") + "/>").html("&nbsp;");
													cellInSelectedColumn.after(newCell);
												});
											}
										}(event))))
   								.append(jq('<li/>').append(jq('<a/>',{text:"Remove Column"}).click(
										function(e) { return function(){
												jq('#context-menu').remove();
												var selectedCell = jq(e.target);
												var columnIndex = selectedCell.siblings().addBack().index(selectedCell);
												selectedCell.closest("table").find("tr").each(function() {
													jq(this).children(":eq(" + columnIndex + ")").remove();
												});
										}}(event))))
   						));
			cMenuUl.append(jq('<li/>').append(modalTrigger))
					.append(jq('<li/>',{class:"divider"}))
					.append(jq('<li/>').append(jq('<a/>',{text:"Remove Table"}).click(
						function(e){ return function(){
								jq('#context-menu').remove();
								jq(e.target).closest("table").remove();
						}}(event))));

		},

		createModal: function(modalId, modalHeader, modalBody, onSave){
			//Create a Modal for the button.
			var modalTrigger = jq('<a/>',{	href:"#"+modalId,
											role:"button",
											class:"btn btn-default",
											"data-toggle":"modal"
			});
			var modalElement = jq('<div/>',{ id: modalId,
								           class: "modal fade",
								              tabindex: "-1",
								              role: "dialog",
								              "aria-labelledby":"h3_"+modalId,
								              "aria-hidden":"true"
								          }).append(jq('<div>',{
								            	class:"modal-dialog"
								         		}).append(jq('<div>',{
							            			class:"modal-content"
									         		}).append(jq('<div>',{
									           			class:"modal-header"
									           			}).append(jq('<button/>',{
										                	type:"button",
										                	class:"close",
										                	"data-dismiss":"modal",
										                	"aria-hidden":"true"
										               		}).html('x')
									            		).append(jq('<h3/>',{
									                		id:"h3_"+modalId
									           				}).html(modalHeader))
									         		).append(jq('<div>',{
									           			class:"modal-body"
									           			}).append(modalBody)
									          		).append(jq('<div>',{
									            		class:"modal-footer"
									         			}).append(jq('<button/>',{
									                		type:"button",
									                		class:"btn btn-default",
									                		"data-dismiss":"modal",
									                		"aria-hidden":"true"
									               			}).html('Cancel')
								           	  			).append(jq('<button/>',{
								                			type:"button",
								                			class:"btn btn-success",
								               				}).html('Done').mousedown(function(e){
								                			e.preventDefault();
								               				}).click(function(obj){return function(){onSave.apply(obj)}}(this)))
	         								  		)
       											)
       									);
			modalElement.appendTo("body");
			return modalTrigger;
		},

		createMenuItem: function(itemSettings, options, returnElement){
			//Function to perform multiple actions.supplied arguments: itemsettings-list of buttons and button options, options: options for select input, returnelement: boolean.
			//1.Create Select Options using Bootstrap Dropdown.
			//2.Create modal dialog using bootstrap options
			//3.Create menubar buttons binded with corresponding event actions
			typeof returnElement !== 'undefined' ? returnElement : false;

			if(itemSettings["select"]){
				var menuWrapElement = jq("<div/>", {class:"btn-group"});
				var menuElement 	= jq("<ul/>", {class:"dropdown-menu"});
				menuWrapElement.append(jq('<a/>',{
										class:"btn btn-default dropdown-toggle",
										"data-toggle":"dropdown",
										"href":"javascript:void(0)",
										"title":itemSettings["tooltip"]
										}).html(itemSettings["default"]).append(jq("<span/>",{class:"caret"})).mousedown(function(e){
											e.preventDefault();
										}));
				jq.each(options,function(i,v){
					var option = jq('<li/>')
		            jq("<a/>",{
		              tabindex : "-1",
		              href : "javascript:void(0)"
		            }).html(i).appendTo(option);

		            option.click(function(){
		            	jq(this).parent().parent().data("value", v);
		            	jq(this).parent().parent().trigger("change")
		            });
		            menuElement.append(option);
		        });
				var action = "change";
		    }
		    else if(itemSettings["modal"]){
		    	var menuWrapElement = methods.createModal.apply(this,[itemSettings["modalId"], itemSettings["modalHeader"], itemSettings["modalBody"], itemSettings["onSave"]]);
		    	var menuElement = jq("<i/>");
		    	if(itemSettings["icon"])
					menuElement.addClass(itemSettings["icon"]);
				else
					menuElement.html(itemSettings["text"]);
				menuWrapElement.append(menuElement);
				menuWrapElement.mousedown(function(obj, methods, beforeLoad){
					return function(e){
						e.preventDefault();
						methods.saveSelection.apply(obj);
						if(beforeLoad){
							beforeLoad.apply(obj);
				    	}
					}
				}(this, methods,itemSettings["beforeLoad"]));
				menuWrapElement.attr('title', itemSettings['tooltip']);
				return menuWrapElement;
		    }
			else{
				var menuWrapElement = jq("<a/>",{href:'javascript:void(0)', class:'btn btn-default'});
				var menuElement = jq("<i/>");
				if(itemSettings["icon"])
					menuElement.addClass(itemSettings["icon"]);
				else
					menuElement.html(itemSettings["text"]);
				var action = "click";
			}
			if(itemSettings["custom"]){
				menuWrapElement.bind(action, (function(obj, params){
						return function(){
						methods.saveSelection.apply(obj);
						itemSettings["custom"].apply(obj, [jq(this), params]);
						}
					})(this, itemSettings['params']));
			}
			else{
				menuWrapElement.data("commandName", itemSettings["commandname"]);
				menuWrapElement.data("editor", jq(this).data("editor"));
				menuWrapElement.bind(action, function(){ methods.setTextFormat.apply(this) });
			}
			menuWrapElement.attr('title', itemSettings['tooltip']);
			menuWrapElement.css('cursor', 'pointer');
			menuWrapElement.append(menuElement);
			if(returnElement)
				return menuWrapElement;
			jq(this).data("menuBar").append(menuWrapElement);
		},

		setTextFormat: function(){
			//Function to run the text formatting options using execCommand.
			methods.setStyleWithCSS.apply(this);
			document.execCommand(jq(this).data("commandName"), false, jq(this).data("value") || null);
			jq(this).data("editor").focus();
			return false;
		},

		getSource: function(button, params){
			//Function to show the html source code to the editor and toggle the text display.
			var flag = 0;
			if(button.data('state')){
				flag = 1;
				button.data('state', null);
			}
			else
				button.data('state', 1);
			jq(this).data("source-mode", !flag);
			var editor = jq(this).data('editor');
			var content;
			if(flag==0){ //Convert text to HTML
				content = document.createTextNode(editor.html());
                //console.log(document.createTextNode(jq(this).data('editor').html()));
				editor.empty();
				editor.attr('contenteditable', false);
				preElement = jq("<pre/>",{
					contenteditable: true
					});
				preElement.append(content);
				editor.append(preElement);
				button.parent().siblings().hide();
				button.siblings().hide();
			}
			else{
				var html = editor.children().first().text();
                //console.log(jq(this).data('editor').children().first().text());
				editor.html(html);
				editor.attr('contenteditable', true);
				button.parent().siblings().show();
				button.siblings().show();
			}
		},

		countWords: function(node){
			//Function to count the number of words recursively as the text grows in the editor.
			var count = 0;
    		var textNodes = node.contents().filter(function() {
				return (this.nodeType == 3);
			});
			for(var index=0;index<textNodes.length;index++){
				text = textNodes[index].textContent;
				text = text.replace(/[^-\w\s]/gi, ' ');
				text = jq.trim(text);
				count = count + text.split(/\s+/).length;
			}
			var childNodes = node.children().each(function(){
				count = count + methods.countWords.apply(this, [jq(this)]);
			});
			return count
		},

		countChars: function(node){
			//Function to count the number of characters recursively as the text grows in the editor.
			var count = 0;
    		var textNodes = node.contents().filter(function() {
				return (this.nodeType == 3);
			});
			for(var index=0;index<textNodes.length;index++){
				text = textNodes[index].textContent;
				count = count + text.length;
			}
			var childNodes = node.children().each(function(){
				count = count + methods.countChars.apply(this, [jq(this)]);
			});
			return count;
		},

		getWordCount: function(){
			//Function to return the word count of the text in the editor
			return methods.countWords.apply(this, [jq(this).data("editor")]);
		},

		getCharCount: function(){
			//Function to return the character count of the text in the editor
			return methods.countChars.apply(this, [jq(this).data("editor")]);
		},

		rgbToHex: function(rgb){
			//Function to convert the rgb color codes into hexadecimal code
			rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)jq/);
			return "#" +
			("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
			("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
			("0" + parseInt(rgb[3],10).toString(16)).slice(-2);
		},

		showMessage: function(target,message){
			//Function to show the error message. Supplied arguments:target-div id, message-message text to be displayed.
			var errorDiv=jq('<div/>',{ class:"alert alert-danger"	}
				).append(jq('<button/>',{
									type:"button",
									class:"close",
									"data-dismiss":"alert",
									html:"x"
				})).append(jq('<span/>').html(message));
			errorDiv.appendTo(jq('#'+target));
			setTimeout(function() { jq('.alert').alert('close'); }, 3000);
		},

		getText: function(){
			//Function to get the source code.
			if(!jq(this).data("source-mode"))
				return jq(this).data("editor").html();
			else
				return jq(this).data("editor").children().first().text();
		},

		setText: function(text){
			//Function to set the source code
			if(!jq(this).data("source-mode"))
				jq(this).data("editor").html(text);
			else
				jq(this).data("editor").children().first().text(text);
		},

		setStyleWithCSS:function(){
			if(navigator.userAgent.match(/MSIE/i)){	//for IE10
				try {
                	Editor.execCommand("styleWithCSS", 0, false);
            	} catch (e) {
	                try {
	                    Editor.execCommand("useCSS", 0, true);
	                } catch (e) {
	                    try {
	                        Editor.execCommand('styleWithCSS', false, false);
	                    }
	                    catch (e) {
	                    }
	                }
            	}
			}
			else{
				document.execCommand("styleWithCSS", null, true);
			}
		},

		Save: function () {
            var story = document.createTextNode(jq(this).data('editor').text());
            var database = firebase.database();
            database.ref('stories/').set({
				storia1: story.wholeText
			});
            $scope.dati.story = story.wholeText;
            console.log($scope.dati.story);
            database.ref('users/' + currentAuth.uid + '/stories/').set({
                storia1: story.wholeText
			})
        }

	}

    jq.fn.Editor = function( method ){

		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			jq.error( 'Method ' +  method + ' does not exist on jQuery.Editor' );
		}
	};
    jq('#txtedit').Editor();

}
])
