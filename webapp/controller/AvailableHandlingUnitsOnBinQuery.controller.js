sap.ui.define(
    [
        //"sap/ui/core/mvc/Controller",
        "./BaseController",
        "sap/ui/Device"
    
    ],
    function (BaseController,Device) {
        "use strict";

        return BaseController.extend("com.app.rfapp.controller.AvailableHandlingUnitsOnBinQuery", {
            onInit: function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);


                this._debouncedValidate = this._debounce(this._validateBinNumber.bind(this), 500); // 500ms delay


                if (Device.system.phone) {
                    this.getView().byId("idBinNumTable_AHUOBQ").setWidth("200%");
                    this.getView().byId("idBinNumTable_AHUOBQ").addStyleClass("MobileviewTable_HUSOQ");
                   
                }
            },

            onLiveChange: function (oEvent) {
                var sValue = oEvent.getSource().getValue().trim();
                this._debouncedValidate(sValue);
            },
            
            _validateBinNumber: function (sBinNumber) {
                if (!sBinNumber) {
                    this._showErrorMessage("Please enter a bin number.");
                    return;
                }
            
                // Call backend service to check if bin number is valid
                var oModel = this.getView().getModel();
                var that = this;
            
                oModel.read(`/BINQItemSet('${sBinNumber}')`, {
                    urlParameters: {
                        "$expand": "BINQHeadSet",
                        "$format": "json"
                    },
                    success: function (odata) {
                        if (odata.Lgpla === sBinNumber) {
                            // Clear any error message before proceeding
                            sap.m.MessageToast.show("", { duration: 0 });
            
                            // Navigate to the next screen
                            that.getView().byId("idPage1_AHUOBQ").setVisible(false);
                            that.getView().byId("idPage2BinNoTable_AHUOBQ").setVisible(true);
                            that.getView().byId("idBinNumberInput_AHUOBQ").setValue(sBinNumber);
            
                            // Populate product details in the table
                            let oDetails = odata.BINQHeadSet.results;

                            let aProductDetails = oDetails.map(detail => ({
                                Huident: detail.Huident,
                                Matnr: detail.Matnr,
                                Flgmove: that.getStatusText(detail.Flgmove)
                            }));
            
                            // Set data in the table's model
                            var oProductModel = new sap.ui.model.json.JSONModel({ products: aProductDetails });
                            that.byId("idBinNumTable_AHUOBQ").setModel(oProductModel);
                            that.byId("idBinNumTable_AHUOBQ").bindItems({
                                path: "/products",
                                template: new sap.m.ColumnListItem({
                                    cells: [
                                        new sap.m.Text({ text: "{Huident}" }),
                                        new sap.m.Text({ text: "{Matnr}" }),
                                        new sap.m.Text({ text: "{Flgmove}" })
                                    ]
                                })
                            });
                        } else {
                            // Show error message if bin number is invalid
                            sap.m.MessageToast.show("Enter a valid bin number.", { duration: 3000 });
                        }
                    },
                    error: function () {
                        that._showErrorMessage("Error fetching products.");
                    }
                });
            },

            
            _debounce: function (fn, delay) {
                var timeout;
                return function (...args) {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => fn(...args), delay);
                };
            },
            
            _showErrorMessage: function (message) {
                sap.m.MessageToast.show(message, { duration: 3000 });
            },
            
            //Avata Press function with Helper function...
            onPressAvatarAHUOBQ: function (oEvent) {
                this.onPressAvatarEveryTileHelperFunction(oEvent);
            },

            onResourceDetailsLoad: async function (oEvent1) {
                const { id } = oEvent1.getParameter("arguments");
                this.ID = id;
                //Profile image updating(from BaseController)...
                this.applyStoredProfileImage();
            },

            onAfterRendering: function () {
                this.byId("idPage1_AHUOBQ").setVisible(true);
            },

            onScanSuccess_AHUOBQ: function (oEvent) {
                console.log("Scan success triggered with data:", oEvent.getParameter("text"));
                var sScannedBinNumber = oEvent.getParameter("text");
                if (sScannedBinNumber) {

                    this.byId("idInput_AHUOBQ").setValue(sScannedBinNumber);
                    this._validateBinNumber(sScannedBinNumber);
                    sap.m.MessageToast.show("Bin number scanned successfully: " + sScannedBinNumber, { duration: 3000 });
                } else {

                    sap.m.MessageToast.show("Invalid barcode scanned.", { duration: 3000 });

                }
            },
            onScanError_AHUOBQ: function (oEvent) {
                console.error("Scan error triggered", oEvent);
                sap.m.MessageToast.show("Scanning failed. Please try again.", { duration: 3000 });
            },

            //Back Btn from 1st ScrollContainer Page 1 =>idPage1_AHUOBQ
            onPressBackBtnPage1_AHUOBQ: async function () {
                var oRouter = this.getOwnerComponent().getRouter();
                var oModel1 = this.getOwnerComponent().getModel();
                await oModel1.read("/RESOURCESSet('" + this.ID + "')", {
                    success: function (oData) {
                        if (oData.Users === "RESOURCE") {
                            oRouter.navTo("RouteResourcePage", { id: this.ID });
                            this.getView().byId("idInput_AHUOBQ").setValue("")
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
            //Back Btn from ScrollContainer Page 2 =>idPage2BinNoTable_AHUOBQ 
            onBackPressBinNumbersTable: function () {
                var oScrollContainer1 = this.byId("idPage1_AHUOBQ");
                var oScrollContainer2 = this.byId("idPage2BinNoTable_AHUOBQ");

                // show the Scanner form VBox
                oScrollContainer1.setVisible(true);

                //Hide the HUDetails scroll container
                oScrollContainer2.setVisible(false);
            },
            //Back Btn from ScrollContainer Page 3 =>idPage3HUContents_AHUOBQ 
            onBackPressHUContentsAHUOBQ: function () {
                var oScrollContainer3 = this.byId("idPage3HUContents_AHUOBQ");
                var oScrollContainer2 = this.byId("idPage2BinNoTable_AHUOBQ");

                // show the Table Contents
                oScrollContainer2.setVisible(true);

                //Hide the HUContents scroll container
                oScrollContainer3.setVisible(false);
            },
            //Back Btn from ScrollContainer Page 4 =>idPage4PrdDecsription_AHUOBQ 
            onBackPressProductDescription: function () {
                var oScrollContainer4 = this.byId("idPage4PrdDecsription_AHUOBQ");
                var oScrollContainer2 = this.byId("idPage2BinNoTable_AHUOBQ");

                // show the Table Contents
                oScrollContainer2.setVisible(true);

                //Hide the Product Description scroll container
                oScrollContainer4.setVisible(false);
            },
            
            // //Submit Btn from ScrollContainer Page 1=> idPage1_AHUOBQ..
            // onSubmitPress_AHUOBQ: function () {
              
            //     // Get the input value from the input field
            //     var oView = this.getView();
            //     var sBinNumber = oView.byId("idInput_AHUOBQ").getValue();
            //     this.sBinNumber = sBinNumber;
          
            //     // Check if bin number is provided
            //     if (!sBinNumber) {
            //       sap.m.MessageToast.show("Please enter a bin number.");
            //       return;
            //     }
          
            //     // Call your backend service to fetch products for this bin
            //     var oModel = this.getView().getModel(); // Assuming you have a model set up
            //     var that = this;
          
            //     oModel.read(`/BINQItemSet('${sBinNumber}')`, {
            //       urlParameters: {
            //         "$expand": "BINQHeadSet",
                    
            //         "$format": "json"
            //       },
          
            //       success: function (odata) {
            //         console.log(odata);
            //         if(odata.Lgpla === sBinNumber) {
            //         that.getView().byId("idPage1_AHUOBQ").setVisible(false);
            //         that.getView().byId("idPage2BinNoTable_AHUOBQ").setVisible(true);
            //         that.getView().byId("idBinNumberInput_AHUOBQ").setValue(sBinNumber);
          
            //         // Get the product details from the response
            //         let oDetails = odata.BINQHeadSet.results;
          
            //         // Prepare an array for binding
            //         var aProductDetails = [];
          
            //         // Loop through the results and push them into the array
            //         for (var i = 0; i < oDetails.length; i++) {
            //           if (oDetails[i].Huident) {
            //             aProductDetails.push({
            //                 Huident: oDetails[i].Huident,
            //                 Matnr: oDetails[i].Matnr,
            //                 Flgmove: that.getStatusText(oDetails[i].Flgmove)
            //             });
            //           }
            //         }
          
                    
            //         // Create a JSON model with the product details array
            //         var oProductModel = new sap.ui.model.json.JSONModel({ products: aProductDetails });
          
            //         // Set the model to the table
            //         that.byId("idBinNumTable_AHUOBQ").setModel(oProductModel);
          
            //         // Bind the items aggregation of the table to the products array in the model
            //         that.byId("idBinNumTable_AHUOBQ").bindItems({
            //           path: "/products",
            //           template: new sap.m.ColumnListItem({
            //             cells: [
            //               new sap.m.Text({ text: "{Huident}" }),  // Hu
            //               new sap.m.Text({ text: "{Matnr}" }),   // 
            //               new sap.m.Text({ text: "{Flgmove}" })   // 
            //             ],
                      
            //           })
            //         });
            //     } else {
            //         sap.m.MessageToast.show("Enter a Valid Binnumber.");
            //     }
            //       },
            //       error: function () {
            //         sap.m.MessageToast.show("Error fetching products.");
            //       }
            //     });
            //   },

            
            onSelectionChange: function (oEvent) {
              // Get the selected item
              var oSelectedItem = oEvent.getParameter("listItem");
          
              if (oSelectedItem) {
                  // Get the binding context of the selected item
                  this._selectedRowContext = oSelectedItem.getBindingContext();
              } else {
                  // Deselecting the item
                  this._selectedRowContext = null;
              }
          },
        //   onChange: function (oEvent) {
        //     var oInput = oEvent.getSource();
        //     var sBinNumber = oInput.getValue().trim();
        
        //     // Check if bin number is provided
        //     if (!sBinNumber) {
        //         this._showErrorMessage("Please enter a bin number.");
        //         return;
        //     }
        
        //     // Call backend service to check if bin number is valid
        //     var oModel = this.getView().getModel();
        //     var that = this;
        
        //     oModel.read(`/BINQItemSet('${sBinNumber}')`, {
        //         urlParameters: {
        //             "$expand": "BINQHeadSet",
        //             "$format": "json"
        //         },
        //         success: function (odata) {
        //             if (odata.Lgpla === sBinNumber) {
        //                 // Clear any error message before proceeding
        //                 sap.m.MessageToast.show("", { duration: 0 }); 
        
        //                 // Bin number is valid, proceed to the next screen
        //                 that.getView().byId("idPage1_AHUOBQ").setVisible(false);
        //                 that.getView().byId("idPage2BinNoTable_AHUOBQ").setVisible(true);
        //                 that.getView().byId("idBinNumberInput_AHUOBQ").setValue(sBinNumber);
        
        //                 // Populate product details in the table
        //                 let oDetails = odata.BINQHeadSet.results;
        //                 let aProductDetails = oDetails.map(detail => ({
        //                     Huident: detail.Huident,
        //                     Matnr: detail.Matnr,
        //                     Flgmove: that.getStatusText(detail.Flgmove)
        //                 }));
        
        //                 // Set data in the table's model
        //                 var oProductModel = new sap.ui.model.json.JSONModel({ products: aProductDetails });
        //                 that.byId("idBinNumTable_AHUOBQ").setModel(oProductModel);
        //                 that.byId("idBinNumTable_AHUOBQ").bindItems({
        //                     path: "/products",
        //                     template: new sap.m.ColumnListItem({
        //                         cells: [
        //                             new sap.m.Text({ text: "{Huident}" }),
        //                             new sap.m.Text({ text: "{Matnr}" }),
        //                             new sap.m.Text({ text: "{Flgmove}" })
        //                         ]
        //                     })
        //                 });
        //             } else {
        //                 // Show error message if bin number is invalid
        //                 sap.m.MessageToast.show("Enter a valid bin number.", { duration: 3000 });
        //             }
        //         },
        //         error: function () {
        //             that._showErrorMessage("Error fetching products.");
        //         }
        //     });
        // },
        
        _showErrorMessage: function (message) {
            sap.m.MessageToast.show(message, { duration: 3000 });
        },
            //Prod Description Btn from ScrollContainer Page 2=>idPage2BinNoTable_AHUOBQ
            onPressProductDescriptionBtn: function (oEvent) {
              // Get the selected row's context from the table
              var oTable = this.byId("idBinNumTable_AHUOBQ"); // Replace with your table ID
              
              var oSelectedItem = oTable.getSelectedItem(); // Get selected item from the table
          
              if (!oSelectedItem) {
                  sap.m.MessageToast.show(" Please select a row.");
                  return;
              }
          
              var sSelectedMatnr = oSelectedItem.getBindingContext().getProperty("Matnr");
              
              // Check if the selected material number is valid
              if (!sSelectedMatnr) {
                  sap.m.MessageToast.show("There is no product available. Please select a row.");
                  return;
              }
          
              var oModel = this.getView().getModel();
          
              oModel.read(`/ProductHeadSet('${sSelectedMatnr}')`, {
                  urlParameters: {
                      "$expand": "ProductHeadtoItem",
                      "$format": "json"
                  },
                  success: (odata) => {
                      console.log(odata);
                      var aBindetails = odata.ProductHeadtoItem.results;
          
                      // Check if there are any details returned
                      if (aBindetails.length === 0) {
                          sap.m.MessageToast.show("No product details found for the selected item.");
                          return;
                      }
          
                      // Update the UI with the selected material's details
                      for (var i = 0; i < aBindetails.length; i++) {
                          if (aBindetails[i].Matnr === sSelectedMatnr) {
                             this.getView().byId("idProductDescription_AHUOBQ").setValue(odata.Maktx);
                              this.getView().byId("idTotalWeightInput_AHUOBQ").setValue(odata.GWeight);
                              this.getView().byId("idTotalValueInput_AHUOBQ").setValue(odata.GVolume);
                              this.getView().byId("idKGUnits_AHUOBQ").setValue(odata.UnitGw);
                              this.getView().byId("idInputL_AHUOBQ").setValue(odata.UnitGv);
                          }
                      }
          
                      // Show product description page and hide the previous table
                      this.byId("idPage4PrdDecsription_AHUOBQ").setVisible(true);
                      this.byId("idPage2BinNoTable_AHUOBQ").setVisible(false);
                  },
                  error: function () {
                      sap.m.MessageToast.show("Error fetching product details.");
                  }
              });
          },
          // On clicking HUContent Button
          onPressHUContentBtn: function () {

            debugger;

            var oView = this.getView();
            var sBinNumber = oView.byId("idInput_AHUOBQ").getValue();
            this.sBinNumber = sBinNumber;
            var oModel = oView.getModel();
        
            if (!this._selectedRowContext) {
                sap.m.MessageToast.show("Please select a row first.");
                return; // Exit if no row is selected
            }
        
            // Fetch HU Number and Product directly from the selected row
            var oSelectedItem = this._selectedRowContext.getObject();
            var sSelectedHuident = oSelectedItem.Huident; // HU Number from selected row
            var sSelectedProduct = oSelectedItem.Matnr; // Product from selected row
        
            // Set HU Number and Product in the respective input fields
            oView.byId("idHUNumInput_AHUOBQ").setValue(sSelectedHuident); // HU Number
            oView.byId("idHUProdNumInput_AHUOBQ").setValue(sSelectedProduct); // Product
        
            // Read additional data from the backend using the BinNumber
            oModel.read(`/BINQItemSet('${this.sBinNumber}')`, {
                urlParameters: {
                    "$expand": "BINQHeadSet",
                    "$format": "json"
                },
                success: function (odata) {
                    console.log(odata);
                    var aMaterials = odata.BINQHeadSet.results;
        
                    // Find the selected material using the HU Number
                    var oSelectedMaterial = aMaterials.find(function (material) {
                        return material.Huident === sSelectedHuident;
                    });
        
                    if (oSelectedMaterial) {
                        // Update the other fields with the selected material's details
                        oView.byId("idSectionInput_AHUOBQ").setValue(odata.Lgtyp); // Storage Type
                        oView.byId("idDocInputThirdPage_AHUOBQ").setValue(oSelectedMaterial.Docno); // Document Number
                        oView.byId("idQtyInputThirdPage_AHUOBQ").setValue(oSelectedMaterial.Quan); // Quantity
                        oView.byId("idBinInputThirdPage_AHUOBQ").setValue(oSelectedMaterial.Owner); // Owner
                    } else {
                        sap.m.MessageToast.show("Material not found.");
                    }
        
                    // Hide the current table and show the HU content section
                    oView.byId("idPage2BinNoTable_AHUOBQ").setVisible(false);
                    oView.byId("idPage3HUContents_AHUOBQ").setVisible(true);
                },
                error: function () {
                    sap.m.MessageToast.show("Error fetching products.");
                }
            });
        },
        getStatusText: function (statusCode) {
            if (typeof statusCode === 'boolean') {
              return statusCode ? 'yes' : 'No';
          }
        }
        });
    }
);
