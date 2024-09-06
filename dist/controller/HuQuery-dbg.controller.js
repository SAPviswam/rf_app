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
                oProductDescriptionHeader.setText(i18nModel.getResourceBundle().getText("product description"));

             }
        },
        onBeforeRendering: function() {
            this.getView().byId("_IDGenButton1133").setVisible(true);   

        },
        onItemSelect: function (oEvent) {
            var oItem = oEvent.getParameter("item");
            this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));
        },
        Onpresssubmit: function () {

            this.getView().byId("icon1").setVisible(false);
            this.getView().byId("icon2").setVisible(true);
            this.getView().byId("_IDGenButton1111").setVisible(true);
            this.getView().byId("_IDGenButton1133").setVisible(false);
            

        },
        Onpressback3:function () {
    
            var oRouter = this.getOwnerComponent().getRouter().navTo("RouteView1");
            },
        
        onHUContentPress: function () {
           

            this.getView().byId("icon1").setVisible(false);
            this.getView().byId("icon2").setVisible(false);
            this.getView().byId("icon3").setVisible(true);
            this.getView().byId("icon4").setVisible(false);
            this.getView().byId("_IDGenButton1111").setVisible(false);
            this.getView().byId("_IDGenButton1122").setVisible(true);
            this.getView().byId("_IDGenButton1133").setVisible(false);
            // none

        },
        onHUHierarchyPress: function () {

            this.getView().byId("icon1").setVisible(false);
            this.getView().byId("icon2").setVisible(false);
            this.getView().byId("icon3").setVisible(false);
            this.getView().byId("icon4").setVisible(true);
            this.getView().byId("_IDGenButton1111").setVisible(false);
            this.getView().byId("_IDGenButton1122").setVisible(true);
            this.getView().byId("_IDGenButton1133").setVisible(false);
            // none
        },

        Onpressback1: function () {

            this.getView().byId("icon1").setVisible(false);
            this.getView().byId("icon2").setVisible(true);
            this.getView().byId("icon3").setVisible(false);
            this.getView().byId("icon4").setVisible(false);
            this.getView().byId("_IDGenButton1111").setVisible(true);
            this.getView().byId("_IDGenButton1122").setVisible(false);
            // none

        },
        Onpressback2: function () {

            this.getView().byId("icon1").setVisible(true);
            this.getView().byId("icon2").setVisible(false);
            this.getView().byId("icon3").setVisible(false);
            this.getView().byId("icon4").setVisible(false);
            this.getView().byId("_IDGenButton1133").setVisible(true);
            this.getView().byId("_IDGenButton1111").setVisible(false);
            // none

        },





    });
});
  