sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    function (Controller) {
        "use strict";

        return Controller.extend("com.app.rfapp.controller.LoadbyHUAutoPosAssiognment", {
            onInit: function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);

            },
            onResourceDetailsLoad: async function (oEvent1) {
                const { id } = oEvent1.getParameter("arguments");
                this.ID = id;
            },

            onF2PressHubyAutoPosAssignment: function () {
                this.getView().byId("idLBHUAPAscrollContainer2").setVisible(true);
                this.getView().byId("idLBHUAPAscrollContainer1").setVisible(false);
            },
            OnPressSecondBackButtonLBHUAPA:function(){
                this.getView().byId("idLBHUAPAscrollContainer2").setVisible(false);
                this.getView().byId("idLBHUAPAscrollContainer1").setVisible(true);

            },
            onF3HubyAutoPosAssignmentScreen1:function(){
                this.getView().byId("idLBHUAPAScrollContainer3").setVisible(true);
                this.getView().byId("idLBHUAPAscrollContainer1").setVisible(false);
            },
            OnpressThirdBackButtonLBHUAPA:function(){
                this.getView().byId("idLBHUAPAScrollContainer3").setVisible(false);
                this.getView().byId("idLBHUAPAscrollContainer1").setVisible(true);

            },
            OnpressBack_AutoPosAssignment: async function(){
                var oRouter = this.getOwnerComponent().getRouter();
                var oModel1 = this.getOwnerComponent().getModel();
                await oModel1.read("/RESOURCESSet('" + this.ID + "')", {
                    success: function (oData) {
                        let oUser = oData.Users.toLowerCase()
                        if (oUser === "resource") {
                            oRouter.navTo("RouteResourcePage", { id: this.ID });
                        }
                        else {
                            oRouter.navTo("Supervisor", { id: this.ID });
                        }
                    }.bind(this), error: function () {

                        sap.m.MessageToast.show("User does not exist");
                    }

                });
            }
        });
    });
