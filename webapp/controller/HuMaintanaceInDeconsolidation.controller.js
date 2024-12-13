sap.ui.define(
    [
        "./BaseController",
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/UIComponent"
    ],
    function(BaseController,UIComponent) {
      "use strict";
 
      return BaseController.extend("com.app.rfapp.controller.HuMaintanaceInDeconsolidation", {
        onInit: function() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
        },
        onResourceDetailsLoad: async function (oEvent1) {
            const { id,idI } = oEvent1.getParameter("arguments");
                this.ID = id;
                this.IDI = idI;
        },
        onHuMaintanaceInDeconsolidationfirstBackBtnPress:async function(){
            var oRouter = UIComponent.getRouterFor(this);
            var oModel1 = this.getOwnerComponent().getModel();
            var that=this;
            await oModel1.read("/RESOURCESSet('" + this.ID + "')", {
                success: function (oData) {
                    let oUser=oData.Users.toLowerCase()
                    if(oUser ===  "resource"){
                        oRouter.navTo("RouteResourcePage",{id:this.ID,idI:that.IDI});
                    }
                    else{
                    oRouter.navTo("Supervisor",{id:this.ID,idI:that.IDI});
                }
                }.bind(this),
                error: function () {
                    MessageToast.show("User does not exist");
                }
             
            });
           
        },
        //Avatar Press function with Helper function...
        onAvatarPressedIn_HUMINDECON: function (oEvent) {
        this.onPressAvatarEveryTileHelperFunction(oEvent);
      },
   
      onSignoutPressed:function(){
        var oRouter = this.getOwnerComponent().getRouter(this);
        oRouter.navTo("InitialScreen",{Userid:this.IDI});
      },
        onLiveWorkcenterinHuMaintanaceValidation: function () {
            this.getView().byId("idHuMaintanaceInDeconsolidationFirstSC").setVisible(false);
            this.getView().byId("idHuMaintanaceInDeconsolidationSecondSC").setVisible(true);
            this.getView().byId("idHuMaintanaceInDeconsolidationfirstbackbtn").setVisible(false);
            this.getView().byId("idHuMaintanaceInDeconsolidationSecondbackbtn").setVisible(true);
            this.getView().byId("idHuMaintanaceInDeconsolidationThirdbackbtn").setVisible(false);
        },
        onHuMaintanaceInDeconsolidationSecondBackBtnPress: function () {
            this.getView().byId("idHuMaintanaceInDeconsolidationFirstSC").setVisible(true);
            this.getView().byId("idHuMaintanaceInDeconsolidationSecondSC").setVisible(false);
            this.getView().byId("idHuMaintanaceInDeconsolidationfirstbackbtn").setVisible(true);
            this.getView().byId("idHuMaintanaceInDeconsolidationSecondbackbtn").setVisible(false);
           
        },
        onHUinHuMaintanaceValidationInSecond: function () {
            this.getView().byId("idHuMaintanaceInDeconsolidationThirdSC").setVisible(true);
            this.getView().byId("idHuMaintanaceInDeconsolidationSecondSC").setVisible(false);
            this.getView().byId("idHuMaintanaceInDeconsolidationThirdbackbtn").setVisible(true);
            this.getView().byId("idHuMaintanaceInDeconsolidationSecondbackbtn").setVisible(false);
        },
        onHuMaintanaceInDeconsolidationThirdBackBtnPress:function () {
            this.getView().byId("idHuMaintanaceInDeconsolidationThirdSC").setVisible(false);
            this.getView().byId("idHuMaintanaceInDeconsolidationSecondSC").setVisible(true);
            this.getView().byId("idHuMaintanaceInDeconsolidationThirdbackbtn").setVisible(false);
            this.getView().byId("idHuMaintanaceInDeconsolidationSecondbackbtn").setVisible(true);
            this.getView().byId("idHuMaintanaceInDeconsolidationfirstbackbtn").setVisible(false);
           
        },
        onPressTransportInHuMaintanaceThirdSc:function () {
            this.getView().byId("idHuMaintanaceInDeconsolidationFourthSC").setVisible(true);
            this.getView().byId("idHuMaintanaceInDeconsolidationThirdSC").setVisible(false);
            this.getView().byId("idHuMaintanaceInDeconsolidationThirdbackbtn").setVisible(false);
            this.getView().byId("idHuMaintanaceInDeconsolidationFourthbackbtn").setVisible(true);
        },
      
        onHuMaintanaceInDeconsolidationFourthBackBtnPress:function () {
            this.getView().byId("idHuMaintanaceInDeconsolidationFourthSC").setVisible(false);
            this.getView().byId("idHuMaintanaceInDeconsolidationSecondSC").setVisible(true);
            this.getView().byId("idHuMaintanaceInDeconsolidationSecondbackbtn").setVisible(true);
            this.getView().byId("idHuMaintanaceInDeconsolidationFourthbackbtn").setVisible(false);
 
        },
        onPrintPressInHuMaintanaceInDeconsolidationInThird:function() {
            this.getView().byId("idHuMaintanaceInDeconsolidationThirdSC").setVisible(false);
            this.getView().byId("idHuMaintanaceInDeconsolidationSecondSC").setVisible(true);
            this.getView().byId("idHuMaintanaceInDeconsolidationThirdbackbtn").setVisible(false);
            this.getView().byId("idHuMaintanaceInDeconsolidationSecondbackbtn").setVisible(true);
            this.getView().byId("idHuMaintanaceInDeconsolidationFourthbackbtn").setVisible(false);
            this.getView().byId("idHuMaintanaceInDeconsolidationfirstbackbtn").setVisible(false);
        },
        onPressTransportBtnInHuMaintananceSecond:function () {
            this.getView().byId("idHuMaintanaceInDeconsolidationSecondSC").setVisible(false);
            this.getView().byId("idHuMaintanaceInDeconsolidationSecondbackbtn").setVisible(false);
            this.getView().byId("idHuMaintanaceInDeconsolidationFourthbackbtn").setVisible(true);
            this.getView().byId("idHuMaintanaceInDeconsolidationFourthSC").setVisible(true);
            this.getView().byId("idHuMaintanaceInDeconsolidationfirstbackbtn").setVisible(false);
        },
      });
    }
  );