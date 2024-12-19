sap.ui.define([
    "./BaseController", 
    "sap/ui/core/UIComponent"
], function (Controller,UIComponent) {
    "use strict";

    return Controller.extend("com.app.rfapp.controller.CreateShippingHUWOWC", {
        onInit: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
        },
        onResourceDetailsLoad: async function (oEvent1) {
            const { id,idI } = oEvent1.getParameter("arguments");
            this.ID = id;
            this.IDI = idI;
            this.applyStoredProfileImage();
        },
        onPressAvatarCSHUWOWC: function (oEvent) {     
            this.onPressAvatarEveryTileHelperFunction(oEvent); 
            },            
        OnpressbackbolCSHUWOWC1: async function () {
            var oRouter = UIComponent.getRouterFor(this);
            var oModel1 = this.getOwnerComponent().getModel();
            var that = this;
            await oModel1.read("/RESOURCESSet('" + this.ID + "')", {
                success: function (oData) {
                    let oUser = oData.Users.toLowerCase();
                    if (oUser === "resource") {
                        oRouter.navTo("RouteResourcePage", { id: this.ID,idI:that.IDI });
                    }
                    else {
                        oRouter.navTo("Supervisor", { id: this.ID,idI:that.IDI });
                    }
                }.bind(this),
                error: function () {
                    MessageToast.show("User does not exist");
                }
            });
        },
        onSignoutPressed: function () {
            var oRouter = this.getOwnerComponent().getRouter(this);
            oRouter.navTo("InitialScreen", { Userid: this.IDI });
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
    });
});