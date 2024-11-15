sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"

    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("com.app.rfapp.controller.HelpTourOnEditConfigSAPSystem", {
        onInit: function() {
        },
        onPressBackBtnIn_HelpTourOnEditConfigSAPSystem: function () {
          var oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("InitialScreen");
        }

      });
    }
  );
  