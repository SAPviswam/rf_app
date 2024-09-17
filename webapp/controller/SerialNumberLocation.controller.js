sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageToast",
        "sap/ui/core/UIComponent"
    ],
    function(BaseController,MessageToast,UIComponent) {
      "use strict";
  
      return BaseController.extend("com.app.rfapp.controller.SerialNumberLocation", {
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

         onSNLfirxtBackBtnPress:async function(){
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
  