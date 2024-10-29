
  sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device",
    "sap/m/MessageToast", // Import MessageToast for user feedback
    "sap/ui/core/UIComponent",
], function (Controller,Device, MessageToast,UIComponent) {

    "use strict";

    return Controller.extend("com.app.rfapp.controller.HuQuery", {

        onInit: function () {
            const oTable = this.getView().byId("idHuDetailsTable_HuQuery");
            oTable.attachBrowserEvent("dblclick", this.onRowDoubleClick.bind(this));
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
            var oProductDescriptionHeader = this.byId("_IDGenText5");
            var oModel = new sap.ui.model.json.JSONModel(sap.ui.require.toUrl("com/app/rfapp/model/data1.json"));
            this.getView().setModel(oModel);
            var i18nModel = this.getOwnerComponent().getModel("i18n");
            // var oQuantityHeader = this.byId("_IDGenText3");
            // var oInput = this.byId("_IDGenInput1"); // Replace with your input field ID
            
            // if (Device.system.phone) {
            //     oQuantityHeader.setText(i18nModel.getResourceBundle().getText("qty"));
            //     oProductDescriptionHeader.setText(i18nModel.getResourceBundle().getText("pr.des"));
            // } else {
            //     oQuantityHeader.setText(i18nModel.getResourceBundle().getText("quantity"));
            //     oProductDescriptionHeader.setText(i18nModel.getResourceBundle().getText("productdescription"));
            // }
        
            // this._setFocus();
        },

        onRowDoubleClick: function () {
            this.getView().byId("idFourthSreen_HuQuery").setVisible(true);
            this.getView().byId("idScrollContainerInSecondScreen_HuQuery").setVisible(false);
            this.getView().byId("idSecondScreenBackBtn_HuQuery").setVisible(false);
            this.getView().byId("idFourthScreenBackbtn_HuQuery").setVisible(true);
           
         
        },

        onLiveHuQueryValidatioInFirstScreen_HuQuery:function (){
                this.getView().byId("idScrollContainerInFirstSreen_HuQuery").setVisible(false);
                this.getView().byId("idScrollContainerInSecondScreen_HuQuery").setVisible(true);
                this.getView().byId("idFirstScreenBackbtn_HuQuery").setVisible(false);
                this.getView().byId("idSecondScreenBackBtn_HuQuery").setVisible(true);
        },

        onSecondScreenBackBtnPressInHuQuery:function (){
            this.getView().byId("idScrollContainerInFirstSreen_HuQuery").setVisible(true);
                this.getView().byId("idScrollContainerInSecondScreen_HuQuery").setVisible(false);
                this.getView().byId("idFirstScreenBackbtn_HuQuery").setVisible(true);
                this.getView().byId("idSecondScreenBackBtn_HuQuery").setVisible(false);

        },

        onThirdScreenBackbtnPressInHuQuery:function (){
            this.getView().byId("idScrollContainerInSecondScreen_HuQuery").setVisible(true);
                this.getView().byId("idThirdSreen_HuQuery").setVisible(false);
                this.getView().byId("idThirdScreenBackbtn_HuQuery").setVisible(false);
                this.getView().byId("idSecondScreenBackBtn_HuQuery").setVisible(true);

        },

        onFirstScreenBackbtnPressInHuQuery: async function () {
            var oRouter = UIComponent.getRouterFor(this);
            var oModel1 = this.getOwnerComponent().getModel();
            await oModel1.read("/RESOURCESSet('" + this.ID + "')", {
                success: function (oData) {
                    let oUser=oData.Users.toLowerCase()
                    if(oUser ===  "resource"){
                        oRouter.navTo("RouteResourcePage",{id:this.ID});
                    }
                    else{
                    oRouter.navTo("Supervisor",{id:this.ID});
                }
                }.bind(this),
                error: function () {
                    MessageToast.show("User does not exist");
                }
             
            });  
    
        },

        onSelectParticularProuctIn_HUQuery:function() {
            this.getView().byId("idFourthSreen_HuQuery").setVisible(true);
            this.getView().byId("idThirdSreen_HuQuery").setVisible(false);
            this.getView().byId("idThirdScreenBackbtn_HuQuery").setVisible(false);
            this.getView().byId("idFourthScreenBackbtn_HuQuery").setVisible(true);

        },

        onFourthScreenBackbtnPressInHuQuery:function() {
            this.getView().byId("idFourthSreen_HuQuery").setVisible(false);
            this.getView().byId("idScrollContainerInSecondScreen_HuQuery").setVisible(true);
            this.getView().byId("idSecondScreenBackBtn_HuQuery").setVisible(true);
            this.getView().byId("idFourthScreenBackbtn_HuQuery").setVisible(false);

        },

        onHUDetailtPressInHuQuery:function (){
            this.getView().byId("idScrollContainerInSecondScreen_HuQuery").setVisible(false);
                this.getView().byId("idThirdSreen_HuQuery").setVisible(true);
                this.getView().byId("idThirdScreenBackbtn_HuQuery").setVisible(true);
                this.getView().byId("idSecondScreenBackBtn_HuQuery").setVisible(false);

        },

        // onRowDoubleClick: function () {
        //     var oSelected = this.byId("simpleTable").getSelectedItem();
        //     console.log(oSelected.getBindingContext().getObject());
        //     var oObj=oSelected.getBindingContext().getObject()
        //     this.onSelectRow(oObj.HUI);
           
        // },
        // onSelectRow:function(oHui){
        //     this.getView().byId("_IDGenButton1122").setVisible(false);
        //     this.getView().byId("_IDGenButton1111").setVisible(true)
        //     this.getView().byId("icon4").setVisible(false);
        //     this.getView().byId("icon2").setVisible(true)
        //     if (oHui) {
        //         // Call OData service to validate the HU value
        //         var oModel = this.getOwnerComponent().getModel();
        //         var that = this;

        //         oModel.read(`/HudetailsSet('${oHui}')`, {
        //             urlParameters: {
        //                 "$expand": "Hudetails_ItemSet",
        //                 "$format": "json"
        //             },
        //             success: function (odata) {
                        // If HU exists, show icon2 and hide icon1
                        // that.getView().byId("icon2").setVisible(true);
                        // that.getView().byId("icon1").setVisible(false);
                        // that.getView().byId("_IDGenButton1111").setVisible(true);
                        // that.getView().byId("_IDGenButton1122").setVisible(false);
                        // that.getView().byId("_IDGenButton1133").setVisible(false);
                        // Optionally, you can also populate fields here based on the result
        //                 that._populateHUDetails(odata);
        //             },
        //             error: function (oError) {
        //                 // Show error message if HU is not found    
        //             }
        //         });
        //     } else {
        //         // Reset view if input is cleared
        //         this.getView().byId("icon2").setVisible(false);
        //         this.getView().byId("icon1").setVisible(true);
        //     }

        // },
        // onResourceDetailsLoad:function(oEvent1){
        //     var that = this;
        //     const { id } = oEvent1.getParameter("arguments");
        //     this.ID = id;
        //     console.log(this.ID);
        // },

        // _setFocus: function() {
        //     var oInput = this.byId("_IDGenInput1");
        //     if (oInput) {
        //         oInput.focus();
        //     }
        // },

        // onBeforeRendering: function() {
        //     this.getView().byId("_IDGenButton1133").setVisible(true);   

        // },
        // onItemSelect: function (oEvent) {
        //     var oItem = oEvent.getParameter("item");
        //     this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));
        // },
        // onScanSuccess: function(oEvent) {
        //     debugger
        //     // Get the scanned text from the event
        //     var scannedText = oEvent.getParameter("text");
        //     var othis = this;
        
        //     // Check if the scan was cancelled
        //     if (oEvent.getParameter("cancelled")) {
        //         // Show a message toast if the scan is cancelled
        //         sap.m.MessageToast.show("Scan cancelled", { duration: 1000 });
        //     } else if (scannedText) {
        //         // If the scanned text exists, find the input field by its ID
        //         var oInput = this.byId("_IDGenInput1"); // Assuming the input field ID is '_IDGenInput1'
                
        //         // Update the input field's value with the scanned text
        //         oInput.setValue(scannedText);
        
        //         // Optionally, display a success message
        //         sap.m.MessageToast.show("Scanned successfully: " + scannedText);
        //         othis.onLiveHuProcess(scannedText);
        //     } else {
        //         // If no text is scanned, set the input field to empty
        //         this.byId("_IDGenInput1").setValue("");
        //         sap.m.MessageToast.show("No barcode text found", { duration: 1000 });
        //     }
        // },
        
        // // Live validation logic
        // onLiveHuValidation: function (oEvent) {
        //     debugger
        //     var oInput = oEvent.getSource();
        //     var oHuValue = oInput.getValue().trim();

        //     if (oHuValue) {
        //         // Call OData service to validate the HU value
        //         var oModel = this.getOwnerComponent().getModel();
        //         var that = this;

        //         oModel.read(`/HudetailsSet('${oHuValue}')`, {
        //             urlParameters: {

        //                 "$expand": "Hudetails_ItemSet",
        //                 "$format": "json"
        //             },
        //             success: function (odata) {
        //                 // If HU exists, show icon2 and hide icon1
        //                 that.getView().byId("icon2").setVisible(true);
        //                 that.getView().byId("icon1").setVisible(false);
        //                 that.getView().byId("_IDGenButton1111").setVisible(true);
        //                 that.getView().byId("_IDGenButton1122").setVisible(false);
        //                 that.getView().byId("_IDGenButton1133").setVisible(false);
        //                 // Optionally, you can also populate fields here based on the result
        //                 that._populateHUDetails(odata);
        //             },
        //             error: function (oError) {
        //                 // Show error message if HU is not found 
        //             }
        //         });
        //     } else {
        //         // Reset view if input is cleared
        //         this.getView().byId("icon2").setVisible(false);
        //         this.getView().byId("icon1").setVisible(true);
        //     }
        // },

        // Function to populate HU details when successful
        // _populateHUDetails: function (odata) {
        //     this.byId("_IDGenInput2").setValue(odata.Huident);
        //     this.byId("_IDGenInput3").setValue(odata.Letyp);
        //     this.byId("_IDGenInputLength").setValue(odata.Length);
        //     this.byId("_IDGenInputWidth").setValue(odata.Width);
        //     this.byId("_IDGenInputHeight").setValue(odata.Height);
        //     this.byId("_IDGenInputTareWeight").setValue(odata.TWeight);
        //     this.byId("_IDGenInputNetWeight").setValue(odata.NWeight);
        //     this.byId("_IDGenInputGrossWeight").setValue(odata.GWeight);
        //     this.byId("_IDGenInputweightsMesurement").setValue(odata.UnitGw);
        //     this.byId("_IDGenInputMesurement").setValue(odata.UnitLwh);
        //     this.byId("_IDGenInputMesurement").setValue(odata.GVolume);
        // },
        // onLiveHuProcess: function (scannedText) {
        //     var oInput = parseInt(scannedText);
        //     var oHuValue = oInput;

        //     if (oHuValue) {
        //         // Call OData service to validate the HU value
        //         var oModel = this.getOwnerComponent().getModel();
        //         var that = this;

        //         oModel.read(`/Hu_ContentSet('${oHuValue}')`, {
        //             success: function (odata) {
        //                 // If HU exists, show icon2 and hide icon1
        //                 that.getView().byId("icon2").setVisible(true);
        //                 that.getView().byId("icon1").setVisible(false);

        //                 // Optionally, you can also populate fields here based on the result
        //                 that._populateHUDetails(odata);
        //                 that.getView().byId("_IDGenButton1111").setVisible(true);
        //                 that.getView().byId("_IDGenButton1122").setVisible(false);
        //                 that.getView().byId("_IDGenButton1133").setVisible(false);
        //             },
        //             error: function (oError) {
        //                 // Show error message if HU is not found
                      
                        
                        
        //             }
        //         });
        //     } else {
        //         // Reset view if input is cleared
        //         this.getView().byId("icon2").setVisible(false);
        //         this.getView().byId("icon1").setVisible(true);
        //     }
        // },

        // Function to populate HU details when successful
        // _populateHUDetails: function (odata) {
        //     this.byId("_IDGenInput2").setValue(odata.Tophu);
        //     this.byId("_IDGenInput3").setValue(odata.Letyp);
        //     this.byId("_IDGenInputLength").setValue(odata.Length);
        //     this.byId("_IDGenInputWidth").setValue(odata.Width);
        //     this.byId("_IDGenInputHeight").setValue(odata.Height);
        //     this.byId("_IDGenInputTareWeight").setValue(odata.TWeight);
        //     this.byId("_IDGenInputNetWeight").setValue(odata.NWeight);
        //     this.byId("_IDGenInputGrossWeight").setValue(odata.GWeight);
        //     this.byId("_IDGenInputWeightsMeasurement").setValue(odata.UnitGw);
        //     this.byId("_IDGenInputMesurement").setValue(odata.UnitLwh);
        //     this.byId("_IDGenInputMesurement").setValue(odata.GVolume);
        // },

        // Submit button logic (if necessary)
        // Onpresssubmit: function () {
        // // Submit button logic (if necessary)
        // Onpresssubmit: function () {

        //     this.getView().byId("icon1").setVisible(false);
        //     this.getView().byId("icon2").setVisible(true);
        //     this.getView().byId("_IDGenButton1111").setVisible(true);
        //     this.getView().byId("_IDGenButton1133").setVisible(false);
        //     var oHu = this.byId("_IDGenInput1").getValue();
        //     debugger
        //     /**Getting Model */
        //     var oModel = this.getOwnerComponent().getModel();
        //     var that = this;
            
        //     oModel.read(`/Hu_ContentSet('${oHu}')`, {
        //         success: function (odata) {
                    
                  
        //            /* odata.Matid
        //             odata.Quan
        //             odata.Meins
                   
                    
                  
                   
                    
                   
        //             odata.UnitLwh
        //             odata.UnitGw
                    
                //     odata.UnitTv
                //     odata.Lgpla 
                //     that.byId("_IDGenInput2").setValue(odata.Huident);
                //     that.byId("_IDGenInput3").setValue( odata.Letyp);
                //     that.byId("_IDGenInputLength").setValue(odata.Length);
                //     that.byId("_IDGenInputWidth").setValue(odata.Width);
                //     that.byId("_IDGenInputHeight").setValue(odata.Height);
                //     that.byId("_IDGenInputTareWeight").setValue(odata.TWeight);
                //     that.byId("_IDGenInputNetWeight").setValue(odata.NWeight);
                //     that.byId("_IDGenInputGrossWeight").setValue(odata.GWeight);
                //     that.byId("_IDGenInputweightsMesurement").setValue(odata.UnitGw);
                //     that.byId("_IDGenInputMesurement").setValue(odata.UnitLwh);
                //     that.byId("_IDGenInputMesurement").setValue(odata.GVolume);
                //     that.getView().byId("icon1").setVisible(false);
                //     that.getView().byId("icon2").setVisible(true);
                //     that.getView().byId("_IDGenButton1111").setVisible(true);
                // }, error: function (oError) {
                   
        //             odata.UnitTv
        //             odata.Lgpla */
        //             that.byId("_IDGenInput2").setValue(odata.Huident);
        //             that.byId("_IDGenInput3").setValue( odata.Letyp);
        //             that.byId("_IDGenInputLength").setValue(odata.Length);
        //             that.byId("_IDGenInputWidth").setValue(odata.Width);
        //             that.byId("_IDGenInputHeight").setValue(odata.Height);
        //             that.byId("_IDGenInputTareWeight").setValue(odata.TWeight);
        //             that.byId("_IDGenInputNetWeight").setValue(odata.NWeight);
        //             that.byId("_IDGenInputGrossWeight").setValue(odata.GWeight);
        //             that.byId("_IDGenInputweightsMesurement").setValue(odata.UnitGw);
        //             that.byId("_IDGenInputMesurement").setValue(odata.UnitLwh);
        //             that.byId("_IDGenInputMesurement").setValue(odata.GVolume);
        //             that.getView().byId("icon1").setVisible(false);
        //             that.getView().byId("icon2").setVisible(true);
        //             that.getView().byId("_IDGenButton1111").setVisible(true);
        //         }, error: function (oError) {
        //             sap.m.MessageBox.error("Error");

        //         }
        //     })

        // },
//         Onpressback3:async function(){
//             var oRouter = UIComponent.getRouterFor(this);
//                 var oModel1 = this.getOwnerComponent().getModel();
//                 await oModel1.read("/RESOURCESSet('" + this.ID + "')", {
//                     success: function (oData) {
//                         let oUser=oData.Users.toLowerCase()
//                         if(oUser ===  "resource"){
//                             oRouter.navTo("RouteResourcePage",{id:this.ID});
//                         }
//                         else{
//                         oRouter.navTo("Supervisor",{id:this.ID});
//                     }
//                     }.bind(this),
//                     error: function () {
//                         MessageToast.show("User does not exist");
//                     }
//                 });
         
//             },
        
//         onHUContentPress: function () {
//             var oHu=this.getView().byId("_IDGenInput2").getValue();
//             var oModel = this.getOwnerComponent().getModel();
//             var that=this
//             oModel.read(`/HudetailsSet('${oHu}')`, {
//                 urlParameters: {
//                     "$expand": "Hudetails_ItemSet",
//                     "$format": "json"
//                 },
//                 success: function (odata) {
//                     // If HU exists, show icon2 and hide icon1
//                     if(odata.Top===true){
//                         console.log("True")
//                           // Get the product details from the response
//                     let oDetails = odata.Hudetails_ItemSet.results;
//                     console.log(oDetails);
       
//                     // Prepare an array for binding
//                     var aProductDetails = [];
       
//                     // Loop through the results and push them into the array
//                     for (var i = 0; i < oDetails.length; i++) {
//                         aProductDetails.push({
//                            Product: oDetails[i].Matnr,
//                             Quantity: oDetails[i].Qty,
//                           SLNO:i+1,
//                           Uom: oDetails[i].Meins,
//                           Pd:oDetails[i].Maktx

//                         });
//                     }
       
//                     // Create a JSON model with the product details array
//                     var oProductModel = new sap.ui.model.json.JSONModel({ products: aProductDetails });
       
//                     // Set the model to the table
//                     that.byId("HuDetailsTable").setModel(oProductModel);
       
//                     // Bind the items aggregation of the table to the products array in the model
//                     that.byId("HuDetailsTable").bindItems({
//                         path: "/products",
//                         template: new sap.m.ColumnListItem({
//                             cells: [
//                                 new sap.m.Text({ text: "{SLNO}" }), 
//                                 new sap.m.Text({ text: "{Product}" }), 
//                                 new sap.m.Text({ text: "{Quantity}" }),   
//                                 new sap.m.Text({ text: "{Uom}" }),
//                                 new sap.m.Text({ text: "{Pd}" }),
                               
//                             ]
//                         })
//                     });
//                     }
//                     else {
                        
//                       console.log(false)
//                       let oDetails = odata.Hudetails_ItemSet.results;
//                       console.log(oDetails);
//                       oDetails = oDetails.filter(item => item.HuidentI== oHu)
//                       // Prepare an array for binding
//                       var aProductDetails = [];
         
//                       // Loop through the results and push them into the array
//                       for (var i = 0; i < oDetails.length; i++) {
//                         aProductDetails.push({
//                            Product: oDetails[i].Matnr,
//                             Quantity: oDetails[i].Qty,
//                           SLNO:i+1,
//                           Uom: oDetails[i].Meins,
//                           Pd:oDetails[i].Maktx

//                         });
//                     }
         
//                       // Create a JSON model with the product details array
//                       var oProductModel = new sap.ui.model.json.JSONModel({ products: aProductDetails });
         
//                       // Set the model to the table
//                       that.byId("HuDetailsTable").setModel(oProductModel);
         
//                       // Bind the items aggregation of the table to the products array in the model
//                       that.byId("HuDetailsTable").bindItems({
//                           path: "/products",
//                           template: new sap.m.ColumnListItem({
//                               cells: [
//                                   new sap.m.Text({ text: "{SLNO}" }), 
//                                   new sap.m.Text({ text: "{Product}" }), 
//                                   new sap.m.Text({ text: "{Quantity}" }),   
//                                   new sap.m.Text({ text: "{Uom}" }),
//                                   new sap.m.Text({ text: "{Pd}" }),
                                 
//                               ]
//                           })
//                       });
//                     }
//                 },
//                 error: function (oError) {
//                     // Show error message if HU is not found
//                    console.log(oError)
                    
//                 }
//             });

//             this.getView().byId("icon1").setVisible(false);
//             this.getView().byId("icon2").setVisible(false);
//             this.getView().byId("icon3").setVisible(true);
//             this.getView().byId("icon4").setVisible(false);
//             this.getView().byId("_IDGenButton1111").setVisible(false);
//             this.getView().byId("_IDGenButton1122").setVisible(true);
//             this.getView().byId("_IDGenButton1133").setVisible(false);

//         },
//         onHUHierarchyPress: function () {
//             var oHu=this.getView().byId("_IDGenInput2").getValue()
//             var oModel = this.getOwnerComponent().getModel();
//             var that=this
//             oModel.read(`/HudetailsSet('${oHu}')`, {
//                 urlParameters: {
//                     "$expand": "Hudetails_ItemSet",
//                     "$format": "json"
//                 },
               
//                 success: function (odata) {
//                     console.log(odata);
                   
       
//                     // Get the product details from the response
//                     let oDetails = odata.Hudetails_ItemSet.results;
//                     console.log(oDetails);
       
//                     // Prepare an array for binding
//                     var aProductDetails = [];
       
//                     // Loop through the results and push them into the array
//                     for (var i = 0; i < oDetails.length; i++) {
//                         aProductDetails.push({
//                            HUI: oDetails[i].HuidentI,
//                             HU: odata.Parent,
//                           SLNO:i+1
//                         });
//                     }
       
//                     // Create a JSON model with the product details array
//                     var oProductModel = new sap.ui.model.json.JSONModel({ products: aProductDetails });
       
//                     // Set the model to the table
//                     that.byId("simpleTable").setModel(oProductModel);
       
//                     // Bind the items aggregation of the table to the products array in the model
//                     that.byId("simpleTable").bindItems({
//                         path: "/products",
//                         template: new sap.m.ColumnListItem({
//                             cells: [
//                                 new sap.m.Text({ text: "{SLNO}" }), 
//                                 new sap.m.Text({ text: "{HUI}" }), 
//                                 new sap.m.Text({ text: "{HU}" }),   
                               
//                             ]
//                         })
//                     });
//                 },
//                 error: function () {
//                     sap.m.MessageToast.show("Error fetching products.");
//                 }
//             });

//             this.getView().byId("icon1").setVisible(false);
//             this.getView().byId("icon2").setVisible(false);
//             this.getView().byId("icon3").setVisible(false);
//             this.getView().byId("icon4").setVisible(true);
//             this.getView().byId("_IDGenButton1111").setVisible(false);
//             this.getView().byId("_IDGenButton1122").setVisible(true);
//    this.getView().byId("_IDGenButton1133").setVisible(false);
          
//         },


//         Onpressback1: function () {
//            debugger
//             this.getView().byId("icon1").setVisible(false);
//             this.getView().byId("icon2").setVisible(true);
//             this.getView().byId("icon3").setVisible(false);
//             this.getView().byId("icon4").setVisible(false);
//             this.getView().byId("_IDGenButton1111").setVisible(true);
//             this.getView().byId("_IDGenButton1122").setVisible(false);
//             this.byId("_IDGenInput1").setValue("");


//         },
//         Onpressback2: function () {

//             this.getView().byId("icon1").setVisible(true);
//             this.getView().byId("icon2").setVisible(false);
//             this.getView().byId("icon3").setVisible(false);
//             this.getView().byId("icon4").setVisible(false);
//             this.byId("_IDGenInput1").setValue("");
//             this.getView().byId("_IDGenButton1133").setVisible(true);
//             this.getView().byId("_IDGenButton1111").setVisible(false);
         

//         },
//         Submit: function () {

//         },
//         onAfterRendering: function () {
//             var oInput = this.byId("_IDGenInput1"); // Replace with your input field ID
//             if (oInput) {
//                 setTimeout(function () {
//                     oInput.focus();
//                 }, 100); // Adjust the delay if needed
//             }
//         }

        


    });
});
  