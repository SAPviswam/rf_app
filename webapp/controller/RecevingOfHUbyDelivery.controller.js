sap.ui.define([
  "sap/ui/core/mvc/Controller",

],
  function (Controller) {
    "use strict";

    return Controller.extend("com.app.rfapp.controller.RecevingOfHUbyDelivery", {
      onInit: function () {
        
        const oRouter = this.getOwnerComponent().getRouter();

        oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);

      },
      onResourceDetailsLoad: async function (oEvent1) {

        const { id } = oEvent1.getParameter("arguments");

        this.ID = id;

      },
      onAfterRendering: function () {
        this.byId("idROHDScanDeliveryNO").setVisible(true);
      },
      //Back Btn from 1st ScrollContainer Page 1 =>idPage1ScannerFormBox
      OnPressScanDeliveryBackButton: async function () {
        var oRouter = this.getOwnerComponent().getRouter();

        var oModel1 = this.getOwnerComponent().getModel();

        await oModel1.read("/RESOURCESSet('" + this.ID + "')", {

          success: function (oData) {
            
            let oUser=oData.Users.toLowerCase()
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

      //Back Btn from ScrollContainer Page 2 =>idROHDDeliverydetailsPage2 
      OnpressDeliveryDetailsBackbutton: function () {
        var oScrollContainer1 = this.byId("idROHDScanDeliveryNO");
        var oScrollContainer2 = this.byId("idROHDDeliverydetailsPage2");

        // show the Scanner form VBox
        oScrollContainer1.setVisible(true);

        //Hide the HUDetails scroll container
        oScrollContainer2.setVisible(false);
      },

      //Back Btn from ScrollContainer Page 3=>idROHDHUListPage3
      OnpressHUlistBackbtn: function () {
        var oScrollContainer3 = this.byId("idROHDHUListPage3");
        var oScrollContainer2 = this.byId("idROHDDeliverydetailsPage2");

        // show the HUDetails Page2
        oScrollContainer2.setVisible(true);

        //Hide the HUListTable Page3
        oScrollContainer3.setVisible(false);
      },

      //Back Btn from ScrollContainer Page 4=>idROHDNewHUPage4
      OnpressNewHuBackbutton: function () {
        var oScrollContainer4 = this.byId("idROHDNewHUPage4");
        var oScrollContainer2 = this.byId("idROHDDeliverydetailsPage2");

        // show the HUDetails Page2
        oScrollContainer2.setVisible(true);

        //Hide the NewHuNumber Page3
        oScrollContainer4.setVisible(true);
      },

      //Back Btn from ScrollContainer Page 5=>idROHDNewHUPage4
      OnpressAfterNextBackbutton: function () {
        var oScrollContainer5 = this.byId("idROHDDeliveryEnterpage5");
        var oScrollContainer4 = this.byId("idROHDNewHUPage4");

        // show the HUDetails Page2
        oScrollContainer4.setVisible(true);

        //Hide the NewHuNumber Page3
        oScrollContainer5.setVisible(false);
      },

      //Back Btn from ScrollContainer Page 6=>idROHDGRpage6
      OnpressROHDGRBackbutton: function () {
        var oScrollContainer6 = this.byId("idROHDGRpage6");
        var oScrollContainer5 = this.byId("idROHDDeliveryEnterpage5");

        // show the VerifyHUNumber Page5
        oScrollContainer5.setVisible(true);

        //Hide the GoodsReceiptGR Page6
        oScrollContainer6.setVisible(false);
      },

      //Back Btn from ScrollContainer Page 7=>idROHDUnloadpage7
      OnpressUnloadBackbutton: function () {
        var oScrollContainer7 = this.byId("idROHDUnloadpage7");
        var oScrollContainer5 = this.byId("idROHDDeliveryEnterpage5");

        // show the UnLoadPage Page7
        oScrollContainer5.setVisible(true);

        //Hide the VerifyHuNmber Page5
        oScrollContainer7.setVisible(false);
      },

      //Submit Btn from ScrollContainer Page 1=> idPage1ScannerFormBox..
      onPressROHDSubmitbtn: function () {
        var oScrollContainer1 = this.byId("idROHDScanDeliveryNO");
        var oScrollContainer2 = this.byId("idROHDDeliverydetailsPage2");

        // Hide the Scanner form VBox
        oScrollContainer1.setVisible(false);

        // Show the HUDetails scroll container
        oScrollContainer2.setVisible(true);
      },

      //HUListTableBtn from ScrollContainer Page 2 =>idROHDDeliverydetailsPage2
      onROHDHUListPress: function () {
        var oScrollContainer2 = this.byId("idROHDDeliverydetailsPage2");
        var oScrollContainer3 = this.byId("idROHDHUListPage3");

        // Hide the form VBox
        oScrollContainer2.setVisible(false);
        //oScrollContainer.setVisible(false);

        // Show the scroll container
        oScrollContainer3.setVisible(true);
      },

      //NewHUNumberBtn from ScrollContainer Page 2=>idROHDDeliverydetailsPage2 
      onPressROHDNewHU: function () {
        var oScrollContainer4 = this.byId("idROHDNewHUPage4");
        var oScrollContainer2 = this.byId("idROHDDeliverydetailsPage2");
        // Hide the form VBox
        oScrollContainer2.setVisible(false);

        // Show the scroll container
        oScrollContainer4.setVisible(true);
      },

      onPressROHDEnter: function () {
        var oScrollContainer5 = this.byId("idROHDDeliveryEnterpage5");
        var oScrollContainer4 = this.byId("idROHDNewHUPage4");
        // Hide the form VBox
        oScrollContainer4.setVisible(false);

        // Show the scroll container
        oScrollContainer5.setVisible(true);
      },

      //GRBtn from from ScrollContainer Page 5=>idROHDGRpage6
      onPressEnterGRButton: function () {
        var oScrollContainer5 = this.byId("idROHDDeliveryEnterpage5");
        var oScrollContainer6 = this.byId("idROHDGRpage6");
        // Hide the form VBox
        oScrollContainer5.setVisible(false);

        // Show the scroll container
        oScrollContainer6.setVisible(true);
      },

      //UnLoad Btn from from ScrollContainer Page 5=>idROHDGRpage6
      onPressEnterUnloadButton: function () {
        var oScrollContainer5 = this.byId("idROHDDeliveryEnterpage5");
        var oScrollContainer7 = this.byId("idROHDUnloadpage7");
        // Hide the form VBox
        oScrollContainer5.setVisible(false);

        // Show the scroll container
        oScrollContainer7.setVisible(true);
      }
    });
  });
