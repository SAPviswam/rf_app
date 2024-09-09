sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";
 
    return Controller.extend("com.app.rfapp.controller.AdhocProductWt", {
        onInit: function () {
 
        },
        onPressSubmitInAdhocHuWt: function () {
 
            this.getView().byId("idProductScanning").setVisible(false);
            this.getView().byId("idProductDetails").setVisible(true);
            this.getView().byId("idBackButtoninAdhocProductWtScan").setVisible(false);
            this.getView().byId("idBackButtoninAdhocProductWtProductDetails").setVisible(true);
 
        },
        onBeforeRendering : function () {
            this.getView().byId("idBackButtoninAdhocProductWtScan").setVisible(true);
        },
        onPressBackButtoninAdhocProductWtProductDetails: function () {
 
            this.getView().byId("idProductScanning").setVisible(true);
            this.getView().byId("idProductDetails").setVisible(false);
            this.getView().byId("idBackButtoninAdhocProductWtProductDetails").setVisible(false);
            this.getView().byId("idBackButtoninAdhocProductWtScan").setVisible(true);
        },
        onPressBackButtoninAdhocProductWtProductScan: function () {
            var oRouter = this.getOwnerComponent().getRouter().navTo("Supervisor");
        }
 
    });
});