sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent"
], function (Controller,UIComponent ) {
    "use strict";

    return Controller.extend("com.app.rfapp.controller.ProductInspectionByHU", {
        onInit: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
        },
        onResourceDetailsLoad: async function (oEvent1) {
            const { id } = oEvent1.getParameter("arguments");
            this.ID = id;
        },
        OnpressbackPIBHU1: async function () {
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
        OnpressPIBHUsubmit:function(){
            this.getView().byId("_IDGenbackButtonPIBHU1").setVisible(false);
            this.getView().byId("scrollContainerPIBHU1").setVisible(false);
            this.getView().byId("scrollContainerPIBHU2").setVisible(true);
            this.getView().byId("_IDGenbackButtonPIBHU2").setVisible(true);
        },
        OnpressbackbolPIBHU2:function(){
            this.getView().byId("_IDGenbackButtonPIBHU1").setVisible(true);
            this.getView().byId("scrollContainerPIBHU1").setVisible(true);
            this.getView().byId("scrollContainerPIBHU2").setVisible(false);
            this.getView().byId("_IDGenbackButtonPIBHU2").setVisible(false);
        }
    });
});