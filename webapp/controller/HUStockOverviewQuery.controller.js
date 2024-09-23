sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/UIComponent"
    ],
    function(BaseController,UIComponent) {
      "use strict";
 
      return BaseController.extend("com.app.rfapp.controller.HUStockOverviewQuery", {
        onInit: function() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
            
        },
        onResourceDetailsLoad: async function (oEvent1) {
            const { id } = oEvent1.getParameter("arguments");
                this.ID = id;
        },
        onHUStockOverviewQueryfirstBackBtnPress:async function(){
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
        onHUInputChange:function(){
            this.getView().byId("idScforFirstHUStockOverviewQuery").setVisible(false);
            this.getView().byId("idHUStockOverviewQueryfirstbackbtn").setVisible(false);
            this.getView().byId("idScforSecondHUStockOverviewQuery").setVisible(true);
            this.getView().byId("idHUStockOverviewQuerySecondbackbtn").setVisible(true);
        },
        onHUStockOverviewQuerySecondBackBtnPress:function(){
            this.getView().byId("idScforFirstHUStockOverviewQuery").setVisible(true);
            this.getView().byId("idHUStockOverviewQueryfirstbackbtn").setVisible(true);
            this.getView().byId("idScforSecondHUStockOverviewQuery").setVisible(false);
            this.getView().byId("idHUStockOverviewQuerySecondbackbtn").setVisible(false);
        },
        onPressHUQueryList:function(){
            this.getView().byId("idScforSecondHUStockOverviewQuery").setVisible(false);
            this.getView().byId("idHUStockOverviewQuerySecondbackbtn").setVisible(false);
            this.getView().byId("idHUStockOverviewQueryThirdbackbtn").setVisible(true);
            this.getView().byId("idScforThirdHUStockOverviewQuery").setVisible(true);
        },
        onHUStockOverviewQueryThirdBackBtnPress:function(){
            this.getView().byId("idScforSecondHUStockOverviewQuery").setVisible(true);
            this.getView().byId("idHUStockOverviewQuerySecondbackbtn").setVisible(true);
            this.getView().byId("idHUStockOverviewQueryThirdbackbtn").setVisible(false);
            this.getView().byId("idScforThirdHUStockOverviewQuery").setVisible(false);
        },
        onPressHUINformationPress:function(){
            this.getView().byId("idHUStockOverviewQueryFourthbackbtn").setVisible(true);
            this.getView().byId("idScforFourthHUStockOverviewQuery").setVisible(true);
            this.getView().byId("idHUStockOverviewQueryThirdbackbtn").setVisible(false);
            this.getView().byId("idScforThirdHUStockOverviewQuery").setVisible(false);
        },
        onHUStockOverviewQueryFourthBackBtnPress:function(){
            this.getView().byId("idHUStockOverviewQueryFourthbackbtn").setVisible(false);
            this.getView().byId("idScforFourthHUStockOverviewQuery").setVisible(false);
            this.getView().byId("idHUStockOverviewQueryThirdbackbtn").setVisible(true);
            this.getView().byId("idScforThirdHUStockOverviewQuery").setVisible(true);
            
        },
        onPressHUQuerystockprodinfoPress:function(){
            this.getView().byId("idHUStockOverviewQueryFifthbackbtn").setVisible(true);
            this.getView().byId("idScforFifthHUStockOverviewQuery").setVisible(true);
            this.getView().byId("idHUStockOverviewQueryThirdbackbtn").setVisible(false);
            this.getView().byId("idScforThirdHUStockOverviewQuery").setVisible(false);
        },
        onHUStockOverviewQueryFifthBackBtnPress:function(){
            this.getView().byId("idHUStockOverviewQueryFifthbackbtn").setVisible(false);
            this.getView().byId("idScforFifthHUStockOverviewQuery").setVisible(false);
            this.getView().byId("idHUStockOverviewQueryThirdbackbtn").setVisible(true);
            this.getView().byId("idScforThirdHUStockOverviewQuery").setVisible(true);   
        }
      });
    }
  );
 
 