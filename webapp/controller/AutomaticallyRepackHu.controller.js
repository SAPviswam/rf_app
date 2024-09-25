sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("com.app.rfapp.controller.AutomaticallyRepackHu", {
        onInit: function() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
        },
        onResourceDetailsLoad: async function (oEvent1) {
            const { id } = oEvent1.getParameter("arguments");
            this.ID = id;
        },
        onPressARHUScanbackbtn: async function () {
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
          //back button from screen 2
          OnpressARHUPage2Backbutton: function () {
            var oScrollContainer1 = this.byId("idARHUScanPage1");
            var oScrollContainer2 = this.byId("idARHUPage2");
    
            // show the Scanner form VBox
            oScrollContainer1.setVisible(true);
    
            //Hide the HUDetails scroll container
            oScrollContainer2.setVisible(false);
          },

          //back button from Screen3
          OnpressARHUPage3Backbutton: function () {
            var oScrollContainer3 = this.byId("idARHUPage3");
            var oScrollContainer2 = this.byId("idARHUPage2");
    
            // show the Scanner form VBox
            oScrollContainer3.setVisible(false);
    
            //Hide the HUDetails scroll container
            oScrollContainer2.setVisible(true);
          },
          //back button from Screen4
          OnpressARHUPage4Backbutton: function () {
            var oScrollContainer3 = this.byId("idARHUPage3");
            var oScrollContainer4 = this.byId("idARHUPage4");
    
            // show the Scanner form VBox
            oScrollContainer4.setVisible(false);
    
            //Hide the HUDetails scroll container
            oScrollContainer3.setVisible(true);
          },
          //back button from Screen5
          OnpressARHUPage5Backbutton: function () {
            var oScrollContainer5 = this.byId("idARHUPage5");
            var oScrollContainer4 = this.byId("idARHUPage4");
    
            // show the Scanner form VBox
            oScrollContainer5.setVisible(false);
    
            //Hide the HUDetails scroll container
            oScrollContainer4.setVisible(true);
          },
          //back button from screen 6
          OnpressARHUPage6Backbutton: function() {
            this.byId("idARHUPage5").setVisible(true);
            this.byId("idARHUPage6").setVisible(false);
          },
          //back button from screen 7
          OnpressARHUPage7Backbutton: function() {
            this.byId("idARHUPage5").setVisible(true);
            this.byId("idARHUPage7").setVisible(false);
          },
          //Submit Btn from ScrollContainer Page 1=> idPage1ScannerFormBox..
        onPressARHUSubmitbtn: function () {
            var oScrollContainer1 = this.byId("idARHUScanPage1");
            var oScrollContainer2 = this.byId("idARHUPage2");
    
            // Hide the Scanner form VBox
            oScrollContainer1.setVisible(false);
    
            // Show the HUDetails scroll container
            oScrollContainer2.setVisible(true);
          },
          // from ScrollContainer Page2 --> Page 3
          onPressARHUSourceHu: function () {
            var oScrollContainer2 = this.byId("idARHUPage2");
            var oScrollContainer3 = this.byId("idARHUPage3");
    
            // Hide the Scanner form VBox
            oScrollContainer2.setVisible(false);
    
            // Show the HUDetails scroll container
            oScrollContainer3.setVisible(true);
          },
          // from ScrollContainer Page2 --> Page 3
          onPressARHUDestHu: function () {
            var oScrollContainer4 = this.byId("idARHUPage4");
            var oScrollContainer3 = this.byId("idARHUPage3");
    
            // Hide the Scanner form VBox
            oScrollContainer3.setVisible(false);
    
            // Show the HUDetails scroll container
            oScrollContainer4.setVisible(true);
          },
          onPressARHUSaveBtn: function() {
            this.byId("idARHUPage4").setVisible(false);
            this.byId("idARHUPage5").setVisible(true);
          },
          onPressARHUHUCreateBtn: function() {
            this.byId("idARHUPage5").setVisible(false);
            this.byId("idARHUPage2").setVisible(true);
          },
          onPressARHUHUOverviewBtn:function() {
            this.byId("idARHUPage5").setVisible(false);
            this.byId("idARHUPage6").setVisible(true);
          },
          onPressARHUHUItemListBtn: function() {
            this.byId("idARHUPage5").setVisible(false);
            this.byId("idARHUPage7").setVisible(true);
          },
      });
    }
  );