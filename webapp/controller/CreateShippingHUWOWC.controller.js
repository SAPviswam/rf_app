sap.ui.define([
    "sap/ui/core/mvc/Controller",
], function (Controller) {
    "use strict";

    return Controller.extend("com.app.rfapp.controller.CreateShippingHUWOWC", {
        onInit: function () {
        },
        Ondesthupresswowc:function(){
            this.getView().byId("scrollContainerCSHUWOWC1").setVisible(false);
            this.getView().byId("_IDGenbackButtonCSHUWOWC1").setVisible(false);
            this.getView().byId("scrollContainerCSHUWOWC2").setVisible(true);
            this.getView().byId("_IDGenbackButtonCSHUWOWC2").setVisible(true);
        },
        OnpressbackbolCSHU2:function(){
            this.getView().byId("scrollContainerCSHUWOWC1").setVisible(true);
            this.getView().byId("_IDGenbackButtonCSHUWOWC1").setVisible(true);
            this.getView().byId("scrollContainerCSHUWOWC2").setVisible(false);
            this.getView().byId("_IDGenbackButtonCSHUWOWC2").setVisible(false);
        },
        OnpressbackbolCSHUWOWC1:function(){
            this.getOwnerComponent().getRouter().navTo("Supervisor");
        }

    });
});