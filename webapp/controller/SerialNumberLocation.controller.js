sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageToast",
        "sap/ui/core/UIComponent"
    ],
    function(BaseController,MessageToast,UIComponent) {
      "use strict";
  
      return BaseController.extend("com.app.rfapp.controller.SerialNumberLocation", {
        onInit: function() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
        },
        onResourceDetailsLoad:function(oEvent1){
            var that = this;
            const { id } = oEvent1.getParameter("arguments");
            this.ID = id;
            console.log(this.ID);
        },

         onSNLfirxtBackBtnPress:async function(){
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
        onSNLproductLiveChange:function () {
              
            // Get the input value from the input field
            var oView = this.getView();
            var sProductNumber = oView.byId("idSNLproductInput").getValue();
            this.sProductNumber = sProductNumber;
      
            // Check if bin number is provided
            if (!sProductNumber) {
              sap.m.MessageToast.show("Please enter a Product.");
              return;
            }
      
            // Call your backend service to fetch products for this bin
            var oModel = this.getView().getModel(); // Assuming you have a model set up
            var that = this;
      
            oModel.read(`/SerialNoLocationSet('${sProductNumber}')`, {
              success: function (odata) {
                console.log(odata);
                that.getView().byId("idSNLFirstSC").setVisible(false);
                that.getView().byId("idSNLsecondSC").setVisible(true);
                that.getView().byId("idSNLProInput").setEditable(false);
                that.getView().byId("idSNLSecondBackBtn").setVisible(true);
                that.getView().byId("idSNLfirstBackBtn").setVisible(false);
                that.getView().byId("idSNLProInput").setValue(sProductNumber);
      
                // Get the product details from the response
                let oDetails = odata.SerialNoLocationSet.results;
      
                // Prepare an array for binding
                // var aProductDetails = [];
      
                // // Loop through the results and push them into the array
                // for (var i = 0; i < oDetails.length; i++) {
                //   if (oDetails[i].Huident) {
                //     aProductDetails.push({
                //         Huident: oDetails[i].Huident,
                //         Matnr: oDetails[i].Matnr,
                //         Flgmove: oDetails[i].Flgmove
                //     });
                //   }
                // }
      
                
                // Create a JSON model with the product details array
                // var oProductModel = new sap.ui.model.json.JSONModel({ products: aProductDetails });
      
                // // Set the model to the table
                // that.byId("idBinNumTable_AHUOBQ").setModel(oProductModel);
      
                // // Bind the items aggregation of the table to the products array in the model
                // that.byId("idBinNumTable_AHUOBQ").bindItems({
                //   path: "/products",
                //   template: new sap.m.ColumnListItem({
                //     cells: [
                //       new sap.m.Text({ text: "{Huident}" }),  // Hu
                //       new sap.m.Text({ text: "{Matnr}" }),   // 
                //       new sap.m.Text({ text: "{Flgmove}" })   // 
                //     ],
                  
                //   })
                // });
              },
              error: function () {
                sap.m.MessageToast.show("Error fetching products.");
              }
            });
          },
        onSNLSecondBackBtnPress:function(){
            this.getView().byId("idSNLFirstSC").setVisible(true);
            this.getView().byId("idSNLsecondSC").setVisible(false);
            this.getView().byId("idSNLSecondBackBtn").setVisible(false);
            this.getView().byId("idSNLfirstBackBtn").setVisible(true);
        },
        onSNLsnoLiveChange:function () {
              
            // Get the input value from the input field
            var oView = this.getView();
            var sProductNumber = oView.byId("idSNLProInput").getValue();
            var sSerialNumber = oView.byId("idSNLsnoInput").getValue();
            this.sProductNumber = sProductNumber;
            this.sSerialNumber = sSerialNumber;
      
            // Check if bin number is provided
            if (!sSerialNumber) {
              sap.m.MessageToast.show("Please enter a SerialNumber");
              return;
            }
      
            // Call your backend service to fetch products for this bin
            var oModel = this.getView().getModel(); // Assuming you have a model set up
            var that = this;
      
            oModel.read(`/SerialNoLocationSet('${sProductNumber}')`, {
              success: function (odata) {
                console.log(odata);
                that.getView().byId("idSNLthirdSC").setVisible(true);
                that.getView().byId("idSNLsecondSC").setVisible(false);
                that.getView().byId("idSNLProInput1").setEditable(false);
                that.getView().byId("idSNLsnoInput1").setEditable(false);
                that.getView().byId("idSNLSecondBackBtn").setVisible(false);
                that.getView().byId("idSNLthirdBackBtn").setVisible(true);
                that.getView().byId("idSNLsnoInput").setValue(sSerialNumber);
      
                // Get the product details from the response
                let oDetails = odata.SerialNoLocationSet.results;
      
                // Prepare an array for binding
                var aProductDetails = [];
      
                // Loop through the results and push them into the array
                for (var i = 0; i < oDetails.length; i++) {
                  if (oDetails[i].Matnr40 === oDetails[i].Serid) {
                    aProductDetails.push({
                        Lgpla: oDetails[i].Lgpla,
                        Lgtyp: oDetails[i].Lgtyp,
                        Lgber: oDetails[i].Lgber
                    });
                  }
                }
      
                
                // Create a JSON model with the product details array
                var oProductModel = new sap.ui.model.json.JSONModel({ products: aProductDetails });
      
                // Set the model to the table
                that.byId("idSNLTable").setModel(oProductModel);
      
                // Bind the items aggregation of the table to the products array in the model
                that.byId("idSNLTable").bindItems({
                  path: "/products",
                  template: new sap.m.ColumnListItem({
                    cells: [
                      new sap.m.Text({ text: "{Lgpla}" }),  // Hu
                      new sap.m.Text({ text: "{Lgtyp}" }),   // 
                      new sap.m.Text({ text: "{Lgber}" })   // 
                    ],
                  
                  })
                });
              },
              error: function () {
                sap.m.MessageToast.show("Error fetching products.");
              }
            });
          },
        onSNLthirdBackBtnPress:function(){
            this.getView().byId("idSNLSecondBackBtn").setVisible(true);
            this.getView().byId("idSNLthirdBackBtn").setVisible(false);
            this.getView().byId("idSNLthirdSC").setVisible(false);
            this.getView().byId("idSNLsecondSC").setVisible(true);

        },
        onSNLPreDePress:function(){
            this.getView().byId("idSNLthirdSC").setVisible(false);
            this.getView().byId("idSNLfourthSC").setVisible(true);
            this.getView().byId("idSNLfourthBackBtn").setVisible(true);
            this.getView().byId("idSNLthirdBackBtn").setVisible(false);
        },

        onSNLfourthBackBtnPress:function(){
            this.getView().byId("idSNLthirdSC").setVisible(true);
            this.getView().byId("idSNLfourthSC").setVisible(false);
            this.getView().byId("idSNLfourthBackBtn").setVisible(false);
            this.getView().byId("idSNLthirdBackBtn").setVisible(true);
        },
        onSNLBinDePress:function(){
            this.getView().byId("idSNLthirdSC").setVisible(false);
            this.getView().byId("idSNLFifthSC").setVisible(true);
            this.getView().byId("idSNLfifthBackBtn").setVisible(true);
            this.getView().byId("idSNLthirdBackBtn").setVisible(false);
        },
        onSNLfifthBackBtnPress:function(){
            this.getView().byId("idSNLthirdSC").setVisible(true);
            this.getView().byId("idSNLFifthSC").setVisible(false);
            this.getView().byId("idSNLfifthBackBtn").setVisible(false);
            this.getView().byId("idSNLthirdBackBtn").setVisible(true);
        }
      });
    }
  );
  