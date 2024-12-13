sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    function (Controller) {
        "use strict";
        return Controller.extend("com.app.rfapp.controller.LoadbyHUManPosAssiognment", {
            onInit: function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
            },
            onResourceDetailsLoad: async function (oEvent1) {
                var that = this;
                const { id, idI } = oEvent1.getParameter("arguments");
                this.ID = id;
                this.IDI = idI;
            },
            onF2PressManPosAssignment: function () {
                this.getView().byId("idLBHUManPosAssignmentScrollContainer2").setVisible(true);
                this.getView().byId("idLBHUManPosAssignmentScrollContainer1").setVisible(false);
            },
            OnPressSecondBackButton: function () {
                this.getView().byId("idLBHUManPosAssignmentScrollContainer2").setVisible(false);
                this.getView().byId("idLBHUManPosAssignmentScrollContainer1").setVisible(true);
            },
            onF3ManPosAssignmentScreen1: function () {
                this.getView().byId("idLBHUManPosAssignmentScrollContainer3").setVisible(true);
                this.getView().byId("idLBHUManPosAssignmentScrollContainer1").setVisible(false);
            },
            OnpressThirdBackButtonLBHUManPosAssignment: function () {
                this.getView().byId("idLBHUManPosAssignmentScrollContainer3").setVisible(false);
                this.getView().byId("idLBHUManPosAssignmentScrollContainer1").setVisible(true);
            },
            OnpressBack_ManPosAssignment: async function () {
                var oRouter = this.getOwnerComponent().getRouter();
                var oModel1 = this.getOwnerComponent().getModel();
                var that = this;
                await oModel1.read("/RESOURCESSet('" + this.ID + "')", {
                    success: function (oData) {
                        let oUser = oData.Users.toLowerCase()
                        if (oUser === "resource") {
                            oRouter.navTo("RouteResourcePage", { id: this.ID, idI: that.IDI });
                        }
                        else {
                            oRouter.navTo("Supervisor", { id: this.ID, idI: that.IDI });
                        }
                    }.bind(this), error: function () {
                        MessageToast.show("User does not exist");
                    }

                });
            },
        });
    });
