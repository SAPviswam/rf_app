sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(Controller) {
      "use strict";
 
      return Controller.extend("com.app.rfapp.controller.ConfigLogin", {
        onInit: function() {
        },
        onpresslogin:function() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("InitialScreen");
        }
      });
    }
  );