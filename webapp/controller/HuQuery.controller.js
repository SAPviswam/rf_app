// sap.ui.define(
//     [
//         "sap/ui/core/mvc/Controller"
//     ],
//     function(BaseController) {
//       "use strict";
  
//       return BaseController.extend("com.app.rfapp.controller.HuQuery", {
//         onInit: function() {
//         }
//       });
//     }
//   );
  sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device"
], function (Controller,Device) {
    "use strict";

    return Controller.extend("com.app.rfapp.controller.HuQuery", {
        // onInit: function () {
        //     var oModel = new sap.ui.model.json.JSONModel(sap.ui.require.toUrl("com/app/rfapp/model/data1.json"));
        //     this.getView().setModel(oModel);
        //     var i18nModel = this.getOwnerComponent().getModel("i18n");
        //     var oTable = this.byId("HuDetailsTable");
        //     var oQuantityHeader = this.byId("_IDGenText3");
        //     var oProductDescriptionHeader = this.byId("_IDGenText5");

        //     if (Device.system.phone) {
        //         oQuantityHeader.setText(i18nModel.getResourceBundle().getText("qty"));
        //         oProductDescriptionHeader.setText(i18nModel.getResourceBundle().getText("pr.des"));


        //     }
        //     else {
        //         oQuantityHeader.setText(i18nModel.getResourceBundle().getText("quantity"));
        //         oProductDescriptionHeader.setText(i18nModel.getResourceBundle().getText("productdescription"));

        //     }
        // },
        // onItemSelect: function (oEvent) {
        //     var oItem = oEvent.getParameter("item");
        //     this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));
        // },
        // Onpresssubmit: function () {
        //     debugger
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
        // onHUContentPress: function () {


        //     this.getView().byId("icon1").setVisible(false);
        //     this.getView().byId("icon2").setVisible(false);
        //     this.getView().byId("icon3").setVisible(true);
        //     this.getView().byId("icon4").setVisible(false);
        //     this.getView().byId("_IDGenButton1111").setVisible(false);
        //     this.getView().byId("_IDGenButton1122").setVisible(true);

        // },
        // onHUHierarchyPress: function () {

        //     this.getView().byId("icon1").setVisible(false);
        //     this.getView().byId("icon2").setVisible(false);
        //     this.getView().byId("icon3").setVisible(false);
        //     this.getView().byId("icon4").setVisible(true);
        //     this.getView().byId("_IDGenButton1111").setVisible(false);
        //     this.getView().byId("_IDGenButton1122").setVisible(true);
        // },

        // Onpressback1: function () {

        //     this.getView().byId("icon1").setVisible(false);
        //     this.getView().byId("icon2").setVisible(true);
        //     this.getView().byId("icon3").setVisible(false);
        //     this.getView().byId("icon4").setVisible(false);
        //     this.getView().byId("_IDGenButton1111").setVisible(true);
        //     this.getView().byId("_IDGenButton1122").setVisible(false);

        // },
        // Onpressback2: function () {

        //     this.getView().byId("icon1").setVisible(true);
        //     this.getView().byId("icon2").setVisible(false);
        //     this.getView().byId("icon3").setVisible(false);
        //     this.getView().byId("icon4").setVisible(false);

        // },
        // Submit: function () {

        // }
        onInit: function () {
            var oModel = new sap.ui.model.json.JSONModel(sap.ui.require.toUrl("com/app/rfapp/model/data1.json"));
            this.getView().setModel(oModel);
            var i18nModel = this.getOwnerComponent().getModel("i18n");
            var oQuantityHeader = this.byId("_IDGenText3");
            var oProductDescriptionHeader = this.byId("_IDGenText5");

            if (Device.system.phone) {
                oQuantityHeader.setText(i18nModel.getResourceBundle().getText("qty"));
                oProductDescriptionHeader.setText(i18nModel.getResourceBundle().getText("pr.des"));
            } else {
                oQuantityHeader.setText(i18nModel.getResourceBundle().getText("quantity"));
                oProductDescriptionHeader.setText(i18nModel.getResourceBundle().getText("productdescription"));
            }
        },

        onItemSelect: function (oEvent) {
            var oItem = oEvent.getParameter("item");
            this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));
        },

        // Live validation logic
        onLiveHuValidation: function (oEvent) {
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
                        // Optionally, you can also populate fields here based on the result
                        that._populateHUDetails(odata);
                    },
                    error: function (oError) {
                        // Show error message if HU is not found
                        MessageBox.error("HU not found. Please enter a valid HU.");
                        that.getView().byId("icon2").setVisible(false);
                        that.getView().byId("icon1").setVisible(true);
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
        Onpresssubmit: function () {
            var oHu = this.byId("_IDGenInput1").getValue().trim();
            if (oHu) {
                this.onLiveHuValidation({
                    getSource: function () {
                        return this.byId("_IDGenInput1");
                    }.bind(this)
                });
            } else {
                MessageBox.error("Please enter a valid HU.");
            }
        },




    });
});
  