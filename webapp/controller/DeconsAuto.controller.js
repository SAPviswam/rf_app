sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("com.app.rfapp.controller.DeconsAuto", {
        onInit: function() {
          const oRouter = this.getOwnerComponent().getRouter();

          oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
  
        },
        onResourceDetailsLoad: async function (oEvent1) {
  
          const { id } = oEvent1.getParameter("arguments");
  
          this.ID = id;
  
        },
      });
    }
  );
  