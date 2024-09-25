sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function (BaseController) {
        "use strict";

        return BaseController.extend("com.app.rfapp.controller.SetReadyforWHProcessingByCO", {
            onInit: function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
            },
            onResourceDetailsLoad: async function (oEvent1) {
                const { id } = oEvent1.getParameter("arguments");
                this.ID = id;
            },
            //Back Btn from 1st ScrollContainer Page 1 =>idPage1ScannerFormBox
            onPressBackBtnPage1_SRWHBYCO: async function () {
                var oRouter = this.getOwnerComponent().getRouter();
                var oModel1 = this.getOwnerComponent().getModel();
                await oModel1.read("/RESOURCESSet('" + this.ID + "')", {
                    success: function (oData) {
                        if (oData.Users === "RESOURCE") {
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
            //Back Btn from ScrollContainer Page 2 =>idPage2ScrollContainer02_SRWHPBYCO 
            onPressBackBtnPage2_SRWHBYCO: function () {
                var oScrollContainer2 = this.byId("idPage2ScrollContainer02_SRWHPBYCO");
                var oScrollContainer1 = this.byId("idPage1ScrollContainer01_SRWHPBYCO");

                // show the 1st Page...
                oScrollContainer1.setVisible(true);

                //Hide the 2nd Page...
                oScrollContainer2.setVisible(false);
            },
            //Back Btn from ScrollContainer Page 3 =>idPage3ScrollContainer02_SRWHPBYCO 
            onPressBackBtnPage3_SRWHBYCO: function () {
                var oScrollContainer3 = this.byId("idPage3ScrollContainer03_SRWHPBYCO");
                var oScrollContainer2 = this.byId("idPage2ScrollContainer02_SRWHPBYCO");

                // show the 2nd Page..
                oScrollContainer2.setVisible(true);

                //Hide the 3rd Page...
                oScrollContainer3.setVisible(false);
            },
            //Back Btn from ScrollContainer Page 4 =>idPage4ScrollContainer04_SRWHPBYCO 
            onPressBackBtnPage4_SRWHBYCO: function () {
                var oScrollContainer4 = this.byId("idPage4ScrollContainer04_SRWHPBYCO");
                var oScrollContainer3 = this.byId("idPage3ScrollContainer03_SRWHPBYCO");

                // show the 3rd Page
                oScrollContainer3.setVisible(true);

                //Hide the 4th Page
                oScrollContainer4.setVisible(false);
            },
            //Quries Btn from ScrollContainer Page 1=> idPage1ScrollContainer01_SRWHPBYCO..
            onQueriesBtnPressPage1_SRWHPBYCO: function () {
                var oScrollContainer1 = this.byId("idPage1ScrollContainer01_SRWHPBYCO");
                var oScrollContainer2 = this.byId("idPage2ScrollContainer02_SRWHPBYCO");

                // Hide the Scanner form VBox
                oScrollContainer1.setVisible(false);

                // Show the HUNumber Table scroll container
                oScrollContainer2.setVisible(true);
            },

            //Enter Btn from ScrollContainer Page 2=> idPage2ScrollContainer02_SRWHPBYCO..
            onEnterBtnPressPage2_SRWHPBYCO: function () {
                var oScrollContainer2 = this.byId("idPage2ScrollContainer02_SRWHPBYCO");
                var oScrollContainer3 = this.byId("idPage3ScrollContainer03_SRWHPBYCO");

                // Hide the 2nd Page...
                oScrollContainer2.setVisible(false);

                // Show the 3rd Page...
                oScrollContainer3.setVisible(true);
            },

            //Enter Btn from ScrollContainer Page 3=> idPage3ScrollContainer03_SRWHPBYCO..
            onEnterBtnPressPage3_SRWHPBYCO: function () {
                var oScrollContainer3 = this.byId("idPage3ScrollContainer03_SRWHPBYCO");
                var oScrollContainer4 = this.byId("idPage4ScrollContainer04_SRWHPBYCO");

                // Hide the 3rd Page...
                oScrollContainer3.setVisible(false);

                // Show the 4th Page...
                oScrollContainer4.setVisible(true);
            },
        });
    }
);
