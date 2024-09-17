sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageToast",
        "sap/ui/core/UIComponent"
    ],
    function(BaseController,MessageToast,UIComponent) {
      "use strict";
  
      return BaseController.extend("com.app.rfapp.controller.CreateConfirmAdhocHu", {
        onInit: function() {
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
        },
        onResourceDetailsLoad: async function (oEvent1) {
          const { id } = oEvent1.getParameter("arguments");
              this.ID = id;
      },

        onLiveChange:function(){
        //   if(this.getView().byId("idHuInput").getValue()=="800020"){
           this.getView().byId("idInitialHuPage").setVisible(false)
           this.getView().byId("idsecondHuPage").setVisible(true)
           var ohu=this.getView().byId("idHuInput").getValue();
           this.getView().byId("idHuInput1").setValue(ohu)
           this.getView().byId("idHuInput1").setEditable(false);
           this.getView().byId("idfirstbackbtn").setVisible(true);
           this.getView().byId("idSecondbackbtn").setVisible(false);
           this.getView().byId("idInitialAdhocbackbtn").setVisible(false);
           
        //   }
        //   else{
        //       MessageToast.show("please enter valid HU Number")
        //   }
      },
      onSrcLiveChange:function(){
        //   if(this.getView().byId("idsrcBinInput").getValue()=="12345"){
              this.getView().byId("idthirdHuPage").setVisible(true);
              this.getView().byId("idsecondHuPage").setVisible(false);
              var ohu=this.getView().byId("idHuInput").getValue();
              this.getView().byId("idHuInput2").setValue(ohu)
              this.getView().byId("idHuInput2").setEditable(false);
              var oSrcBin=this.getView().byId("idsrcBinInput").getValue();
              this.getView().byId("idSrcBinInput2").setValue(oSrcBin)
              this.getView().byId("idSrcBinInput2").setEditable(false);
              this.getView().byId("idSecondbackbtn").setVisible(true);
              this.getView().byId("idfirstbackbtn").setVisible(false)
              this.getView().byId("idInitialAdhocbackbtn").setVisible(false)
        //   }
        //   else{
        //       MessageToast.show("please enter valid Source Bin number")
        //   }
      },
      onfirstBackBtnPress:function(){
          this.getView().byId("idInitialHuPage").setVisible(true);
          this.getView().byId("idsecondHuPage").setVisible(false);
          this.getView().byId("idfirstbackbtn").setVisible(false);
          this.getView().byId("idInitialAdhocbackbtn").setVisible(true);
      },
      onSecondBackBtnPress:function(){
          this.getView().byId("idsecondHuPage").setVisible(true);
          this.getView().byId("idthirdHuPage").setVisible(false); 
          this.getView().byId("idInitialHuPage").setVisible(false);
          this.getView().byId("idfirstbackbtn").setVisible(true);
          this.getView().byId("idSecondbackbtn").setVisible(false)
          
      },
      onInitialAdhocBackBtnPress:async function(){
        var oRouter = UIComponent.getRouterFor(this);
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
      
      });
    }
  );
  