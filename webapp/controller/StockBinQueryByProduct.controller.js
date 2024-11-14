sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent"
  ],
  function (BaseController, MessageToast, UIComponent) {
    "use strict";

    return BaseController.extend("com.app.rfapp.controller.StockBinQueryByProduct", {
      onInit: function () {
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
      },
      onResourceDetailsLoad: function (oEvent1) {
        var that = this;
        const { id } = oEvent1.getParameter("arguments");
        this.ID = id;
        console.log(this.ID);

    },
      onSBQPfirstBackBtnPress:async function(){
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
     
      onSBQPSecondBackBtnPress:function(){
            this.getView().byId("idFirstSC_SBQP").setVisible(true)
            this.getView().byId("idsecondSC_SBQP").setVisible(false)
            this.getView().byId("idfirstbackbtn_SBQP").setVisible(true)
            this.getView().byId("idSecondbackbtn_SBQP").setVisible(false)
           
      },
      onSBQPfirstBackBtnPress: async function () {
        var oRouter = UIComponent.getRouterFor(this);
        var oModel1 = this.getOwnerComponent().getModel();
        await oModel1.read("/RESOURCESSet('" + this.ID + "')", {
          success: function (oData) {
            let oUser = oData.Users.toLowerCase()
            if (oUser === "resource") {
              oRouter.navTo("RouteResourcePage", { id: this.ID });
            }
            else {
              oRouter.navTo("Supervisor", { id: this.ID });
            }
            this.getView().byId("idProductinput_SBQP").setValue("")
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
        this.sProductNo = sProductNo;

        // if (sProductNo.length < 10) {
        //   return;
        // }

        sProductNo = sProductNo.toUpperCase();
        this.sProductNo = sProductNo;

        if (!sProductNo) {
          sap.m.MessageToast.show("Please enter a bin number.");
          return;
        }

        // Call your backend service to fetch products for this bin
        var oModel = this.getView().getModel();
        var that = this;

        oModel.read(`/ProductHeadSet('${sProductNo}')`, {
          urlParameters: {
            "$expand": "ProductHeadtoItem",
            "$format": "json"
          },

          success: function (odata) {
            console.log(odata);
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
              // Check if enough time has passed since the last valid submission
              if (!that.lastValidSubmission || new Date() - that.lastValidSubmission > 9000) { // 9000 ms = 9 seconds
                sap.m.MessageToast.show("Enter a Valid Product.");
              }
            }
          },
          error: function () {
            if (!that.lastValidSubmission || new Date() - that.lastValidSubmission > 9000) {
              sap.m.MessageToast.show("Error fetching product data.");
            }
          }
        });
      },

      onSBQPSecondBackBtnPress: function () {
        this.getView().byId("idFirstSC_SBQP").setVisible(true)
        this.getView().byId("idsecondSC_SBQP").setVisible(false)
        this.getView().byId("idfirstbackbtn_SBQP").setVisible(true)
        this.getView().byId("idSecondbackbtn_SBQP").setVisible(false)

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
              this.getView().byId("idMaxWInput_SBQP").setValue(odata.GWeight);
              this.getView().byId("idUnitGwInput_SBQP").setValue(odata.UnitGw);
              this.getView().byId("idMaxVinput_SBQP").setValue(odata.GVolume);
              this.getView().byId("idUnitGvInput_SBQP").setValue(odata.UnitGv);
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

      onSBQPFourthBackBtnPress: function () {
        this.getView().byId("idFourthbackbtn_SBQP").setVisible(false);
        this.getView().byId("idSecondbackbtn_SBQP").setVisible(true);
        this.getView().byId("idsecondSC_SBQP").setVisible(true);
        this.getView().byId("idFourthSC_SBQP").setVisible(false);
      }
    });
  }
);

