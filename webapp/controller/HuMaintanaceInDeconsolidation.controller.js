sap.ui.define(
    [
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
            const { id } = oEvent1.getParameter("arguments");
                this.ID = id;
        },
        onHuMaintanaceInDeconsolidationfirstBackBtnPress:async function(){
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
        onLiveWorkcenterinHuMaintanaceValidation: function () {
            this.getView().byId("idHuMaintanaceInDeconsolidationFirstSC").setVisible(false);
            this.getView().byId("idHuMaintanaceInDeconsolidationSecondSC").setVisible(true);
            this.getView().byId("idHuMaintanaceInDeconsolidationfirstbackbtn").setVisible(false);
            this.getView().byId("idHuMaintanaceInDeconsolidationSecondbackbtn").setVisible(true);
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
        },
        onPressTransportInHuMaintanaceThirdSc:function () {
            this.getView().byId("idHuMaintanaceInDeconsolidationFourthSC").setVisible(true);
            this.getView().byId("idHuMaintanaceInDeconsolidationThirdSC").setVisible(false);
            this.getView().byId("idHuMaintanaceInDeconsolidationThirdbackbtn").setVisible(false);
            this.getView().byId("idHuMaintanaceInDeconsolidationFourthbackbtn").setVisible(true);
        },
        onHuMaintanaceInDeconsolidationFourthBackBtnPress:function () {
            this.getView().byId("idHuMaintanaceInDeconsolidationFourthSC").setVisible(false);
            this.getView().byId("idHuMaintanaceInDeconsolidationThirdSC").setVisible(true);
            this.getView().byId("idHuMaintanaceInDeconsolidationThirdbackbtn").setVisible(true);
            this.getView().byId("idHuMaintanaceInDeconsolidationFourthbackbtn").setVisible(false);

        },
        onPrintPressInHuMaintanaceInDeconsolidationInThird:function() {
            this.getView().byId("idHuMaintanaceInDeconsolidationThirdSC").setVisible(false);
            this.getView().byId("idHuMaintanaceInDeconsolidationSecondSC").setVisible(true);
            this.getView().byId("idHuMaintanaceInDeconsolidationThirdbackbtn").setVisible(false);
            this.getView().byId("idHuMaintanaceInDeconsolidationSecondbackbtn").setVisible(true); 
        },
        onPressTransportBtnInHuMaintananceSecond:function () {
            this.getView().byId("idHuMaintanaceInDeconsolidationSecondSC").setVisible(false);
            this.getView().byId("idHuMaintanaceInDeconsolidationSecondbackbtn").setVisible(false);
            this.getView().byId("idHuMaintanaceInDeconsolidationFourthbackbtn").setVisible(true);
            this.getView().byId("idHuMaintanaceInDeconsolidationFourthSC").setVisible(true);
        },
      });
    }
  );
 
 