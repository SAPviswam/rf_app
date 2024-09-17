sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageToast",
         "sap/ui/core/UIComponent"
    ],
    function(BaseController,MessageToast,UIComponent) {
      "use strict";
  
      return BaseController.extend("com.app.rfapp.controller.StockBinQueryByProduct", {
        onInit: function() {
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
        },
        onResourceDetailsLoad:function(oEvent1){
          var that = this;
          const { id } = oEvent1.getParameter("arguments");
          this.ID = id;
          console.log(this.ID);
      },
        onSBQPfirstBackBtnPress:async function(){
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

        onSBQProductLiveChange:function(){
            // if(this.getView().byId("idSBQProductInput").getValue()=="800020"){
            this.getView().byId("idSBQPFirstSC").setVisible(false);
            this.getView().byId("idSBQPsecondSC").setVisible(true);
            this.getView().byId("idSBQPfirstbackbtn").setVisible(false);
            this.getView().byId("idSBQPSecondbackbtn").setVisible(true);
            var oProduct=this.getView().byId("idSBQProductInput").getValue();
            this.getView().byId("idSBQProductInput2").setValue(oProduct);
            this.getView().byId("idSBQProductInput2").setEditable(false);
            // }
            // else{
            //   MessageToast.show("please enter valid product")
            // }
        },
        onSBQPSecondBackBtnPress:function(){
              this.getView().byId("idSBQPFirstSC").setVisible(true)
              this.getView().byId("idSBQPsecondSC").setVisible(false)
              this.getView().byId("idSBQPfirstbackbtn").setVisible(true)
              this.getView().byId("idSBQPSecondbackbtn").setVisible(false)
              
        },
        onSBQPPreDePress:function(){
          this.getView().byId("idSBQPsecondSC").setVisible(false);
          this.getView().byId("idSBQPThirdSC").setVisible(true);
          this.getView().byId("idSBQPSecondbackbtn").setVisible(false);
          this.getView().byId("idSBQPThirdbackbtn").setVisible(true);
        },
        onSBQPThirdBackBtnPress:function(){
          this.getView().byId("idSBQPsecondSC").setVisible(true);
          this.getView().byId("idSBQPThirdSC").setVisible(false);
          this.getView().byId("idSBQPSecondbackbtn").setVisible(true);
          this.getView().byId("idSBQPThirdbackbtn").setVisible(false);
        },
        onSBQPBinDePress:function(){
          this.getView().byId("idSBQPsecondSC").setVisible(false);
          this.getView().byId("idSBQPFourthSC").setVisible(true);
          this.getView().byId("idSBQPFourthbackbtn").setVisible(true);
          this.getView().byId("idSBQPThirdbackbtn").setVisible(false);
          this.getView().byId("idSBQPSecondbackbtn").setVisible(false);

          
        },
        onSBQPFourthBackBtnPress:function(){
          this.getView().byId("idSBQPFourthbackbtn").setVisible(false);
          this.getView().byId("idSBQPThirdbackbtn").setVisible(true);
          this.getView().byId("idSBQPsecondSC").setVisible(true);
          this.getView().byId("idSBQPFourthSC").setVisible(false);
        }
      });
    }
  );
  