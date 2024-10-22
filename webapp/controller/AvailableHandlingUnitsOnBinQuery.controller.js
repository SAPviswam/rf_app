sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function (BaseController) {
        "use strict";

        return BaseController.extend("com.app.rfapp.controller.AvailableHandlingUnitsOnBinQuery", {
            onInit: function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
            },
            onResourceDetailsLoad: async function (oEvent1) {
                const { id } = oEvent1.getParameter("arguments");
                this.ID = id;
            },
            onAfterRendering: function () {
                this.byId("idPage1_AHUOBQ").setVisible(true);
            },
            //Back Btn from 1st ScrollContainer Page 1 =>idPage1_AHUOBQ
            onPressBackBtnPage1_AHUOBQ: async function () {
                var oRouter = this.getOwnerComponent().getRouter();
                var oModel1 = this.getOwnerComponent().getModel();
                await oModel1.read("/RESOURCESSet('" + this.ID + "')", {
                    success: function (oData) {
                        if (oData.Users === "RESOURCE") {
                            oRouter.navTo("RouteResourcePage", { id: this.ID });
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



            //Submit Btn from ScrollContainer Page 1=> idPage1_AHUOBQ..
            onSubmitPress_AHUOBQ: function () {
              
                // Get the input value from the input field
                var oView = this.getView();
                var sBinNumber = oView.byId("idInput_AHUOBQ").getValue();
                this.sBinNumber = sBinNumber;
          
                // Check if bin number is provided
                if (!sBinNumber) {
                  sap.m.MessageToast.show("Please enter a bin number.");
                  return;
                }
          
                // Call your backend service to fetch products for this bin
                var oModel = this.getView().getModel(); // Assuming you have a model set up
                var that = this;
          
                oModel.read(`/BINQItemSet('${sBinNumber}')`, {
                  urlParameters: {
                    "$expand": "BINQHeadSet",
                    "$format": "json"
                  },
          
                  success: function (odata) {
                    console.log(odata);
                    that.getView().byId("idPage1_AHUOBQ").setVisible(false);
                    that.getView().byId("idPage2BinNoTable_AHUOBQ").setVisible(true);
                    that.getView().byId("idBinNumberInput_AHUOBQ").setValue(sBinNumber);
          
                    // Get the product details from the response
                    let oDetails = odata.BINQHeadSet.results;
          
                    // Prepare an array for binding
                    var aProductDetails = [];
          
                    // Loop through the results and push them into the array
                    for (var i = 0; i < oDetails.length; i++) {
                      if (oDetails[i].Huident) {
                        aProductDetails.push({
                            Huident: oDetails[i].Huident,
                            Letyp: oDetails[i].Letyp,
                            Flgmove: oDetails[i].Flgmove
                        });
                      }
                    }
          
                    
                    // Create a JSON model with the product details array
                    var oProductModel = new sap.ui.model.json.JSONModel({ products: aProductDetails });
          
                    // Set the model to the table
                    that.byId("idBinNumTable_AHUOBQ").setModel(oProductModel);
          
                    // Bind the items aggregation of the table to the products array in the model
                    that.byId("idBinNumTable_AHUOBQ").bindItems({
                      path: "/products",
                      template: new sap.m.ColumnListItem({
                        cells: [
                          new sap.m.Text({ text: "{Huident}" }),  // Hu
                          new sap.m.Text({ text: "{Letyp}" }),   // 
                          new sap.m.Text({ text: "{Flgmove}" })   // 
                        ]
                      })
                    });
                  },
                  error: function () {
                    sap.m.MessageToast.show("Error fetching products.");
                  }
                });
              },

            //HUContent Btn from ScrollContainer Page 2=>idPage2BinNoTable_AHUOBQ
            onPressHUContentBtn: function () {
                var oScrollContainer3 = this.byId("idPage3HUContents_AHUOBQ");
                var oScrollContainer2 = this.byId("idPage2BinNoTable_AHUOBQ");

                // Hide the BinTable Page2
                oScrollContainer2.setVisible(false);

                //Show the HUContents Page3
                oScrollContainer3.setVisible(true);
            },

            //Prod Description Btn from ScrollContainer Page 2=>idPage2BinNoTable_AHUOBQ
            onPressProductDescriptionBtn: function () {
                var oScrollContainer4 = this.byId("idPage4PrdDecsription_AHUOBQ");
                var oScrollContainer2 = this.byId("idPage2BinNoTable_AHUOBQ");

                // show the Product Description Page4
                oScrollContainer4.setVisible(true);

                //Hide the Table Of Bin Numbers Page2
                oScrollContainer2.setVisible(false);
            }, 

 

        });
    }
);
