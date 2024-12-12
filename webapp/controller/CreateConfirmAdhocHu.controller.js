sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageToast",
        "sap/ui/core/UIComponent",
        "sap/ui/Device"
    ],
    function(BaseController,MessageToast,UIComponent,Device) {
      "use strict";
  
      return BaseController.extend("com.app.rfapp.controller.CreateConfirmAdhocHu", {
        onInit: function() {
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
          if(Device.system.phone){
            this.getView().byId("idTitle_CCAHU").addStyleClass("titleMobile");
          }
        },
        onResourceDetailsLoad: async function (oEvent1) {
          const { id } = oEvent1.getParameter("arguments");
              this.ID = id;
      },

        onLiveChange:function(){
        //   if(this.getView().byId("idHuInput_CCAHU").getValue()=="800020"){
           this.getView().byId("idFirstSc_CCAHU").setVisible(false)
           this.getView().byId("idsecondSc_CCAHU").setVisible(true)
           var ohu=this.getView().byId("idHuInput_CCAHU").getValue();
           this.getView().byId("idSecSCHuInput_CCAHU").setValue(ohu)
           this.getView().byId("idSecSCHuInput_CCAHU").setEditable(false);
        
           
        //   }
        //   else{
        //       MessageToast.show("please enter valid HU Number")
        //   }
      },
      onHuDetailsPress_CCAHU:function(){
        this.getView().byId("idthirdSc_CCAHU").setVisible(true);
        this.getView().byId("idsecondSc_CCAHU").setVisible(false);

      },
      onSecondBackBtnPress_CCAHU:function(){
          this.getView().byId("idFirstSc_CCAHU").setVisible(true);
          this.getView().byId("idsecondSc_CCAHU").setVisible(false);
          
      },
      onThirdBackBtnPress_CCAHU:function(){
          this.getView().byId("idsecondSc_CCAHU").setVisible(true);
         
          this.getView().byId("idFirstSc_CCAHU").setVisible(false);
          
          
      },
      onFirstBackBtnPress_CCAHU:async function(){
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
      
      });
    }
  );
  