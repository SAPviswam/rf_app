sap.ui.define(
    [
        "./BaseController",
        "sap/m/MessageToast",
        "sap/ui/core/UIComponent"
    ],
    function (BaseController, MessageToast, UIComponent) {
        "use strict";

        return BaseController.extend("com.app.rfapp.controller.CreateConfirmAdhocProduct", {
            onInit: function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
            },
            onResourceDetailsLoad: function (oEvent1) {
                var that = this;
                const { id, idI } = oEvent1.getParameter("arguments");
                this.ID = id;
                this.IDI = idI;
                console.log(this.ID);
            },
            onAvatarPressed_CCAP: function (oEvent) {
                this.onPressAvatarEveryTileHelperFunction(oEvent);

            },
            onSignoutPressed: function () {
                var oRouter = this.getOwnerComponent().getRouter(this);
                oRouter.navTo("InitialScreen", { Userid: this.IDI });
            },

            // onSubmitAdhocProductBtnPress: function () {
            //     var oView = this.getView();
            //     var sProductnumber = oView.byId("1_CidProductInputCAP").getValue();

            //     // Convert the product number to uppercase and store it
            //     sProductnumber = sProductnumber.toUpperCase();
            //     this.sProductnumber = sProductnumber;

            //     // Check if the product number is provided, if not show a message
            //     if (!sProductnumber) {
            //         sap.m.MessageToast.show("Please enter a ProductNumber");
            //         return;
            //     }
            //     this.getView().byId("idInitialProductPage").setVisible(false)
            //     this.getView().byId("idsecondProductPage").setVisible(true)
            //     this.getView().byId("idProductfirstbackbtn").setVisible(true);
            //     this.getView().byId("idInitialAdhocProductbackbtn").setVisible(false);
            //     this.getView().byId("idproductInput1").setValue(sProductnumber);
            // },
            onSecondSubmitBtnPress: async function () {
                var oView = this.getView();
                var sProductnumber = oView.byId("idproductInput1").getValue();

                var sBinnumber = oView.byId("idProductsrcBinInput").getValue();
              
                // Convert the product number to uppercase and store it
                sProductnumber = sProductnumber.toUpperCase();
                this.sProductnumber = sProductnumber;

                sBinnumber = sBinnumber.toUpperCase();
                this.sBinnumber = sBinnumber;
               

                // Check if the product number is provided, if not show a message
                if (!sBinnumber ||!sProductnumber ) {
                    sap.m.MessageToast.show("Please enter a BinNumber and Product number");
                    return;
                }
                var oModel = this.getView().getModel(); // Get the model associated with the view
                var that = this;

                var sRequestUrl = `/ProductWTC1Set(Matnr40='${this.sProductnumber}',Vlpla='${sBinnumber}')`;

                await oModel.read(sRequestUrl, {
                    urlParameters: {
                        "$expand": "ProductWTCSetsNav1", // Expand related task data
                        "$format": "json" // Request the data in JSON format
                    },
                    success: (odata) => {
                        console.log(odata);
                        this.Odata = odata
                        if (odata.Matnr40 === that.sProductnumber &&  odata.Vlpla === sBinnumber) {
                            var odataItems = odata.ProductWTCSetsNav1.results;
                            if (odataItems.length > 1) {
                                // Prepare an array for binding
                                var aProductDetails = [];

                                // Loop through the results and push them into the array
                                for (var i = 0; i < odataItems.length; i++) {
                                    if (odataItems[i].Matnr40) {
                                        aProductDetails.push({
                                            Matnr40: odataItems[i].Matnr40,
                                            Huident: odataItems[i].Huident,
                                            Owner: odataItems[i].Owner
                                        });
                                    }
                                }

                                // Create a JSON model with the product details array
                                var oProductModel = new sap.ui.model.json.JSONModel({ products: aProductDetails });

                                // Set the model to the table
                                that.byId("idBinNumTable_CCAP").setModel(oProductModel);

                                // Bind the items aggregation of the table to the products array in the model
                                that.byId("idBinNumTable_CCAP").bindItems({
                                    path: "/products",
                                    template: new sap.m.ColumnListItem({
                                        cells: [
                                            new sap.m.Text({ text: "{Matnr40}" }),  // Product Number
                                            new sap.m.Text({ text: "{Huident}" }),   // Hu number
                                            new sap.m.Text({ text: "{Owner}" })   // Owner
                                        ],
                                    })
                                });
                                that.getView().byId("idProductfirstbackbtn").setVisible(false);
                                that.getView().byId("idsecondProductPage").setVisible(false);
                                that.getView().byId("idfifthProductPage").setVisible(true);
                                that.getView().byId("idBtnHUContentBtn_CCAP").setVisible(true);
                            }
                            else {
                                that.getView().byId("idProductSrcBinInput2").setValue(sBinnumber);
                                that.getView().byId("idProductInput2").setValue(that.sProductnumber);
                                that.getView().byId("idthirdProductPage").setVisible(true);
                                that.getView().byId("idsecondProductPage").setVisible(false);
                                that.getView().byId("idProdutSecondbackbtn").setVisible(true);
                                that.getView().byId("idProductfirstbackbtn").setVisible(false);
                                that.getView().byId("idProductAvlQtyInput2").setValue(odataItems[0].AvailQuan);
                                this.oSelectedMaterial=odata.ProductWTCSetsNav1.results[0];
                            }
                        }
                    },
                    error: function () {
                    }
                });
            },
            onSelectionChange: function (oEvent) {

                var aMaterials = this.Odata.ProductWTCSetsNav1.results;

                var sSelectedMatnr = oEvent.getSource().getSelectedItem().getBindingContext().getProperty("Matnr40");
                var sSelectedHuident = oEvent.getSource().getSelectedItem().getBindingContext().getProperty("Huident");

                var oSelectedMaterial = aMaterials.find(function (material) {

                    return material.Matnr40 === sSelectedMatnr && material.Huident === sSelectedHuident;
                });
                if (oSelectedMaterial) {
                    this.getView().byId("idthirdProductPage").setVisible(true);
                    this.getView().byId("idsecondProductPage").setVisible(false);
                    this.getView().byId("idProdutSecondbackbtn").setVisible(true);
                    this.getView().byId("idProductfirstbackbtn").setVisible(false);
                    this.getView().byId("idProductAvlQtyInput2").setValue(oSelectedMaterial.AvailQuan);
                    this.getView().byId("idProductSrcBinInput2").setValue(this.sBinnumber);
                    this.getView().byId("idProductInput2").setValue(this.sProductnumber);
                    this.oSelectedMaterial = oSelectedMaterial;

                } else {
                    sap.m.MessageToast.show("Material not found.");
                }
            },
            onProductfirstBackBtnPress: function () {
                // this.getView().byId("idInitialProductPage").setVisible(true);
                this.getView().byId("idsecondProductPage").setVisible(false);
                this.getView().byId("idProductfirstbackbtn").setVisible(false);
                this.getView().byId("idInitialAdhocProductbackbtn").setVisible(true);
            },
            onProductSecondBackBtnPress: function () {
                var oView = this.getView(); // Ensure the view is being referred to correctly
                var sProductnumber1 = oView.byId("idproductInput1");
                var sBinnumber = oView.byId("idProductsrcBinInput");
                // Get references to the input fields
                var sProductnumber = oView.byId("idProductInput2");
                var sSrcBin = oView.byId("idProductSrcBinInput2");
                var sAvailqty = oView.byId("idProductAvlQtyInput2");
                var sWPTnumber = oView.byId("idWPTtypeInput");
                var sSrcQty = oView.byId("idProductSourceQtyInput2");
                var sDestBin = oView.byId("idProductDestBinInput2");
            
                // Clear their values
                sProductnumber1.setValue("");  // Clear the Product number input
                sBinnumber.setValue("");      // Clear the Bin number input
                sProductnumber.setValue("");  // Clear the Product number input
                sSrcBin.setValue("");         // Clear the Source Bin input
                sAvailqty.setValue("");       // Clear the Available Quantity input
                sWPTnumber.setValue("");      // Clear the WPT input
                sSrcQty.setValue("");         // Clear the Source Quantity input
                sDestBin.setValue("");        // Clear the Destination Bin input
            
                // Set the visibility of pages and buttons
                this.getView().byId("idsecondProductPage").setVisible(true);
                this.getView().byId("idthirdProductPage").setVisible(false);
                this.getView().byId("idProductfirstbackbtn").setVisible(true);
                this.getView().byId("idProdutSecondbackbtn").setVisible(false);
            },
            
            onbackbuttonfromtablepress: function () {


                this.getView().byId("idProductfirstbackbtn").setVisible(true);
                this.getView().byId("idsecondProductPage").setVisible(true);
                this.getView().byId("idfifthProductPage").setVisible(false);
                this.getView().byId("idfourthProductPage").setVisible(false);
    
            },
            onProductdetailsBtnPress: function () {
                this.getView().byId("idProductInput_CCAP").setValue(this.oSelectedMaterial.Matnr40)
                this.getView().byId("idProTextInput_CCAP").setValue(this.oSelectedMaterial.Maktx)
                this.getView().byId("idBatchSTypeInput_CCAP").setValue(this.oSelectedMaterial.Cat)
                this.getView().byId("idPtyEntlInput_CCAP").setValue(this.oSelectedMaterial.Entitled)
                this.getView().byId("idOwnerInput_CCAP").setValue(this.oSelectedMaterial.Owner)
                this.getView().byId("idGRDateInput_CCAP").setValue(this.oSelectedMaterial.GrDate)
                this.getView().byId("idStatusInput_CCAP").setValue(this.oSelectedMaterial.UsageIv)
                this.getView().byId("idBatchInput1_CCAP").setValue(this.oSelectedMaterial.ChargBarc)
                this.getView().byId("idBatchInput2_CCAP").setValue(this.oSelectedMaterial.Brestr)
                this.getView().byId("idBatchCRInput_CCAP").setValue(this.oSelectedMaterial.Coo)
                this.getView().byId("idRow4Input1_CCAP").setValue(this.oSelectedMaterial.StockDoccat)
                this.getView().byId("idRow4Input2_CCAP").setValue(this.oSelectedMaterial.StockDocno)
                this.getView().byId("idRow4Input3_CCAP").setValue(this.oSelectedMaterial.StockItmno)
                this.getView().byId("idSLEDBBDInput_CCAP").setValue(this.oSelectedMaterial.Vfdat)
                this.getView().byId("idHazSubsInput_CCAP").setValue(this.oSelectedMaterial.HazmatInd)
                this.getView().byId("idWhseHandInput_CCAP").setValue(this.oSelectedMaterial.Hndlcode)
                this.getView().byId("idERelInput_CCAP").setValue(this.oSelectedMaterial.Envrel)
                this.getView().byId("idfourthProductPage").setVisible(true);
                this.getView().byId("idthirdProductPage").setVisible(false);
                this.getView().byId("idProductThirdBackBtn_CCAP").setVisible(true);
                this.getView().byId("idProdutSecondbackbtn").setVisible(false)
            },
            onThirdSubmitBtnPress: function () {
                var oView = this.getView();
                var sSrcBin = oView.byId("idProductSrcBinInput2").getValue();
                var sDestBin = oView.byId("idProductDestBinInput2").getValue();
                var sProductnumber = oView.byId("idProductInput2").getValue();
                var sSrcQty = oView.byId("idProductSourceQtyInput2").getValue();
                // Ensure all required fields are filled in
                if (!sDestBin || !sSrcQty) {
                    sap.m.MessageToast.show("Please enter all the required fields: Source Qty, Destination Bin.");
                    return;
                }
                var oobj = {
                    Matnr40: sProductnumber,
                    Vlpla: sSrcBin,
                    Nlpla: sDestBin,
                    VsolaBarc: sSrcQty,
                    Procty: this.sProctyp,
                }

                // Call the backend service to update the data

                var oModel = this.getView().getModel();
                var that = this;


                try {
                    oModel.create("/ProductWTC1Set", oobj, {
                        success: function (oSucces) {
                            console.log(oSucces)
                            MessageToast.show("Warehouse Task created and confirmed Successfully")
                        },
                        error: function (oError) {
                            var ojson = JSON.parse(oError.responseText)
                            console.log(ojson)
                            MessageToast.show(ojson.error.message.value)
                        }
                    })

                } catch (error) {
                    sap.m.MessageToast.show("Unexpected error occurred. Please try again.");
                    console.error(error);
                }

            },
            onProductthirdBackBtnPress: function () {
                this.getView().byId("idfourthProductPage").setVisible(false);
                this.getView().byId("idthirdProductPage").setVisible(true);
                this.getView().byId("idProductThirdBackBtn_CCAP").setVisible(false);
                this.getView().byId("idProdutSecondbackbtn").setVisible(true)
            },
            onProductfirstBackBtnPress: async function () {
                var oView = this.getView();
                var sProductnumber = oView.byId("idproductInput1");
                var sBinnumber = oView.byId("idProductsrcBinInput");
            
                // Clear their values
                sProductnumber.setValue("");  // Clear the Product number input
                sBinnumber.setValue("");      // Clear the Bin number input
            
                var oRouter = UIComponent.getRouterFor(this);
                var oModel1 = this.getOwnerComponent().getModel();
                var that = this;
                await oModel1.read("/RESOURCESSet('" + this.ID + "')", {
                    success: function (oData) {
                        let oUser = oData.Users.toLowerCase()
                        if (oUser === "resource") {
                            oRouter.navTo("RouteResourcePage", { id: this.ID, idI: that.IDI });
                        }
                        else {
                            oRouter.navTo("Supervisor", { id: this.ID, idI: that.IDI });
                        }
                    }.bind(this),
                    error: function () {
                        MessageToast.show("User does not exist");
                    }
                });
            },

        });
    }
);
