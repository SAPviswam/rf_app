sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/UIComponent"
    ],
    function(BaseController,UIComponent) {
      "use strict";
 
      return BaseController.extend("com.app.rfapp.controller.WTQueryByWT", {
        onInit: function() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
        },
        onResourceDetailsLoad: async function (oEvent1) {
            const { id } = oEvent1.getParameter("arguments");
                this.ID = id;
        },
        onWtQBWtfirstBackBtnPress:async function(){
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
        onWtQBWtWhLiveChange:function(){
           
                this.getView().byId("idWtQBWtFirstSC").setVisible(false);
                this.getView().byId("idWtQBWtWhSecondsc").setVisible(true);
                this.getView().byId("idWtQBWtfirstbackbtn").setVisible(false);
                this.getView().byId("idWtQBWtSecondbackbtn").setVisible(true);
            
        },
        onWtQBWtSecondBackBtnPress:function(){
            this.getView().byId("idWtQBWtWhSecondsc").setVisible(false);
            this.getView().byId("idWtQBWtFirstSC").setVisible(true);
            this.getView().byId("idWtQBWtSecondbackbtn").setVisible(false);
            this.getView().byId("idWtQBWtfirstbackbtn").setVisible(true);
           
        },
        onWtQBWtDetailBtnPress:function(){
            this.getView().byId("idWtQBWtWhSecondsc").setVisible(false);
            this.getView().byId("idWtQBWtWhThirdsc").setVisible(true);
            this.getView().byId("idWtQBWtSecondbackbtn").setVisible(false);
            this.getView().byId("idWtQBWtThirdbackbtn").setVisible(true);
           
        },
        onWtQBWtThirdBackBtnPress:function(){
            this.getView().byId("idWtQBWtWhSecondsc").setVisible(true);
            this.getView().byId("idWtQBWtWhThirdsc").setVisible(false);
            this.getView().byId("idWtQBWtSecondbackbtn").setVisible(true);
            this.getView().byId("idWtQBWtThirdbackbtn").setVisible(false);
           
        },
    
 
      });
    }
  );
 
 