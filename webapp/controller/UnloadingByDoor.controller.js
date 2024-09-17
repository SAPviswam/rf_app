sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent"
],
    function (Controller, UIComponent) {
        "use strict";

        return Controller.extend("com.app.rfapp.controller.UnloadingByDoor", {
            onInit: function () {

                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);

            },
            onResourceDetailsLoad: async function (oEvent1) {
                const { id } = oEvent1.getParameter("arguments");
                this.ID = id;

            },
            Onpresssubmit: function () {

                this.getView().byId("icon1_UBYD").setVisible(false);
                this.getView().byId("icon2_UBYD").setVisible(true);
                // this.getView().byId("_IDGenButton77_UBYD").setVisible(false);
            },
            Onpressback1: function () {
                this.getView().byId("icon1_UBYD").setVisible(true);
                this.getView().byId("icon2_UBYD").setVisible(false);
                // this.getView().byId("_IDGenButton77_UBYD").setVisible(true);

            },
            onHUListPress: function () {
                this.getView().byId("icon1_UBYD").setVisible(false);
                this.getView().byId("icon2_UBYD").setVisible(false);
                this.getView().byId("icon3_UBYD").setVisible(true);
            },
            Onpressback2: function () {
                this.getView().byId("icon1_UBYD").setVisible(false);
                this.getView().byId("icon2_UBYD").setVisible(true);
                this.getView().byId("icon3_UBYD").setVisible(false);
            },
            onNewHUPress: function () {
                this.getView().byId("icon1_UBYD").setVisible(false);
                this.getView().byId("icon2_UBYD").setVisible(false);
                this.getView().byId("icon3_UBYD").setVisible(false);
                this.getView().byId("icon4_UBYD").setVisible(true);
                this.getView().byId("icon5_UBYD").setVisible(false);
            },
            Onpressback3: function () {
                this.getView().byId("icon1_UBYD").setVisible(false);
                this.getView().byId("icon2_UBYD").setVisible(true);
                this.getView().byId("icon4_UBYD").setVisible(false);
            },
            onNextEnterpress: function () {
                this.getView().byId("icon5_UBYD").setVisible(true);
                this.getView().byId("icon4_UBYD").setVisible(false);
                this.getView().byId("icon1_UBYD").setVisible(false);
                this.getView().byId("icon2_UBYD").setVisible(false);
            },
            Onpressback4: function () {
                this.getView().byId("icon1_UBYD").setVisible(false);
                this.getView().byId("icon5_UBYD").setVisible(false);
                this.getView().byId("icon4_UBYD").setVisible(true);
                this.getView().byId("icon3_UBYD").setVisible(false);
                this.getView().byId("icon2_UBYD").setVisible(false);
            },
            onGRPress: function () {
                this.getView().byId("icon6_UBYD").setVisible(true);
                this.getView().byId("icon5_UBYD").setVisible(false);
                this.getView().byId("icon4_UBYD").setVisible(false);
                this.getView().byId("icon1_UBYD").setVisible(false);
                this.getView().byId("icon2_UBYD").setVisible(false);
            },
            Onpressback5: function () {
                this.getView().byId("icon1_UBYD").setVisible(false);
                this.getView().byId("icon5_UBYD").setVisible(true);
                this.getView().byId("icon6_UBYD").setVisible(false);
                this.getView().byId("icon4_UBYD").setVisible(false);
                this.getView().byId("icon2_UBYD").setVisible(false);
            },
            onUnloadPress: function () {
                this.getView().byId("icon6_UBYD").setVisible(false);
                this.getView().byId("icon5_UBYD").setVisible(false);
                this.getView().byId("icon4_UBYD").setVisible(false);
                this.getView().byId("icon7_UBYD").setVisible(true);
                this.getView().byId("icon1_UBYD").setVisible(false);
                this.getView().byId("icon2_UBYD").setVisible(false);
            },
            Onpressback6: function () {
                this.getView().byId("icon1_UBYD").setVisible(false);
                this.getView().byId("icon5_UBYD").setVisible(true);
                this.getView().byId("icon7_UBYD").setVisible(false);
                this.getView().byId("icon6_UBYD").setVisible(false);
                this.getView().byId("icon3_UBYD").setVisible(false);
                this.getView().byId("icon4_UBYD").setVisible(false);
                this.getView().byId("icon2_UBYD").setVisible(false);
            },
            // onPressBackToHome: function () {
            //     var oRouter = this.getOwnerComponent().getRouter();
            //     oRouter.navTo("Supervisor");

            // },


            onPressBackToHome: async function() {
                // var oRouter = UIComponent.getRouterFor(this);
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

                    }.bind(this),

                    error: function () {

                        MessageToast.show("User does not exist");

                    }

                });
            },

        });
    });
