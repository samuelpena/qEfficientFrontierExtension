//Define Global Variables
var submitPress = 0;
var Extension_path = Qva.Remote + "?public=only&name=Extensions/qEfficientFrontier/";

function qEfficientFrontier_Init() {
	Qv.AddExtension("qEfficientFrontier",
		function() {
			var _this = this;
			//-------------------------
			// Load External files
			//-------------------------
			// Add CSS
			//-------------------------
			Qva.LoadCSS(Extension_path + "css/style.css");
            Qva.LoadCSS(Extension_path + "css/demo.css");
            Qva.LoadCSS(Extension_path + "css/demo-print.css");	
			//-------------------------
			// Add javascript libraries
			//-------------------------
			Qva.LoadScript(Extension_path + "js/opencpu.js", function() {
                Qva.LoadScript(Extension_path + "js/json2.js", function(){
                    Qva.LoadScript(Extension_path + "js/jquery.js", function(){
                        Qva.LoadScript(Extension_path + "js/json-to-table.js", function(){
                            Qva.LoadScript(Extension_path + "js/jquery.dynatable.js", function(){
                                Qva.LoadScript(Extension_path + "js/underscore-min.js", function(){
                                    Qva.LoadScript(Extension_path + "js/raphael.js", function(){
                                        Qva.LoadScript(Extension_path + "js/g.raphael.js", function(){
                                            Qva.LoadScript(Extension_path + "js/g.pie.js", function(){
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });  
            
            setProps();
			$(_this.Element).empty();

			initLoadingPane();
            showLoadingPanel();
            initGrid();
            initFooter();
            //Need an if condition here to see if we should load data or submitted data)
            loadData();

            // ------------------------------------------------------
            // Set Properties
            // ------------------------------------------------------
            function setProps() {
                // Retrieve Props
                _this.WebserviceUrl = _this.Layout.Text0.text;
                _this.short_Parameter = _this.Layout.Text1.text;
                _this.max_allocation = _this.Layout.Text2.text;
                _this.risk_premium_up = _this.Layout.Text3.text;
                _this.risk_increment = _this.Layout.Text4.text;
                _this.dimLabel = new Array(); //is this the right place to put it?
            }

            // ------------------------------------------------------------------
            // Html structure
            // ------------------------------------------------------------------
            function initGrid() {

                var tableDiv = document.createElement("div");
                // see http://stackoverflow.com/questions/139000/div-with-overflowauto-and-a-100-wide-table-problem
                // for browsers < IE7
                tableDiv.style.overflow = "auto";
                tableDiv.style.height = _this.GetHeight() - 35 + "px";
                tableDiv.className = "divTable";

                var myTable = document.createElement("div");
                myTable.className = "tblDataSelection";
                myTable.id = "tblDataSelection_" + safeId(_this.Layout.ObjectId);

                tableDiv.appendChild(myTable);
                _this.Element.appendChild(tableDiv);
            }

            function initFooter() {
                var divStatusBar = document.createElement("div");
                divStatusBar.className = "statusBar";
                divStatusBar.id = "statusBar_" + safeId(_this.Layout.ObjectId); 

                // Statusbar-Content
                var divStatusContent = document.createElement("div");
                divStatusContent.className = "statusContent";
                divStatusContent.id = "statusContent_" + safeId(_this.Layout.ObjectId);
                divStatusBar.appendChild(divStatusContent);

                // Submit-Button
                var divSubmit = document.createElement("div"); 
                divSubmit.className = "divSubmit";
                var submitButton = document.createElement("input");
                submitButton.type = "button";
                submitButton.value = "Submit";
                if (!submitButton.addEventListener) {
                    //for IE8
                    submitButton.attachEvent("onclick", submitButton_Click);
                } else {
                    submitButton.addEventListener("click", submitButton_Click, false);
                }               
                divSubmit.appendChild(submitButton); 
                divStatusBar.appendChild(divSubmit);

                _this.Element.appendChild(divStatusBar);
            }

            // ------------------------------------------------------------------
            // Status Bar
            // ------------------------------------------------------------------

            function hideStatusBar() {
                $('#statusBar_' + safeId(_this.Layout.ObjectId)).hide();
            }
            function showStatusBar() {
                $('#statusBar_' + safeId(_this.Layout.ObjectId)).show();
            }

            function addStatusMsg(msg) {
                document.getElementById("statusContent_" + safeId(_this.Layout.ObjectId)).innerHTML = msg;
                showStatusBar();
            }

			// ------------------------------------------------------------------
            // Loading Panel
            // ------------------------------------------------------------------
			 function showLoadingPanel() {
                $("#loadingPanel_" + GetSafeId()).show();
            }

            function hideLoadingPanel() {
                $("#loadingPanel_" + GetSafeId()).hide();
            }

            function initLoadingPane() {

                var divLoader = document.createElement("div");
                divLoader.className = "divLoading";
                divLoader.id = "loadingPanel_" + GetSafeId();
				
                var imageUrl = GetImage("qEfficientFrontier", "loading.gif");
				var loadingMsg = document.createElement("div");
                loadingMsg.style.width = GetTableWidth();

                loadingMsg.style.textAlign = "center";
				
                var loadingInnerMsg = document.createElement("div");
                loadingInnerMsg.id = "loadingInnerMsg_" + GetSafeId();
                loadingInnerMsg.className = "loadingInnerMsg";

                var loadingImg = document.createElement("img");
                loadingImg.src = imageUrl;
                loadingImg.className = "loadingImg";
                loadingImg.style.paddingTop = (_this.GetHeight() / 2) - 40 + "px";

                loadingMsg.appendChild(loadingImg);
                loadingMsg.appendChild(loadingInnerMsg);
                divLoader.appendChild(loadingMsg);

                _this.Element.appendChild(divLoader);

            }

            // ------------------------------------------------------------------
            // Data related
            // ------------------------------------------------------------------
            function loadData() {
                hideLoadingPanel();
                var data = JsonTable(GetData());
                var jsonHtmlTable = ConvertJsonToTable(data.value, 'tblData_' + safeId(_this.Layout.ObjectId), 'dynatable-tblData', 'Download');

                $("#tblDataSelection_" + safeId(_this.Layout.ObjectId)).append(jsonHtmlTable);
                $('#tblData_' + safeId(_this.Layout.ObjectId)).dynatable({
                    table: {
                        defaultColumnIdStyle: 'myNewStyle'
                    },
                    features: {
                        paginate: false,
                        recordCount: false,
                        search: false,
                        perPageSelect: false
                    }
                });
            }            

			// ------------------------------------------------------------------
            // Internal Methods
            // ------------------------------------------------------------------
            function GetTableHeight() {
                return _this.GetHeight() - 35 + "px";
            }

            function GetTableWidth() {
                return _this.GetWidth() + "px";
            }

            function safeId(str) {
                return str.replace("\\", "_");
            }

            function GetSafeId() {
                return safeId(_this.Layout.ObjectId);
            }

            function GetImage(ext, filename) {
            	return Qva.Remote+(Qva.Remote.indexOf("?")>=0?"&":"?")+"public=only"+"&name=Extensions/"+ext+"/img/"+filename;
            }

            function SetDimensionLabel(elementLabel) {
                //BUG: Pushing out the same element twice [x, y, x, y]
                _this.dimLabel.push(elementLabel);
            }

            function GetDimensionLabel() {
                //BUG: Element is repeated twice therefore will slice it in half
                //var halfArray = _this.dimLabel.length/2;
                //var arrayTemp = _this.dimLabel.splice(halfArray,halfArray);
                //console.log(_this.dimLabel.splice(halfArray,halfArray));
                return _this.dimLabel;
            }

            function GetData(){
                if (!Qva.Public.Wrapper.prototype.getData) {
                        var data = {},
                        header = _this.Data.HeaderRows[0],
                        i = 0;
                        data.Rows = _this.Data.Rows;
                        data.Column = Object.keys(data.Rows[0]).map(function(c) {
                            return data.Rows.map(function(r) {
                                return r[c];
                            });
                        });
                        data.Column.forEach(function(element, index) {
                            element.type = element[0].color === undefined ? "expression" : "dimension";
                            element.label = header[index].text;
                            if(element.type == "dimension") {SetDimensionLabel(element.label)};
                        });
                        return data;
                }    
            }
            
            function JsonTable(data) {
                var jsonData = new Object();
                var arrayData = new Array();
                var arrayType = new Array();
                jsonData={data:{},type:{}};
                    for(var rowIx = 0; rowIx < data.Rows.length; rowIx++) {
                        for(var colIx = 0; colIx < data.Column.length; colIx++) {
                            jsonData.data[data.Column[colIx].label] = data.Rows[rowIx][colIx].text;
                            if(rowIx == data.Rows.length-1 )
                            {
                                jsonData.type[data.Column[colIx].label] = data.Column[colIx].type;
                            }
                        }
                        //http://stackoverflow.com/questions/25025629/values-messed-up-when-pushing-multi-level-object-literal-to-array
                        arrayData.push($.extend(true, {}, jsonData.data));
                        if(rowIx == data.Rows.length-1 )
                        {
                            arrayType.push($.extend(true, {}, jsonData.type));
                        }
                    }
                var item = {
                            "value":arrayData,
                            "type": arrayType 
                        }
                //returns JSON object with 2 items
                //value: contains all the data by rows
                //type: contains if the column is a dimension or expression
                return item;
            }

            function ConvertJson(data) {
                var jsonData  = new Object();
                jsonData={data:{},type:{}, param:{}};
                var arrayTemp = new Array();
                    for(var colIx = 0; colIx < data.Column.length; colIx++) {
                        for(var rowIx = 0; rowIx < data.Rows.length; rowIx++) {
                            arrayTemp[rowIx] = data.Column[colIx][rowIx].text;
                        }
                        jsonData.data[data.Column[colIx].label] = arrayTemp.slice();
                        jsonData.type[data.Column[colIx].label] = data.Column[colIx].type;
                        //http://stackoverflow.com/questions/25025629/values-messed-up-when-pushing-multi-level-object-literal-to-array
                    }

                    jsonData.param['short'] = _this.short_Parameter;
                    jsonData.param['max_allocation'] = _this.max_allocation;
                    jsonData.param['risk_premium_up'] = _this.risk_premium_up;
                    jsonData.param['risk_increment'] =  _this.risk_increment;
                //returns JSON object with 3 items
                //value: contains all the data by rows
                //type: contains if the column is a dimension or expression
                return jsonData;
            }

            // ------------------------------------------------------------------
            // Events ...
            // ------------------------------------------------------------------

            function submitButton_Click() {
                $("#tblDataSelection_" + GetSafeId()).hide();
                showLoadingPanel();
                var jsonDataR = ConvertJson(GetData());
                //set CORS to call "efficientFrontier" package on public server
                ocpu.seturl(_this.WebserviceUrl);
                
                //to run with different data, edit and press Run at the top of the page
                 var req = ocpu.rpc("eff_frontier",{
                        Data : jsonDataR
                    }, function(output){

                         //TODO: I need to move this outside of the submit button eventually
                        //Empty thye tag to set room for the new object and show the div tag if not you will experience a bug!
                        $("#tblDataSelection_" + GetSafeId()).empty();
                        //http://www.shanison.com/2010/07/18/raphael-pie-chart-legend-stacked-line-problem/
                        $("#tblDataSelection_" + GetSafeId()).show();
                        var iFrameWidth = _this.GetWidth();
                        var iFrameHeight = _this.GetHeight();

                        /* Title setting */
                        title = 'Optimized Portfolio From R';
                        titleXpos = 390;
                        titleYpos = 55;

                        /* Pie Data */
                        pieRadius = 130;
                        pieXpos = 150;
                        pieYpos = 150;
                        pieData =new Array();
                        pieLegend =new Array();
                        pieLegendPos = "east";

                        //-------------------------------------------------------
                        // Converting json to array
                        _.each(output, function (value, key){
                            _.each(value, function (value,key){
                                
                                pieLegend.push("%%.%% – " + key); 
                                pieData.push(value);                                
                            })
                        });
                        
                        var divName = document.getElementById("tblDataSelection_" + safeId(_this.Layout.ObjectId));
                        
                        var r = Raphael(divName, iFrameWidth-23, iFrameHeight-46);
                        
                        r.text(titleXpos, titleYpos, title).attr({"font-size": 20});
                        
                        var pie = r.piechart(pieXpos, pieYpos, pieRadius, pieData, {legend: pieLegend, legendpos: pieLegendPos});
                            pie.hover(function () {
                            this.sector.stop();
                            this.sector.scale(1.1, 1.1, this.cx, this.cy);
                            if (this.label) {
                                this.label[0].stop();
                                this.label[0].scale(1.1);
                                this.label[1].attr({"font-weight": 800});
                            }
                        }, function () {
                    //      this.sector.animate({scale: [0.9, 0.9, this.cx, this.cy]}, 500, "bounce");
                            this.sector.scale(0.9091, 0.9091, this.cx, this.cy);
                            if (this.label) {
                    //          this.label[0].animate({scale: 0.9}, 500, "bounce");
                                this.label[0].scale(0.9091);
                                this.label[1].attr({"font-weight": 400});
                            }
                        });
                                                
                        hideLoadingPanel();

                    }); 
                    //optional
                    req.fail(function(){
                        alert("R returned an error: " + req.responseText); 
                    });
            }
		}
	)
}



//Runs Efficient Frontier Init()
qEfficientFrontier_Init();