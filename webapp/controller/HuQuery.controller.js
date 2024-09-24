
  sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device",
    "sap/m/MessageToast", // Import MessageToast for user feedback
    "sap/ui/core/UIComponent"
], function (Controller,Device, MessageToastFra,UIComponent) {
    "use strict";

    return Controller.extend("com.app.rfapp.controller.HuQuery", {

        onInit: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
            var oProductDescriptionHeader = this.byId("_IDGenText5");
            var oModel = new sap.ui.model.json.JSONModel(sap.ui.require.toUrl("com/app/rfapp/model/data1.json"));
            this.getView().setModel(oModel);
            var i18nModel = this.getOwnerComponent().getModel("i18n");
            var oQuantityHeader = this.byId("_IDGenText3");
            var oInput = this.byId("_IDGenInput1"); // Replace with your input field ID
            
            if (Device.system.phone) {
                oQuantityHeader.setText(i18nModel.getResourceBundle().getText("qty"));
                oProductDescriptionHeader.setText(i18nModel.getResourceBundle().getText("pr.des"));
            } else {
                oQuantityHeader.setText(i18nModel.getResourceBundle().getText("quantity"));
                oProductDescriptionHeader.setText(i18nModel.getResourceBundle().getText("productdescription"));
            }
        
          
            this._setFocus();
            
        },
        onResourceDetailsLoad:function(oEvent1){
            var that = this;
            const { id } = oEvent1.getParameter("arguments");
            this.ID = id;
            console.log(this.ID);
        },

        _setFocus: function() {
            var oInput = this.byId("_IDGenInput1");
            if (oInput) {
                oInput.focus();
            }
        },

         onBeforeRendering: function() {
            this.getView().byId("_IDGenButton1133").setVisible(true);   

        },
        onItemSelect: function (oEvent) {
            var oItem = oEvent.getParameter("item");
            this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));
        },
        onScanSuccess: function(oEvent) {
            debugger
            // Get the scanned text from the event
            var scannedText = oEvent.getParameter("text");
            var othis = this;
        
            // Check if the scan was cancelled
            if (oEvent.getParameter("cancelled")) {
                // Show a message toast if the scan is cancelled
                sap.m.MessageToast.show("Scan cancelled", { duration: 1000 });
            } else if (scannedText) {
                // If the scanned text exists, find the input field by its ID
                var oInput = this.byId("_IDGenInput1"); // Assuming the input field ID is '_IDGenInput1'
                
                // Update the input field's value with the scanned text
                oInput.setValue(scannedText);
        
                // Optionally, display a success message
                sap.m.MessageToast.show("Scanned successfully: " + scannedText);
                othis.onLiveHuProcess(scannedText);
            } else {
                // If no text is scanned, set the input field to empty
                this.byId("_IDGenInput1").setValue("");
                sap.m.MessageToast.show("No barcode text found", { duration: 1000 });
            }
        },
        
        // Live validation logic
        onLiveHuValidation: function (oEvent) {
            debugger
            var oInput = oEvent.getSource();
            var oHuValue = oInput.getValue().trim();

            if (oHuValue) {
                // Call OData service to validate the HU value
                var oModel = this.getOwnerComponent().getModel();
                var that = this;

                oModel.read(`/Hu_ContentSet('${oHuValue}')`, {
                    success: function (odata) {
                        // If HU exists, show icon2 and hide icon1
                        that.getView().byId("icon2").setVisible(true);
                        that.getView().byId("icon1").setVisible(false);
                        that.getView().byId("_IDGenButton1111").setVisible(true);
                        that.getView().byId("_IDGenButton1122").setVisible(false);
                        that.getView().byId("_IDGenButton1133").setVisible(false);
                        // Optionally, you can also populate fields here based on the result
                        that._populateHUDetails(odata);
                    },
                    error: function (oError) {
                        // Show error message if HU is not found
                       
                        
                    }
                });
            } else {
                // Reset view if input is cleared
                this.getView().byId("icon2").setVisible(false);
                this.getView().byId("icon1").setVisible(true);
            }
        },

        // Function to populate HU details when successful
        _populateHUDetails: function (odata) {
            this.byId("_IDGenInput2").setValue(odata.Huident);
            this.byId("_IDGenInput3").setValue(odata.Letyp);
            this.byId("_IDGenInputLength").setValue(odata.Length);
            this.byId("_IDGenInputWidth").setValue(odata.Width);
            this.byId("_IDGenInputHeight").setValue(odata.Height);
            this.byId("_IDGenInputTareWeight").setValue(odata.TWeight);
            this.byId("_IDGenInputNetWeight").setValue(odata.NWeight);
            this.byId("_IDGenInputGrossWeight").setValue(odata.GWeight);
            this.byId("_IDGenInputweightsMesurement").setValue(odata.UnitGw);
            this.byId("_IDGenInputMesurement").setValue(odata.UnitLwh);
            this.byId("_IDGenInputMesurement").setValue(odata.GVolume);
        },
        onLiveHuProcess: function (scannedText) {
            var oInput = parseInt(scannedText);
            var oHuValue = oInput;

            if (oHuValue) {
                // Call OData service to validate the HU value
                var oModel = this.getOwnerComponent().getModel();
                var that = this;

                oModel.read(`/Hu_ContentSet('${oHuValue}')`, {
                    success: function (odata) {
                        // If HU exists, show icon2 and hide icon1
                        that.getView().byId("icon2").setVisible(true);
                        that.getView().byId("icon1").setVisible(false);

                        // Optionally, you can also populate fields here based on the result
                        that._populateHUDetails(odata);
                        that.getView().byId("_IDGenButton1111").setVisible(true);
                        that.getView().byId("_IDGenButton1122").setVisible(false);
                        that.getView().byId("_IDGenButton1133").setVisible(false);
                    },
                    error: function (oError) {
                        // Show error message if HU is not found
                      
                        
                        
                    }
                });
            } else {
                // Reset view if input is cleared
                this.getView().byId("icon2").setVisible(false);
                this.getView().byId("icon1").setVisible(true);
            }
        },

        // Function to populate HU details when successful
        _populateHUDetails: function (odata) {
            this.byId("_IDGenInput2").setValue(odata.Huident);
            this.byId("_IDGenInput3").setValue(odata.Letyp);
            this.byId("_IDGenInputLength").setValue(odata.Length);
            this.byId("_IDGenInputWidth").setValue(odata.Width);
            this.byId("_IDGenInputHeight").setValue(odata.Height);
            this.byId("_IDGenInputTareWeight").setValue(odata.TWeight);
            this.byId("_IDGenInputNetWeight").setValue(odata.NWeight);
            this.byId("_IDGenInputGrossWeight").setValue(odata.GWeight);
            this.byId("_IDGenInputweightsMesurement").setValue(odata.UnitGw);
            this.byId("_IDGenInputMesurement").setValue(odata.UnitLwh);
            this.byId("_IDGenInputMesurement").setValue(odata.GVolume);
        },

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
        Onpressback3:async function(){
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
        
        onHUContentPress: function () {


            this.getView().byId("icon1").setVisible(false);
            this.getView().byId("icon2").setVisible(false);
            this.getView().byId("icon3").setVisible(true);
            this.getView().byId("icon4").setVisible(false);
            this.getView().byId("_IDGenButton1111").setVisible(false);
            this.getView().byId("_IDGenButton1122").setVisible(true);
            this.getView().byId("_IDGenButton1133").setVisible(false);

        },
        onHUHierarchyPress: function () {

            this.getView().byId("icon1").setVisible(false);
            this.getView().byId("icon2").setVisible(false);
            this.getView().byId("icon3").setVisible(false);
            this.getView().byId("icon4").setVisible(true);
            this.getView().byId("_IDGenButton1111").setVisible(false);
            this.getView().byId("_IDGenButton1122").setVisible(true);
   this.getView().byId("_IDGenButton1133").setVisible(false);
          
        },


        Onpressback1: function () {
           debugger
            this.getView().byId("icon1").setVisible(false);
            this.getView().byId("icon2").setVisible(true);
            this.getView().byId("icon3").setVisible(false);
            this.getView().byId("icon4").setVisible(false);
            this.getView().byId("_IDGenButton1111").setVisible(true);
            this.getView().byId("_IDGenButton1122").setVisible(false);
            this.byId("_IDGenInput1").setValue("");


        },
        Onpressback2: function () {

            this.getView().byId("icon1").setVisible(true);
            this.getView().byId("icon2").setVisible(false);
            this.getView().byId("icon3").setVisible(false);
            this.getView().byId("icon4").setVisible(false);
            this.byId("_IDGenInput1").setValue("");
            this.getView().byId("_IDGenButton1133").setVisible(true);
            this.getView().byId("_IDGenButton1111").setVisible(false);
         

        },
        Submit: function () {

        },
        onAfterRendering: function () {
            var oInput = this.byId("_IDGenInput1"); // Replace with your input field ID
            if (oInput) {
                setTimeout(function () {
                    oInput.focus();
                }, 100); // Adjust the delay if needed
            }
        }

        


    });
});
  