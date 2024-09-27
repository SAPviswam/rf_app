sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/UIComponent",
        "sap/m/MessageToast"
    ],
    function(Controller,UIComponent,MessageToast) {
      "use strict";
  
      return Controller.extend("com.app.rfapp.controller.ReversalofConsumptionbyMO_Bin", {
        onInit: function() {
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
        },
      onResourceDetailsLoad: async function (oEvent1) {
          const { id } = oEvent1.getParameter("arguments");
              this.ID = id;
      },

        onPressBackToHome_RCBM:async function(){
          debugger
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
        onPressManfOrdSubmit: function () {
          this.getView().byId("icon1_RCBM").setVisible(false);
          this.getView().byId("icon2_RCBM").setVisible(true);
          // this.getView().byId("_IDGenButton77_RCBM").setVisible(false);
      },
      onPressback1: function () {
        this.getView().byId("icon1_RCBM").setVisible(true);
        this.getView().byId("icon2_RCBM").setVisible(false);
      },
      onProductInputChange: function(oEvent) {
        // Get the value of the input field
        var sValue = oEvent.getParameter("value");
    
        if (sValue.length >= 1) {
          // Hide icon1_RCBM and icon2_RCBM
          this.getView().byId("icon1_RCBM").setVisible(false);
          this.getView().byId("icon2_RCBM").setVisible(false);
  
          // Show icon3_RCBM
          this.getView().byId("icon3_RCBM").setVisible(true);
        }
      },
      onPressback2:function () {
        this.getView().byId("icon1_RCBM").setVisible(false);
        this.getView().byId("icon3_RCBM").setVisible(false);
        this.getView().byId("icon2_RCBM").setVisible(true);
      },
      onBatchInputChange: function(oEvent) {
        // Get the value of the input field
        var sValue = oEvent.getParameter("value");
    
        if (sValue.length >= 1) {
          this.getView().byId("icon1_RCBM").setVisible(false);
          this.getView().byId("icon2_RCBM").setVisible(false);
          this.getView().byId("icon3_RCBM").setVisible(false);
          this.getView().byId("icon4_RCBM").setVisible(true);
        }
      },
      onPressback3:function () {
        this.getView().byId("icon1_RCBM").setVisible(false);
        this.getView().byId("icon2_RCBM").setVisible(false);
        this.getView().byId("icon2_RCBM").setVisible(false);
        this.getView().byId("icon3_RCBM").setVisible(true);
      },

      onStorBinInputChange:function () {
        this.getView().byId("icon1_RCBM").setVisible(false);
        this.getView().byId("icon2_RCBM").setVisible(false);
        this.getView().byId("icon3_RCBM").setVisible(false);
        this.getView().byId("icon4_RCBM").setVisible(false);
        this.getView().byId("icon5_RCBM").setVisible(true);
 
      },

      onPressback4:function(){
        this.getView().byId("icon4_RCBM").setVisible(true);
        this.getView().byId("icon5_RCBM").setVisible(false);

      },
    
      });
    }
  );
  