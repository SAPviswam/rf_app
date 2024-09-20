sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("com.app.rfapp.controller.CreatePutawayHusManually", {
        onInit: function() {
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
        },
        onResourceDetailsLoad: async function (oEvent1) {
        
          const { id } = oEvent1.getParameter("arguments");
          this.ID = id;
  
        },
        onAfterRendering: function () {
          this.byId("idCPHMANScanPage1").setVisible(true);
        },

     onPressCPHMANScanbackbtn: async function () {
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
        //back button from Second Screen to first screen
        OnpressCPHMANPage2Backbutton: function () {
          var oScrollContainer1 = this.byId("idCPHMANScanPage1");
          var oScrollContainer2 = this.byId("idCPHMANPage2");
  
          // show the Scanner form VBox
          oScrollContainer1.setVisible(true);
  
          //Hide the HUDetails scroll container
          oScrollContainer2.setVisible(false);
        },
        //back button from Third Screen to Second screen
        onPressCPHMANPage3backbtn: function () {
          var oScrollContainer3 = this.byId("idCPHMANPage3");
          var oScrollContainer2 = this.byId("idCPHMANPage2");
  
          // show the Scanner form VBox
          oScrollContainer3.setVisible(false);
  
          //Hide the HUDetails scroll container
          oScrollContainer2.setVisible(true);
        },
  
        //Submit Btn from ScrollContainer Page 1=> idPage1ScannerFormBox..
        onPressCPHMANSubmitbtn: function () {
          var oScrollContainer1 = this.byId("idCPHMANScanPage1");
          var oScrollContainer2 = this.byId("idCPHMANPage2");
  
          // Hide the Scanner form VBox
          oScrollContainer1.setVisible(false);
  
          // Show the HUDetails scroll container
          oScrollContainer2.setVisible(true);
        },
        onPressCPHMANESaveBTn: function() {
          var oScrollContainer3 = this.byId("idCPHMANPage3");
          var oScrollContainer2 = this.byId("idCPHMANPage2");
  
          // Hide the Scanner form VBox
          oScrollContainer2.setVisible(false);
  
          // Show the HUDetails scroll container
          oScrollContainer3.setVisible(true);
        }

      });
    }
  );