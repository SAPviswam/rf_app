sap.ui.define([
    "./BaseController",
    "sap/ui/Device",
    "sap/ui/core/UIComponent",
    "sap/m/MessageToast"
], function (Controller, Device, UIComponent,MessageToast) {

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
                this.getView().byId("HuDetailsTable_HuQuery").setWidth("200%");
                this.getView().byId("idSimpleTable_HuQuery").setWidth("200%");
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
            const { HUI } = oEvent.getSource().getSelectedItem().getBindingContext().getObject();  // Get the HU value
            console.log(HUI);  // Log the HU value for debugging
            this.onSelectRow(HUI);  // Call onSelectRow with the HU value
        },
        onSignoutPressed:function(){
            var oRouter = this.getOwnerComponent().getRouter(this);
            oRouter.navTo("InitialScreen"); 
        },

        // Function to handle selection of a row (HU)
        onSelectRow: function (oHui) {
            this.getView().byId("idFourthSc_HuQuery").setVisible(false);  // Hide fourth screen
            this.getView().byId("idSecondSc_HuQuery").setVisible(true);  // Show second screen

            if (oHui) {
                // Call OData service to validate the HU value
                var oModel = this.getOwnerComponent().getModel();
                var that = this;

                oModel.read(`/HandlingUnitNHSet('${oHui}')`, {
                    urlParameters: {
                        "$expand": "HUheadtoItems",  // Expand the related details set
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
            this.applyStoredProfileImage();
        },
        onAvatarPressed: function (oEvent) {     
            this.onPressAvatarEveryTileHelperFunction(oEvent); 

            },

        // Scan success handler for barcode scanning
        // onScanSuccess: function(oEvent) {
        //     if (oEvent.getParameter("cancelled")) {
        //         MessageToast.show("Scan cancelled", { duration:1000 });
        //     } else {
        //         if (oEvent.getParameter("text")) {
        //             oScanResultText.setText(oEvent.getParameter("text"));
        //         } else {
        //             oScanResultText.setText('');
        //         }
        //     }
        // },
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
                othis.onLiveHuValidation(scannedText);  // Process the scanned HU
            } else {
                // Show a message if no barcode text found
                this.byId("idScanHuInput_HuQuery").setValue("");
                sap.m.MessageToast.show("No barcode text found", { duration: 1000 });
            }
            // var sScannedProduct = oEvent.getParameter("text");
            // this.getView().byId("idScanHuInput_HuQuery").setValue(sScannedProduct);
            // this.onLiveHuValidation();
        },


        // Live validation logic for HU input
        onLiveHuValidation: function (oHuValue) {
            if(oHuValue===this.getView().byId("idScanHuInput_HuQuery").getValue()){
                var oHuValue=oHuValue
            }
            else{
                var oInput = oHuValue.getSource();
            var oHuValue = oInput.getValue().trim();
            }
            // var oInput = oEvent.getSource();
            // var oHuValue = oInput.getValue().trim();  // Get and trim the HU input value

            if (oHuValue) {
                // Set a timeout of 1 second before calling the OData service
                setTimeout(function () {
                    // Call OData service to validate the HU value
                    var oModel = this.getOwnerComponent().getModel();
                    var that = this;

                    oModel.read(`/HandlingUnitNHSet('${oHuValue}')`, {
                        urlParameters: {
                            "$expand": "HUheadtoItems",  // Expand related details
                            "$format": "json"  // Get response in JSON format
                        },
                        success: function (odata) {
                            if (odata.HUheadtoItems.results.length > 0) {
                                sap.m.MessageToast.show("Scanned Succesfully"); 
                                that.getView().byId("idSecondSc_HuQuery").setVisible(true);  // Show second screen
                                that.getView().byId("idFirstSc_HuQuery").setVisible(false);  // Hide first screen
                                that._populateHUDetails(odata);  // Populate HU details
                            }
                            else{
                                sap.m.MessageToast.show("Please Enter correct Handling Unit"); 
                                that.getView().byId("idSecondSc_HuQuery").setVisible(false);  // Show second screen
                                that.getView().byId("idFirstSc_HuQuery").setVisible(true); 
                            }
                        },
                        error: function (oError) {
                            // Handle error if HU is not found
                            sap.m.MessageToast.show("Please Enter correct Handling Unit"); 
                        }
                    });
                }.bind(this), 2000);  // Delay of 1000ms (1 second)
            } else {
                // Reset view if input is cleared
                this.getView().byId("idSecondSc_HuQuery").setVisible(false);
                this.getView().byId("idFirstSc_HuQuery").setVisible(true);
                sap.m.MessageToast.show("Please Enter correct Handling Unit"); 
            }
        },


        // Function to populate HU details on success
        _populateHUDetails: function (odata) {
            this.byId("idHuInput_HuQuery").setValue(odata.Huident);
            this.byId("idPackagingMaterialInput_HuQuery").setValue(odata.Pmat);
            this.byId("idHuTypeInput_HuQuery").setValue(odata.Letyp);
            this.byId("idLocInput_HuQuery").setValue(odata.Wsbin);
            this.byId("idCGrpInput_HuQuery").setValue(odata.Dstgrp);
            this.byId("idTotalWeightInput_HuQuery").setValue(odata.GWeight);
            this.byId("idTotalWeightInput2_HuQuery").setValue(odata.UnitGw);
            this.byId("idVolumeInput_HuQuery").setValue(odata.GVolume);
            this.byId("idVolumeInput2_HuQuery").setValue(odata.UnitGv);
            this.byId("idTarWeightInput_HuQuery").setValue(odata.TWeight);
            this.byId("idTarVInput_HuQuery").setValue(odata.TVolume);
            this.byId("idMaxWeightInput_HuQuery").setValue(odata.MaxWeight);
            this.byId("idmaxVInput_HuQuery").setValue(odata.MaxVolume);
            
            this.byId("idLenInput_HuQuery").setValue(odata.Length);
            this.byId("idWidthInput_HuQuery").setValue(odata.Width);
            this.byId("idHeightInput_HuQuery").setValue(odata.Height);
            
            this.byId("idUnitsInput_HuQuery").setValue(odata.UnitLwh);
           
            
     
        },

        clear: function () {
            this.getView().byId("idScanHuInput_HuQuery").setValue();
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
            this.clear();
        },

        // Back button handlers for second, third, and fourth screens
        onPressBackButtonSecondSC: function () {
            this.getView().byId("idFirstSc_HuQuery").setVisible(true);  // Show first screen
            this.getView().byId("idSecondSc_HuQuery").setVisible(false);  // Hide second screen
            this.clear();
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
            oModel.read(`/HandlingUnitNHSet('${oHu}')`, {
                urlParameters: {
                    "$expand": "HUheadtoItems",  // Expand related items
                    "$format": "json"  // Response format JSON
                },
                success: function (odata) {
                    if (odata.Top === true || odata.Top.toUpperCase()==="X") {
                        // Handle case where HU is a top-level HU
                        let oDetails = odata.HUheadtoItems.results;
                        console.log(oDetails);  // Log the product details

                        // Prepare an array for binding to the table
                        var aProductDetails = [];
                        for (var i = 0; i < oDetails.length; i++) {
                            aProductDetails.push({
                                Product: oDetails[i].Matnr,
                                Quantity: parseFloat(oDetails[i].Nista),
                                SLNO: i + 1,
                                Uom: oDetails[i].Altme,
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
                        let oDetails = odata.HUheadtoItems.results;
                        console.log(oDetails);  // Log details
                        oDetails = oDetails.filter(item => item.Huident == oHu);  // Filter based on HU identifier

                        // Prepare array for binding
                        var aProductDetails = [];
                        for (var i = 0; i < oDetails.length; i++) {
                            aProductDetails.push({

                                Product: oDetails[i].Matnr,
                                Quantity: parseFloat(oDetails[i].Nista),
                                SLNO: i + 1,
                                Uom: oDetails[i].Altme,
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
            oModel.read(`/HandlingUnitNHSet('${oHu}')`, {
                urlParameters: {
                    "$expand": "HUheadtoItems",  // Expand related item set
                    "$format": "json"  // Response format JSON
                },
                success: function (odata) {
                    debugger
                    if (odata.Tophu === oHu) {
                    console.log(odata);  // Log the data response

                    // Get the product details from the response
                    let oDetails = odata.HUheadtoItems.results;
                    console.log(oDetails);  // Log the details

                    // Prepare array for binding to the table
                    var aProductDetails = [];
                    for (var i = 0; i < oDetails.length; i++) {
                        aProductDetails.push({
                            HUI: oDetails[i].Huident,
                            HU: odata.Tophu,
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
                }
                else{
                    console.log(odata);  // Log the data response

                    // Get the product details from the response
                    let oDetails = odata.HUheadtoItems.results;
                    console.log(oDetails);  // Log the details
                    oDetails = oDetails.filter(item => item.Huident == oHu);
                    // Prepare array for binding to the table
                    var aProductDetails = [];
                    for (var i = 0; i < oDetails.length; i++) {
                        aProductDetails.push({
                            HUI: oDetails[i].Huident,
                            HU: odata.Tophu,
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
                }
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

