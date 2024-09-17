sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent"
], function (Controller,UIComponent ) {
    "use strict";

    return Controller.extend("com.app.rfapp.controller.BillofLading", {
        onInit: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
        },
        onResourceDetailsLoad: async function (oEvent1) {
            const { id } = oEvent1.getParameter("arguments");
            this.ID = id;
        },
        Onpressbackbol1: async function () {
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
        OnpressBOLsubmit: function () {
            this.getView().byId("scrollContainer1").setVisible(false);
            this.getView().byId("_IDGenbackButton1").setVisible(false);
            this.getView().byId("scrollContainer2").setVisible(true);
            this.getView().byId("_IDGenbackButton2").setVisible(true);
        },
        onHUListPress: function () {
            this.getView().byId("scrollContainer3").setVisible(true);
            this.getView().byId("_IDGenbackButton3").setVisible(true);
            this.getView().byId("_IDGenbackButton2").setVisible(false);
            this.getView().byId("scrollContainer2").setVisible(false);
        },
        onNewhuPress: function () {
            this.getView().byId("_IDGenbackButton2").setVisible(false);
            this.getView().byId("scrollContainer2").setVisible(false);
            this.getView().byId("scrollContainer4").setVisible(true);
            this.getView().byId("_IDGenbackButton4").setVisible(true);
        },
        oneEnterPress: function () {
            this.getView().byId("_IDGenbackButton4").setVisible(false);
            this.getView().byId("scrollContainer4").setVisible(false);
            this.getView().byId("scrollContainer5").setVisible(true);
            this.getView().byId("_IDGenbackButton5").setVisible(true);
        },
        onGRPress: function () {
            this.getView().byId("_IDGenbackButton5").setVisible(false);
            this.getView().byId("scrollContainer5").setVisible(false);
            this.getView().byId("scrollContainer6").setVisible(true);
            this.getView().byId("_IDGenbackButton6").setVisible(true);
        },

        onunloadPress: function () {
            this.getView().byId("scrollContainer7").setVisible(true);
            this.getView().byId("_IDGenbackButton7").setVisible(true);
            this.getView().byId("_IDGenbackButton5").setVisible(false);
            this.getView().byId("scrollContainer5").setVisible(false);
        },
        Onpressbackbol3: function () {
            this.getView().byId("scrollContainer2").setVisible(true);
            this.getView().byId("_IDGenbackButton2").setVisible(true);
            this.getView().byId("_IDGenbackButton3").setVisible(false);
            this.getView().byId("scrollContainer3").setVisible(false);
        },
        Onpressbackbol5: function () {
            this.getView().byId("scrollContainer4").setVisible(true);
            this.getView().byId("_IDGenbackButton4").setVisible(true);
            this.getView().byId("_IDGenbackButton5").setVisible(false);
            this.getView().byId("scrollContainer5").setVisible(false);
        },
        Onpressbackbol6: function () {
            this.getView().byId("scrollContainer5").setVisible(true);
            this.getView().byId("_IDGenbackButton5").setVisible(true);
            this.getView().byId("_IDGenbackButton6").setVisible(false);
            this.getView().byId("scrollContainer6").setVisible(false);
        },
        Onpressbackbol4: function () {
            this.getView().byId("scrollContainer2").setVisible(true);
            this.getView().byId("_IDGenbackButton2").setVisible(true);
            this.getView().byId("_IDGenbackButton4").setVisible(false);
            this.getView().byId("scrollContainer4").setVisible(false);
        },
        Onpressbackbol2: function () {
            this.getView().byId("scrollContainer1").setVisible(true);
            this.getView().byId("_IDGenbackButton2").setVisible(false);
            this.getView().byId("scrollContainer2").setVisible(false);
            this.getView().byId("_IDGenbackButton1").setVisible(true);
        },
        Onpressbackbol7: function () {
            this.getView().byId("scrollContainer5").setVisible(true);
            this.getView().byId("_IDGenbackButton5").setVisible(true);
            this.getView().byId("_IDGenbackButton7").setVisible(false);
            this.getView().byId("scrollContainer7").setVisible(false);
        },
    });
});