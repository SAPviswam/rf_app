sap.ui.define(
    [
      "sap/ui/core/mvc/Controller"
    ],
    function (BaseController) {
      "use strict";
  
      return BaseController.extend("com.app.rfapp.controller.RecevingOfHUbyManufacturingOrder", {
        onInit: function () {
  
            const oTable = this.getView().byId("idROHMTable");
              oTable.attachBrowserEvent("dblclick", this.onRowDoubleClick.bind(this));
            
              const oRouter = this.getOwnerComponent().getRouter();
              oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
      
            },
            onResourceDetailsLoad: async function (oEvent1) {
      
              const { id } = oEvent1.getParameter("arguments");
      
              this.ID = id;
      
            },
          onRowDoubleClick: function () {
              debugger
              var oSelected = this.byId("idROHMTable").getSelectedItem();
              // var ID = oSelected.getBindingContext().getObject()
              this.getView().byId("idROHMScanManufacturingorder").setVisible(false);
              this.getView().byId("idROHMDeliverydetailsPage2").setVisible(true);
          },
        onAfterRendering: function () {
          this.byId("idROHMScanManufacturingorder").setVisible(true);
        },
        //Back Btn from 1st ScrollContainer Page 1 =>idPage1ScannerFormBox
        onPressROHMScanManubackbtn: async function () {
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
          this.getView().byId("idROHMPanel").setVisible(false);

        },
  
        //Back Btn from ScrollContainer Page 2 =>idROHMDeliverydetailsPage2 
        OnpressManuDelDetailsBackbutton: function () {
          var oScrollContainer1 = this.byId("idROHMScanManufacturingorder");
          var oScrollContainer2 = this.byId("idROHMDeliverydetailsPage2");
  
          // show the Scanner form VBox
          oScrollContainer1.setVisible(true);
  
          //Hide the HUDetails scroll container
          oScrollContainer2.setVisible(false);
        },
  
        //Back Btn from ScrollContainer Page 3=>idROHMHUListPage3
        OnpressROHMHUlistBackbtn: function () {
          var oScrollContainer3 = this.byId("idROHMHUListPage3");
          var oScrollContainer2 = this.byId("idROHMDeliverydetailsPage2");
  
          // show the HUDetails Page2
          oScrollContainer2.setVisible(true);
  
          //Hide the HUListTable Page3
          oScrollContainer3.setVisible(false);
        },
  
        //Back Btn from ScrollContainer Page 4=>idROHMNewHUPage4
        OnpressROHMNewHuBackbutton: function () {
          var oScrollContainer4 = this.byId("idROHMNewHUPage4");
          var oScrollContainer2 = this.byId("idROHMDeliverydetailsPage2");
  
          // show the HUDetails Page2
          oScrollContainer2.setVisible(true);
  
          //Hide the NewHuNumber Page3
          oScrollContainer4.setVisible(true);
        },
  
        //Back Btn from ScrollContainer Page 5=>idROHMNewHUPage4
        OnpressAfterNextBackbutton: function () {
          var oScrollContainer5 = this.byId("idROHMnextOrEnterpage5");
          var oScrollContainer4 = this.byId("idROHMNewHUPage4");
  
          // show the HUDetails Page2
          oScrollContainer4.setVisible(true);
  
          //Hide the NewHuNumber Page3
          oScrollContainer5.setVisible(false);
        },
  
        //Back Btn from ScrollContainer Page 6=>idROHMGRpage6
        OnpressROHMGRBackbutton: function () {
          var oScrollContainer6 = this.byId("idROHMGRpage6");
          var oScrollContainer5 = this.byId("idROHMnextOrEnterpage5");
  
          // show the VerifyHUNumber Page5
          oScrollContainer5.setVisible(true);
  
          //Hide the GoodsReceiptGR Page6
          oScrollContainer6.setVisible(false);
        },
  
        //Back Btn from ScrollContainer Page 7=>idROHMUnloadpage7
        OnpressROHMUnloadBackbutton: function () {
          var oScrollContainer7 = this.byId("idROHMUnloadpage7");
          var oScrollContainer5 = this.byId("idROHMnextOrEnterpage5");
  
          // show the UnLoadPage Page7
          oScrollContainer5.setVisible(true);
  
          //Hide the VerifyHuNmber Page5
          oScrollContainer7.setVisible(false);
        },
  
        //Submit Btn from ScrollContainer Page 1=> idPage1ScannerFormBox..
        onPressROHMSubmitbtn: function () {
          var oScrollContainer1 = this.byId("idROHMScanManufacturingorder");
          var oScrollContainer2 = this.byId("idROHMPanel");
  
          // Hide the Scanner form VBox
          
  
          // Show the HUDetails scroll container
          oScrollContainer2.setVisible(true);
        },
  
        //HUListTableBtn from ScrollContainer Page 2 =>idROHMDeliverydetailsPage2
        onPressROHMHUListPress: function () {
          var oScrollContainer2 = this.byId("idROHMDeliverydetailsPage2");
          var oScrollContainer3 = this.byId("idROHMHUListPage3");
  
          // Hide the form VBox
          oScrollContainer2.setVisible(false);
          //oScrollContainer.setVisible(false);
  
          // Show the scroll container
          oScrollContainer3.setVisible(true);
        },
  
        //NewHUNumberBtn from ScrollContainer Page 2=>idROHMDeliverydetailsPage2 
        onPressROHMNewHU: function () {
          var oScrollContainer4 = this.byId("idROHMNewHUPage4");
          var oScrollContainer2 = this.byId("idROHMDeliverydetailsPage2");
          // Hide the form VBox
          oScrollContainer2.setVisible(false);
  
          // Show the scroll container
          oScrollContainer4.setVisible(true);
        },
  
        onPressROHMEnter: function(){
          var oScrollContainer5 = this.byId("idROHMnextOrEnterpage5");
          var oScrollContainer4 = this.byId("idROHMNewHUPage4"); 
          // Hide the form VBox
          oScrollContainer4.setVisible(false);
  
          // Show the scroll container
          oScrollContainer5.setVisible(true);
        },
  
        //GRBtn from from ScrollContainer Page 5=>idROHMGRpage6
        onPressEnterROHMGRButton: function(){
          var oScrollContainer5 = this.byId("idROHMnextOrEnterpage5");
          var oScrollContainer6 = this.byId("idROHMGRpage6"); 
          // Hide the form VBox
          oScrollContainer5.setVisible(false);
  
          // Show the scroll container
          oScrollContainer6.setVisible(true);
        },
  
        //UnLoad Btn from from ScrollContainer Page 5=>idROHMGRpage6
        onPressEnterROHMUnloadButton: function(){
          var oScrollContainer5 = this.byId("idROHMnextOrEnterpage5");
          var oScrollContainer7 = this.byId("idROHMUnloadpage7"); 
          // Hide the form VBox
          oScrollContainer5.setVisible(false);
  
          // Show the scroll container
          oScrollContainer7.setVisible(true);
        }
  
      });
    }
  );
  