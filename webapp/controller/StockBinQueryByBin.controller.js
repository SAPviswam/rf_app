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
      this.aStoredData = null;

    },
    onResourceDetailsLoad: function (oEvent1) {
      var that = this;
      const { id } = oEvent1.getParameter("arguments");
      this.ID = id;
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
      var sScannedBinNumber = oEvent.getParameter("text"); 

      // Set the scanned value into the input field
      this.getView().byId("_IDBinGenInput1_SBQB").setValue(sScannedBinNumber);

      // Call the submit function to fetch products
      this.onPressBinSubmit(); 
    },
    onPressBinSubmit: function () {
      // Get the input value from the input field
      var oView = this.getView();
      var sBinNumber = oView.byId("_IDBinGenInput1_SBQB").getValue();

      sBinNumber = sBinNumber.toUpperCase();
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
          console.log(odata)
          if (odata.Lgpla === sBinNumber) {
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
                ],
                type: "Navigation",
                press: [that.onSelectMaterial, that]
              })
            });
          } else {
            // If no matching bin number found, show a message
            sap.m.MessageToast.show("No products found for the entered bin number.");
          }
        },
        error: function () {
          sap.m.MessageToast.show("Error fetching products.");
        }
      });
    },
    onPressBinDetails: function () {
      var oModel = this.getView().getModel(); // Assuming you have a model set up
      var that = this;

      oModel.read(`/BINQItemSet('${this.sBinNumber}')`, {
        urlParameters: {
          "$expand": "BINQHeadSet",
          "$format": "json"
        },

        success: function (odata) {
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
          that.getView().byId("page2_SBQB").setVisible(false);
          that.getView().byId("page3_SBQB").setVisible(true);
        },
        error: function () {
          sap.m.MessageToast.show("Error fetching products.");
        }
      });
    },
    onPressList: function () {
      var oModel = this.getView().getModel(); // Assuming you have a model set up
      var that = this;

      oModel.read(`/BINQItemSet('${this.sBinNumber}')`, {
        urlParameters: {
          "$expand": "BINQHeadSet",
          "$format": "json"
        },

        success: function (odata) {
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
              ],
            })
          });
          that.getView().byId("page2_SBQB").setVisible(false);
          that.getView().byId("page4_SBQB").setVisible(true);
        },
        error: function () {
          sap.m.MessageToast.show("Error fetching products.");
        }
      });
    },

    onSelectMaterial: function (oEvent) {
      var oView = this.getView();

      var oModel = this.getView().getModel(); // Assuming you have a model set up
      oModel.read(`/BINQItemSet('${this.sBinNumber}')`, {
        urlParameters: {
          "$expand": "BINQHeadSet",
          "$format": "json"
        },

        success: function (odata) {
          var aMaterials = odata.BINQHeadSet.results;

          var sSelectedMatnr = oEvent.getSource().getBindingContext().getProperty("Matnr");

          var oSelectedMaterial = aMaterials.find(function (material) {
            return material.Matnr === sSelectedMatnr;
          });
          if (oSelectedMaterial) {
            // Update the UI with the selected material's details
            oView.byId("idSBQBBinInput_extra").setValue(odata.Lgtyp);
            oView.byId("idSBQBStoreTypeInput_extra").setValue(odata.Lgber);
            oView.byId("idSBQBNoOfHuInput_extra").setValue(odata.MaxWeight);
            oView.byId("idSBQBBinAisleInput_extra").setValue(odata.Weight);
            oView.byId("idSBQBMaxWInput_extra").setValue(odata.MaxVolume);
            oView.byId("idSBQBBinLevelInput_extra").setValue(odata.Volum);
            oView.byId("idSBQBMaxVInput_extra").setValue(oSelectedMaterial.Matnr);  // Selected material number
            oView.byId("idinput_binqbin_AQty").setValue(oSelectedMaterial.Quan);  // Selected material quantity
            oView.byId("idinput_binqbin_Uom").setValue(oSelectedMaterial.Meins);
            oView.byId("idinput_binqbin_OWnr").setValue(oSelectedMaterial.Owner);
            oView.byId("idinput_binqbin_PEnt").setValue(oSelectedMaterial.Entitled);
            oView.byId("idinput_binqbin_Styp").setValue(oSelectedMaterial.Cat);
          } else {
            sap.m.MessageToast.show("Material not found.");
          }

          // Hide the ScrollContainer
          oView.byId("page2_SBQB").setVisible(false);
          oView.byId("page1_SBQB_extra_BinDetails").setVisible(true);
        }, error: function () {
          sap.m.MessageToast.show("Error fetching products.");
        }
      });
    },
    onPressBackfromView: function () {
      this.getView().byId("page2_SBQB").setVisible(true);
      this.getView().byId("page1_SBQB_extra_BinDetails").setVisible(false);
    },


    // // Reusable OData read function - fetch data only if not already fetched
    // _fetchDataOnce: function (sBinNumber, mParameters, fnSuccess, fnError) {
    //   // If data is already fetched, just call the success callback with the stored data
    //   if (this.aStoredData) {
    //     if (typeof fnSuccess === "function") {
    //       fnSuccess(this.aStoredData);  // Use the cached data
    //     }
    //     return;
    //   }

    //   // Otherwise, fetch the data from the backend
    //   var oModel = this.getView().getModel();
    //   oModel.read(`/BINQItemSet('${sBinNumber}')`, {
    //     urlParameters: mParameters,
    //     success: function (oData) {
    //       this.aStoredData = oData;  // Store the fetched data
    //       if (typeof fnSuccess === "function") {
    //         fnSuccess(oData);  // Call the success callback with the data
    //       }
    //     }.bind(this),  // Use .bind(this) to preserve controller context
    //     error: function (oError) {
    //       if (typeof fnError === "function") {
    //         fnError(oError);  // Call error callback if provided
    //       } else {
    //         sap.m.MessageToast.show("Error fetching data.");
    //       }
    //     }
    //   });
    // },

    // onPressBinSubmit: function () {
    //   var oView = this.getView();
    //   var sBinNumber = oView.byId("_IDBinGenInput1_SBQB").getValue();
    //   this.sBinNumber = sBinNumber;

    //   if (!sBinNumber) {
    //     sap.m.MessageToast.show("Please enter a bin number.");
    //     return;
    //   }

    //   var mParameters = {
    //     "$expand": "BINQHeadSet",
    //     "$format": "json"
    //   };

    //   // Fetch data only once and reuse it
    //   this._fetchDataOnce(sBinNumber, mParameters, function (oData) {
    //     // Handle the data (this code is unchanged from your original logic)
    //     this.getView().byId("page1_SBQB").setVisible(false);
    //     this.getView().byId("page2_SBQB").setVisible(true);
    //     this.getView().byId("_IDBinDetailsGenInput1_SBQB").setValue(sBinNumber);

    //     let oDetails = oData.BINQHeadSet.results;
    //     var aProductDetails = [];

    //     for (var i = 0; i < oDetails.length; i++) {
    //       if (oDetails[i].Matnr) {
    //         aProductDetails.push({
    //           Matnr: oDetails[i].Matnr,
    //           Lgpla: oDetails[i].Lgpla,
    //           Quan: oDetails[i].Quan,
    //           Meins: oDetails[i].Meins
    //         });
    //       }
    //     }

    //     var oProductModel = new sap.ui.model.json.JSONModel({ products: aProductDetails });
    //     this.byId("idBinDataTable").setModel(oProductModel);

    //     this.byId("idBinDataTable").bindItems({
    //       path: "/products",
    //       template: new sap.m.ColumnListItem({
    //         cells: [
    //           new sap.m.Text({ text: "{Matnr}" }),
    //           new sap.m.Text({ text: "{Quan}" }),
    //           new sap.m.Text({ text: "{Meins}" })
    //         ]
    //       })
    //     });
    //   }.bind(this));
    // },

    // onPressBinDetails: function () {
    //   this.getView().byId("page2_SBQB").setVisible(false);
    //   this.getView().byId("page3_SBQB").setVisible(true);

    //   if (!this.sBinNumber) return;

    //   var mParameters = {
    //     "$expand": "BINQHeadSet",
    //     "$format": "json"
    //   };

    //   // Fetch data once and reuse it
    //   this._fetchDataOnce(this.sBinNumber, mParameters, function (oData) {
    //     // Handle the bin details (this code is unchanged)
    //     var oView = this.getView();
    //     oView.byId("idSBQBBinInput").setValue(oData.Lgtyp);
    //     oView.byId("idSBQBMaxVInput").setValue(oData.MaxVolume);
    //     oView.byId("idSBQBStoreTypeInput").setValue(oData.Lgber);
    //     oView.byId("idSBQBQtyWInput").setValue(oData.Ivnum);
    //     oView.byId("idSBQBStorSecInput").setValue(oData.Anzle);
    //     oView.byId("idSBQBNoOfHuInput").setValue(oData.MaxWeight);
    //     oView.byId("idSBQBMaxWInput").setValue(oData.MaxVolume);
    //     oView.byId("idSBQBMaxVInput").setValue(oData.MaxCapa);
    //     oView.byId("idSBQBBinAisleInput").setValue(oData.Weight);
    //     oView.byId("idSBQBBinLevelInput").setValue(oData.Volum);
    //     oView.byId("idSBQBStackInput").setValue(oData.Fcapa);
    //     oView.byId("idSBQBBinAisleInputUOM").setValue(oData.UnitW);
    //     oView.byId("idSBQBinLevelInputUOM").setValue(oData.UnitV);
    //     oView.byId("idinput_MovementId_BQB").setValue(oData.MovedDate);
    //     oView.byId("idinput_LastChanged_BQB").setValue(oData.ClearedDate);
    //     oView.byId("idinput_MovementId_LI_BQB").setValue(oData.IdatuD);
    //     oView.byId("idinput_LastChanged_LI_BQB").setValue(oData.Ivnum);
    //     oView.byId("idinput_Movementcbt_LI_BQB").setValue(oData.IvPos);

    //     function convertMillisecondsToTime(milliseconds) {
    //       // Calculate total seconds
    //       let totalSeconds = Math.floor(milliseconds / 1000);

    //       // Calculate hours, minutes, and seconds
    //       const hours = Math.floor(totalSeconds / 3600);
    //       const minutes = Math.floor((totalSeconds % 3600) / 60);
    //       const seconds = totalSeconds % 60;

    //       // Format as HH:MM:SS
    //       return (
    //         String(hours).padStart(2, '0') + ':' +
    //         String(minutes).padStart(2, '0') + ':' +
    //         String(seconds).padStart(2, '0')
    //       );
    //     }

    //     // Example usage
    //     const milliseconds = oData.MovedTime.ms;
    //     const milliseconds1 = oData.ClearedTime.ms;
    //     const milliseconds2 = oData.IdatuT.ms;
    //     oView.byId("idinput_Movement_BQB").setValue(convertMillisecondsToTime(milliseconds));
    //     oView.byId("idinput_Movementcbt_BQB").setValue(convertMillisecondsToTime(milliseconds1));
    //     oView.byId("idinput_Movement_LI_BQB").setValue(convertMillisecondsToTime(milliseconds2));
    //   }.bind(this));
    // },

    // onPressList: function () {
    //   this.getView().byId("page2_SBQB").setVisible(false);
    //   this.getView().byId("page4_SBQB").setVisible(true);

    //   var mParameters = {
    //     "$expand": "BINQHeadSet",
    //     "$format": "json"
    //   };

    //   // Fetch data once and reuse it
    //   this._fetchDataOnce(this.sBinNumber, mParameters, function (oData) {
    //     let oDetails = oData.BINQHeadSet.results;
    //     var aHUDetails = [];

    //     for (var i = 0; i < oDetails.length; i++) {
    //       if (oDetails[i].Huident) {
    //         aHUDetails.push({
    //           Huident: oDetails[i].Huident,
    //           Letyp: oDetails[i].Letyp,
    //           Flgmove: oDetails[i].Flgmove
    //         });
    //       }
    //     }

    //     var oHUModel = new sap.ui.model.json.JSONModel({ products: aHUDetails });
    //     this.byId("idBinListDataTable").setModel(oHUModel);

    //     this.byId("idBinListDataTable").bindItems({
    //       path: "/products",
    //       template: new sap.m.ColumnListItem({
    //         cells: [
    //           new sap.m.Text({ text: "{Huident}" }),
    //           new sap.m.Text({ text: "{Letyp}" }),
    //           new sap.m.Text({ text: "{Flgmove}" })
    //         ],
    //         type: "Navigation"
    //       })
    //     });
    //   }.bind(this));
    // }


  });
});
