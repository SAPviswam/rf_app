sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent"
], function (Controller,UIComponent) {
    "use strict";

    return Controller.extend("com.app.rfapp.controller.CreateShippingHU", {
        onInit: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
        },
        onResourceDetailsLoad: async function (oEvent1) {
            const { id } = oEvent1.getParameter("arguments");
            this.ID = id;
        },
        OnpressbackCSHU1: async function () {
            var oRouter = UIComponent.getRouterFor(this);
            var oModel1 = this.getOwnerComponent().getModel();
            await oModel1.read("/RESOURCESSet('" + this.ID + "')", {
                success: function (oData) {
                    let oUser = oData.Users.toLowerCase();
                    if (oUser === "resource") {
                        oRouter.navTo("RouteResourcePage", { id: this.ID });
                    }
                    else {
                        oRouter.navTo("Supervisor", { id: this.ID });
                    }
                }.bind(this),
                error: function () {
                    MessageToast.show("User does not exist");
                }
            });
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
    });
});