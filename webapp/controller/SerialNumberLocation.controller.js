sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageToast"
    ],
    function(BaseController,MessageToast) {
      "use strict";
  
      return BaseController.extend("com.app.rfapp.controller.SerialNumberLocation", {
        onInit: function() {
        },
       

         onSNLfirxtBackBtnPress:function(){
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("Supervisor");
        },
        onSNLproductLiveChange:function(){
            // if(this.getView().byId("idSNLproductInput").getValue()=="800020"){
                this.getView().byId("idSNLFirstSC").setVisible(false);
                this.getView().byId("idSNLsecondSC").setVisible(true);
                var oProduct=this.getView().byId("idSNLproductInput").getValue();
                this.getView().byId("idSNLProInput").setValue(oProduct);
                this.getView().byId("idSNLProInput").setEditable(false);
                this.getView().byId("idSNLSecondBackBtn").setVisible(true);
                this.getView().byId("idSNLfirstBackBtn").setVisible(false);

            // }
        },
        onSNLSecondBackBtnPress:function(){
            this.getView().byId("idSNLFirstSC").setVisible(true);
            this.getView().byId("idSNLsecondSC").setVisible(false);
            this.getView().byId("idSNLSecondBackBtn").setVisible(false);
            this.getView().byId("idSNLfirstBackBtn").setVisible(true);
        },
        onSNLsnoLiveChange:function(){
            // if(this.getView().byId("idSNLsnoInput").getValue()=="12345"){
                this.getView().byId("idSNLthirdSC").setVisible(true);
                this.getView().byId("idSNLsecondSC").setVisible(false);
                var osno=this.getView().byId("idSNLsnoInput").getValue();
                this.getView().byId("idSNLsnoInput1").setValue(osno);
                var oProduct=this.getView().byId("idSNLproductInput").getValue();
                this.getView().byId("idSNLProInput1").setValue(oProduct);
                this.getView().byId("idSNLProInput1").setEditable(false);
                this.getView().byId("idSNLsnoInput1").setEditable(false);
                this.getView().byId("idSNLSecondBackBtn").setVisible(false);
                this.getView().byId("idSNLthirdBackBtn").setVisible(true);

            // }
        },
        onSNLthirdBackBtnPress:function(){
            this.getView().byId("idSNLSecondBackBtn").setVisible(true);
            this.getView().byId("idSNLthirdBackBtn").setVisible(false);
            this.getView().byId("idSNLthirdSC").setVisible(false);
            this.getView().byId("idSNLsecondSC").setVisible(true);

        },
        onSNLPreDePress:function(){
            this.getView().byId("idSNLthirdSC").setVisible(false);
            this.getView().byId("idSNLfourthSC").setVisible(true);
            this.getView().byId("idSNLfourthBackBtn").setVisible(true);
            this.getView().byId("idSNLthirdBackBtn").setVisible(false);
        },

        onSNLfourthBackBtnPress:function(){
            this.getView().byId("idSNLthirdSC").setVisible(true);
            this.getView().byId("idSNLfourthSC").setVisible(false);
            this.getView().byId("idSNLfourthBackBtn").setVisible(false);
            this.getView().byId("idSNLthirdBackBtn").setVisible(true);
        },
        onSNLBinDePress:function(){
            this.getView().byId("idSNLthirdSC").setVisible(false);
            this.getView().byId("idSNLFifthSC").setVisible(true);
            this.getView().byId("idSNLfifthBackBtn").setVisible(true);
            this.getView().byId("idSNLthirdBackBtn").setVisible(false);
        },
        onSNLfifthBackBtnPress:function(){
            this.getView().byId("idSNLthirdSC").setVisible(true);
            this.getView().byId("idSNLFifthSC").setVisible(false);
            this.getView().byId("idSNLfifthBackBtn").setVisible(false);
            this.getView().byId("idSNLthirdBackBtn").setVisible(true);
        }
      });
    }
  );
  