sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/Device"

    ],
    function(BaseController,Device) {
      "use strict";
  
      return BaseController.extend("com.app.rfapp.controller.HelpTourOnEditConfigSAPSystem", {
        onInit: function() {
          if (Device.system.phone) {
     
            this.getView().byId("idPageTitle_HelpTourOnEditConfigSAPSystem").addStyleClass("MainHeadingInPhone_HelpTourOnEditConfigSAPSystem");
          }
          else if (Device.system.tablet) {
            this.getView().byId("idPageTitle_HelpTourOnEditConfigSAPSystem").addStyleClass("MainHeadingInTab_HelpTourOnEditConfigSAPSystem");
        }
        },
        onPressBackBtnIn_HelpTourOnEditConfigSAPSystem: function () {
          var oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("InitialScreen");
        },
 
      });
    }
  );
  