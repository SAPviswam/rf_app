sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        'sap/m/MessageToast'
    ],
    function(Controller,MessageToast) {
      "use strict";
 
      return Controller.extend("com.app.rfapp.controller.ConfigLogin", {
        onInit: function() {
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