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
        onInit: function () {
            var oModel = new sap.ui.model.json.JSONModel(sap.ui.require.toUrl("com/app/rfapp/model/data1.json"));
            this.getView().setModel(oModel);
            var i18nModel = this.getOwnerComponent().getModel("i18n");
            var oTable = this.byId("HuDetailsTable");
            var oQuantityHeader = this.byId("_IDGenText3");
            var oProductDescriptionHeader = this.byId("_IDGenText5");

            if (Device.system.phone) {
                oQuantityHeader.setText(i18nModel.getResourceBundle().getText("qty"));
                oProductDescriptionHeader.setText(i18nModel.getResourceBundle().getText("pr.des"));


            }
            else {
                oQuantityHeader.setText(i18nModel.getResourceBundle().getText("quantity"));
                oProductDescriptionHeader.setText(i18nModel.getResourceBundle().getText("productdescription"));

            }
        },
        onItemSelect: function (oEvent) {
            var oItem = oEvent.getParameter("item");
            this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));
        },
        Onpresssubmit: function () {
            debugger
            var oHu = this.byId("_IDGenInput1").getValue();
            debugger
            /**Getting Model */
            var oModel = this.getOwnerComponent().getModel();
            var that = this;
            
            oModel.read(`/Hu_ContentSet('${oHu}')`, {
                success: function (odata) {
                    
                  
                   /* odata.Matid
                    odata.Quan
                    odata.Meins
                   
                    
                  
                   
                    
                   
                    odata.UnitLwh
                    odata.UnitGw
                    
                    odata.UnitTv
                    odata.Lgpla */
                    that.byId("_IDGenInput2").setValue(odata.Huident);
                    that.byId("_IDGenInput3").setValue( odata.Letyp);
                    that.byId("_IDGenInputLength").setValue(odata.Length);
                    that.byId("_IDGenInputWidth").setValue(odata.Width);
                    that.byId("_IDGenInputHeight").setValue(odata.Height);
                    that.byId("_IDGenInputTareWeight").setValue(odata.TWeight);
                    that.byId("_IDGenInputNetWeight").setValue(odata.NWeight);
                    that.byId("_IDGenInputGrossWeight").setValue(odata.GWeight);
                    that.byId("_IDGenInputweightsMesurement").setValue(odata.UnitGw);
                    that.byId("_IDGenInputMesurement").setValue(odata.UnitLwh);
                    that.byId("_IDGenInputMesurement").setValue(odata.GVolume);
                    that.getView().byId("icon1").setVisible(false);
                    that.getView().byId("icon2").setVisible(true);
                    that.getView().byId("_IDGenButton1111").setVisible(true);
                }, error: function (oError) {
                    sap.m.MessageBox.error("Error");

                }
            })


        },
        onHUContentPress: function () {


            this.getView().byId("icon1").setVisible(false);
            this.getView().byId("icon2").setVisible(false);
            this.getView().byId("icon3").setVisible(true);
            this.getView().byId("icon4").setVisible(false);
            this.getView().byId("_IDGenButton1111").setVisible(false);
            this.getView().byId("_IDGenButton1122").setVisible(true);

        },
        onHUHierarchyPress: function () {

            this.getView().byId("icon1").setVisible(false);
            this.getView().byId("icon2").setVisible(false);
            this.getView().byId("icon3").setVisible(false);
            this.getView().byId("icon4").setVisible(true);
            this.getView().byId("_IDGenButton1111").setVisible(false);
            this.getView().byId("_IDGenButton1122").setVisible(true);
        },

        Onpressback1: function () {

            this.getView().byId("icon1").setVisible(false);
            this.getView().byId("icon2").setVisible(true);
            this.getView().byId("icon3").setVisible(false);
            this.getView().byId("icon4").setVisible(false);
            this.getView().byId("_IDGenButton1111").setVisible(true);
            this.getView().byId("_IDGenButton1122").setVisible(false);

        },
        Onpressback2: function () {

            this.getView().byId("icon1").setVisible(true);
            this.getView().byId("icon2").setVisible(false);
            this.getView().byId("icon3").setVisible(false);
            this.getView().byId("icon4").setVisible(false);

        },
        Submit: function () {

        }




    });
});
  