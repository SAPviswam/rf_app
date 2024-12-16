sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent"
],
    function (Controller, MessageToast, UIComponent) {
        "use strict";

        return Controller.extend("com.app.rfapp.controller.AdhocProductWt", {
            onInit: function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
            },
            onResourceDetailsLoad: function (oEvent1) {
                var that = this;
                const { id,idI} = oEvent1.getParameter("arguments");
                this.ID = id;
                this.IDI = idI;
                console.log(this.ID);
            },
            onAdhocProductWtBackBtn1Press: async function () {
                var oRouter = UIComponent.getRouterFor(this);
                var oModel1 = this.getOwnerComponent().getModel();
                var that=this;
                await oModel1.read("/RESOURCESSet('" + this.ID + "')", {
                    success: function (oData) {
                        let oUser=oData.Users.toLowerCase()
                        if(oUser ===  "resource"){
                            oRouter.navTo("RouteResourcePage",{id:this.ID,idI: that.IDI});
                        }
                        else{
                        oRouter.navTo("Supervisor",{id:this.ID,idI: that.IDI});
                    }

                    }.bind(this),
                    error: function () {
                        MessageToast.show("User does not exist");
                    }
                });
            },
            //Avatar Press function with Helper function...
onAvatarPressedIn_APWT: function (oEvent) {
this.onPressAvatarEveryTileHelperFunction(oEvent);
      },
onSignoutPressed:function(){
        var oRouter = this.getOwnerComponent().getRouter(this);
        oRouter.navTo("InitialScreen",{Userid:this.IDI});
      },
            onPressSubmitInAdhocHuWt:function(){
                this.getView().byId("Id_Scrollcontainer_Screen2").setVisible(true)
                this.getView().byId("Id_ScrollContainer_AdhocProductWt").setVisible(false)
            },
            onHuDetailsPress_AdhocProductWt:function(){
                this.getView().byId("Id_Scrollcontainer_ProductDet_AdhocProductWt").setVisible(true)
                this.getView().byId("Id_Scrollcontainer_Screen2").setVisible(false) 
            },
            onAdhocProductWtBackBtnPress:function(){
                this.getView().byId("Id_Scrollcontainer_ProductDet_AdhocProductWt").setVisible(false)
                this.getView().byId("Id_Scrollcontainer_Screen2").setVisible(true) 
            },
            onSecondBackBtnPress_AdhocProductWt:function(){
                this.getView().byId("Id_Scrollcontainer_Screen2").setVisible(false)
                this.getView().byId("Id_ScrollContainer_AdhocProductWt").setVisible(true)  
            }
        });
    });