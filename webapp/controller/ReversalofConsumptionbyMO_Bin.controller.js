sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("com.app.rfapp.controller.ReversalofConsumptionbyMO_Bin", {
        onInit: function() {
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
          // Hide icon1_RCBM and icon2_RCBM
          this.getView().byId("icon1_RCBM").setVisible(false);
          this.getView().byId("icon2_RCBM").setVisible(false);
          this.getView().byId("icon3_RCBM").setVisible(false);
  
          // Show icon3_RCBM
          this.getView().byId("icon4_RCBM").setVisible(true);
        }
      },
      onPressback3:function () {
        this.getView().byId("icon1_RCBM").setVisible(false);
        this.getView().byId("icon2_RCBM").setVisible(false);
        this.getView().byId("icon2_RCBM").setVisible(false);
        this.getView().byId("icon3_RCBM").setVisible(true);
      },
    
      });
    }
  );
  