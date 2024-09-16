sap.ui.define([
    "sap/ui/core/mvc/Controller",
], function (Controller) {
    "use strict";

    return Controller.extend("com.app.rfapp.controller.CreateShippingHU", {
        onInit: function () {
        },
        OnpressCSHUsubmit:function(){
            this.getView().byId("scrollContainerCSHU1").setVisible(false);
            this.getView().byId("_IDGenbackButtonCSHU1").setVisible(false);
            this.getView().byId("scrollContainerCSHU2").setVisible(true);
            this.getView().byId("_IDGenbackButtonCSHU2").setVisible(true);
        },
        Ondesthupress: function(){
            this.getView().byId("scrollContainerCSHU2").setVisible(false);
            this.getView().byId("_IDGenbackButtonCSHU2").setVisible(false);
            this.getView().byId("scrollContainerCSHU3").setVisible(true);
            this.getView().byId("_IDGenbackButtonCSHU3").setVisible(true);
        },
        OnpressbackbolCSHU3:function(){
            this.getView().byId("scrollContainerCSHU2").setVisible(true);
            this.getView().byId("_IDGenbackButtonCSHU2").setVisible(true);
            this.getView().byId("scrollContainerCSHU3").setVisible(false);
            this.getView().byId("_IDGenbackButtonCSHU3").setVisible(false);
        },
        OnpressbackbolCSHU2:function(){
            this.getView().byId("scrollContainerCSHU1").setVisible(true);
            this.getView().byId("_IDGenbackButtonCSHU1").setVisible(true);
            this.getView().byId("scrollContainerCSHU2").setVisible(false);
            this.getView().byId("_IDGenbackButtonCSHU2").setVisible(false);
        },
        OnpressbackCSHU1:function(){
            this.getOwnerComponent().getRouter().navTo("Supervisor");
        }

    });
});