sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function (BaseController) {
        "use strict";

        return BaseController.extend("com.app.rfapp.controller.PutawayByWO", {
            onInit: function () {
            },
            onAfterRendering: function () {
                this.byId("idPage1ScannerFormBox").setVisible(true);
            },
            //Back Btn from 1st ScrollContainer Page 1 =>idPage1ScannerFormBox
            onPressBackBtnScanerFormBox: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("Supervisor");
            },

            //Back Btn from ScrollContainer Page 2 =>idPage2HUDetails 
            onBackPressHUDetails: function () {
                var oScrollContainer1 = this.byId("idPage1ScannerFormBox");
                var oScrollContainer2 = this.byId("idPage2HUDetails");

                // show the Scanner form VBox
                oScrollContainer1.setVisible(true);

                //Hide the HUDetails scroll container
                oScrollContainer2.setVisible(false);
            },

            //Back Btn from ScrollContainer Page 3=>idPage3HUListTable
            onBackPressHUListTable: function () {
                var oScrollContainer3 = this.byId("idPage3HUListTable");
                var oScrollContainer2 = this.byId("idPage2HUDetails");

                // show the HUDetails Page2
                oScrollContainer2.setVisible(true);

                //Hide the HUListTable Page3
                oScrollContainer3.setVisible(false);
            },

            //Back Btn from ScrollContainer Page 4=>idPage4NewHUNumber
            onBackBtnPressNewHUNumber: function () {
                var oScrollContainer4 = this.byId("idPage4NewHUNumber");
                var oScrollContainer3 = this.byId("idPage3HUListTable");

                // show the HUDetails Page2
                oScrollContainer3.setVisible(true);

                //Hide the NewHuNumber Page3
                oScrollContainer4.setVisible(true);
            },

            //Back Btn from ScrollContainer Page 5=>idPage4NewHUNumber
            onBackPressVerifyHUNumber: function () {
                var oScrollContainer5 = this.byId("idPage5VerifyHUNumber");
                var oScrollContainer4 = this.byId("idPage4NewHUNumber");

                // show the HUDetails Page2
                oScrollContainer4.setVisible(true);

                //Hide the NewHuNumber Page3
                oScrollContainer5.setVisible(false);
            },

            //Back Btn from ScrollContainer Page 6=>idPage6GoodsReceiptGR
            onBackPressGoodsReceipt: function () {
                var oScrollContainer6 = this.byId("idPage6GoodsReceiptGR");
                var oScrollContainer5 = this.byId("idPage5VerifyHUNumber");

                // show the VerifyHUNumber Page5
                oScrollContainer5.setVisible(true);

                //Hide the GoodsReceiptGR Page6
                oScrollContainer6.setVisible(false);
            },

            //Back Btn from ScrollContainer Page 7=>idPage7UnLoadPage
            onBackPressUnLoadPage: function () {
                var oScrollContainer7 = this.byId("idPage7UnLoadPage");
                var oScrollContainer5 = this.byId("idPage5VerifyHUNumber");

                // show the UnLoadPage Page7
                oScrollContainer5.setVisible(true);

                //Hide the VerifyHuNmber Page5
                oScrollContainer7.setVisible(false);
            },

            //Submit Btn from ScrollContainer Page 1=> idPage1ScannerFormBox..
            onSubmitPress: function () {
                var oScrollContainer1 = this.byId("idPage1ScannerFormBox");
                var oScrollContainer2 = this.byId("idPage2HUDetails");

                // Hide the Scanner form VBox
                oScrollContainer1.setVisible(false);

                // Show the HUDetails scroll container
                oScrollContainer2.setVisible(true);
            },

            //HUListTableBtn from ScrollContainer Page 2 =>idPage2HUDetails
            onPressHUListTable: function () {
                var oScrollContainer2 = this.byId("idPage2HUDetails");
                var oScrollContainer3 = this.byId("idPage3HUListTable");

                // Hide the form VBox
                oScrollContainer2.setVisible(false);
                //oScrollContainer.setVisible(false);

                // Show the scroll container
                oScrollContainer3.setVisible(true);
            },

            //NewHUNumberBtn from ScrollContainer Page 2=>idPage2HUDetails 
            onPressNewHUNumberBtn: function () {
                var oScrollContainer4 = this.byId("idPage4NewHUNumber");
                var oScrollContainer2 = this.byId("idPage3HUListTable");
                // Hide the form VBox
                oScrollContainer2.setVisible(false);

                // Show the scroll container
                oScrollContainer4.setVisible(true);
            },

            onEnterNewHUNUmberPress: function () {
                var oScrollContainer5 = this.byId("idPage5VerifyHUNumber");
                var oScrollContainer4 = this.byId("idPage4NewHUNumber");
                // Hide the form VBox
                oScrollContainer4.setVisible(false);

                // Show the scroll container
                oScrollContainer5.setVisible(true);
            },

            //GRBtn from from ScrollContainer Page 5=>idPage6GoodsReceiptGR
            onGRBtnPressVerifyHUNumber: function () {
                var oScrollContainer5 = this.byId("idPage5VerifyHUNumber");
                var oScrollContainer6 = this.byId("idPage6GoodsReceiptGR");
                // Hide the form VBox
                oScrollContainer5.setVisible(false);

                // Show the scroll container
                oScrollContainer6.setVisible(true);
            },

            //UnLoad Btn from from ScrollContainer Page 5=>idPage6GoodsReceiptGR
            onUnloadPressVerifyHUNumber: function () {
                var oScrollContainer5 = this.byId("idPage5VerifyHUNumber");
                var oScrollContainer7 = this.byId("idPage7UnLoadPage");
                // Hide the form VBox
                oScrollContainer5.setVisible(false);

                // Show the scroll container
                oScrollContainer7.setVisible(true);
            }

        });
    }
);