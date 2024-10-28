sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageToast",
        "sap/ui/core/UIComponent",
        "sap/ui/model/json/JSONModel",
    ],
    function(BaseController,MessageToast,UIComponent,JSONModel) {
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
        onSNLproductLiveChange: function () {
          // Get the input values from the input fields
          var oView = this.getView();
          var sProductNumber = oView.byId("idSNLproductInput").getValue();
          var sSerialNumber = oView.byId("idSNLSerialNoInput").getValue();
      
          // Ensure both product number and serial number are provided
          if (!sProductNumber || !sSerialNumber) {
              sap.m.MessageToast.show("Please enter both Product and Serial Number");
              return;
          }
      
          // Call your backend service to fetch products based on the provided keys
          var oModel = this.getView().getModel();
          var that = this;
      
          // Construct the request URL using the provided format
          var sRequestUrl = `/SerialNoLocationSet(Matnr40='${sProductNumber}',Serid='${sSerialNumber}')`;
      
          // Perform the read operation
          oModel.read(sRequestUrl, {
              success: function (odata) {
                  console.log(odata);
                  that.getView().byId("idSNLfirstBackBtn").setVisible(false);
                  that.getView().byId("idSNLFirstSC").setVisible(false);
                  that.getView().byId("idSNLthirdSC").setVisible(true);
                  that.getView().byId("idSNLsecondSC").setVisible(false);
                  that.getView().byId("idSNLProInput1").setEditable(false);
                  that.getView().byId("idSNLsnoInput1").setEditable(false);
                  that.getView().byId("idSNLSecondBackBtn").setVisible(false);
                  that.getView().byId("idSNLthirdBackBtn").setVisible(true);
                  that.getView().byId("idSNLSerialNoInput").setValue(sSerialNumber);
      
                  // Create a new JSON model to hold the data
            const oLocalModel = new sap.ui.model.json.JSONModel();

            // Assuming 'odata' contains the properties you need
            // If 'odata' is a single object, wrap it in an array to bind it to the table
            oLocalModel.setData({
                items: [
                    {
                        Binno: odata.Lgtyp,
                        Bin: odata.Lgpla,
                        product: odata.Matnr40,
                        pc: odata.Altme
                    }
                ]
            });

            // Set the JSON model to the view
            that.getView().setModel(oLocalModel, "oLocalModel");

            // Bind the items aggregation of the table to the local model
            that.byId("idSNLTable").bindItems({
                path: "oLocalModel>/items", // Path to the items array in your local model
                template: new sap.m.ColumnListItem({
                    cells: [
                        new sap.m.Text({ text: "{oLocalModel>Binno}" }), // Bin No
                        new sap.m.Text({ text: "{oLocalModel>Bin}" }),
                        new sap.m.Text({ text: "{oLocalModel>product}" }), // Bin
                        new sap.m.Text({ text: "{oLocalModel>pc}" })      // pc
                    ]
                })
            });
        },
        error: function () {
            sap.m.MessageToast.show("Error fetching products.");
        }
    });
},
        // onSNLsnoLiveChange:function () {
              
        //     // Get the input value from the input field
        //     var oView = this.getView();
        //     var sProductNumber = oView.byId("idSNLProInput").getValue();
        //     var sSerialNumber = oView.byId("idSNLsnoInput").getValue();
        //     this.sProductNumber = sProductNumber;
        //     this.sSerialNumber = sSerialNumber;
      
        //     // Check if bin number is provided
        //     if (!sSerialNumber) {
        //       sap.m.MessageToast.show("Please enter a SerialNumber");
        //       return;
        //     }
      
        //     // Call your backend service to fetch products for this bin
        //     var oModel = this.getView().getModel(); // Assuming you have a model set up
        //     var that = this;
      
        //     oModel.read(`/SerialNoLocationSet('${sProductNumber}')`, {
        //       success: function (odata) {
        //         console.log(odata);
        //         that.getView().byId("idSNLthirdSC").setVisible(true);
        //         that.getView().byId("idSNLsecondSC").setVisible(false);
        //         that.getView().byId("idSNLProInput1").setEditable(false);
        //         that.getView().byId("idSNLsnoInput1").setEditable(false);
        //         that.getView().byId("idSNLSecondBackBtn").setVisible(false);
        //         that.getView().byId("idSNLthirdBackBtn").setVisible(true);
        //         that.getView().byId("idSNLsnoInput").setValue(sSerialNumber);
      
        //         // Get the product details from the response
        //         let oDetails = odata.SerialNoLocationSet.results;
      
        //         // Prepare an array for binding
        //         var aProductDetails = [];
      
        //         // Loop through the results and push them into the array
        //         for (var i = 0; i < oDetails.length; i++) {
        //           if (oDetails[i].Matnr40 === oDetails[i].Serid) {
        //             aProductDetails.push({
        //                 Lgpla: oDetails[i].Lgpla,
        //                 Lgtyp: oDetails[i].Lgtyp,
        //                 Lgber: oDetails[i].Lgber
        //             });
        //           }
        //         }
      
                
        //         // Create a JSON model with the product details array
        //         var oProductModel = new sap.ui.model.json.JSONModel({ products: aProductDetails });
      
        //         // Set the model to the table
        //         that.byId("idSNLTable").setModel(oProductModel);
      
        //         // Bind the items aggregation of the table to the products array in the model
        //         that.byId("idSNLTable").bindItems({
        //           path: "/products",
        //           template: new sap.m.ColumnListItem({
        //             cells: [
        //               new sap.m.Text({ text: "{Lgpla}" }),  // Hu
        //               new sap.m.Text({ text: "{Lgtyp}" }),   // 
        //               new sap.m.Text({ text: "{Lgber}" })   // 
        //             ],
                  
        //           })
        //         });
        //       },
        //       error: function () {
        //         sap.m.MessageToast.show("Error fetching products.");
        //       }
        //     });
        //   },


        //for selecting a row
        onSelectionChange: function (oEvent) {
          // Get the selected item
          var oSelectedItem = oEvent.getParameter("listItem");
     
          if (oSelectedItem) {
              // Get the binding context of the selected item
              this._selectedRowContext = oSelectedItem.getBindingContext();
          } else {
              // Deselecting the item
              this._selectedRowContext = null;
          }
      },
      // when we press Product description
      
      onSNLPreDePress:function (oEvent) {
        // Get the selected row's context from the table
        var oTable = this.byId("idSNLTable"); // Replace with your table ID
       
        var oSelectedItem = oTable.getSelectedItem(); // Get selected item from the table
   
        // if (!oSelectedItem) {
        //     sap.m.MessageToast.show("There is no product available. Please select another row.");
        //     return;
        // }
   
        var sSelectedMatnr = oSelectedItem.getBindingContext().getProperty("Matnr40");
       
        // // Check if the selected material number is valid
        // if (!sSelectedMatnr) {
        //     sap.m.MessageToast.show("There is no product available. Please select another row.");
        //     return;
        // }
   
        var oModel = this.getView().getModel();
   
        oModel.read(`/SerialNoLocationSet('${sSelectedMatnr}')`, {
            success: (odata) => {
                console.log(odata);
                // Check if there are any details returned
                // if (aBindetails.length === 0) {
                //     sap.m.MessageToast.show("No product details found for the selected item.");
                //     return;
                // }
   
                // Update the UI with the selected material's details
                
                    if (odata.Matnr40 === sSelectedMatnr) {
                        this.getView().byId("idSNLSnoInput").setValue(odata.Serid);
                        this.getView().byId("idSNLTotWInput").setValue(odata.Matnr40);
                    }
   
                // Show product description page and hide the previous table
              this.getView().byId("idSNLthirdSC").setVisible(false);
              this.getView().byId("idSNLfourthSC").setVisible(true);
              this.getView().byId("idSNLfourthBackBtn").setVisible(true);
              this.getView().byId("idSNLthirdBackBtn").setVisible(false);
 
            },
            error: function () {
                sap.m.MessageToast.show("Error fetching product details.");
            }
        });
    },
        onSNLthirdBackBtnPress:function(){
            this.getView().byId("idSNLfirstBackBtn").setVisible(true);
            this.getView().byId("idSNLthirdBackBtn").setVisible(false);
            this.getView().byId("idSNLthirdSC").setVisible(false);
            this.getView().byId("idSNLFirstSC").setVisible(true);

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
  