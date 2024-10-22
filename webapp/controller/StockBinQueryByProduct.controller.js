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
            this.getView().byId("idSBQPFirstSC").setVisible(true)
            this.getView().byId("idSBQPsecondSC").setVisible(false)
            this.getView().byId("idSBQPfirstbackbtn").setVisible(true)
            this.getView().byId("idSBQPSecondbackbtn").setVisible(false)
           
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
          }.bind(this),
          error: function () {
            MessageToast.show("User does not exist");
          }
        });
      },

      // onSBQProductLiveChange:function(){
      //     // if(this.getView().byId("idSBQProductInput").getValue()=="800020"){
      //     this.getView().byId("idSBQPFirstSC").setVisible(false);
      //     this.getView().byId("idSBQPsecondSC").setVisible(true);
      //     this.getView().byId("idSBQPfirstbackbtn").setVisible(false);
      //     this.getView().byId("idSBQPSecondbackbtn").setVisible(true);
      //     var oProduct=this.getView().byId("idSBQProductInput").getValue();
      //     this.getView().byId("idSBQProductInput2").setValue(oProduct);
      //     this.getView().byId("idSBQProductInput2").setEditable(false);
      //     // }
      //     // else{
      //     //   MessageToast.show("please enter valid product")
      //     // }
      // },

      onpressProductsubmit: function () {
        var oView = this.getView();
        var sProductNo = oView.byId("idSBQProductInput").getValue();
        this.sProductNo = sProductNo;

        // if (!sProductNo) {
        //   sap.m.MessageToast.show("Please enter a bin number.");
        //   return;
        // }

        // Call your backend service to fetch products for this bin
        var oModel = this.getView().getModel(); // Assuming you have a model set up
        var that = this;

        oModel.read(`/ProductHeadSet('${sProductNo}')`, {
          urlParameters: {
            "$expand": "ProductHeadtoItem",
            "$format": "json"
          },

          success: function (odata) {
            console.log(odata)
            that.getView().byId("idSBQPFirstSC").setVisible(false);
            that.getView().byId("idSBQPsecondSC").setVisible(true);
            that.getView().byId("idSBQPfirstbackbtn").setVisible(false);
            that.getView().byId("idSBQPSecondbackbtn").setVisible(true);
            that.getView().byId("idSBQProductInput2").setEditable(false);
            that.getView().byId("idSBQProductInput2").setValue(sProductNo);

            // Get the product details from the response
            let oDetails = odata.ProductHeadtoItem.results;

            // Prepare an array for binding
            var aProductDetails = [];

            // Loop through the results and push them into the array
            for (var i = 0; i < oDetails.length; i++) {
              aProductDetails.push({
                Lgpla: oDetails[i].Lgpla,
                Nista: oDetails[i].Nista,
                Altme: oDetails[i].Altme
              });
            }


            // Create a JSON model with the product details array
            var oProductModel = new sap.ui.model.json.JSONModel({ products: aProductDetails });

            // Set the model to the table
            that.byId("idSBQPTable").setModel(oProductModel);

            // Bind the items aggregation of the table to the products array in the model
            that.byId("idSBQPTable").bindItems({
              path: "/products",
              template: new sap.m.ColumnListItem({
                cells: [
                  new sap.m.Text({ text: "{Lgpla}" }),  // Bins
                  new sap.m.Text({ text: "{Nista}" }),   // Pices
                  new sap.m.Text({ text: "{Altme}" })   // UOM
                ],
                type: "Navigation",
                press: [that.onSelectMaterial, that]
              })
            });
          },
          error: function () {
            sap.m.MessageToast.show("Error fetching products.");
          }
        });
      },
      onSBQPSecondBackBtnPress: function () {
        this.getView().byId("idSBQPFirstSC").setVisible(true)
        this.getView().byId("idSBQPsecondSC").setVisible(false)
        this.getView().byId("idSBQPfirstbackbtn").setVisible(true)
        this.getView().byId("idSBQPSecondbackbtn").setVisible(false)

      },
      // onSBQPPreDePress: function () {
      //     this.getView().byId("idSBQPsecondSC").setVisible(false);
      //     this.getView().byId("idSBQPThirdSC").setVisible(true);
      //     this.getView().byId("idSBQPSecondbackbtn").setVisible(false);
      //     this.getView().byId("idSBQPThirdbackbtn").setVisible(true);
      //   },
      onSBQPPreDePress: function () {
        var oModel = this.getView().getModel();
        var that = this;
        oModel.read(`/ProductHeadSet('${this.sProductNo}')`, {
          urlParameters: {
            "$expand": "ProductHeadtoItem",
            "$format": "json"
          },
          success: function (odata) {
            console.log(odata)
            var oView = that.getView();
            oView.byId("idInput_BinQProduct_Product").setValue(odata.Maktx);
            oView.byId("idSBQPTotWInput").setValue(odata.GWeight);
            oView.byId("idSBQPTotWInput2").setValue(odata.UnitGw);
            oView.byId("idSBQPTotVInput").setValue(odata.GVolume);
            oView.byId("idSBQPTotVInput2").setValue(odata.UnitGv);
          },
          error: function () {
            sap.m.MessageToast.show("Error fetching products.");
          }
        });
      },
      onSBQPPreDePress:function(){
        this.getView().byId("idSBQPsecondSC").setVisible(false);
        this.getView().byId("idSBQPThirdSC").setVisible(true);
        this.getView().byId("idSBQPSecondbackbtn").setVisible(false);
        this.getView().byId("idSBQPThirdbackbtn").setVisible(true);
      },
      onSBQPThirdBackBtnPress: function () {
        this.getView().byId("idSBQPsecondSC").setVisible(true);
        this.getView().byId("idSBQPThirdSC").setVisible(false);
        this.getView().byId("idSBQPSecondbackbtn").setVisible(true);
        this.getView().byId("idSBQPThirdbackbtn").setVisible(false);
      },
      onSBQPBinDePress: function () {
        this.getView().byId("idSBQPsecondSC").setVisible(false);
        this.getView().byId("idSBQPFourthSC").setVisible(true);
        this.getView().byId("idSBQPFourthbackbtn").setVisible(true);
        this.getView().byId("idSBQPThirdbackbtn").setVisible(false);
        this.getView().byId("idSBQPSecondbackbtn").setVisible(false);
      },
      onSBQPFourthBackBtnPress: function () {
        this.getView().byId("idSBQPFourthbackbtn").setVisible(false);
        this.getView().byId("idSBQPThirdbackbtn").setVisible(true);
        this.getView().byId("idSBQPsecondSC").setVisible(true);
        this.getView().byId("idSBQPFourthSC").setVisible(false);
      }
    });
  }
);

