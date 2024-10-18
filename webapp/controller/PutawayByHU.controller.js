sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
     "sap/ui/Device"
  ],
  function (BaseController,MessageToast,Device) {
    "use strict";

    return BaseController.extend("com.app.rfapp.controller.PutawayByHU", {
      onInit: function () {
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
          // Attach media change handler for screen size adjustments
          Device.media.attachHandler(this.onResize, this);
            
    },



   

    onResourceDetailsLoad: async function (oEvent1) {
        const { id } = oEvent1.getParameter("arguments");
            this.ID = id;
  
      },
      onAfterRendering: function () {
        this.byId("idPage1ScannerFormBoxHU").setVisible(true);
      },
      //Back Btn from 1st ScrollContainer Page 1 =>idPage1ScannerFormBox
    //   
      onPressBackBtnScanerFormBox: async function(){
        var oRouter = this.getOwnerComponent().getRouter();
        var oModel1 = this.getOwnerComponent().getModel();
        await oModel1.read("/RESOURCESSet('" + this.ID + "')", {
            success: function (oData) {
                let oUser=oData.Users.toLowerCase()
                if(oUser ===  "resource"){
                    oRouter.navTo("RouteResourcePage",{id:this.ID});
                }
                else{
                oRouter.navTo("Supervisor",{id:this.ID});
            }
            }.bind(this),
            error: function () {
                MessageToast.show("User does not exist");
            }
        });
    },

      //Back Btn from ScrollContainer Page 2 =>idPage2HUDetails 
      onBackPressHUDetails: function () {
        var oScrollContainer1 = this.byId("idPage1ScannerFormBoxHU");
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

      //Submit Btn from ScrollContainer Page 1=> idPage1ScannerFormBox..
      onSubmitPress: function () {
        var oScrollContainer1 = this.byId("idPage1ScannerFormBoxHU");
        var oScrollContainer2 = this.byId("idPage2HUDetails");

        // Hide the Scanner form VBox
        oScrollContainer1.setVisible(false);

        // Show the HUDetails scroll container
        oScrollContainer2.setVisible(true);
      },

    //   onSubmitPress: function () {
    //     debugger
    //     var oHu = this.byId("idInputWarhouseOrderNoHU").getValue();
    
    //     /**Getting Model */
    //     var oModel = this.getOwnerComponent().getModel();
    //     var that = this;
        
    //     oModel.read(`/Hu_ContentSet('${oHu}')`, {
    //         success: function (odata) {
                
              
    //            /* odata.Matid
    //             odata.Quan
    //             odata.Meins
               
                
              
               
                
               
    //             odata.UnitLwh
    //             odata.UnitGw
                
    //             odata.UnitTv
    //             odata.Lgpla */
    //             // that.byId("_IDGenInput2").setValue(odata.Huident);
    //             // that.byId("_IDGenInput3").setValue( odata.Letyp);
    //             // that.byId("_IDGenInputLength").setValue(odata.Length);
    //             // that.byId("_IDGenInputWidth").setValue(odata.Width);
    //             // that.byId("_IDGenInputHeight").setValue(odata.Height);
    //             // that.byId("_IDGenInputTareWeight").setValue(odata.TWeight);
    //             // that.byId("_IDGenInputNetWeight").setValue(odata.NWeight);
    //             // that.byId("_IDGenInputGrossWeight").setValue(odata.GWeight);
    //             // that.byId("_IDGenInputweightsMesurement").setValue(odata.UnitGw);
    //             // that.byId("_IDGenInputMesurement").setValue(odata.UnitLwh);
    //             // that.byId("_IDGenInputMesurement").setValue(odata.GVolume);
    //             // that.getView().byId("icon1").setVisible(false);
    //             // that.getView().byId("icon2").setVisible(true);
    //             // that.getView().byId("_IDGenButton1111").setVisible(true);
    //         }, error: function (oError) {
    //             sap.m.MessageBox.error("Error");
    
    //         }
    //     })
    
    
    // },

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

      onEnterNewHUNUmberPress: function(){
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


    });
  }
);
