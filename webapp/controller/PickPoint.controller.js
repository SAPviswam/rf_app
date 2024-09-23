sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageToast", // Import MessageToast for user feedback
    "sap/ui/core/UIComponent"
    ],
    function(BaseController, MessageToast,UIComponent) {
      "use strict";
  
      return BaseController.extend("com.app.rfapp.controller.PickPoint", {
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
      onFirstPPbackbtnPress:async function(){
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

        onWorkCenterLiveChange:function(){
          this.getView().byId("idFirstPPPage").setVisible(false);
          this.getView().byId("idSecondHUPPPage").setVisible(true);
          this.getView().byId("idPPSecondbackbtn").setVisible(true);
          this.getView().byId("idFirstPPbackbtn").setVisible(false);
        },

        onPPSecondbackbtnPress :function(){
          this.getView().byId("idPPSecondbackbtn").setVisible(false);
          this.getView().byId("idFirstPPbackbtn").setVisible(true);
          this.getView().byId("idFirstPPPage").setVisible(true);
          this.getView().byId("idSecondHUPPPage").setVisible(false);
        },

        onHUPPLiveChange:function(){
          this.getView().byId("idSecondHUPPPage").setVisible(false);
          this.getView().byId("idFirstPPPage").setVisible(false);
          this.getView().byId("idThirdPPPage").setVisible(true);
          this.getView().byId("idPPSecondbackbtn").setVisible(false);
          this.getView().byId("idPPThirdbackbtn").setVisible(true);

        },
        onPPThirdbackbtnPress:function(){
          this.getView().byId("idSecondHUPPPage").setVisible(true);
          // this.getView().byId("idFirstPPPage").setVisible(false);
          this.getView().byId("idThirdPPPage").setVisible(false);
          this.getView().byId("idPPSecondbackbtn").setVisible(true);
          this.getView().byId("idPPThirdbackbtn").setVisible(false);
        },
      });
    }
  );