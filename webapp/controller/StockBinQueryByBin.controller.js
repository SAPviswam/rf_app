sap.ui.define([
  "./BaseController",
  "sap/ui/Device",
  "sap/m/MessageToast", // Import MessageToast for user feedback
  "sap/ui/core/UIComponent",
  "sap/ui/model/odata/ODataModel",
], function (Controller, Device, MessageToast, UIComponent, ODataModel) {
  "use strict";
  return Controller.extend("com.app.rfapp.controller.StockBinQueryByBin", {
    onInit: function () {
      const oRouter = this.getOwnerComponent().getRouter();
      oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
      this.aStoredData = null;

    },
    onResourceDetailsLoad: function (oEvent1) {
      var that = this;

      const { id,idI } = oEvent1.getParameter("arguments");

      this.ID = id;
      this.IDI = idI;
      this.applyStoredProfileImage();
    },
    onPressAvatarSBQBB: function (oEvent) {
      this.onPressAvatarEveryTileHelperFunction(oEvent);
    },
    onPressBinBackToHome: async function () {
      var oRouter = UIComponent.getRouterFor(this);
      var oModel1 = this.getOwnerComponent().getModel();

      var that=this;
      // Fetch resource details from OData service

      await oModel1.read("/RESOURCESSet('" + this.ID + "')", {
        success: function (oData) {
          let oUser = oData.Users.toLowerCase()
          if (oUser === "resource") {

            oRouter.navTo("RouteResourcePage", { id: this.ID,idI: this.IDI });
          }
          else {
            oRouter.navTo("Supervisor", { id: this.ID,idI: this.IDI });

          }
          this.getView().byId("_IDBinGenInput1_SBQB").setValue("");
        }.bind(this),
        error: function () {
          MessageToast.show("User does not exist");
        }
      });
    },


    //Avatar Press function with Helper function...
    onPressAvatarSBQBP: function (oEvent) {
      this.onPressAvatarEveryTileHelperFunction(oEvent);
    },

    onSignoutPressed:function(){
      var oRouter = this.getOwnerComponent().getRouter(this);
      oRouter.navTo("InitialScreen",{Userid:this.IDI});
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

      // Check if bin number is provided
      if (!sBinNumber) {
        sap.m.MessageToast.show("Please enter a bin number.");
        return;
      }

      if (sBinNumber === "DECON BIN") {
        sBinNumber = "DECON%20BIN";
      }

      this.sBinNumber = sBinNumber;

      // Clear any previous timeout for invalid Bin toast
      if (this._timeoutIDForInvalidBin) {
        clearTimeout(this._timeoutIDForInvalidBin);
      }

      // Set a new timeout to validate the Bin after 500ms (debounce)
      this._timeoutIDForInvalidBin = setTimeout(function () {
        this.onFetchBinDetails(sBinNumber);
      }.bind(this), 1000);
    },
    onFetchBinDetails: function (sBinNumber) {
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
          if (odata.Lgpla === sBinNumber || sBinNumber === "DECON%20BIN") {
            that.getView().byId("_IDBinDetailsGenInput1_SBQB").setValue(odata.Lgpla);

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
                // type: "Navigation",
                //  press: [that.onSelectMaterial, that]
              })
            });
            that.getView().byId("page1_SBQB").setVisible(false);
            that.getView().byId("page2_SBQB").setVisible(true);
          }
          else {
            that.showInvalidBinMessageToast();
          }
        },
        error: function () {
          that.showInvalidBinMessageToast();
        }
      });
    },

    showInvalidBinMessageToast: function () {
      if (this._timeoutIDForInvalidQueueMessage) {
        clearTimeout(this._timeoutIDForInvalidQueueMessage);
      }

      // Set a timeout for showing the message toast after 500ms (debounce)
      this._timeoutIDForInvalidQueueMessage = setTimeout(function () {
        sap.m.MessageToast.show("Please enter a valid Bin number.");
      }, 500); // 500ms delay
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
          oView.byId("idSBQBStoreTypeInput1").setValue(odata.Lptyp);
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
          // oView.byId("idinput_MovementId_BQB").setValue(odata.MovedDate);
          // oView.byId("idinput_LastChanged_BQB").setValue(odata.ClearedDate);
          // oView.byId("idinput_MovementId_LI_BQB").setValue(odata.IdatuD);
          // oView.byId("idinput_LastChanged_LI_BQB").setValue(odata.Ivnum);
          // oView.byId("idinput_Movementcbt_LI_BQB").setValue(odata.IvPos);

          // function convertMillisecondsToTime(milliseconds) {
          //   // Calculate total seconds
          //   let totalSeconds = Math.floor(milliseconds / 1000);

          //   // Calculate hours, minutes, and seconds
          //   const hours = Math.floor(totalSeconds / 3600);
          //   const minutes = Math.floor((totalSeconds % 3600) / 60);
          //   const seconds = totalSeconds % 60;

          //   // Format as HH:MM:SS
          //   return (
          //     String(hours).padStart(2, '0') + ':' +
          //     String(minutes).padStart(2, '0') + ':' +
          //     String(seconds).padStart(2, '0')
          //   );
          // }

          // Example usage
          // const milliseconds = odata.MovedTime.ms;
          // const milliseconds1 = odata.ClearedTime.ms;
          // const milliseconds2 = odata.IdatuT.ms;
          // oView.byId("idinput_Movement_BQB").setValue(convertMillisecondsToTime(milliseconds));
          // oView.byId("idinput_Movementcbt_BQB").setValue(convertMillisecondsToTime(milliseconds1));
          // oView.byId("idinput_Movement_LI_BQB").setValue(convertMillisecondsToTime(milliseconds2));
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
          that.getView().byId("_IDBinListDetailsGenInput1_SBQB").setValue(odata.Lgpla);
          let oDetails = odata.BINQHeadSet.results;

          // Prepare an array for binding
          var aHUDetails = [];

          // Loop through the results and push them into the array
          for (var i = 0; i < oDetails.length; i++) {
            if (oDetails[i].Huident) {
              aHUDetails.push({
                Huident: oDetails[i].Huident,
                Letyp: oDetails[i].Letyp,
                Flgmove: that.getStatusText(oDetails[i].Flgmove)
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
          var sSelectedQuan = oEvent.getSource().getBindingContext().getProperty("Quan");

          var oSelectedMaterial = aMaterials.find(function (material) {

            return (material.Matnr === sSelectedMatnr && material.Quan === sSelectedQuan);
          });
          if (oSelectedMaterial) {
            // Update the UI with the selected material's details
            oView.byId("idSBQBBinInput_extra").setValue(odata.Lgtyp);
            oView.byId("idSBQBStoreTypeInput_extra").setValue(odata.Lgber);
            oView.byId("idSBQBStoreTypeInput1_extra").setValue(odata.Lptyp);
            oView.byId("idSBQBNoOfHuInput_extra").setValue(odata.MaxWeight);
            oView.byId("idSBQBBinAisleInput_extra").setValue(odata.Weight);
            oView.byId("idSBQBMaxWInput_extra").setValue(odata.MaxVolume);
            oView.byId("idSBQBBinLevelInput_extra").setValue(odata.Volum);
            oView.byId("idSBQBMaxVInput_extra").setValue(oSelectedMaterial.Maktx);  // Selected material number
            oView.byId("idinput_binqbin_AQty").setValue(oSelectedMaterial.Quan);  // Selected material quantity
            oView.byId("idinput_binqbin_Uom").setValue(oSelectedMaterial.Meins);
            oView.byId("idinput_binqbin_OWnr").setValue(oSelectedMaterial.Owner);
            oView.byId("idinput_binqbin_PEnt").setValue(oSelectedMaterial.Entitled);
            oView.byId("idinput_binqbin_Styp").setValue(oSelectedMaterial.Cat);
          } else {
            sap.m.MessageToast.show("Material not found.");
          }

          // Hide the ScrollContainerpage1_SBQB_extra_BinDetails
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
    getStatusText: function (statusCode) {
      if (typeof statusCode === 'boolean') {
        return statusCode ? 'yes' : 'No';
      }
    }
  });
});
