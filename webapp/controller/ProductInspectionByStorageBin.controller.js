sap.ui.define([
    "./BaseController", 
    "sap/ui/core/UIComponent"
], function (Controller,UIComponent ) {
    "use strict";

    return Controller.extend("com.app.rfapp.controller.ProductInspectionByStorageBin", {
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
        onPressAvatarPIBSB: function (oEvent) {     
            this.onPressAvatarEveryTileHelperFunction(oEvent); 
            },
        OnpressbackPIBSB1: async function () {
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
        OnpressPIBSBsubmit:function(){
            this.getView().byId("_IDGenbackButtonPIBSB1").setVisible(false);
            this.getView().byId("scrollContainerPIBSB1").setVisible(false);
            this.getView().byId("scrollContainerPIBSB2").setVisible(true);
            this.getView().byId("_IDGenbackButtonPIBSB2").setVisible(true);
        },
        OnpressbackbolPIBHU2:function(){
            this.getView().byId("_IDGenbackButtonPIBSB1").setVisible(true);
            this.getView().byId("scrollContainerPIBSB1").setVisible(true);
            this.getView().byId("scrollContainerPIBSB2").setVisible(false);
            this.getView().byId("_IDGenbackButtonPIBSB2").setVisible(false);
        }

    });
});