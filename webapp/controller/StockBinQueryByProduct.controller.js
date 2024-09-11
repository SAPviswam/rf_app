sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageToast"
    ],
    function(BaseController,MessageToast) {
      "use strict";
  
      return BaseController.extend("com.app.rfapp.controller.StockBinQueryByProduct", {
        onInit: function() {
        },
        onSBQPfirstBackBtnPress:function(){
          var oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("Supervisor");
        },

        onSBQProductLiveChange:function(){
            if(this.getView().byId("idSBQProductInput").getValue()=="800020"){
            this.getView().byId("idSBQPFirstSC").setVisible(false);
            this.getView().byId("idSBQPsecondSC").setVisible(true);
            this.getView().byId("idSBQPfirstbackbtn").setVisible(false);
            this.getView().byId("idSBQPSecondbackbtn").setVisible(true);
            var oProduct=this.getView().byId("idSBQProductInput").getValue();
            this.getView().byId("idSBQProductInput2").setValue(oProduct);
            this.getView().byId("idSBQProductInput2").setEditable(false);
            }
            else{
              MessageToast.show("please enter valid product")
            }
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
  