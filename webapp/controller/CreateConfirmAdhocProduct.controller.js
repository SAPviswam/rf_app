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

            onSubmitAdhocProductBtnPress: function () {
                var oView = this.getView();
                var sProductnumber = oView.byId("1_CidProductInputCAP").getValue();

                // Convert the product number to uppercase and store it
                sProductnumber = sProductnumber.toUpperCase();
                this.sProductnumber = sProductnumber;

                // Check if the product number is provided, if not show a message
                if (!sProductnumber) {
                    sap.m.MessageToast.show("Please enter a ProductNumber");
                    return;
                }
                this.getView().byId("idInitialProductPage").setVisible(false)
                this.getView().byId("idsecondProductPage").setVisible(true)
                this.getView().byId("idProductfirstbackbtn").setVisible(true);
                this.getView().byId("idInitialAdhocProductbackbtn").setVisible(false);
                this.getView().byId("idproductInput1").setValue(sProductnumber);
            },
            onSecondSubmitBtnPress: async function () {
                var oView = this.getView();
                var sBinnumber = oView.byId("idProductsrcBinInput").getValue();
                var sProctyp = oView.byId("idProcesstypeInput").getValue();

                // Convert the product number to uppercase and store it
                sBinnumber = sBinnumber.toUpperCase();
                this.sBinnumber = sBinnumber;

                // Check if the product number is provided, if not show a message
                if (!sBinnumber || !sProctyp) {
                    sap.m.MessageToast.show("Please enter a BinNumber and Process Type");
                    return;
                }
                var oModel = this.getView().getModel(); // Get the model associated with the view
                var that = this;

                var sRequestUrl = `/ProductWTC1Set(Matnr40='${this.sProductnumber}',Procty='${sProctyp}',Vlpla='${sBinnumber}')`;

                await oModel.read(sRequestUrl, {
                    urlParameters: {
                        "$expand": "ProductWTCSetsNav1", // Expand related task data
                        "$format": "json" // Request the data in JSON format
                    },
                    success: (odata) => {
                        console.log(odata);
                        this.Odata = odata
                        if (odata.Matnr40 === that.sProductnumber && odata.Procty === sProctyp && odata.Vlpla === sBinnumber) {
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

                } else {
                    sap.m.MessageToast.show("Material not found.");
                }
            },
            onProductfirstBackBtnPress: function () {
                this.getView().byId("idInitialProductPage").setVisible(true);
                this.getView().byId("idsecondProductPage").setVisible(false);
                this.getView().byId("idProductfirstbackbtn").setVisible(false);
                this.getView().byId("idInitialAdhocProductbackbtn").setVisible(true);
            },
            onProductSecondBackBtnPress: function () {
                this.getView().byId("idsecondProductPage").setVisible(true);
                this.getView().byId("idthirdProductPage").setVisible(false);
                this.getView().byId("idProductfirstbackbtn").setVisible(true);
                this.getView().byId("idProdutSecondbackbtn").setVisible(false)
            },
            onbackbuttonfromtablepress: function () {
                this.getView().byId("idProductfirstbackbtn").setVisible(true);
                this.getView().byId("idsecondProductPage").setVisible(true);
                this.getView().byId("idfifthProductPage").setVisible(false);
                this.getView().byId("idfourthProductPage").setVisible(false)
            },
            onProductdetailsBtnPress: function () {
                var aProductdata = this.Odata.ProductWTCSetsNav1.results[0];
                

                this.getView().byId("idfourthProductPage").setVisible(true);
                this.getView().byId("idthirdProductPage").setVisible(false);
                this.getView().byId("idProductthirdbackbtn").setVisible(true);
                this.getView().byId("idProdutSecondbackbtn").setVisible(false)
            },
            onProductthirdBackBtnPress: function () {
                this.getView().byId("idfourthProductPage").setVisible(false);
                this.getView().byId("idthirdProductPage").setVisible(true);
                this.getView().byId("idProductthirdbackbtn").setVisible(false);
                this.getView().byId("idProdutSecondbackbtn").setVisible(true)
            },
            onInitialAdhocProductBackBtnPress: async function () {
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
