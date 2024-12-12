sap.ui.define(
    [
        "./BaseController",
        "sap/ui/core/UIComponent"
    ],
    function(BaseController,UIComponent) {
      "use strict";
 
      return BaseController.extend("com.app.rfapp.controller.UnloadByHu", {
        onInit: function() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
            
        },
        onResourceDetailsLoad: async function (oEvent1) {
            const { id,idI } = oEvent1.getParameter("arguments");
                this.ID = id;
                this.IDI = idI;
        },

        onAvatarPressed:function (oEvent) {     
            this.onPressAvatarEveryTileHelperFunction(oEvent); 
            },
        onSignoutPressed:function(){
                var oRouter = this.getOwnerComponent().getRouter(this);
                oRouter.navTo("InitialScreen", { Userid:this.IDI }); 
            }, 

        onUnloadByHufirstBackBtnPress:async function(){
            var oRouter = UIComponent.getRouterFor(this);
            var oModel1 = this.getOwnerComponent().getModel();
            var that = this;
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
        onHUInputChange:function(){
            this.getView().byId("idScforFirstUnloadByHu").setVisible(false);
            this.getView().byId("idUnloadByHufirstbackbtn").setVisible(false);
            this.getView().byId("idScforSecondUnloadByHu").setVisible(true);
            this.getView().byId("idUnloadByHuSecondbackbtn").setVisible(true);
        },
        onUnloadByHuSecondBackBtnPress:function(){
            this.getView().byId("idScforFirstUnloadByHu").setVisible(true);
            this.getView().byId("idUnloadByHufirstbackbtn").setVisible(true);
            this.getView().byId("idScforSecondUnloadByHu").setVisible(false);
            this.getView().byId("idUnloadByHuSecondbackbtn").setVisible(false);
        },
        onPressListForHus:function(){
            this.getView().byId("idScforSecondUnloadByHu").setVisible(false);
            this.getView().byId("idUnloadByHuSecondbackbtn").setVisible(false);
            this.getView().byId("idUnloadByHuThirdbackbtn").setVisible(true);
            this.getView().byId("idScforThirdUnloadByHu").setVisible(true);
        },
        onUnloadByHuThirdBackBtnPress:function(){
            this.getView().byId("idScforSecondUnloadByHu").setVisible(true);
            this.getView().byId("idUnloadByHuSecondbackbtn").setVisible(true);
            this.getView().byId("idUnloadByHuThirdbackbtn").setVisible(false);
            this.getView().byId("idScforThirdUnloadByHu").setVisible(false);
        },
        onPressTOL:function(){
            this.getView().byId("idUnloadByHuFourthbackbtn").setVisible(true);
            this.getView().byId("idScforFourthUnloadByHu").setVisible(true);
            this.getView().byId("idScforSecondUnloadByHu").setVisible(false);
            this.getView().byId("idUnloadByHuSecondbackbtn").setVisible(false);
        },
        onUnloadByHuFourthBackBtnPress:function(){
            this.getView().byId("idUnloadByHuFourthbackbtn").setVisible(false);
            this.getView().byId("idScforFourthUnloadByHu").setVisible(false);
            this.getView().byId("idUnloadByHuSecondbackbtn").setVisible(true);
            this.getView().byId("idScforSecondUnloadByHu").setVisible(true);
            
        },
        onPressWODetails:function(){
            this.getView().byId("idUnloadByHuFifthbackbtn").setVisible(true);
            this.getView().byId("idScforFifthUnloadByHu").setVisible(true);
            this.getView().byId("idUnloadByHuSecondbackbtn").setVisible(false);
            this.getView().byId("idScforSecondUnloadByHu").setVisible(false);
        },
        onUnloadByHuFifthBackBtnPress:function(){
            this.getView().byId("idUnloadByHuFifthbackbtn").setVisible(false);
            this.getView().byId("idScforFifthUnloadByHu").setVisible(false);
            this.getView().byId("idUnloadByHuSecondbackbtn").setVisible(true);
            this.getView().byId("idScforSecondUnloadByHu").setVisible(true);   
        },
        onPressDETV:function(){
            this.getView().byId("idUnloadByHuSixthbackbtn").setVisible(true);
            this.getView().byId("idScforSixthUnloadByHu").setVisible(true);
            this.getView().byId("idUnloadByHuSecondbackbtn").setVisible(false);
            this.getView().byId("idScforSecondUnloadByHu").setVisible(false);
        },
        onUnloadByHuSIxthBackBtnPress:function(){
            this.getView().byId("idUnloadByHuSixthbackbtn").setVisible(false);
            this.getView().byId("idScforSixthUnloadByHu").setVisible(false);
            this.getView().byId("idUnloadByHuSecondbackbtn").setVisible(true);
            this.getView().byId("idScforSecondUnloadByHu").setVisible(true);
        },
      });
    }
  );
 
 