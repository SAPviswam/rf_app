sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("com.app.rfapp.controller.UnloadingASNDetails", {
        onInit: function() {
        },
        Onpresssubmit: function () {
          this.getView().byId("icon1_UBYASN").setVisible(false);
          this.getView().byId("icon2_UBYASN").setVisible(true);
      },
      Onpressback1: function () {
          this.getView().byId("icon1_UBYASN").setVisible(true);
          this.getView().byId("icon2_UBYASN").setVisible(false);
      },
      onHUListPress: function () {
          this.getView().byId("icon1_UBYASN").setVisible(false);
          this.getView().byId("icon2_UBYASN").setVisible(false);
          this.getView().byId("icon3_UBYASN").setVisible(true);
      },
      Onpressback2: function () {
          this.getView().byId("icon1_UBYASN").setVisible(false);
          this.getView().byId("icon2_UBYASN").setVisible(true);
          this.getView().byId("icon3_UBYASN").setVisible(false);
      },
      onNewHUPress: function () {
          this.getView().byId("icon1_UBYASN").setVisible(false);
          this.getView().byId("icon2_UBYASN").setVisible(false);
          this.getView().byId("icon3_UBYASN").setVisible(false);
          this.getView().byId("icon4_UBYASN").setVisible(true);
          this.getView().byId("icon5_UBYASN").setVisible(false);
      },
      Onpressback3: function () {
          this.getView().byId("icon1_UBYASN").setVisible(false);
          this.getView().byId("icon2_UBYASN").setVisible(true);
          this.getView().byId("icon4_UBYASN").setVisible(false);
      },
      onNextEnterpress: function () {
          this.getView().byId("icon5_UBYASN").setVisible(true);
          this.getView().byId("icon4_UBYASN").setVisible(false);
          this.getView().byId("icon1_UBYASN").setVisible(false);
          this.getView().byId("icon2_UBYASN").setVisible(false);
      },
      Onpressback4: function () {
          this.getView().byId("icon1_UBYASN").setVisible(false);
          this.getView().byId("icon5_UBYASN").setVisible(false);
          this.getView().byId("icon4_UBYASN").setVisible(true);
          this.getView().byId("icon3_UBYASN").setVisible(false);
          this.getView().byId("icon2_UBYASN").setVisible(false);
      },
      onGRPress: function () {
          this.getView().byId("icon6_UBYASN").setVisible(true);
          this.getView().byId("icon5_UBYASN").setVisible(false);
          this.getView().byId("icon4_UBYASN").setVisible(false);
          this.getView().byId("icon1_UBYASN").setVisible(false);
          this.getView().byId("icon2_UBYASN").setVisible(false);
      },
      Onpressback5: function () {
          this.getView().byId("icon1_UBYASN").setVisible(false);
          this.getView().byId("icon5_UBYASN").setVisible(true);
          this.getView().byId("icon6_UBYASN").setVisible(false);
          this.getView().byId("icon4_UBYASN").setVisible(false);
          this.getView().byId("icon2_UBYASN").setVisible(false);
      },
      onUnloadPress: function () {
          this.getView().byId("icon6_UBYASN").setVisible(false);
          this.getView().byId("icon5_UBYASN").setVisible(false);
          this.getView().byId("icon4_UBYASN").setVisible(false);
          this.getView().byId("icon7_UBYASN").setVisible(true);
          this.getView().byId("icon1_UBYASN").setVisible(false);
          this.getView().byId("icon2_UBYASN").setVisible(false);
      },
      Onpressback6: function () {
          this.getView().byId("icon1_UBYASN").setVisible(false);
          this.getView().byId("icon5_UBYASN").setVisible(true);
          this.getView().byId("icon7_UBYASN").setVisible(false);
          this.getView().byId("icon6_UBYASN").setVisible(false);
          this.getView().byId("icon3_UBYASN").setVisible(false);
          this.getView().byId("icon4_UBYASN").setVisible(false);
          this.getView().byId("icon2_UBYASN").setVisible(false);
      },
      /** Initial page To Home ->Back Navigation */
      Onpressback7:function(){
        this.getOwnerComponent().getRouter().navTo("Supervisor");
      }
  });
});