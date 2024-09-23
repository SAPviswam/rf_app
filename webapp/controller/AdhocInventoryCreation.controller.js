sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel",
    "sap/m/Popover",
    "sap/m/Button",
    "sap/m/library"
],
    function (Controller, Device, JSONModel, Popover, Button, library) {
        "use strict";

        return Controller.extend("com.app.rfapp.controller.AdhocInventoryCreation", {
            onInit: function () {
                const oRouter = this.getOwnerComponent().getRouter();

                oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);

            },
            onResourceDetailsLoad: async function (oEvent1) {

                const { id } = oEvent1.getParameter("arguments");

                this.ID = id;

            },
            Onpressback0: async function () {
                const oRouter = this.getOwnerComponent().getRouter();
         
                var oModel1 = this.getOwnerComponent().getModel();
         
                await oModel1.read("/RESOURCESSet('" + this.ID + "')", {
         
                  success: function (oData) {
                    let oUser=oData.Users.toLowerCase()
                    if (oUser === "resource") {
         
                      oRouter.navTo("RouteResourcePage", { id: this.ID });
         
                    }
         
                    else {
         
                      oRouter.navTo("Supervisor", { id: this.ID });
                    }
         
                  }.bind(this),
         
                  error: function () {
         
                    sap.m.MessageToast.show("User does not exist");
         
                  }
                });
            },
            

              onF3press: function () {
                // Get references to the input fields
                var oBinInput = this.getView().byId("idProductInput_AIC"); // Bin field
                var oProductInput = this.getView().byId("idPackagingMaterialInput_AIC"); // Product field
                var oReasonInput = this.getView().byId("idHubyASNqtyInput_AIC"); // Reason field
            
                // Get the values entered by the user
                var sBin = oBinInput.getValue();
                var sProduct = oProductInput.getValue();
                var sReason = oReasonInput.getValue();
            
                // Check if all required fields have values
                if (sBin && sProduct && sReason) {
                    // If all fields are filled, navigate to screen 2
                    this.getView().byId("page1_AIC").setVisible(false);
                    this.getView().byId("page2_AIC").setVisible(true);
                } else {
                    // Show an error message if any of the fields are empty
                    sap.m.MessageToast.show("Please fill in all required fields: Bin, Product, and Reason.");
                }
            
          },
          Onpressback1: function () {

            this.getView().byId("page1_AIC").setVisible(true);
            this.getView().byId("page2_AIC").setVisible(false);

        },
        onF4press: function () {
          // Get references to the input fields
          var oBinInput = this.getView().byId("idProductInput_AIC"); // Bin field
          var oProductInput = this.getView().byId("idPackagingMaterialInput_AIC"); // Product field
          var oReasonInput = this.getView().byId("idHubyASNqtyInput_AIC"); // Reason field
      
          // Get the values entered by the user
          var sBin = oBinInput.getValue();
          var sProduct = oProductInput.getValue();
          var sReason = oReasonInput.getValue();
      
          // Check if all required fields have values
          if (sBin && sProduct && sReason) {
              // If all fields are filled, navigate to screen 2
              this.getView().byId("page1_AIC").setVisible(false);
              this.getView().byId("page2_AIC").setVisible(false);
              this.getView().byId("page3_AIC").setVisible(true);
          } else {
              // Show an error message if any of the fields are empty
              sap.m.MessageToast.show("Please fill in all required fields: Bin, Product, and Reason.");
          }
      
    },
    Onpressback2: function () {

      this.getView().byId("page1_AIC").setVisible(true);
      this.getView().byId("page2_AIC").setVisible(false);
      this.getView().byId("page3_AIC").setVisible(false);

  },
        });
    });