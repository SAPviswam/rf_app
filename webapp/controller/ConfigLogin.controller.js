sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    'sap/m/MessageToast',
    "sap/ui/model/odata/v2/ODataModel",
  ],
  function (Controller, MessageToast, ODataModel) {

    "use strict";

    return Controller.extend("com.app.rfapp.controller.ConfigLogin", {
      onInit: function () {
        var oModel = new ODataModel("/sap/opu/odata/sap/ZEWM_RFUI_SRV_01/", {
          headers: {
            "Authorization": "Basic " + btoa("sreedhars:Sreedhar191729"),
            "sap-client": "100"
          }
        });
        this.getView().setModel(oModel);
      },

      onpresslogin: function () {
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("InitialScreen");
      },

      onpressSignup: function () {
        this.getView().byId("idconnecttsosapDetailsForm_CP").setVisible(true)
        this.getView().byId("idPaddingBox_configPage").setVisible(false)

      },
      onSignupPress:function(){
        MessageToast.show("OK")

      },
      onCancleSignup: function () {
        this.getView().byId("idconnecttsosapDetailsForm_CP").setVisible(false)
        this.getView().byId("idPaddingBox_configPage").setVisible(true)
      },
      onValidate: function(){
        this.getView().byId("idOTPHBox").setVisible(false)
      },
      onGetOTPPress: function(){
        this.getView().byId("idOTPHBox").setVisible(true)
        
      }

    });
  }
);
