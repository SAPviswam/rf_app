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
        },
        onpresssignup: async function () {
          try {
              // Load the fragment if it hasn't been loaded yet
              if (!this.oInitialSignup) {
                  this.oInitialSignup = await this.loadFragment({
                      name: "com.app.rfapp.fragments.InitialSignup"
                  });
              }

              // Open the dialog once fragment is loaded
              this.oInitialSignup.open();
          } catch (oError) {
              console.error("Error loading fragment:", oError);
          }
      },
      onpresscancel: function () {
          if (this.oInitialSignup.isOpen()) {
              this.oInitialSignup.close();
          }
      }
      });
    }
  );