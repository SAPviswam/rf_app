sap.ui.define(
  [
    "sap/ui/core/mvc/Controller"
  ],
  function (BaseController) {
    "use strict";

    return BaseController.extend("com.app.rfapp.controller.WTQueryByHU", {
      onInit: function () {
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
      },
      onResourceDetailsLoad: async function (oEvent1) {
        const { id } = oEvent1.getParameter("arguments");
        this.ID = id;
      },
      //Back Btn from 1st ScrollContainer Page 1 =>idPage1ScannerFormBox_WTQBYHU
      onPressBackBtnPage1_WTQBYHU: async function () {
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

      //Back Btn from ScrollContainer Page 2 =>idPage2HUNumberTable_WTQBYHU 
      onBackPressHUNumbersTable: function () {
        var oScrollContainer2 = this.byId("idPage2HUNumberTable_WTQBYHU");
        var oScrollContainer1 = this.byId("idPage1ScannerFormBox_WTQBYHU");

        // show the Scanner form VBox
        oScrollContainer1.setVisible(true);

        //Hide the HUNumbers Table scroll container
        oScrollContainer2.setVisible(false);
      },

      //Back Btn from ScrollContainer Page 3 =>idPage3WTDetails_WTQBYHU 
      onBackPressBtnWTDetails_WTQBYHU: function () {
        var oScrollContainer3 = this.byId("idPage3WTDetails_WTQBYHU");
        var oScrollContainer2 = this.byId("idPage2HUNumberTable_WTQBYHU");

        // show the Table Contents
        oScrollContainer2.setVisible(true);

        //Hide the HUContents scroll container
        oScrollContainer3.setVisible(false);
      },
      //Back Btn from ScrollContainer Page 4 =>idPage4ProductDescription_WTQBYHU 
      onBackPressBtnProductDetails_WTQBYHU: function () {
        var oScrollContainer4 = this.byId("idPage4ProductDescription_WTQBYHU");
        var oScrollContainer3 = this.byId("idPage3WTDetails_WTQBYHU");

        // show the WT Details Contents
        oScrollContainer3.setVisible(true);

        //Hide the Product Details scroll container
        oScrollContainer4.setVisible(false);
      },



      //Submit Btn from ScrollContainer Page 1=> idPage1ScannerFormBox_WTQBYHU..
      onSubmitPressPage1_WTQBYHU: function () {
        var oScrollContainer1 = this.byId("idPage1ScannerFormBox_WTQBYHU");
        var oScrollContainer2 = this.byId("idPage2HUNumberTable_WTQBYHU");

        // Hide the Scanner form VBox
        oScrollContainer1.setVisible(false);

        // Show the HUNumber Table scroll container
        oScrollContainer2.setVisible(true);
      },

      //WT Btn from ScrollContainer Page 2=> idPage2HUNumberTable_WTQBYHU..
      onPressWTBtnPage2_WTQBYHU: function () {
        var oScrollContainer2 = this.byId("idPage2HUNumberTable_WTQBYHU");
        var oScrollContainer3 = this.byId("idPage3WTDetails_WTQBYHU");

        // Hide the HUNumber Table...
        oScrollContainer2.setVisible(false);

        // Show the Wt Details...
        oScrollContainer3.setVisible(true);
      },

      //Detail Btn from ScrollContainer Page 3=> idPage3WTDetails_WTQBYHU..
      onBtnDetailPressPage3_WTQBYHU: function () {
        var oScrollContainer3 = this.byId("idPage3WTDetails_WTQBYHU");
        var oScrollContainer4 = this.byId("idPage4ProductDescription_WTQBYHU");

        // Hide the WT Details...
        oScrollContainer3.setVisible(false);

        // Show the Product Details...
        oScrollContainer4.setVisible(true);
      },
    });
  }
);
