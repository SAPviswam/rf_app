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
    // onPressList: function () {
    //   this.getView().byId("page2_SBQB").setVisible(false);
    //   this.getView().byId("page3_SBQB").setVisible(false);
    //   this.getView().byId("page4_SBQB").setVisible(true);
    // },
    onScanSuccess: function (oEvent) {
      // Get the scanned bin number from the event
      var sScannedBinNumber = oEvent.getParameter("text"); // Assuming this is how you get the scanned text
  
      // Set the scanned value into the input field
      this.getView().byId("_IDBinGenInput1_SBQB").setValue(sScannedBinNumber);
  
      // Call the submit function to fetch products
      this.onPressBinSubmit(); // Call your existing submit function
  },
    onPressBinSubmit: function () {
      // Get the input value from the input field
      var oView = this.getView();
      var sBinNumber = oView.byId("_IDBinGenInput1_SBQB").getValue();
      this.sBinNumber = sBinNumber;

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
          that.getView().byId("page1_SBQB").setVisible(false);
          that.getView().byId("page2_SBQB").setVisible(true);
          that.getView().byId("_IDBinDetailsGenInput1_SBQB").setValue(sBinNumber);

          // Get the product details from the response
          let oDetails = odata.BINQHeadSet.results;

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
    },
    onPressBinDetails: function () {
      this.getView().byId("page2_SBQB").setVisible(false);
      this.getView().byId("page3_SBQB").setVisible(true);

      var oModel = this.getView().getModel(); // Assuming you have a model set up
      var that = this;

      oModel.read(`/BINQItemSet('${this.sBinNumber}')`, {
        urlParameters: {
          "$expand": "BINQHeadSet",
          "$format": "json"
        },

        success: function (odata) {
          console.log(odata)

          var oView = that.getView();
          oView.byId("idSBQBBinInput").setValue(odata.Lgtyp);
          oView.byId("idSBQBMaxVInput").setValue(odata.MaxVolume);
          oView.byId("idSBQBStoreTypeInput").setValue(odata.Lgber);
          oView.byId("idSBQBQtyWInput").setValue(odata.Ivnum);
          oView.byId("idSBQBStorSecInput").setValue(odata.Anzle);
          oView.byId("idSBQBNoOfHuInput").setValue(odata.MaxWeight);
          oView.byId("idSBQBMaxWInput").setValue(odata.MaxVolume);
          oView.byId("idSBQBMaxVInput").setValue(odata.MaxCapa);
          oView.byId("idSBQBBinAisleInput").setValue(odata.Weight);
          oView.byId("idSBQBBinLevelInput").setValue(odata.Volum);
          oView.byId("idSBQBStackInput").setValue(odata.Fcapa);
          oView.byId("idSBQBBinAisleInputUOM").setValue(odata.UnitW);
          oView.byId("idSBQBinLevelInputUOM").setValue(odata.UnitV);
          oView.byId("idinput_MovementId_BQB").setValue(odata.MovedDate);
          oView.byId("idinput_LastChanged_BQB").setValue(odata.ClearedDate);
          oView.byId("idinput_MovementId_LI_BQB").setValue(odata.IdatuD);
          oView.byId("idinput_LastChanged_LI_BQB").setValue(odata.Ivnum);
          oView.byId("idinput_Movementcbt_LI_BQB").setValue(odata.IvPos);

          function convertMillisecondsToTime(milliseconds) {
            // Calculate total seconds
            let totalSeconds = Math.floor(milliseconds / 1000);
        
            // Calculate hours, minutes, and seconds
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
        
            // Format as HH:MM:SS
            return (
                String(hours).padStart(2, '0') + ':' +
                String(minutes).padStart(2, '0') + ':' +
                String(seconds).padStart(2, '0')
            );
        }
        
        // Example usage
        const milliseconds = odata.MovedTime.ms;
        const milliseconds1 = odata.ClearedTime.ms;
        const milliseconds2 = odata.IdatuT.ms;
        oView.byId("idinput_Movement_BQB").setValue(convertMillisecondsToTime(milliseconds));
        oView.byId("idinput_Movementcbt_BQB").setValue(convertMillisecondsToTime(milliseconds1));
        oView.byId("idinput_Movement_LI_BQB").setValue(convertMillisecondsToTime(milliseconds2));
        },
        error: function () {
          sap.m.MessageToast.show("Error fetching products.");
        }
      });
    },
    onPressList: function () {
      this.getView().byId("page2_SBQB").setVisible(false);
      this.getView().byId("page4_SBQB").setVisible(true);

      var oModel = this.getView().getModel(); // Assuming you have a model set up
      var that = this;

      oModel.read(`/BINQItemSet('${this.sBinNumber}')`, {
        urlParameters: {
          "$expand": "BINQHeadSet",
          "$format": "json"
        },

        success: function (odata) {
          console.log(odata);
          that.getView().byId("_IDBinListDetailsGenInput1_SBQB").setValue(that.sBinNumber);
          let oDetails = odata.BINQHeadSet.results;

          // Prepare an array for binding
          var aHUDetails = [];

          // Loop through the results and push them into the array
          for (var i = 0; i < oDetails.length; i++) {
            if (oDetails[i].Huident) {
              aHUDetails.push({
                Huident: oDetails[i].Huident,
                Letyp: oDetails[i].Letyp,
                Flgmove: oDetails[i].Flgmove

              });
            }
          }

          // Create a JSON model with the product details array
          var oHUModel = new sap.ui.model.json.JSONModel({ products: aHUDetails });

          // Set the model to the table
          that.byId("idBinListDataTable").setModel(oHUModel);

          // Bind the items aggregation of the table to the products array in the model
          that.byId("idBinListDataTable").bindItems({
            path: "/products",
            template: new sap.m.ColumnListItem({
              cells: [
                new sap.m.Text({ text: "{Huident}" }),  // HU Number
                new sap.m.Text({ text: "{Letyp}" }),   // Quantity
                new sap.m.Text({ text: "{Flgmove}" })   // UOM
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
