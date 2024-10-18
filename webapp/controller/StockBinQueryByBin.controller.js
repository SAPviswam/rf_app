sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/Device",
  "sap/m/MessageToast", // Import MessageToast for user feedback
  "sap/ui/core/UIComponent"
], function (Controller, Device, MessageToast, UIComponent) {
  "use strict";
  return Controller.extend("com.app.rfapp.controller.StockBinQueryByBin", {
    onInit: function () {
      const oRouter = this.getOwnerComponent().getRouter();
      oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
    },
    onResourceDetailsLoad: function (oEvent1) {
      var that = this;
      const { id } = oEvent1.getParameter("arguments");
      this.ID = id;
      console.log(this.ID);
    },
    onPressBinBackToHome: async function () {
      var oRouter = UIComponent.getRouterFor(this);
      var oModel1 = this.getOwnerComponent().getModel();
      await oModel1.read("/RESOURCESSet('" + this.ID + "')", {
        success: function (oData) {
          let oUser = oData.Users.toLowerCase()
          if (oUser === "resource") {
            oRouter.navTo("RouteResourcePage", { id: this.ID });
          }
          else {
            oRouter.navTo("Supervisor", { id: this.ID });
          }
        }.bind(this),
        error: function () {
          MessageToast.show("User does not exist");
        }
      });
    },
    onPressBinBackToBin: function () {
      this.getView().byId("page1_SBQB").setVisible(true);
      this.getView().byId("page2_SBQB").setVisible(false);
    },
    onPressBinBacktoProductDetaails: function () {
      this.getView().byId("page2_SBQB").setVisible(true);
      this.getView().byId("page3_SBQB").setVisible(false);
    },
    onPressBackfromBinList: function () {
      this.getView().byId("page2_SBQB").setVisible(true);
      this.getView().byId("page4_SBQB").setVisible(false);
    },
    // onPressBinSubmit:function(){
    //   this.getView().byId("page1_SBQB").setVisible(false);
    //   this.getView().byId("page2_SBQB").setVisible(true);
    // },
    onPressBinDetails: function () {
      this.getView().byId("page1_SBQB").setVisible(false);
      this.getView().byId("page2_SBQB").setVisible(false);
      this.getView().byId("page3_SBQB").setVisible(true);
    },
    onPressList: function () {
      this.getView().byId("page1_SBQB").setVisible(false);
      this.getView().byId("page2_SBQB").setVisible(false);
      this.getView().byId("page3_SBQB").setVisible(false);
      this.getView().byId("page4_SBQB").setVisible(true);
    },
    onScanSuccess: function (oEvent) {
      // Check if the scan was cancelled
      if (oEvent.getParameter("cancelled")) {
        MessageToast.show("Scan cancelled", { duration: 1000 });
      } else {

        var scannedText = oEvent.getParameter("text");
        if (scannedText) {
          var oInput = this.byId("_IDBinGenInput1_SBQB");
          oInput.setValue(scannedText);

          this._generateQRCode(scannedText);
        } else {
          MessageToast.show("No data found", { duration: 1000 });
        }
      }
    },
    _generateQRCode: function (scannedText) {

      // Get the QR code container element
      var oQRCodeContainer = this.byId("qrCodePlaceholder_SBQB");

      // Clear previous QR code (if any)
      oQRCodeContainer.destroyItems();
    },

    onPressBinSubmit: function () {
      // Get the input value from the input field
      var oView = this.getView();
      var sBinNumber = oView.byId("_IDBinGenInput1_SBQB").getValue();
  
      // Check if bin number is provided
      if (!sBinNumber) {
          sap.m.MessageToast.show("Please enter a bin number.");
          return;
      }
  
      // Call your backend service to fetch products for this bin
      var oModel = this.getView().getModel(); // Assuming you have a model set up
      var that = this;
  
      oModel.read(`/BINQItemSet('${sBinNumber}')`, {
          urlParameters: {
              "$expand": "BINQHeadSet",
              "$format": "json"
          },

          success: function (odata) {
              console.log(odata);
              that.getView().byId("page1_SBQB").setVisible(false);
              that.getView().byId("page2_SBQB").setVisible(true);
              that.getView().byId("_IDBinDetailsGenInput1_SBQB").setValue(sBinNumber);
  
              // Get the product details from the response
              let oDetails = odata.BINQHeadSet.results;
              console.log(oDetails);
  
              // Prepare an array for binding
              var aProductDetails = [];
  
              // Loop through the results and push them into the array
              for (var i = 0; i < oDetails.length; i++) {
                if (oDetails[i].Matnr) {
                  aProductDetails.push({
                      Matnr: oDetails[i].Matnr,
                      Lgpla: oDetails[i].Lgpla,
                      Quan: oDetails[i].Quan,
                      Meins: oDetails[i].Meins
                  });
                }
              }
  
              // Create a JSON model with the product details array
              var oProductModel = new sap.ui.model.json.JSONModel({ products: aProductDetails });
  
              // Set the model to the table
              that.byId("idBinDataTable").setModel(oProductModel);
  
              // Bind the items aggregation of the table to the products array in the model
              that.byId("idBinDataTable").bindItems({
                  path: "/products",
                  template: new sap.m.ColumnListItem({
                      cells: [
                          new sap.m.Text({ text: "{Matnr}" }),  // Product Number
                          new sap.m.Text({ text: "{Quan}" }),   // Quantity
                          new sap.m.Text({ text: "{Meins}" })   // UOM
                      ]
                  })
              });
          },
          error: function () {
              sap.m.MessageToast.show("Error fetching products.");
          }
      });
  }

  });
}
);
