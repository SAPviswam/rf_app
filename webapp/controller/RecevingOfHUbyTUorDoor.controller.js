sap.ui.define(
    [
      "sap/ui/core/mvc/Controller"
    ],
    function (BaseController) {
      "use strict";
  
      return BaseController.extend("com.app.rfapp.controller.RecevingOfHUbyTUorDoor", {
        onInit: function () {

          const oTable = this.getView().byId("idROHTU_DTable");
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
                var oSelected = this.byId("idROHTU_DTable").getSelectedItem();
                // var ID = oSelected.getBindingContext().getObject()
                this.getView().byId("idROHTU_DScanPage1").setVisible(false);
                this.getView().byId("idROHTU_DDeliverydetailsPage2").setVisible(true);
            },
          onAfterRendering: function () {
            this.byId("idROHTU_DScanPage1").setVisible(true);
          },
          //Back Btn from 1st ScrollContainer Page 1 =>idPage1ScannerFormBox
          onPressROHTU_DScanbackbtn: async function () {
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
            this.getView().byId("idROHTU_DPanel").setVisible(false);

          },
    
          //Back Btn from ScrollContainer Page 2 =>idROHTU_DDeliverydetailsPage2 
          OnpressManuDelDetailsBackbutton: function () {
            var oScrollContainer1 = this.byId("idROHTU_DScanPage1");
            var oScrollContainer2 = this.byId("idROHTU_DDeliverydetailsPage2");
    
            // show the Scanner form VBox
            oScrollContainer1.setVisible(true);
    
            //Hide the HUDetails scroll container
            oScrollContainer2.setVisible(false);
          },
    
          //Back Btn from ScrollContainer Page 3=>idROHTU_DHUListPage3
          OnpressROHTU_DHUlistBackbtn: function () {
            var oScrollContainer3 = this.byId("idROHTU_DHUListPage3");
            var oScrollContainer2 = this.byId("idROHTU_DDeliverydetailsPage2");
    
            // show the HUDetails Page2
            oScrollContainer2.setVisible(true);
    
            //Hide the HUListTable Page3
            oScrollContainer3.setVisible(false);
          },
    
          //Back Btn from ScrollContainer Page 4=>idROHTU_DNewHUPage4
          OnpressROHTU_DNewHuBackbutton: function () {
            var oScrollContainer4 = this.byId("idROHTU_DNewHUPage4");
            var oScrollContainer2 = this.byId("idROHTU_DDeliverydetailsPage2");
    
            // show the HUDetails Page2
            oScrollContainer2.setVisible(true);
    
            //Hide the NewHuNumber Page3
            oScrollContainer4.setVisible(true);
          },
    
          //Back Btn from ScrollContainer Page 5=>idROHTU_DNewHUPage4
          OnpressROHTU_DAfterNextBackbutton: function () {
            var oScrollContainer5 = this.byId("idROHTU_DnextOrEnterpage5");
            var oScrollContainer4 = this.byId("idROHTU_DNewHUPage4");
    
            // show the HUDetails Page2
            oScrollContainer4.setVisible(true);
    
            //Hide the NewHuNumber Page3
            oScrollContainer5.setVisible(false);
          },
    
          //Back Btn from ScrollContainer Page 6=>idROHTU_DGRpage6
          OnpressROHTU_DGRBackbutton: function () {
            var oScrollContainer6 = this.byId("idROHTU_DGRpage6");
            var oScrollContainer5 = this.byId("idROHTU_DnextOrEnterpage5");
    
            // show the VerifyHUNumber Page5
            oScrollContainer5.setVisible(true);
    
            //Hide the GoodsReceiptGR Page6
            oScrollContainer6.setVisible(false);
          },
    
          //Back Btn from ScrollContainer Page 7=>idROHTU_DUnloadpage7
          OnpressROHTU_DUnloadBackbutton: function () {
            var oScrollContainer7 = this.byId("idROHTU_DUnloadpage7");
            var oScrollContainer5 = this.byId("idROHTU_DnextOrEnterpage5");
    
            // show the UnLoadPage Page7
            oScrollContainer5.setVisible(true);
    
            //Hide the VerifyHuNmber Page5
            oScrollContainer7.setVisible(false);
          },
    
          //Submit Btn from ScrollContainer Page 1=> idPage1ScannerFormBox..
          onPressROHTU_DSubmitbtn: function () {
            var oScrollContainer1 = this.byId("idROHTU_DScanPage1");
            var oScrollContainer2 = this.byId("idROHTU_DPanel");
    
            // Hide the Scanner form VBox
            
    
            // Show the HUDetails scroll container
            oScrollContainer2.setVisible(true);
          },
    
          //HUListTableBtn from ScrollContainer Page 2 =>idROHTU_DDeliverydetailsPage2
          onPressROHTU_DHUListPress: function () {
            var oScrollContainer2 = this.byId("idROHTU_DDeliverydetailsPage2");
            var oScrollContainer3 = this.byId("idROHTU_DHUListPage3");
    
            // Hide the form VBox
            oScrollContainer2.setVisible(false);
            //oScrollContainer.setVisible(false);
    
            // Show the scroll container
            oScrollContainer3.setVisible(true);
          },
    
          //NewHUNumberBtn from ScrollContainer Page 2=>idROHTU_DDeliverydetailsPage2 
          onPressROHTU_DNewHU: function () {
            var oScrollContainer4 = this.byId("idROHTU_DNewHUPage4");
            var oScrollContainer2 = this.byId("idROHTU_DDeliverydetailsPage2");
            // Hide the form VBox
            oScrollContainer2.setVisible(false);
    
            // Show the scroll container
            oScrollContainer4.setVisible(true);
          },
    
          onPressROHTU_DEnter: function(){
            var oScrollContainer5 = this.byId("idROHTU_DnextOrEnterpage5");
            var oScrollContainer4 = this.byId("idROHTU_DNewHUPage4"); 
            // Hide the form VBox
            oScrollContainer4.setVisible(false);
    
            // Show the scroll container
            oScrollContainer5.setVisible(true);
          },
    
          //GRBtn from from ScrollContainer Page 5=>idROHTU_DGRpage6
          onPressEnterROHTU_DGRButton: function(){
            var oScrollContainer5 = this.byId("idROHTU_DnextOrEnterpage5");
            var oScrollContainer6 = this.byId("idROHTU_DGRpage6"); 
            // Hide the form VBox
            oScrollContainer5.setVisible(false);
    
            // Show the scroll container
            oScrollContainer6.setVisible(true);
          },
    
          //UnLoad Btn from from ScrollContainer Page 5=>idROHTU_DGRpage6
          onPressEnterROHTU_DUnloadButton: function(){
            var oScrollContainer5 = this.byId("idROHTU_DnextOrEnterpage5");
            var oScrollContainer7 = this.byId("idROHTU_DUnloadpage7"); 
            // Hide the form VBox
            oScrollContainer5.setVisible(false);
    
            // Show the scroll container
            oScrollContainer7.setVisible(true);
          }
    
        });
      }
    );    