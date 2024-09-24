sap.ui.define(
  [
    "sap/ui/core/mvc/Controller"
  ],
  function (Controller) {
    "use strict";

    return Controller.extend("com.app.rfapp.controller.ManuallyRepackingByHUItem", {
      onInit: function () {
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
      },
      onResourceDetailsLoad: async function (oEvent1) {
        const { id } = oEvent1.getParameter("arguments");
        this.ID = id;
      },
      onAfterRendering: function () {
        this.byId("idScrollContainerScreen1").setVisible(false);
      },
      //Back Btn from 1st ScrollContainer Page 1 =>idPage1ScannerFormBox
    //   
    onBackBtnPressScreen1: async function(){
        
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
  onBackBtnPressScreen1: async function(){
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
onNxtBtnPressScreen1: function () {
  this.byId("idScrollContainerScreen1").setVisible(false);
  this.byId("idScrollContainerScreen2").setVisible(true);

},
  onNxtBtnPressScreen2: function () {
    this.byId("idScrollContainerScreen2").setVisible(false);
    this.byId("idScrollContainerScreen3").setVisible(true);

  },
  onNxtBtnPressScreen3: function () {
    this.byId("idScrollContainerScreen3").setVisible(false);
    this.byId("idScrollContainerScreen4").setVisible(true);

  },
  onNxtBtnPressScreen4: function () {
    this.byId("idScrollContainerScreen4").setVisible(false);
    this.byId("idScrollContainerScreen5").setVisible(true);

  },
  
  onNxtBtnPressScreen5: function () {
    this.byId("idScrollContainerScreen5").setVisible(false);
    this.byId("idScrollContainerScreen6").setVisible(true);

  },
  onNxtBtnPressScreen6: function () {
    this.byId("idScrollContainerScreen6").setVisible(false);
    this.byId("idScrollContainerScreen7").setVisible(true);

  },
  onNxtBtnPressScreen7: function () {
    this.byId("idScrollContainerScreen7").setVisible(false);
    this.byId("idScrollContainerScreen8").setVisible(true);

  },
  onNxtBtnPressScreen8: function () {
    this.byId("idScrollContainerScreen8").setVisible(false);
    this.byId("idScrollContainerScreen9").setVisible(true);

  },
  onNxtBtnPressScreen9: function () {
    this.byId("idScrollContainerScreen9").setVisible(false);
    this.byId("idScrollContainerScreen10").setVisible(true);

  },
 
  onBackBtnPressScreen2 : function () {
    this.byId("idScrollContainerScreen1").setVisible(true);
    this.byId("idScrollContainerScreen2").setVisible(false);

  },
  onBackBtnPressScreen3 : function () {
    this.byId("idScrollContainerScreen2").setVisible(true);
    this.byId("idScrollContainerScreen3").setVisible(false);

  },
  onBackBtnPressScreen4 : function () {
    this.byId("idScrollContainerScreen3").setVisible(true);
    this.byId("idScrollContainerScreen4").setVisible(false);

  },
  onBackBtnPressScreen5 : function () {
    this.byId("idScrollContainerScreen4").setVisible(true);
    this.byId("idScrollContainerScreen5").setVisible(false);

  },
  onBackBtnPressScreen6 : function () {
    this.byId("idScrollContainerScreen5").setVisible(true);
    this.byId("idScrollContainerScreen6").setVisible(false);

  },
  onBackBtnPressScreen7 : function () {
    this.byId("idScrollContainerScreen6").setVisible(true);
    this.byId("idScrollContainerScreen7").setVisible(false);

  },
  onBackBtnPressScreen8 : function () {
    this.byId("idScrollContainerScreen7").setVisible(true);
    this.byId("idScrollContainerScreen8").setVisible(false);

  },
  onBackBtnPressScreen9 : function () {
    this.byId("idScrollContainerScreen8").setVisible(true);
    this.byId("idScrollContainerScreen9").setVisible(false);

  },
  onBackBtnPressScreen10 : function () {
    this.byId("idScrollContainerScreen9").setVisible(true);
    this.byId("idScrollContainerScreen10").setVisible(false);

  },

  


    });
  }
);

