sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/UIComponent"
    ],

    function(BaseController,UIComponent) {
      "use strict";
 
      return BaseController.extend("com.app.rfapp.controller.HUStockOverviewQuery", {
        onInit: function() {
            
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
        },
        onResourceDetailsLoad: async function (oEvent1) {
            const { id } = oEvent1.getParameter("arguments");
                this.ID = id;
        },
        onHUStockOverviewQueryfirstBackBtnPress:async function(){
            var oRouter = UIComponent.getRouterFor(this);
            var oModel1 = this.getOwnerComponent().getModel();
            await oModel1.read("/RESOURCESSet('" + this.ID + "')", {

                success: function (oData) {

                    let oUser=oData.Users.toLowerCase()

              

                    if(oUser ===  "resource"){
                        oRouter.navTo("RouteResourcePage",{id:this.ID});
                    }
                    else{
                    oRouter.navTo("Supervisor",{id:this.ID});
                }
                }.bind(this),
                error: function () {
                    MessageToast.show("User does not exist");
                }
            });
            
           
        },
        
        onSubmitButtonPress: function () {
            
           
                // Get the input value from the input field
                var oView = this.getView();
                var sHUNumber = oView.byId("idinputhusovqhu").getValue();
          
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
                    console.log(odata)
                    if (odata.Huident === sHUNumber) {
                      that.getView().byId("idScforFirstHUStockOverviewQuery").setVisible(false);
                        that.getView().byId("idHUStockOverviewQueryfirstbackbtn").setVisible(false);
                        that.getView().byId("idScforSecondHUStockOverviewQuery").setVisible(true);
                        that.getView().byId("idHUStockOverviewQuerySecondbackbtn").setVisible(true);
                      that.getView().byId("idBinNumberI_nput_HUSOQ11").setValue(sHUNumber);
                      that.getView().byId("idBinNumberInp_ut_HUSOQ121").setValue(odata.NumIt);
                      that.getView().byId("idBinNum_berInput_HUSOQ131").setValue(odata.NumHu);
                      that.getView().byId("idBinNumbe_rInput_HUSOQ141").setValue(odata.TopInd);


                      
          
                      // Get the product details from the response
                      let oDetails = odata.HUheadtoItems.results;
          
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
                      that.byId("idBinNumTable_AHUOB12Q11").setModel(oProductModel);
          
                      // Bind the items aggregation of the table to the products array in the model
                      that.byId("idBinNumTable_AHUOB12Q11").bindItems({
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
                    }
                    //  else {
                    //   // If no matching bin number found, show a message
                    //   sap.m.MessageToast.show("No products found for the entered bin number.");
                    // }
                  },
                  error: function () {
                    sap.m.MessageToast.show("Error fetching products.");
                  }
                });
         
        },
        onHUStockOverviewQuerySecondBackBtnPress:function(){
            this.getView().byId("idScforFirstHUStockOverviewQuery").setVisible(true);
            this.getView().byId("idHUStockOverviewQueryfirstbackbtn").setVisible(true);
            this.getView().byId("idScforSecondHUStockOverviewQuery").setVisible(false);
            this.getView().byId("idHUStockOverviewQuerySecondbackbtn").setVisible(false);
        },
        onPressHUQueryList:function(){
            
            // Get the input value from the input field
            var oView = this.getView();
            var sHUNumber = oView.byId("idBinNumberI_nput_HUSOQ11").getValue();
      
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
                console.log(odata)
                if (odata.Huident === sHUNumber) {
                    that.getView().byId("idScforSecondHUStockOverviewQuery").setVisible(false);
                    that.getView().byId("idHUStockOverviewQuerySecondbackbtn").setVisible(false);
                    that.getView().byId("idHUStockOverviewQueryThirdbackbtn").setVisible(true);
                    that.getView().byId("idScforThirdHUStockOverviewQuery").setVisible(true);
                   that.getView().byId("idBinNumberInput_HUSOQ11").setValue(sHUNumber);
                   that.getView().byId("idBinNumberInput_HUSOQ121").setValue(odata.NumIt);
                   that.getView().byId("idBinNumberInput_HUSOQ131").setValue(odata.NumHu);
                   that.getView().byId("idBinNumberInput_HUSOQ141").setValue(odata.TopInd);


                  

      
                  // Get the product details from the response
                  let oDetails = odata.HUheadtoItems.results;
      
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
                  that.byId("idBinNumTable_AHUOB12Q1").setModel(oProductModel);
      
                  // Bind the items aggregation of the table to the products array in the model
                  that.byId("idBinNumTable_AHUOB12Q1").bindItems({
                    path: "/products",
                    template: new sap.m.ColumnListItem({
                      cells: [
                        new sap.m.Text({ text: "{Huident}" }),  // Product Number
                        new sap.m.Text({ text: "{Matnr}" })   // Quantity

                          // UOM
                      ],
                    })
                  });
                }
                //  else {
                //   // If no matching bin number found, show a message
                //   sap.m.MessageToast.show("No products found for the entered bin number.");
                // }
              },
              error: function () {
                sap.m.MessageToast.show("Error fetching products.");
              }
            });

        },
        onHUStockOverviewQueryThirdBackBtnPress:function(){
            this.getView().byId("idScforSecondHUStockOverviewQuery").setVisible(true);
            this.getView().byId("idHUStockOverviewQuerySecondbackbtn").setVisible(true);
            this.getView().byId("idHUStockOverviewQueryThirdbackbtn").setVisible(false);
            this.getView().byId("idScforThirdHUStockOverviewQuery").setVisible(false);
        },
        onPressHUINformationPress:function(){
            

            // Get the input value from the input field
            var oView = this.getView();
            var sHUNumber = oView.byId("idBinNumberInput_HUSOQ11").getValue();
      
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
                console.log(odata)
                if (odata.Tophu === sHUNumber) {
                    that.getView().byId("idHUStockOverviewQueryFourthbackbtn").setVisible(true);
                    that.getView().byId("idScforFourthHUStockOverviewQuery").setVisible(true);
                    that.getView().byId("idHUStockOverviewQueryThirdbackbtn").setVisible(false);
                    that.getView().byId("idScforThirdHUStockOverviewQuery").setVisible(false);
                   that.getView().byId("idBinNumberInput_HUSOQ11").setValue(sHUNumber);


                   let oDetails = odata.HUheadtoItems.results;

                   that.getView().byId("inputPkmt").setValue(odata.Pmat);
                   that.getView().byId("inputHtyp").setValue(oDetails[0].Letyp);
                   that.getView().byId("inputTotw1").setValue(oDetails[0].GWeight);
                   that.getView().byId("inputTotw2").setValue(oDetails[0].UnitGw);
                   that.getView().byId("inputTotv1").setValue(oDetails[0].GVolume);
                   that.getView().byId("inputTotv2").setValue(oDetails[0].UnitGv);
                   that.getView().byId("inputMaxW").setValue(oDetails[0].MaxWeight);
                   that.getView().byId("inputMaxV").setValue(oDetails[0].MaxVolume);
                   that.getView().byId("inputTarW").setValue(oDetails[0].TWeight);
                   that.getView().byId("inputTarV").setValue(oDetails[0].TVolume);
                   that.getView().byId("inputEr1").setValue(oDetails[0].Length);
                   that.getView().byId("inputEr2").setValue(oDetails[0].Width);
                   that.getView().byId("inputEr3").setValue(oDetails[0].Height);
                   that.getView().byId("inputEr4").setValue(oDetails[0].UnitLwh);
                   that.getView().byId("inputTop").setValue(oDetails[0].Top);
                   that.getView().byId("inputLwst").setValue(oDetails[0].Bottom);
                   that.getView().byId("inputMove").setValue(oDetails[0].Flgmove);
                   that.getView().byId("inputStat1").setValue(oDetails[0].Phystat);
                   that.getView().byId("inputStat2").setValue(oDetails[0].HazmatInd);
                   that.getView().byId("inputBin1").setValue(oDetails[0].Wsbin);
                   that.getView().byId("inputCGrp").setValue(oDetails[0].Dstgrp);
                   
                }
              },
              error: function () {
                sap.m.MessageToast.show("Error fetching products.");
              }
            });

        },
        onHUStockOverviewQueryFourthBackBtnPress:function(){
            this.getView().byId("idHUStockOverviewQueryFourthbackbtn").setVisible(false);
            this.getView().byId("idScforFourthHUStockOverviewQuery").setVisible(false);
            this.getView().byId("idHUStockOverviewQueryThirdbackbtn").setVisible(true);
            this.getView().byId("idScforThirdHUStockOverviewQuery").setVisible(true);
            
        },
        onPressHUQuerystockprodinfoPress:function(){
            
            var oView = this.getView();
            var sHUNumber = oView.byId("idBinNumberInput_HUSOQ11").getValue();
      
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
                console.log(odata)
                if (odata.Tophu === sHUNumber) {
                  that.getView().byId("idHUStockOverviewQueryFifthbackbtn").setVisible(true);
                  that.getView().byId("idScforFifthHUStockOverviewQuery").setVisible(true);
                  that.getView().byId("idHUStockOverviewQueryThirdbackbtn").setVisible(false);
                  that.getView().byId("idScforThirdHUStockOverviewQuery").setVisible(false);


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
        onHUStockOverviewQueryFifthBackBtnPress:function(){
            this.getView().byId("idHUStockOverviewQueryFifthbackbtn").setVisible(false);
            this.getView().byId("idScforFifthHUStockOverviewQuery").setVisible(false);
            this.getView().byId("idHUStockOverviewQueryThirdbackbtn").setVisible(true);
            this.getView().byId("idScforThirdHUStockOverviewQuery").setVisible(true);   
        }
      });
    }
  );
 
 