sap.ui.define([
    "./BaseController", 
    "sap/ui/core/UIComponent"
], function (Controller,UIComponent ) {
    "use strict";

    return Controller.extend("com.app.rfapp.controller.ProductInspectionByHU", {
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
        onPressAvatarPIBHU: function (oEvent) {     
            this.onPressAvatarEveryTileHelperFunction(oEvent); 
            },
        OnpressbackPIBHU1: async function () {
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