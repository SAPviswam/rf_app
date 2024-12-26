sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent"
],
    function (Controller, MessageToast, UIComponent) {
        "use strict";

        return Controller.extend("com.app.rfapp.controller.AdhocProductWt", {
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
            onAdhocProductWtBackBtn1Press: async function () {
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
            //Avatar Press function with Helper function...
            onAvatarPressedIn_APWT: function (oEvent) {
                this.onPressAvatarEveryTileHelperFunction(oEvent);
            },
            onSignoutPressed: function () {
                var oRouter = this.getOwnerComponent().getRouter(this);
                oRouter.navTo("InitialScreen", { Userid: this.IDI });
            },
            onPressSubmitInAdhocHuWt: function () {
                var sProduct = this.getView().byId("Id_Input1_AdhocProductWt").getValue();
                sProduct = sProduct.toUpperCase();
                this.sProduct = sProduct;

                //Message Toast for the empty Input Product number
                if (!sProduct) {
                    MessageToast.show("Please enter a Product Number");
                    return;
                }
                this.getView().byId("idproductInput1__AdhocProductwt").setValue(sProduct);
                this.getView().byId("idsecondProductPage_AdhocProductwt").setVisible(true)
                this.getView().byId("Id_ScrollContainer_AdhocProductWt").setVisible(false)
            },
            onProductDetailsPress_AdhocProductWt: function () {
                this.getView().byId("idProductInput_AdhocProductWt").setValue(this.oSelectedMaterial.Matnr40)
                this.getView().byId("idProTextInput_AdhocProductWt").setValue(this.oSelectedMaterial.Maktx)
                this.getView().byId("idBatchSTypeInput_AdhocProductWt").setValue(this.oSelectedMaterial.Cat)
                this.getView().byId("idPtyEntlInput_AdhocProductWt").setValue(this.oSelectedMaterial.Entitled)
                this.getView().byId("idOwnerInput_AdhocProductWt").setValue(this.oSelectedMaterial.Owner)
                this.getView().byId("idGRDateInput_AdhocProductWt").setValue(this.oSelectedMaterial.GrDate)
                this.getView().byId("idStatusInput_AdhocProductWt").setValue(this.oSelectedMaterial.UsageIv)
                this.getView().byId("idBatchInput1_AdhocProductWt").setValue(this.oSelectedMaterial.ChargBarc)
                this.getView().byId("idBatchInput2_AdhocProductWt").setValue(this.oSelectedMaterial.Brestr)
                this.getView().byId("idBatchCRInput_AdhocProductWt").setValue(this.oSelectedMaterial.Coo)
                this.getView().byId("idRow4Input1_AdhocProductWt").setValue(this.oSelectedMaterial.StockDoccat)
                this.getView().byId("idRow4Input2_AdhocProductWt").setValue(this.oSelectedMaterial.StockDocno)
                this.getView().byId("idRow4Input3_AdhocProductWt").setValue(this.oSelectedMaterial.StockItmno)
                this.getView().byId("idSLEDBBDInput_AdhocProductWt").setValue(this.oSelectedMaterial.Vfdat)
                this.getView().byId("idHazSubsInput_AdhocProductWt").setValue(this.oSelectedMaterial.HazmatInd)
                this.getView().byId("idWhseHandInput_AdhocProductWt").setValue(this.oSelectedMaterial.Hndlcode)
                this.getView().byId("idERelInput_AdhocProductWt").setValue(this.oSelectedMaterial.Envrel)
                this.getView().byId("Id_Scrollcontainer_ProductDet_AdhocProductWt").setVisible(true)
                this.getView().byId("Id_Scrollcontainer_Screen2").setVisible(false)
            },
            onAdhocProductWtBackBtnPress: function () {
                this.getView().byId("Id_Scrollcontainer_ProductDet_AdhocProductWt").setVisible(false)
                this.getView().byId("Id_Scrollcontainer_Screen2").setVisible(true) 
            },
            onSecondBackBtnPress_AdhocProductWt: function () {
                this.getView().byId("idsecondProductPage_AdhocProductwt").setVisible(true)
                this.getView().byId("Id_Scrollcontainer_Screen2").setVisible(false)
                this.getView().byId("idProductfirstbackbtn__AdhocProductwt").setVisible(true);
                this.getView().byId("idSecondBackBtn_AdhocProductWt").setVisible(false);
            },
            onPressSecondSubmitBtnPress: async function () {
                var oView = this.getView();
                var SourceBinnumber = oView.byId("idProductsrcBinInput__AdhocProductwt").getValue();
                var Processtype = oView.byId("idProcesstypeInput__AdhocProductwt").getValue();

                var oModel = this.getView().getModel(); // Get the model associated with the view
                var that = this;

                SourceBinnumber = SourceBinnumber.toUpperCase();
                this.SourceBinnumber = SourceBinnumber;

                Processtype = Processtype.toUpperCase();
                this.Processtype = Processtype;

                if (!SourceBinnumber) {
                    MessageToast.show("Please enter a Source BinNumber ");
                    return;
                }
                if (!Processtype) {

                    MessageToast.show("Please enter a Warehouse Process Type");
                    return;
                }
                
                // if (Processtype !== "T999") {
                //     MessageToast.show("Please enter a valid Process Type (T999)");
                //     return;
                // }

                var sRequestUrl = `/ProductWTCSet(Matnr40='${this.sProduct}',Procty='${Processtype}',Vlpla='${SourceBinnumber}')`;
                await oModel.read(sRequestUrl, {
                    urlParameters: {
                        "$expand": "ProductWTCSetsNav",
                        "$format": "json"
                    },
                    success: (odata) => {
                        console.log(odata);
                        this.Odata = odata
                        if (odata.Matnr40 === that.sProduct && odata.Procty === Processtype && odata.Vlpla === SourceBinnumber) {
                            var odataItems = odata.ProductWTCSetsNav.results;
                            if (odataItems.length > 1) {
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
                                that.byId("idBinNumTable_AdhocProductWt").setModel(oProductModel);

                                // Bind the items aggregation of the table to the products array in the model
                                that.byId("idBinNumTable_AdhocProductWt").bindItems({
                                    path: "/products",
                                    template: new sap.m.ColumnListItem({
                                        cells: [
                                            new sap.m.Text({ text: "{Matnr40}" }),  // Product Number
                                            new sap.m.Text({ text: "{Huident}" }),   // Hu number
                                            new sap.m.Text({ text: "{Owner}" })   // Owner
                                        ],
                                    })
                                });
                                that.getView().byId("idsecondProductPage_AdhocProductwt").setVisible(false);
                                that.getView().byId("idProductfirstbackbtn__AdhocProductwt").setVisible(false);
                                that.getView().byId("idfifthProductPage__AdhocProductWt").setVisible(true);
                                that.getView().byId("idBtnHUContentBtn_AdhocProductWt").setVisible(true);
                            }
                            else {
                                that.getView().byId("id_Input_SrcBin_AdhocProductWt").setValue(SourceBinnumber);
                                that.getView().byId("id_Input_Product_AdhocProductWt").setValue(that.sProduct);
                                that.getView().byId("idsecondProductPage_AdhocProductwt").setVisible(false);
                                that.getView().byId("idProductfirstbackbtn__AdhocProductwt").setVisible(false);
                                that.getView().byId("Id_Scrollcontainer_Screen2").setVisible(true);
                                that.getView().byId("idSecondBackBtn_AdhocProductWt").setVisible(true);
                                that.getView().byId("id_Input_Wpt_AdhocProductWt").setValue(odataItems[0].AvailQuan);

                                this.oSelectedMaterial=odata.ProductWTCSetsNav.results[0];

                              
                            }
                        }
                    },
                    error: (odata) => {
                        console.log(odata);
                    },
                });
                // this.getView().byId("Id_Scrollcontainer_Screen2").setVisible(true)
                // this.getView().byId("idsecondProductPage_AdhocProductwt").setVisible(false)
            },
            onSelectionChange: function (oEvent) {
                debugger
                var aMaterials = this.Odata.ProductWTCSetsNav.results;
                var sSelectedMatnr = oEvent.getSource().getSelectedItem().getBindingContext().getProperty("Matnr40");
                var sSelectedHuident = oEvent.getSource().getSelectedItem().getBindingContext().getProperty("Huident");
                var oSelectedMaterial = aMaterials.find(function (material) {
                    return material.Matnr40 === sSelectedMatnr && material.Huident === sSelectedHuident;
                });
                if (oSelectedMaterial) {
                    this.getView().byId("id_Input_Wpt_AdhocProductWt").setValue(oSelectedMaterial.AvailQuan);
                    this.getView().byId("id_Input_SrcBin_AdhocProductWt").setValue(this.SourceBinnumber);
                    this.getView().byId("id_Input_Product_AdhocProductWt").setValue(this.sProduct);
                    this.getView().byId("idfifthProductPage__AdhocProductWt").setVisible(false);
                    this.getView().byId("idBtnHUContentBtn_AdhocProductWt").setVisible(false);
                    this.getView().byId("idSecondBackBtn_AdhocProductWt").setVisible(true);
                    this.getView().byId("Id_Scrollcontainer_Screen2").setVisible(true); 

                    this.oSelectedMaterial = oSelectedMaterial;

                } else {
                    sap.m.MessageToast.show("Material not found.");
                }
            },
            onPressProductfirstBackBtnPress: function () {
                this.getView().byId("Id_ScrollContainer_AdhocProductWt").setVisible(true)
                this.getView().byId("idsecondProductPage_AdhocProductwt").setVisible(false)
            },
            onbackbuttonfromtablepress:function(){
                this.getView().byId("idsecondProductPage_AdhocProductwt").setVisible(true);
                this.getView().byId("idfifthProductPage__AdhocProductWt").setVisible(false);
            },
            OnPressSubmit1AdhocProductWt:function() {
                debugger
                var oProductnum=this.getView().byId("id_Input_Product_AdhocProductWt").getValue()
                var oSrcBin=this.getView().byId("id_Input_SrcBin_AdhocProductWt").getValue();
                var oDestbin=this.getView().byId("id_Input_DestBin_AdhocProductWt").getValue();
                var oSrcQuan=this.getView().byId("id_Input_srcquan_AdhocProductWt").getValue();
                var oHunumber= this.getView().byId("id_Input_DestHu_AdhocProductWt").getValue();
                var oModel = this.getView().getModel();
                // var that = this;

                var oOwner =  this.oSelectedMaterial.Owner;
                var oEntitled = this.oSelectedMaterial.Entitled;
                var oCat = this.oSelectedMaterial.Cat;
                var oobj = {
                    Matnr40: oProductnum,
                    Vlpla: oSrcBin,
                    Nlpla: oDestbin,
                    VsolaBarc: oSrcQuan,
                    Procty: this.Processtype,
                    Owner: oOwner,
                    Opunit: "PC",
                    Altme: "PC",
                    Cat: oCat,
                    Entitled: oEntitled,
                    Huident: "" 
                }
                oModel.create("/ProductWTCSet", oobj, {
                    success: function(oSucces) {
                        sap.m.MessageToast.show("Product added successfully.");
                    },
                    error: function(oError) {
                        var ojson = JSON.parse(oError.responseText)
                        console.log(ojson)
                        MessageToast.show(ojson.error.message.value);
                    }
                });
            },
            OnScannerAdhocProductWt:function(oEvent){
                var sScannedProduct = oEvent.getParameter("text");
                this.getView().byId("Id_Input1_AdhocProductWt").setValue(sScannedProduct);
            },
            OnScannerSourceBin: function(oEvent) {
                var sScannedBin = oEvent.getParameter("text");
                this.getView().byId("idProductsrcBinInput__AdhocProductwt").setValue(sScannedBin);

            }
        });
    });