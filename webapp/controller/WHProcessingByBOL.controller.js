sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageToast",
         "sap/ui/core/UIComponent"
    ],
    function(Controller,MessageToast,UIComponent) {
      "use strict";
  
      return Controller.extend("com.app.rfapp.controller.WHProcessingByBOL", {
        onInit: function() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
        },
        onResourceDetailsLoad: async function (oEvent1) {
            const { id } = oEvent1.getParameter("arguments");
                this.ID = id;
        },
        onFirstBOLbackbtnPress:async function(){
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
        onBolQueriesPress:function(){
           this.getView().byId("idFirstBOLPage").setVisible(false);
           this.getView().byId("idSecondBOLPage").setVisible(true);
           this.getView().byId("idFirstBOLbackbtn").setVisible(false);
           this.getView().byId("idSecondBOLbackbtn").setVisible(true);
        },
        onSecondBOLbackbtnPress:function(){
            this.getView().byId("idFirstBOLPage").setVisible(true);
           this.getView().byId("idSecondBOLPage").setVisible(false);
           this.getView().byId("idFirstBOLbackbtn").setVisible(true);
           this.getView().byId("idSecondBOLbackbtn").setVisible(false);
        },
        onBOLEnterPress:function(){
            
        }
      });
    }
  );
  