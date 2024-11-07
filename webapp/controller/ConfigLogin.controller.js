sap.ui.define(
    [
      "sap/ui/core/mvc/Controller",
       'sap/m/MessageToast',
       "sap/ui/model/odata/v2/ODataModel",
    ],
    function(Controller,MessageToast,ODataModel) {

      "use strict";
 
      return Controller.extend("com.app.rfapp.controller.ConfigLogin", {
        onInit: function() {
          var oModel = new ODataModel("/sap/opu/odata/sap/ZEWM_RFUI_SRV_01/", {
            headers: {
                "Authorization": "Basic " + btoa("psrilekha:Artihcus@123"),
                "sap-client": "100"
            }
        });
        this.getView().setModel(oModel);
        },
        
        onpresslogin:function() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("InitialScreen");
        },

        onpressSignup:function(){
          MessageToast.show("you click on SignUp button");

        }

      });
    }
  );
