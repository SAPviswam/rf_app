sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";
 
    return Controller.extend("com.app.rfapp.controller.AdhocHuWt", {
        onInit: function () {
 
        },
        onPressSubmitInAdhocHuWt: function () {
 
            this.getView().byId("idHuScanning").setVisible(false);
            this.getView().byId("idHuDetails").setVisible(true);
            this.getView().byId("idBackButtoninAdhocHuWtHuScan").setVisible(false);
            this.getView().byId("idBackButtoninAdhocHuWtHuDetails").setVisible(true);
 
        },
        onBeforeRendering : function () {
            this.getView().byId("idBackButtoninAdhocHuWtHuScan").setVisible(true);
        },
        onPressBackButtoninAdhocHuWtHuDetails: function () {
 
            this.getView().byId("idHuScanning").setVisible(true);
            this.getView().byId("idHuDetails").setVisible(false);
            this.getView().byId("idBackButtoninAdhocHuWtHuDetails").setVisible(false);
            this.getView().byId("idBackButtoninAdhocHuWtHuScan").setVisible(true);
        },
        onPressBackButtoninAdhocHuWtHuScan : function () {
            var oRouter = this.getOwnerComponent().getRouter().navTo("Supervisor");
        }
 
    });
});