sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/UIComponent"
    ],
    function(Controller,UIComponent) {
      "use strict";
  
      return Controller.extend("com.app.rfapp.controller.UnloadByDelivery", {
        onInit: function() {
            const oRouter = this.getOwnerComponent().getRouter(); 
            oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this); 
        },
        onResourceDetailsLoad: async function (oEvent1) {
            const { id } = oEvent1.getParameter("arguments");
                this.ID = id;
        },
        Onpresssubmit: function () {

            this.getView().byId("icon1_UNBD").setVisible(false);
            this.getView().byId("icon2_UNBD").setVisible(true);
            // this.getView().byId("_IDGenButton77_UNBD").setVisible(false);
        },
        Onpressback1: function () {
            this.getView().byId("icon1_UNBD").setVisible(true);
            this.getView().byId("icon2_UNBD").setVisible(false);
            // this.getView().byId("_IDGenButton77_UNBD").setVisible(true);

        },
        onHUListPress: function () {
            this.getView().byId("icon1_UNBD").setVisible(false);
            this.getView().byId("icon2_UNBD").setVisible(false);
            this.getView().byId("icon3_UNBD").setVisible(true);
        },
        Onpressback2: function () {
            this.getView().byId("icon1_UNBD").setVisible(false);
            this.getView().byId("icon2_UNBD").setVisible(true);
            this.getView().byId("icon3_UNBD").setVisible(false);
        },
        onNewHUPress: function () {
            this.getView().byId("icon1_UNBD").setVisible(false);
            this.getView().byId("icon2_UNBD").setVisible(false);
            this.getView().byId("icon3_UNBD").setVisible(false);
            this.getView().byId("icon4_UNBD").setVisible(true);
            this.getView().byId("icon5_UNBD").setVisible(false);
        },
        Onpressback3: function () {
            this.getView().byId("icon1_UNBD").setVisible(false);
            this.getView().byId("icon2_UNBD").setVisible(true);
            this.getView().byId("icon4_UNBD").setVisible(false);
        },
        onNextEnterpress: function () {
            this.getView().byId("icon5_UNBD").setVisible(true);
            this.getView().byId("icon4_UNBD").setVisible(false);
            this.getView().byId("icon1_UNBD").setVisible(false);
            this.getView().byId("icon2_UNBD").setVisible(false);
        },
        Onpressback4: function () {
            this.getView().byId("icon1_UNBD").setVisible(false);
            this.getView().byId("icon5_UNBD").setVisible(false);
            this.getView().byId("icon4_UNBD").setVisible(true);
            this.getView().byId("icon3_UNBD").setVisible(false);
            this.getView().byId("icon2_UNBD").setVisible(false);
        },
        onGRPress: function () {
            this.getView().byId("icon6_UNBD").setVisible(true);
            this.getView().byId("icon5_UNBD").setVisible(false);
            this.getView().byId("icon4_UNBD").setVisible(false);
            this.getView().byId("icon1_UNBD").setVisible(false);
            this.getView().byId("icon2_UNBD").setVisible(false);
        },
        Onpressback5: function () {
            this.getView().byId("icon1_UNBD").setVisible(false);
            this.getView().byId("icon5_UNBD").setVisible(true);
            this.getView().byId("icon6_UNBD").setVisible(false);
            this.getView().byId("icon4_UNBD").setVisible(false);
            this.getView().byId("icon2_UNBD").setVisible(false);
        },
        onUnloadPress: function () {
            this.getView().byId("icon6_UNBD").setVisible(false);
            this.getView().byId("icon5_UNBD").setVisible(false);
            this.getView().byId("icon4_UNBD").setVisible(false);
            this.getView().byId("icon7_UNBD").setVisible(true);
            this.getView().byId("icon1_UNBD").setVisible(false);
            this.getView().byId("icon2_UNBD").setVisible(false);
        },
        Onpressback6: function () {
            this.getView().byId("icon1_UNBD").setVisible(false);
            this.getView().byId("icon5_UNBD").setVisible(true);
            this.getView().byId("icon7_UNBD").setVisible(false);
            this.getView().byId("icon6_UNBD").setVisible(false);
            this.getView().byId("icon3_UNBD").setVisible(false);
            this.getView().byId("icon4_UNBD").setVisible(false);
            this.getView().byId("icon2_UNBD").setVisible(false);
        },
        // onPressBackToHome:function(){
        //     var oRouter = this.getOwnerComponent().getRouter();
        //     oRouter.navTo("Supervisor");

        // },
        onPressBackToHome:async function(){
            debugger
            var oRouter = UIComponent.getRouterFor(this);
            var oModel1 = this.getOwnerComponent().getModel();
            await oModel1.read("/RESOURCESSet('" + this.ID + "')", {
                success: function (oData) {
                    let oUser= oData.Users.toLowerCase()
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
  