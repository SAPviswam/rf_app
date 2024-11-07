sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device",
    "sap/ui/core/UIComponent",
], function (Controller, Device, UIComponent) {
 
    "use strict";
 
    return Controller.extend("com.app.rfapp.controller.HuQuery", {
 
        // Initializing the controller
        onInit: function () {
            const oRouter = this.getOwnerComponent().getRouter();  // Getting the router object
            oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this); // Attach a route event to handle route changes
           
            // Setting up the UI model for the view
            var oProductDescriptionHeader = this.byId("idPrDesText_HuQuery");  // Get Product Description header element
            var oModel = new sap.ui.model.json.JSONModel(sap.ui.require.toUrl("com/app/rfapp/model/data1.json")); // Create JSON model with data from 'data1.json'
            this.getView().setModel(oModel);  // Set the model for the view
           
            // Setting up i18n model for language-specific resources
            var i18nModel = this.getOwnerComponent().getModel("i18n");  // Fetch i18n model
            var oQuantityHeader = this.byId("idQuanText_HuQuery");  // Get Quantity header element
            var oHigherLevelHu = this.byId("idHlHuLabel_HuQuery");  // Get Higher Level HU label
            var oHighestLevelHu = this.byId("idHlestHuLabel_HuQuery");  // Get Highest Level HU label
 
            // Conditional text for mobile devices (phone)
            if (Device.system.phone) {
                oQuantityHeader.setText(i18nModel.getResourceBundle().getText("qty"));
                oProductDescriptionHeader.setText(i18nModel.getResourceBundle().getText("pr.des"));
                oHigherLevelHu.setText(i18nModel.getResourceBundle().getText("hlHu"));
                oHighestLevelHu.setText(i18nModel.getResourceBundle().getText("hstlHu"));
            } else {
                oQuantityHeader.setText(i18nModel.getResourceBundle().getText("quantity"));
                oProductDescriptionHeader.setText(i18nModel.getResourceBundle().getText("productdescription"));
                oHigherLevelHu.setText(i18nModel.getResourceBundle().getText("higherLevelHu"));
                oHighestLevelHu.setText(i18nModel.getResourceBundle().getText("highestLevelHu"));
            }
        },
 
        // Handler for selecting a particular warehouse transfer (WT)
        onSelectParticularWT: async function (oEvent) {
            const { HU } = oEvent.getSource().getSelectedItem().getBindingContext().getObject();  // Get the HU value
            console.log(HU);  // Log the HU value for debugging
            this.onSelectRow(HU);  // Call onSelectRow with the HU value
        },
 
        // Function to handle selection of a row (HU)
        onSelectRow: function (oHui) {
            this.getView().byId("idFourthSc_HuQuery").setVisible(false);  // Hide fourth screen
            this.getView().byId("idSecondSc_HuQuery").setVisible(true);  // Show second screen
 
            if (oHui) {
                // Call OData service to validate the HU value
                var oModel = this.getOwnerComponent().getModel();
                var that = this;
 
                oModel.read(`/HudetailsSet('${oHui}')`, {
                    urlParameters: {
                        "$expand": "Hudetails_ItemSet",  // Expand the related details set
                        "$format": "json"  // Fetch response in JSON format
                    },
                    success: function (odata) {
                        that._populateHUDetails(odata);  // Populate HU details on success
                    },
                    error: function (oError) {
                        // Handle error if HU is not found    
                    }
                });
            } else {
                // Reset the view if input is cleared
                this.getView().byId("idSecondSc_HuQuery").setVisible(false);
                this.getView().byId("idFirstSc_HuQuery").setVisible(true);
            }
        },
 
        // Load resource details on route pattern match
        onResourceDetailsLoad: function (oEvent1) {
            const { id } = oEvent1.getParameter("arguments");  // Retrieve the ID from route arguments
            this.ID = id;  // Save ID for later use
        },
 
        // Scan success handler for barcode scanning
        onScanSuccess: function (oEvent) {
            var scannedText = oEvent.getParameter("text");  // Get the scanned text
            var othis = this;
 
            if (oEvent.getParameter("cancelled")) {
                // Show a message toast if scan was cancelled
                sap.m.MessageToast.show("Scan cancelled", { duration: 1000 });
            } else if (scannedText) {
                // Update input field with the scanned text
                var oInput = this.byId("idScanHuInput_HuQuery");
                oInput.setValue(scannedText);
                sap.m.MessageToast.show("Scanned successfully: " + scannedText);  // Show a success message
                othis.onLiveHuProcess(scannedText);  // Process the scanned HU
            } else {
                // Show a message if no barcode text found
                this.byId("idScanHuInput_HuQuery").setValue("");
                sap.m.MessageToast.show("No barcode text found", { duration: 1000 });
            }
        },
 
        // Live validation logic for HU input
        onLiveHuValidation: function (oEvent) {
            var oInput = oEvent.getSource();
            var oHuValue = oInput.getValue().trim();  // Get and trim the HU input value
 
            if (oHuValue) {
                // Call OData service to validate the HU value
                var oModel = this.getOwnerComponent().getModel();
                var that = this;
 
                oModel.read(`/HudetailsSet('${oHuValue}')`, {
                    urlParameters: {
                        "$expand": "Hudetails_ItemSet",  // Expand related details
                        "$format": "json"  // Get response in JSON format
                    },
                    success: function (odata) {
                        that.getView().byId("idSecondSc_HuQuery").setVisible(true);  // Show second screen
                        that.getView().byId("idFirstSc_HuQuery").setVisible(false);  // Hide first screen
                        that._populateHUDetails(odata);  // Populate HU details
                    },
                    error: function (oError) {
                        // Handle error if HU is not found
                    }
                });
            } else {
                // Reset view if input is cleared
                this.getView().byId("idSecondSc_HuQuery").setVisible(false);
                this.getView().byId("idFirstSc_HuQuery").setVisible(true);
            }
        },
 
        // Function to populate HU details on success
        _populateHUDetails: function (odata) {
            this.byId("idHuInput_HuQuery").setValue(odata.Tophu);
            this.byId("idHuTypeInput_HuQuery").setValue(odata.Letyp);
            this.byId("idLenInput_HuQuery").setValue(odata.Length);
            this.byId("idWidthInput_HuQuery").setValue(odata.Width);
            this.byId("idHeightInput_HuQuery").setValue(odata.Height);
            this.byId("idTareWtInput_HuQuery").setValue(odata.TWeight);
            this.byId("idNetWtInput_HuQuery").setValue(odata.NWeight);
            this.byId("idGWtInput_HuQuery").setValue(odata.GWeight);
            this.byId("idUnitInput_HuQuery").setValue(odata.UnitGw);
            this.byId("_IDGenInputMesurement").setValue(odata.UnitLwh);
            this.byId("_IDGenInputMesurement").setValue(odata.GVolume);
            this.byId("idPackagingMaterialInput_HuQuery").setValue(odata.Pmat);
            this.byId("idLocInput_HuQuery").setValue(odata.Vlpla);
        },
 
        // Handler for pressing the "Back" button from the first screen
        onPressBackButtonFirstSC: async function () {
            var oRouter = UIComponent.getRouterFor(this);  // Get the router
            var oModel1 = this.getOwnerComponent().getModel();  // Get the OData model
 
            // Fetch resource details from OData service
            await oModel1.read("/RESOURCESSet('" + this.ID + "')", {
                success: function (oData) {
                    let oUser = oData.Users.toLowerCase();  // Get user role
                    if (oUser === "resource") {
                        oRouter.navTo("RouteResourcePage", { id: this.ID });  // Navigate to Resource page
                    } else {
                        oRouter.navTo("Supervisor", { id: this.ID });  // Navigate to Supervisor page
                    }
                }.bind(this),
                error: function () {
                    MessageToast.show("User does not exist");  // Show error if user doesn't exist
                }
            });
        },
 
        // Back button handlers for second, third, and fourth screens
        onPressBackButtonSecondSC: function () {
            this.getView().byId("idFirstSc_HuQuery").setVisible(true);  // Show first screen
            this.getView().byId("idSecondSc_HuQuery").setVisible(false);  // Hide second screen
        },
        onPressBackButtonThirdSC: function () {
            this.getView().byId("idSecondSc_HuQuery").setVisible(true);  // Show second screen
            this.getView().byId("idThirdSc_HuQuery").setVisible(false);  // Hide third screen
        },
        onPressBackButtonFourthSC: function () {
            this.getView().byId("idSecondSc_HuQuery").setVisible(true);  // Show second screen
            this.getView().byId("idFourthSc_HuQuery").setVisible(false);  // Hide fourth screen
        },
 
        // Handler for HU content press
        onHUContentPress: function () {
            var oHu = this.getView().byId("idHuInput_HuQuery").getValue();  // Get HU input value
            var oModel = this.getOwnerComponent().getModel();  // Get the OData model
            var that = this;
 
            // Call OData service to fetch HU details
            oModel.read(`/HudetailsSet('${oHu}')`, {
                urlParameters: {
                    "$expand": "Hudetails_ItemSet",  // Expand related items
                    "$format": "json"  // Response format JSON
                },
                success: function (odata) {
                    if (odata.Top === true) {
                        // Handle case where HU is a top-level HU
                        let oDetails = odata.Hudetails_ItemSet.results;
                        console.log(oDetails);  // Log the product details
 
                        // Prepare an array for binding to the table
                        var aProductDetails = [];
                        for (var i = 0; i < oDetails.length; i++) {
                            aProductDetails.push({
                                Product: oDetails[i].Matnr,
                                Quantity: oDetails[i].Quan,
                                SLNO: i + 1,
                                Uom: oDetails[i].Meins,
                                Pd: oDetails[i].Maktx
                            });
                        }
 
                        // Set model to the product details table
                        var oProductModel = new sap.ui.model.json.JSONModel({ products: aProductDetails });
                        that.byId("HuDetailsTable_HuQuery").setModel(oProductModel);
 
                        // Bind table items to the product details model
                        that.byId("HuDetailsTable_HuQuery").bindItems({
                            path: "/products",
                            template: new sap.m.ColumnListItem({
                                cells: [
                                    new sap.m.Text({ text: "{SLNO}" }),
                                    new sap.m.Text({ text: "{Product}" }),
                                    new sap.m.Text({ text: "{Quantity}" }),
                                    new sap.m.Text({ text: "{Uom}" }),
                                    new sap.m.Text({ text: "{Pd}" }),
                                ]
                            })
                        });
                    } else {
                        // Handle case for non-top-level HU
                        let oDetails = odata.Hudetails_ItemSet.results;
                        console.log(oDetails);  // Log details
                        oDetails = oDetails.filter(item => item.HuidentI == oHu);  // Filter based on HU identifier
 
                        // Prepare array for binding
                        var aProductDetails = [];
                        for (var i = 0; i < oDetails.length; i++) {
                            aProductDetails.push({
                                Product: oDetails[i].Matnr,
                                Quantity: oDetails[i].Qty,
                                SLNO: i + 1,
                                Uom: oDetails[i].Meins,
                                Pd: oDetails[i].Maktx
                            });
                        }
 
                        // Set the model to the table and bind items
                        var oProductModel = new sap.ui.model.json.JSONModel({ products: aProductDetails });
                        that.byId("HuDetailsTable_HuQuery").setModel(oProductModel);
                        that.byId("HuDetailsTable_HuQuery").bindItems({
                            path: "/products",
                            template: new sap.m.ColumnListItem({
                                cells: [
                                    new sap.m.Text({ text: "{SLNO}" }),
                                    new sap.m.Text({ text: "{Product}" }),
                                    new sap.m.Text({ text: "{Quantity}" }),
                                    new sap.m.Text({ text: "{Uom}" }),
                                    new sap.m.Text({ text: "{Pd}" }),
                                ]
                            })
                        });
                    }
                },
                error: function (oError) {
                    // Handle error if HU not found
                    console.log(oError);  // Log the error
                }
            });
 
            // Switch to the third screen view
            this.getView().byId("idFirstSc_HuQuery").setVisible(false);
            this.getView().byId("idSecondSc_HuQuery").setVisible(false);
            this.getView().byId("idThirdSc_HuQuery").setVisible(true);
            this.getView().byId("idFourthSc_HuQuery").setVisible(false);
        },
 
        // Handler for HU hierarchy press
        onHUHierarchyPress: function () {
            var oHu = this.getView().byId("idHuInput_HuQuery").getValue();  // Get HU value
            var oModel = this.getOwnerComponent().getModel();  // Get OData model
            var that = this;
 
            // Call OData service to fetch HU hierarchy details
            oModel.read(`/HudetailsSet('${oHu}')`, {
                urlParameters: {
                    "$expand": "Hudetails_ItemSet",  // Expand related item set
                    "$format": "json"  // Response format JSON
                },
                success: function (odata) {
                    console.log(odata);  // Log the data response
                   
                    // Get the product details from the response
                    let oDetails = odata.Hudetails_ItemSet.results;
                    console.log(oDetails);  // Log the details
                   
                    // Prepare array for binding to the table
                    var aProductDetails = [];
                    for (var i = 0; i < oDetails.length; i++) {
                        aProductDetails.push({
                            HUI: oDetails[i].HuidentI,
                            HU: odata.Parent,
                            SLNO: i + 1
                        });
                    }
 
                    // Create a JSON model with the hierarchy details
                    var oProductModel = new sap.ui.model.json.JSONModel({ products: aProductDetails });
                    that.byId("idSimpleTable_HuQuery").setModel(oProductModel);
 
                    // Bind the table items to the hierarchy model
                    that.byId("idSimpleTable_HuQuery").bindItems({
                        path: "/products",
                        template: new sap.m.ColumnListItem({
                            cells: [
                                new sap.m.Text({ text: "{SLNO}" }),
                                new sap.m.Text({ text: "{HUI}" }),
                                new sap.m.Text({ text: "{HU}" }),
                            ]
                        })
                    });
                },
                error: function () {
                    sap.m.MessageToast.show("Error fetching products.");  // Show error message
                }
            });
 
            // Switch to fourth screen
            this.getView().byId("idFirstSc_HuQuery").setVisible(false);
            this.getView().byId("idSecondSc_HuQuery").setVisible(false);
            this.getView().byId("idThirdSc_HuQuery").setVisible(false);
            this.getView().byId("idFourthSc_HuQuery").setVisible(true);
        },
 
    });
});
 
 