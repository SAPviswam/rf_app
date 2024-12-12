sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent"
],
    function (Controller, MessageToast, UIComponent) {
        "use strict";

        return Controller.extend("com.app.rfapp.controller.AdhocProductWt", {
            onInit: function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
            },
            onResourceDetailsLoad: function (oEvent1) {
                var that = this;
                const { id } = oEvent1.getParameter("arguments");
                this.ID = id;
                console.log(this.ID);
            },
            onPressSubmitInAdhocHuWt: function () {
                this.getView().byId("idProductScanning").setVisible(false);
                this.getView().byId("idProductDetails").setVisible(true);
                this.getView().byId("idBackButtoninAdhocProductWtScan").setVisible(false);
                this.getView().byId("idBackButtoninAdhocProductWtProductDetails").setVisible(true);
            },
            onBeforeRendering: function () {
                this.getView().byId("idBackButtoninAdhocProductWtScan").setVisible(true);
            },
            onPressBackButtoninAdhocProductWtProductDetails: function () {
                this.getView().byId("idProductScanning").setVisible(true);
                this.getView().byId("idProductDetails").setVisible(false);
                this.getView().byId("idBackButtoninAdhocProductWtProductDetails").setVisible(false);
                this.getView().byId("idBackButtoninAdhocProductWtScan").setVisible(true);
            },
            onAdhocProductWtBackBtnPress: async function () {
                var oRouter = UIComponent.getRouterFor(this);
                var oModel1 = this.getOwnerComponent().getModel();
                var that=this;
                await oModel1.read("/RESOURCESSet('" + this.ID + "')", {
                    success: function (oData) {

                        let oUser=oData.Users.toLowerCase()
                        if(oUser ===  "resource"){
                            oRouter.navTo("RouteResourcePage",{id:this.ID,idI: that.IDI});
                        }
                        else{
                        oRouter.navTo("Supervisor",{id:this.ID,idI: that.IDI});
                    }

                    }.bind(this),
                    error: function () {
                        MessageToast.show("User does not exist");
                    }
                });
            },
            onPressSubmitInAdhocHuWt:function(){
                this.getView().byId("Id_Scrollcontainer_Screen2").setVisible(true)
                this.getView().byId("Id_ScrollContainer_AdhocProductWt").setVisible(false)
            }
        });
    });