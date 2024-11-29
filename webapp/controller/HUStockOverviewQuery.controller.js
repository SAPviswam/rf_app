sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/Device"
  ],

  function (BaseController, UIComponent, Device) {
    "use strict";

    return BaseController.extend("com.app.rfapp.controller.HUStockOverviewQuery", {
      onInit: function () {

        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);

        this._timeoutID = null;

        this._cachedProductNumbers = {};
        this._cacheExpiryTime = 60000;
        

        if (Device.system.phone) {
          this.getView().byId("idBinNumberTableInput_HUSOQ").setWidth("200%");
          this.getView().byId("idTable_HUSOQ").setWidth("200%");
          this.getView().byId("idBinNumberTableInput_HUSOQ").addStyleClass("MobileviewTable_HUSOQ");
          this.getView().byId("idTable_HUSOQ").addStyleClass("MobileviewTable_HUSOQ");
      }
      
      if (Device.system.tablet) {
        this.getView().byId("idBinNumTable_AHUOBQ").addStyleClass("tab_Table_HuStockOverview");
    }

      },
      onResourceDetailsLoad: async function (oEvent1) {
        const { id } = oEvent1.getParameter("arguments");
        this.ID = id;
      },
      //Back button from 1st screen
      onHUStockOverviewQueryfirstBackBtnPress: async function () {
        var oRouter = UIComponent.getRouterFor(this);
        var oModel1 = this.getOwnerComponent().getModel();
        await oModel1.read("/RESOURCESSet('" + this.ID + "')", {

          success: function (oData) {

            let oUser = oData.Users.toLowerCase()



            if (oUser === "resource") {
              oRouter.navTo("RouteResourcePage", { id: this.ID });
              this.getView().byId("idinput_HUSOQ").setValue("")
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
      //on clicking submit button in 1st screen
      onSubmitButtonPress: function () {
        debugger;

        // Get the input value from the input field
        var oView = this.getView();
        var sHUNumber = oView.byId("idinput_HUSOQ").getValue();

        sHUNumber = sHUNumber.toUpperCase();

        this.sHUNumber = sHUNumber;

        // Check if bin number is provided
        if (!sHUNumber) {
          sap.m.MessageToast.show("Please enter a hu number.");
          return;
        }
        // Clear any previous timeout
        if (this._timeoutID) {
          clearTimeout(this._timeoutID);
        }

        // Set a new timeout to validate the product after 500ms (debounce)
        this._timeoutID = setTimeout(function () {
          this._validateProduct(sHUNumber);
        }.bind(this), 500);
      },

      // Call your backend service to fetch products for this bin
      _validateProduct: function (sHUNumber) {
         
        var cachedProduct = this._cachedProductNumbers[sHUNumber];
        if (cachedProduct && (new Date() - cachedProduct.timestamp < this._cacheExpiryTime)) {
          // If cached data is valid, use the cached product number
          this._handleSuccess(cachedProduct.data, sHUNumber);
          return;
        }

        var oModel = this.getOwnerComponent().getModel(); // Assuming you have a model set up
        var that = this;
        var sRequestUrl = `/HandlingUnitNHSet('${sHUNumber}')`;
        oModel.read(sRequestUrl, {
          urlParameters: {
            "$expand": "HUheadtoItems",
            "$format": "json"
          },

          success: function (odata) {
            console.log(odata)
            that._cachedProductNumbers[sHUNumber] = {
              data: odata,
              timestamp: new Date()
            };

            // Handle the success callback
            that._handleSuccess(odata, sHUNumber);
          },
          error: function () {
            sap.m.MessageToast.show("Error fetching products.");
          }
        });
      },
      _handleSuccess: function (odata, sHUNumber) {
        var that = this;

        if (odata.Tophu === sHUNumber) {
          that.getView().byId("idScforFirstHUStockOverviewQuery_HUSOQ").setVisible(false);
            that.getView().byId("idHUStockOverviewQueryfirstbackbtn_HUSOQ").setVisible(false);
            that.getView().byId("idScforSecondHUStockOverviewQuery_HUSOQ").setVisible(true);
            that.getView().byId("idHUStockOverviewQuerySecondbackbtn_HUSOQ").setVisible(true);
            that.getView().byId("idBinNumberInput_HUSOQ_HUSOQ").setValue(sHUNumber);
         
          // Get the product details from the response
          let oDetails = odata.HUheadtoItems.results;

          that.getView().byId("idBinNumberInputBinInput_HUSOQ").setValue(oDetails[0].NumIt);
          that.getView().byId("idBinNumberInputBinNumberInput_HUSOQ").setValue(oDetails[0].NumHu);
          that.getView().byId("idBinNumberInputBinNumInput_HUSOQ").setValue(odata.Top);

          // Prepare an array for binding
          var aProductDetails = [];

          // Loop through the results and push them into the array
          for (var i = 0; i < oDetails.length; i++) {
            if (oDetails[i].Matnr) {

              aProductDetails.push({
                Matnr: oDetails[i].Matnr,
                Maktx: oDetails[i].Maktx,
                Nista: oDetails[i].Nista,
                Altme: oDetails[i].Altme,
                Batch: oDetails[i].Batch,
                Cat: oDetails[i].Cat
              });
            }
          }
          // Create a JSON model with the product details array
          var oProductModel = new sap.ui.model.json.JSONModel({ products: aProductDetails });

          // Set the model to the table
          that.byId("idBinNumberTableInput_HUSOQ").setModel(oProductModel);

          // Bind the items aggregation of the table to the products array in the model
          that.byId("idBinNumberTableInput_HUSOQ").bindItems({
            path: "/products",
            template: new sap.m.ColumnListItem({
              cells: [
                new sap.m.Text({ text: "{Matnr}" }),  // Product Number
                new sap.m.Text({ text: "{Maktx}" }),   // Quantity
                new sap.m.Text({ text: "{Nista}" }),
                new sap.m.Text({ text: "{Altme}" }),
                new sap.m.Text({ text: "{Batch}" }),
                new sap.m.Text({ text: "{Cat}" })

                  // UOM
              ],
            })
          });
        } else if (odata.Huident=== sHUNumber) {

          that.getView().byId("idScforFirstHUStockOverviewQuery_HUSOQ").setVisible(false);
            that.getView().byId("idHUStockOverviewQueryfirstbackbtn_HUSOQ").setVisible(false);
            that.getView().byId("idScforSecondHUStockOverviewQuery_HUSOQ").setVisible(true);
            that.getView().byId("idHUStockOverviewQuerySecondbackbtn_HUSOQ").setVisible(true);
            that.getView().byId("idBinNumberInput_HUSOQ_HUSOQ").setValue(sHUNumber);
         
          // Get the product details from the response
          let oDetails = odata.HUheadtoItems.results;

          oDetails = oDetails.filter(item => item.Huident == sHUNumber);

          that.getView().byId("idBinNumberInputBinInput_HUSOQ").setValue(oDetails[0].NumIt);
          that.getView().byId("idBinNumberInputBinNumberInput_HUSOQ").setValue(oDetails[0].NumHu);
          that.getView().byId("idBinNumberInputBinNumInput_HUSOQ").setValue(odata.Top);

          // Prepare an array for binding
          var aProductDetails = [];

          // Loop through the results and push them into the array
          for (var i = 0; i < oDetails.length; i++) {
            if (oDetails[i].Matnr) {

              aProductDetails.push({
                Matnr: oDetails[i].Matnr,
                Maktx: oDetails[i].Maktx,
                Nista: oDetails[i].Nista,
                Altme: oDetails[i].Altme,
                Batch: oDetails[i].Batch,
                Cat: oDetails[i].Cat
              });
            }
          }
          // Create a JSON model with the product details array
          var oProductModel = new sap.ui.model.json.JSONModel({ products: aProductDetails });

          // Set the model to the table
          that.byId("idBinNumberTableInput_HUSOQ").setModel(oProductModel);

          // Bind the items aggregation of the table to the products array in the model
          that.byId("idBinNumberTableInput_HUSOQ").bindItems({
            path: "/products",
            template: new sap.m.ColumnListItem({
              cells: [
                new sap.m.Text({ text: "{Matnr}" }),  // Product Number
                new sap.m.Text({ text: "{Maktx}" }),   // Quantity
                new sap.m.Text({ text: "{Nista}" }),
                new sap.m.Text({ text: "{Altme}" }),
                new sap.m.Text({ text: "{Batch}" }),
                new sap.m.Text({ text: "{Cat}" })

                  // UOM
              ],
            })
          });



          
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
          sap.m.MessageToast.show("Enter a Valid Hu NUmber.");
        }, 500); 
      },

      //on clicking on back button in second screen
      onHUStockOverviewQuerySecondBackBtnPress: function () {
        this.getView().byId("idScforFirstHUStockOverviewQuery_HUSOQ").setVisible(true);
        this.getView().byId("idHUStockOverviewQueryfirstbackbtn_HUSOQ").setVisible(true);
        this.getView().byId("idScforSecondHUStockOverviewQuery_HUSOQ").setVisible(false);
        this.getView().byId("idHUStockOverviewQuerySecondbackbtn_HUSOQ").setVisible(false);
      },
      //on clicking on HUQUERYLIST button
      onPressHUQueryList: function () {
        debugger;

        // Get the input value from the input field
        var oView = this.getView();
        var sHUNumber = oView.byId("idBinNumberInput_HUSOQ_HUSOQ").getValue();

        sHUNumber = sHUNumber.toUpperCase();

        this.sHUNumber = sHUNumber;

        // Call your backend service to fetch products for this bin
        var oModel = this.getOwnerComponent().getModel(); // Assuming you have a model set up
        var that = this;
        var sRequestUrl = `/HandlingUnitNHSet('${sHUNumber}')`;
        oModel.read(sRequestUrl, {
          urlParameters: {
            "$expand": "HUheadtoItems",
            "$format": "json"
          },

          success: function (odata) {

            console.log(odata)

            if (odata.Tophu === sHUNumber) {

              that.getView().byId("idScforSecondHUStockOverviewQuery_HUSOQ").setVisible(false);
              that.getView().byId("idHUStockOverviewQuerySecondbackbtn_HUSOQ").setVisible(false);
              that.getView().byId("idHUStockOverviewQueryThirdbackbtn_HUSOQ").setVisible(true);
              that.getView().byId("idScforThirdHUStockOverviewQuery_HUSOQ").setVisible(true);
              that.getView().byId("idBinNumberforlabelInput_HUSOQ").setValue(sHUNumber);
              that.getView().byId("idBinNumberforbinnumbernput_HUSOQ").setValue(odata.NumIt);
              that.getView().byId("idBinNumbinnumbernput_HUSOQ").setValue(odata.NumHu);

              // Get the product details from the response
              let oDetails = odata.HUheadtoItems.results;

              that.getView().byId("idBinNumberforbinnumbernput_HUSOQ").setValue(oDetails[0].NumIt);
              that.getView().byId("idBinNumbinnumbernput_HUSOQ").setValue(oDetails[0].NumHu);
              that.getView().byId("idBinNumbeerInput_HUSOQ").setValue(odata.Top);

              // Prepare an array for binding
              var aProductDetails = [];

              // Loop through the results and push them into the array
              for (var i = 0; i < oDetails.length; i++) {
                if (oDetails[i].Huident) {
                  aProductDetails.push({
                    Huident: oDetails[i].Huident,
                    Matnr: oDetails[i].Matnr,
                  });
                }
              }
              // Create a JSON model with the product details array
              var oProductModel = new sap.ui.model.json.JSONModel({ products: aProductDetails });

              // Set the model to the table
              that.byId("idTable_HUSOQ").setModel(oProductModel);

              // Bind the items aggregation of the table to the products array in the model
              that.byId("idTable_HUSOQ").bindItems({
                path: "/products",
                template: new sap.m.ColumnListItem({
                  cells: [
                    new sap.m.Text({ text: "{Huident}" }),  // Product Number
                    new sap.m.Text({ text: "{Matnr}" })   // Quantity

                    // UOM
                  ],
                  type: "Navigation",
               press: [that.onSelectProduct, that]
                })
              });
            }
             else {
              
              that.getView().byId("idScforSecondHUStockOverviewQuery_HUSOQ").setVisible(false);
              that.getView().byId("idHUStockOverviewQuerySecondbackbtn_HUSOQ").setVisible(false);
              that.getView().byId("idHUStockOverviewQueryThirdbackbtn_HUSOQ").setVisible(true);
              that.getView().byId("idScforThirdHUStockOverviewQuery_HUSOQ").setVisible(true);
              that.getView().byId("idBinNumberforlabelInput_HUSOQ").setValue(sHUNumber);
              that.getView().byId("idBinNumberforbinnumbernput_HUSOQ").setValue(odata.NumIt);
              that.getView().byId("idBinNumbinnumbernput_HUSOQ").setValue(odata.NumHu);


              // Get the product details from the response
              let oDetails = odata.HUheadtoItems.results;

              oDetails = oDetails.filter(item => item.Huident == sHUNumber);

              that.getView().byId("idBinNumberforbinnumbernput_HUSOQ").setValue(oDetails[0].NumIt);
              that.getView().byId("idBinNumbinnumbernput_HUSOQ").setValue(oDetails[0].NumHu);
              that.getView().byId("idBinNumbeerInput_HUSOQ").setValue(odata.Top);

              // Prepare an array for binding
              var aProductDetails = [];

              // Loop through the results and push them into the array
              for (var i = 0; i < oDetails.length; i++) {
                if (oDetails[i].Huident) {
                  aProductDetails.push({
                    Huident: oDetails[i].Huident,
                    Matnr: oDetails[i].Matnr,
                  });
                }
              }
              // Create a JSON model with the product details array
              var oProductModel = new sap.ui.model.json.JSONModel({ products: aProductDetails });

              // Set the model to the table
              that.byId("idTable_HUSOQ").setModel(oProductModel);

              // Bind the items aggregation of the table to the products array in the model
              that.byId("idTable_HUSOQ").bindItems({
                path: "/products",
                template: new sap.m.ColumnListItem({
                  cells: [
                    new sap.m.Text({ text: "{Huident}" }),  // Product Number
                    new sap.m.Text({ text: "{Matnr}" })   // Quantity

                    // UOM
                  ],
                type: "Navigation",
               press: [that.onSelectProduct, that]
                })
              });
            }
          },
          error: function () {
            sap.m.MessageToast.show("Error fetching products.");
          }
        });

      },
      //on clicking on back button from third screen 
      onHUStockOverviewQueryThirdBackBtnPress: function () {
        this.getView().byId("idScforSecondHUStockOverviewQuery_HUSOQ").setVisible(true);
        this.getView().byId("idHUStockOverviewQuerySecondbackbtn_HUSOQ").setVisible(true);
        this.getView().byId("idHUStockOverviewQueryThirdbackbtn_HUSOQ").setVisible(false);
        this.getView().byId("idScforThirdHUStockOverviewQuery_HUSOQ").setVisible(false);
      },
      //on clicking on HU information button
      onPressHUINformationPress: function () {
       debugger;
        // Get the input value from the input field
        var oView = this.getView();
        var sHUNumber = oView.byId("idBinNumberforlabelInput_HUSOQ").getValue();

        sHUNumber = sHUNumber.toUpperCase();

        this.sHUNumber = sHUNumber;

        // Call your backend service to fetch products for this bin
        var oModel = this.getOwnerComponent().getModel(); // Assuming you have a model set up
        var that = this;
        var sRequestUrl = `/HandlingUnitNHSet('${sHUNumber}')`;
        oModel.read(sRequestUrl, {
          urlParameters: {
            "$expand": "HUheadtoItems",
            "$format": "json"
          },

          success: function (odata) {
            debugger;

            console.log(odata)
            if (odata.Tophu === sHUNumber) {
              that.getView().byId("idHUStockOverviewQueryFourthbackbtn_HUSOQ").setVisible(true);
              that.getView().byId("idScforFourthHUStockOverviewQuery_HUSOQ").setVisible(true);
              that.getView().byId("idHUStockOverviewQueryThirdbackbtn_HUSOQ").setVisible(false);
              that.getView().byId("idScforThirdHUStockOverviewQuery_HUSOQ").setVisible(false);
              that.getView().byId("idBinNumberforlabelInput_HUSOQ").setValue(sHUNumber);


              let oDetails = odata.HUheadtoItems.results;

              that.getView().byId("inputPkmt").setValue(odata.Pmat);
              that.getView().byId("inputHtyp").setValue(odata.Letyp);
              that.getView().byId("inputTotw1").setValue(odata.GWeight);
              that.getView().byId("inputTotw2").setValue(odata.UnitGw);
              that.getView().byId("inputTotv1").setValue(odata.GVolume);
              that.getView().byId("inputTotv2").setValue(odata.UnitGv);
              that.getView().byId("inputMaxW").setValue(odata.MaxWeight);
              that.getView().byId("inputMaxV").setValue(odata.MaxVolume);
              that.getView().byId("inputTarW").setValue(odata.TWeight);
              that.getView().byId("inputTarV").setValue(odata.TVolume);
              that.getView().byId("inputEr1").setValue(odata.Length);
              that.getView().byId("inputEr2").setValue(odata.Width);
              that.getView().byId("inputEr3").setValue(odata.Height);
              that.getView().byId("inputEr4").setValue(odata.UnitLwh);
              that.getView().byId("inputTop").setValue(odata.Top);
              that.getView().byId("inputLwst").setValue(odata.Bottom);
              that.getView().byId("inputMove").setValue(odata.Flgmove);
              that.getView().byId("inputStat1").setValue(odata.Phystat);
              that.getView().byId("inputStat2").setValue(odata.HazmatInd);
              that.getView().byId("inputBin1").setValue(odata.Wsbin);
              that.getView().byId("inputCGrp").setValue(odata.Dstgrp);

            } else {
              that.getView().byId("idHUStockOverviewQueryFourthbackbtn_HUSOQ").setVisible(true);
              that.getView().byId("idScforFourthHUStockOverviewQuery_HUSOQ").setVisible(true);
              that.getView().byId("idHUStockOverviewQueryThirdbackbtn_HUSOQ").setVisible(false);
              that.getView().byId("idScforThirdHUStockOverviewQuery_HUSOQ").setVisible(false);
              that.getView().byId("idBinNumberforlabelInput_HUSOQ").setValue(sHUNumber);


              let oDetails = odata.HUheadtoItems.results;

              that.getView().byId("inputPkmt").setValue(odata.Pmat);
              that.getView().byId("inputHtyp").setValue(odata.Letyp);
              that.getView().byId("inputTotw1").setValue(odata.GWeight);
              that.getView().byId("inputTotw2").setValue(odata.UnitGw);
              that.getView().byId("inputTotv1").setValue(odata.GVolume);
              that.getView().byId("inputTotv2").setValue(odata.UnitGv);
              that.getView().byId("inputMaxW").setValue(odata.MaxWeight);
              that.getView().byId("inputMaxV").setValue(odata.MaxVolume);
              that.getView().byId("inputTarW").setValue(odata.TWeight);
              that.getView().byId("inputTarV").setValue(odata.TVolume);
              that.getView().byId("inputEr1").setValue(odata.Length);
              that.getView().byId("inputEr2").setValue(odata.Width);
              that.getView().byId("inputEr3").setValue(odata.Height);
              that.getView().byId("inputEr4").setValue(odata.UnitLwh);
              that.getView().byId("inputTop").setValue(odata.Top);
              that.getView().byId("inputLwst").setValue(odata.Bottom);
              that.getView().byId("inputMove").setValue(odata.Flgmove);
              that.getView().byId("inputStat1").setValue(odata.Phystat);
              that.getView().byId("inputStat2").setValue(odata.HazmatInd);
              that.getView().byId("inputBin1").setValue(odata.Wsbin);
              that.getView().byId("inputCGrp").setValue(odata.Dstgrp);


            }
          },
          error: function () {
            sap.m.MessageToast.show("Error fetching products.");
          }
        });

      },
      //On clicking on back button from fourth screen
      onHUStockOverviewQueryFourthBackBtnPress: function () {
        this.getView().byId("idHUStockOverviewQueryFourthbackbtn_HUSOQ").setVisible(false);
        this.getView().byId("idScforFourthHUStockOverviewQuery_HUSOQ").setVisible(false);
        this.getView().byId("idHUStockOverviewQueryThirdbackbtn_HUSOQ").setVisible(true);
        this.getView().byId("idScforThirdHUStockOverviewQuery_HUSOQ").setVisible(true);

      },
      //onclicking on HU query prod info button
      onSelectProduct: function (oEvent) {
        debugger;

        var oView = this.getView();
        var sHUNumber = oView.byId("idBinNumberforlabelInput_HUSOQ").getValue();

        sHUNumber = sHUNumber.toUpperCase();

        this.sHUNumber = sHUNumber;

        // Check if bin number is provided
        if (!sHUNumber) {
          sap.m.MessageToast.show("Please enter a hu number.");
          return;
        }

        // Call your backend service to fetch products for this bin
        var oModel = this.getOwnerComponent().getModel(); // Assuming you have a model set up
        var that = this;
        var sRequestUrl = `/HandlingUnitNHSet('${sHUNumber}')`;
        oModel.read(sRequestUrl, {
          urlParameters: {
            "$expand": "HUheadtoItems",
            "$format": "json"
          },

          success: function (odata) {

            debugger;

            console.log(odata)

            var aMaterials = odata.HUheadtoItems.results;
 
            var sSelectedMatnr = oEvent.getSource().getBindingContext().getProperty("Matnr");
            var sSelectedHu = oEvent.getSource().getBindingContext().getProperty("Huident");
   
            var oSelectedMaterial = aMaterials.find(function (material) {
   
              return (material.Matnr === sSelectedMatnr && material.Huident === sSelectedHu);
            });


            if (oSelectedMaterial) {
              that.getView().byId("idHUStockOverviewQueryFifthbackbtn_HUSOQ").setVisible(true);
              that.getView().byId("idScforFifthHUStockOverviewQuery_HUSOQ").setVisible(true);
              that.getView().byId("idHUStockOverviewQueryThirdbackbtn_HUSOQ").setVisible(false);
              that.getView().byId("idScforThirdHUStockOverviewQuery_HUSOQ").setVisible(false);


              let oDetails = odata.HUheadtoItems.results;

              that.getView().byId("inputPro").setValue(oDetails[0].Matnr);
              that.getView().byId("inputProSmall").setValue(oDetails[0].HazmatInd);
              that.getView().byId("inputLarge").setValue(oDetails[0].Maktx);
              that.getView().byId("inputStyp").setValue(oDetails[0].Wstyp);
              that.getView().byId("inputBin").setValue(oDetails[0].Wsbin);
              that.getView().byId("inputAqty").setValue(oDetails[0].Nista);
              that.getView().byId("inputAqtySmall").setValue(oDetails[0].Altme);
              that.getView().byId("inputBtch").setValue(oDetails[0].Batch);
              that.getView().byId("inputBtchSmall").setValue(oDetails[0].Brestr);
              that.getView().byId("inputStyp2").setValue(oDetails[0].Cat);
              that.getView().byId("inputOwnr").setValue(oDetails[0].Owner);
              that.getView().byId("inputPent").setValue(oDetails[0].Entitled);
              that.getView().byId("inputMisc1").setValue(oDetails[0].StockDoccat);
              that.getView().byId("inputMisc2").setValue(oDetails[0].StockDocno);
              that.getView().byId("inputMisc3").setValue(oDetails[0].StockItmno);
            }

          },
          error: function () {
            sap.m.MessageToast.show("Error fetching products.");
          }
        });
      },
      //on clicking on back button from fifth screen 
      onHUStockOverviewQueryFifthBackBtnPress: function () {
        this.getView().byId("idHUStockOverviewQueryFifthbackbtn_HUSOQ").setVisible(false);
        this.getView().byId("idScforFifthHUStockOverviewQuery_HUSOQ").setVisible(false);
        this.getView().byId("idHUStockOverviewQueryThirdbackbtn_HUSOQ").setVisible(true);
        this.getView().byId("idScforThirdHUStockOverviewQuery_HUSOQ").setVisible(true);
      },
      getStatusText: function (statusCode) {
        if (typeof statusCode === 'boolean') {
          return statusCode ? 'yes' : 'No';
        }
      },
      onScanSuccess__HUSOQ: function (oEvent) {
        // Get the scanned bin number from the event
        var sScannedHu = oEvent.getParameter("text");
        this.getView().byId("idinput_HUSOQ").setValue(sScannedHu);
        this.onSubmitButtonPress();
      },
    });
  }
);

