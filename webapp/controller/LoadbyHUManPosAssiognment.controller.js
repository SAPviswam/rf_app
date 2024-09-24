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

                const { id } = oEvent1.getParameter("arguments");

                this.ID = id;

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

                        MessageToast.show("User does not exist");
                    }

                });
            },
        });
    });
