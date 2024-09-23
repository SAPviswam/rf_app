sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("com.app.rfapp.controller.CreatePutawayHusforDeconsolidate", {
        onInit: function() {
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
        },
        onResourceDetailsLoad: async function (oEvent1) {
        
          const { id } = oEvent1.getParameter("arguments");
          this.ID = id;
  
        },
        onAfterRendering: function () {
          this.byId("idCPHFDEScanPage1").setVisible(true);
        },
        //Back Btn from 1st ScrollContainer Page 1 =>idPage1ScannerFormBox
        onPressCPHFDEScanbackbtn: async function () {
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
        OnpressCPHFDEPage2Backbutton: function () {
          var oScrollContainer1 = this.byId("idCPHFDEScanPage1");
          var oScrollContainer2 = this.byId("idCPHFDEPage2");
  
          // show the Scanner form VBox
          oScrollContainer1.setVisible(true);
  
          //Hide the HUDetails scroll container
          oScrollContainer2.setVisible(false);
        },
        //back button from Third Screen to Second screen
        OnpressCPHFDEPage3Backbutton: function () {
          var oScrollContainer3 = this.byId("idCPHFDEPage3");
          var oScrollContainer2 = this.byId("idCPHFDEPage2");
  
          // show the Scanner form VBox
          oScrollContainer3.setVisible(false);
  
          //Hide the HUDetails scroll container
          oScrollContainer2.setVisible(true);
        },
  
        //Submit Btn from ScrollContainer Page 1=> idPage1ScannerFormBox..
        onPressCPHFDESubmitbtn: function () {
          var oScrollContainer1 = this.byId("idCPHFDEScanPage1");
          var oScrollContainer2 = this.byId("idCPHFDEPage2");
  
          // Hide the Scanner form VBox
          oScrollContainer1.setVisible(false);
  
          // Show the HUDetails scroll container
          oScrollContainer2.setVisible(true);
        },
        OnlivechangePutaway: function() {
          var oScrollContainer3 = this.byId("idCPHFDEPage3");
          var oScrollContainer2 = this.byId("idCPHFDEPage2");
  
          // Hide the Scanner form VBox
          oScrollContainer2.setVisible(false);
  
          // Show the HUDetails scroll container
          oScrollContainer3.setVisible(true);
        }

      });
    }
  );