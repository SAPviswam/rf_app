sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/Device",
    "sap/ui/core/UIComponent"
  ],
  function (BaseController, MessageToast, Device,UIComponent ) {
    "use strict";

    return BaseController.extend("com.app.rfapp.controller.StockBinQueryByProduct", {
      onInit: function () {
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);

        this._timeoutID = null;

        this._cachedProductNumbers = {};
        this._cacheExpiryTime = 60000;
        if (Device.system.phone) {
          this.getView().byId("idTable_SBQP").setWidth("150%");

        }

      },
      onResourceDetailsLoad: function (oEvent1) {
        var that = this;
        const { id } = oEvent1.getParameter("arguments");
        this.ID = id;
        console.log(this.ID);

      },
      onSBQPfirstBackBtnPress: async function () {
        var oRouter = UIComponent.getRouterFor(this);
        var oModel1 = this.getOwnerComponent().getModel();
        await oModel1.read("/RESOURCESSet('" + this.ID + "')", {
          success: function (oData) {
            let oUser = oData.Users.toLowerCase()
            if (oUser === "resource") {
              oRouter.navTo("RouteResourcePage", { id: this.ID });
              this.getView().byId("idProductinput_SBQP").setValue("")
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

      onSBQPSecondBackBtnPress: function () {
        this.getView().byId("idFirstSC_SBQP").setVisible(true)
        this.getView().byId("idsecondSC_SBQP").setVisible(false)
        this.getView().byId("idfirstbackbtn_SBQP").setVisible(true)
        this.getView().byId("idSecondbackbtn_SBQP").setVisible(false)

      },
      //scanner
      onScanSuccessProduct: function (oEvent) {
        // Get the scanned bin number from the event
        var sScannedProduct = oEvent.getParameter("text");
        this.getView().byId("idProductinput_SBQP").setValue(sScannedProduct);
        this.onpressProductsubmit();
      },

      onpressProductsubmit: function () {
        var oView = this.getView();
        var sProductNo = oView.byId("idProductinput_SBQP").getValue();
        sProductNo = sProductNo.toUpperCase();

        // Store the product number for future use
        this.sProductNo = sProductNo;

        // If the product number is empty, show the message toast and exit
        if (!sProductNo) {
          sap.m.MessageToast.show("Please enter a Product.");
          return;
        }

        // Clear any previous timeout
        if (this._timeoutID) {
          clearTimeout(this._timeoutID);
        }

        // Set a new timeout to validate the product after 500ms (debounce)
        this._timeoutID = setTimeout(function () {
          this._validateProduct(sProductNo);
        }.bind(this), 500);
      },

      _validateProduct: function (sProductNo) {
        // Check if the product data is already cached and if the cache is still valid
        var cachedProduct = this._cachedProductNumbers[sProductNo];
        if (cachedProduct && (new Date() - cachedProduct.timestamp < this._cacheExpiryTime)) {
          // If cached data is valid, use the cached product number
          this._handleSuccess(cachedProduct.data, sProductNo);
          return;
        }

        // If not cached or cache expired, make a new backend request
        var oModel = this.getView().getModel();
        var that = this;

        oModel.read(`/ProductHeadSet('${sProductNo}')`, {
          urlParameters: {
            "$expand": "ProductHeadtoItem",
            "$format": "json"
          },
          success: function (odata) {
            console.log(odata);

            // Cache the product data with a timestamp for expiry validation
            that._cachedProductNumbers[sProductNo] = {
              data: odata,
              timestamp: new Date()
            };

            // Handle the success callback
            that._handleSuccess(odata, sProductNo);
          },
          error: function () {
            // Show error message if fetching product data fails
            sap.m.MessageToast.show("Error fetching product data.");
          }
        });
      },

      _handleSuccess: function (odata, sProductNo) {
        var that = this;

        if (odata.Matnr === sProductNo) {
          that.getView().byId("idFirstSC_SBQP").setVisible(false);
          that.getView().byId("idsecondSC_SBQP").setVisible(true);
          that.getView().byId("idfirstbackbtn_SBQP").setVisible(false);
          that.getView().byId("idSecondbackbtn_SBQP").setVisible(true);
          that.getView().byId("idProductinput2_SBQP").setEditable(false);
          that.getView().byId("idProductinput2_SBQP").setValue(sProductNo);

          // Get the product details from the response
          let oDetails = odata.ProductHeadtoItem.results;

          // Filter out items where Lgpla is empty or null
          let aFilteredProductDetails = oDetails.filter(function (item) {
            return item.Lgpla && item.Lgpla.trim() !== '';
          });

          // Prepare an array for binding
          var aProductDetails = [];

          // Loop through the filtered results and push them into the array
          for (var i = 0; i < aFilteredProductDetails.length; i++) {
            aProductDetails.push({
              Lgpla: aFilteredProductDetails[i].Lgpla,
              Nista: aFilteredProductDetails[i].Nista,
              Altme: aFilteredProductDetails[i].Altme
            });
          }

          // Create a JSON model with the filtered product details array
          var oProductModel = new sap.ui.model.json.JSONModel({ products: aProductDetails });

          // Set the model to the table
          that.byId("idTable_SBQP").setModel(oProductModel);

          // Bind the items aggregation of the table to the products array in the model
          that.byId("idTable_SBQP").bindItems({
            path: "/products",
            template: new sap.m.ColumnListItem({
              cells: [
                new sap.m.Text({ text: "{Lgpla}" }),  // Bins
                new sap.m.Text({ text: "{Nista}" }),   // Pieces
                new sap.m.Text({ text: "{Altme}" })   // UOM
              ],
              type: "Navigation",
              press: [that.onSelectBin, that]
            })
          });
          that.lastValidSubmission = new Date();
        } else {
          // If product number is not valid, show message toast after timeout
          this._showInvalidProductMessageToast();
        }
      },

      _showInvalidProductMessageToast: function () {
        if (this._timeoutIDForInvalidProduct) {
          clearTimeout(this._timeoutIDForInvalidProduct);
        }

        // Set a timeout for the message 
        this._timeoutIDForInvalidProduct = setTimeout(function () {
          sap.m.MessageToast.show("Enter a Valid Product.");
        }, 500);
      },

      onSBQPThirdBackBtnPress: function () {
        this.getView().byId("idsecondSC_SBQP").setVisible(true);
        this.getView().byId("idThirdSC_SBQP").setVisible(false);
        this.getView().byId("idSecondbackbtn_SBQP").setVisible(true);
        this.getView().byId("idThirdbackbtn_SBQP").setVisible(false);
      },

      onSelectBin: function (oEvent) {
        var oModel = this.getView().getModel();
        oModel.read(`/ProductHeadSet('${this.sProductNo}')`, {
          urlParameters: {
            "$expand": "ProductHeadtoItem",
            "$format": "json"
          },
          success: (odata) => {
            var aBindetails = odata.ProductHeadtoItem.results;

            var sSelectedLgpla = oEvent.getSource().getBindingContext().getProperty("Lgpla");

            var oSelectedBinDetails = aBindetails.find(function (Bin) {
              return Bin.Lgpla === sSelectedLgpla;
            });
            //Remove preceding spaces and zeros.
            var Aisle = oSelectedBinDetails.Aisle.trimStart();
            var Stack = oSelectedBinDetails.Stack.trimStart();
            var LvlV = oSelectedBinDetails.LvlV.trimStart();

            if (oSelectedBinDetails) {
              // Update the UI with the selected material's details
              this.getView().byId("idBininput_SBQP").setValue(oSelectedBinDetails.Lgpla);
              this.getView().byId("idStorageTypeInput_SBQP").setValue(oSelectedBinDetails.Lgtyp);
              this.getView().byId("idQtyInput_SBQP").setValue(oSelectedBinDetails.Nista);
              this.getView().byId("idSSecinput_SBQP").setValue(oSelectedBinDetails.Lgber);
              this.getView().byId("idNoOfHuInput_SBQP").setValue(oSelectedBinDetails.Anzle);
              this.getView().byId("idBinAisleinput_SBQP").setValue(Aisle);
              this.getView().byId("idStackinput_SBQP").setValue(Stack);
              this.getView().byId("idBinLevelinput_SBQP").setValue(LvlV);
              this.getView().byId("idMaxWInput_SBQP").setValue(oSelectedBinDetails.MaxWeight);
              this.getView().byId("idUnitGwInput_SBQP").setValue(oSelectedBinDetails.UnitW);
              this.getView().byId("idMaxVinput_SBQP").setValue(oSelectedBinDetails.MaxVolume);
              this.getView().byId("idUnitGvInput_SBQP").setValue(oSelectedBinDetails.UnitV);
            } else {
              sap.m.MessageToast.show("Material not found.");
            }
            this.getView().byId("idsecondSC_SBQP").setVisible(false);
            this.getView().byId("idFourthSC_SBQP").setVisible(true);
            this.getView().byId("idFourthbackbtn_SBQP").setVisible(true);
            this.getView().byId("idThirdbackbtn_SBQP").setVisible(false);
            this.getView().byId("idSecondbackbtn_SBQP").setVisible(false);
          },
          error: function () {
            sap.m.MessageToast.show("Error fetching products.");
          }
        });
      },
      onSBQPPreDePress: function () {
        var oModel = this.getView().getModel();
        var that = this;
        oModel.read(`/ProductHeadSet('${this.sProductNo}')`, {
          urlParameters: {
            "$expand": "ProductHeadtoItem",
            "$format": "json"
          },
          success: function (odata) {
            
            var oView = that.getView();
            oView.byId("idMaktxInput_SBQP").setValue(odata.Maktx);
            oView.byId("idEANInput_SBQP").setValue(odata.Ean11);
            oView.byId("idTotWinput_SBQP").setValue(odata.GWeight);
            oView.byId("idUnitGWinput_SBQP").setValue(odata.UnitGw);
            oView.byId("idTotVinput_SBQP").setValue(odata.GVolume);
            oView.byId("idUnitGVinput_SBQP").setValue(odata.UnitGv);
            that.getView().byId("idsecondSC_SBQP").setVisible(false);
            that.getView().byId("idThirdSC_SBQP").setVisible(true);
            that.getView().byId("idSecondbackbtn_SBQP").setVisible(false);
            that.getView().byId("idThirdbackbtn_SBQP").setVisible(true);
          },
          error: function () {
            sap.m.MessageToast.show("Error fetching products.");
          }
        });
      },
      onSBQPFourthBackBtnPress: function () {
        this.getView().byId("idFourthbackbtn_SBQP").setVisible(false);
        this.getView().byId("idSecondbackbtn_SBQP").setVisible(true);
        this.getView().byId("idsecondSC_SBQP").setVisible(true);
        this.getView().byId("idFourthSC_SBQP").setVisible(false);
      }
    });
  }
);

