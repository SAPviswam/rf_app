sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function (BaseController) {
        "use strict";

        return BaseController.extend("com.app.rfapp.controller.AvailableHandlingUnitsOnBinQuery", {
            onInit: function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
            },
            onResourceDetailsLoad: async function (oEvent1) {
                const { id } = oEvent1.getParameter("arguments");
                this.ID = id;
            },
            onAfterRendering: function () {
                this.byId("idPage1_AHUOBQ").setVisible(true);
            },
            //Back Btn from 1st ScrollContainer Page 1 =>idPage1_AHUOBQ
            onPressBackBtnPage1_AHUOBQ: async function () {
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
            //Back Btn from ScrollContainer Page 2 =>idPage2BinNoTable_AHUOBQ 
            onBackPressBinNumbersTable: function () {
                var oScrollContainer1 = this.byId("idPage1_AHUOBQ");
                var oScrollContainer2 = this.byId("idPage2BinNoTable_AHUOBQ");

                // show the Scanner form VBox
                oScrollContainer1.setVisible(true);

                //Hide the HUDetails scroll container
                oScrollContainer2.setVisible(false);
            },
            //Back Btn from ScrollContainer Page 3 =>idPage3HUContents_AHUOBQ 
            onBackPressHUContentsAHUOBQ: function () {
                var oScrollContainer3 = this.byId("idPage3HUContents_AHUOBQ");
                var oScrollContainer2 = this.byId("idPage2BinNoTable_AHUOBQ");

                // show the Table Contents
                oScrollContainer2.setVisible(true);

                //Hide the HUContents scroll container
                oScrollContainer3.setVisible(false);
            },
            //Back Btn from ScrollContainer Page 4 =>idPage4PrdDecsription_AHUOBQ 
            onBackPressProductDescription: function () {
                var oScrollContainer4 = this.byId("idPage4PrdDecsription_AHUOBQ");
                var oScrollContainer2 = this.byId("idPage2BinNoTable_AHUOBQ");

                // show the Table Contents
                oScrollContainer2.setVisible(true);

                //Hide the Product Description scroll container
                oScrollContainer4.setVisible(false);
            },



            //Submit Btn from ScrollContainer Page 1=> idPage1_AHUOBQ..
            onSubmitPress_AHUOBQ: function () {
                var oScrollContainer1 = this.byId("idPage1_AHUOBQ");
                var oScrollContainer2 = this.byId("idPage2BinNoTable_AHUOBQ");

                // Hide the Scanner Page1
                oScrollContainer1.setVisible(false);

                // Show the Bin Table Page2
                oScrollContainer2.setVisible(true);
            },

            //HUContent Btn from ScrollContainer Page 2=>idPage2BinNoTable_AHUOBQ
            onPressHUContentBtn: function () {
                var oScrollContainer3 = this.byId("idPage3HUContents_AHUOBQ");
                var oScrollContainer2 = this.byId("idPage2BinNoTable_AHUOBQ");

                // Hide the BinTable Page2
                oScrollContainer2.setVisible(false);

                //Show the HUContents Page3
                oScrollContainer3.setVisible(true);
            },

            //Prod Description Btn from ScrollContainer Page 2=>idPage2BinNoTable_AHUOBQ
            onPressProductDescriptionBtn: function () {
                var oScrollContainer4 = this.byId("idPage4PrdDecsription_AHUOBQ");
                var oScrollContainer2 = this.byId("idPage2BinNoTable_AHUOBQ");

                // show the Product Description Page4
                oScrollContainer4.setVisible(true);

                //Hide the Table Of Bin Numbers Page2
                oScrollContainer2.setVisible(false);
            },



        });
    }
);
