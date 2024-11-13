sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
  ],
  function (BaseController, JSONModel) {
    "use strict";
 
    return BaseController.extend("com.app.rfapp.controller.WTQueryByHU", {
      // Initialization function
      onInit: function () {
        // Setup router to handle navigation
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
        
        // Create a local JSON model to hold warehouse task data
        const oLocalModel = new JSONModel({
          WarehouseTask: {
            WT: "",
            WTIt: "",
            WTs: "",
            Sts: "",
            Ptyp: "",
            Spro: "",
            Acty: "",
            ActyEmI: "",
            Pro: "",
            ProEmI: "",
            Sbin: "",
            SbinEmI: "",
            Dbin: "",
            DbinEmI: "",
            Cdat: "",
            CdatEmI: "",
            Cusr: "",
            PD: "",
            WO: "",
            ESTP: "",
            SQTY: "",
            SQTYEmI: "",
            Batch: "",
            Owner: "",
            PEnt: "",
            HUWT: "",
            H_Type: "",
            Wh_HU: "",
          },
        });
        
        // Set the local model to the view
        this.getView().setModel(oLocalModel, "localModel");
      },

      // Navigate back to the scanner form
      onPressBackButtonSecondSC: function () {
        this.getView().byId("idPage1ScannerFormBox_WTQBYHU").setVisible(true);
        this.getView().byId("idPage2HUNumberTable_WTQBYHU").setVisible(false);
      },

      // Load resource details based on the router event
      onResourceDetailsLoad: async function (oEvent1) {
        const { id } = oEvent1.getParameter("arguments");
        this.ID = id; // Store the resource ID for later use
      },

      // Handle selection of a specific warehouse task
      onSelectParticularWT: async function (oEvent) {
        const oHu = this.getView().byId("idHUNumberInput_WTQBYHU").getValue();
        const { WT } = oEvent.getSource().getSelectedItem().getBindingContext().getObject();
        console.log(WT);
        var oModel = this.getOwnerComponent().getModel();
        const oPayload = this.getView().getModel("localModel").getProperty("/");

        // Read data for the specified handling unit (HU)
        var that = this;
        await oModel.read(`/HUWTHSet('${oHu}')`, {
          urlParameters: {
            "$expand": "HUtoWT", // Expand the HUtoWT association
            "$format": "json"
          },
          success: function (odata) {
            // Process data if HU exists
            odata.HUtoWT.results.forEach(element => {
              if (element.Tanum === WT) {
                // Populate local model with the warehouse task details
                oPayload.WarehouseTask.WT = element.Tanum;
                oPayload.WarehouseTask.WTIt = element.Tapos;
                oPayload.WarehouseTask.WTs = element.Numwt;
                oPayload.WarehouseTask.Sts = element.Tostat;
                oPayload.WarehouseTask.Ptyp = element.Procty;
                oPayload.WarehouseTask.Spro = element.Prces;
                oPayload.WarehouseTask.Acty = element.ActType;
                oPayload.WarehouseTask.Pro = element.Matnr;
                oPayload.WarehouseTask.ProEmI = element.HazmatInd;
                oPayload.WarehouseTask.Sbin = element.Vlpla;
                oPayload.WarehouseTask.SbinEmI = element.Vlenr;
                oPayload.WarehouseTask.Dbin = element.Nlpla;
                oPayload.WarehouseTask.DbinEmI = element.Nlenr;

                // Format the confirmation date and time
                let dateStr = element.ConfD;
                let formattedDate = `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
                let milliseconds = element.ConfBy;
                let timeFormatted = `${Math.floor(milliseconds / (1000 * 60 * 60))}:${Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60))}:${Math.floor((milliseconds % (1000 * 60)) / 1000)}`;

                // Set formatted date and time into payload
                oPayload.WarehouseTask.Cdat = formattedDate;
                oPayload.WarehouseTask.CdatEmI = timeFormatted;
                oPayload.WarehouseTask.Cusr = element.ConfBy;
                oPayload.WarehouseTask.PD = element.Maktx;
                oPayload.WarehouseTask.WO = element.Who;
                oPayload.WarehouseTask.ESTP = element.Procs;
                oPayload.WarehouseTask.SQTY = element.Vsola;
                oPayload.WarehouseTask.SQTYEmI = element.Altme;
                oPayload.WarehouseTask.Owner = element.Owner;
                oPayload.WarehouseTask.PEnt = element.Entitled;
                oPayload.WarehouseTask.HUWT = element.Flghuto;
                oPayload.WarehouseTask.H_Type = element.Letyp;
                oPayload.WarehouseTask.Wh_HU = element.Vlenr;

                // Update the local model with the fetched data
                that.getView().getModel("localModel").setData(oPayload);
                that.getView().byId("idPage2HUNumberTable_WTQBYHU").setVisible(false);
                that.getView().byId("idPage3WTDetails_WTQBYHU").setVisible(true);
              }
            });
            console.log(odata);
          },
          error: function (oError) {
            // Handle error if HU is not found
          }
        });
      },

      // Navigate back from different pages in the UI
      onPressBackBtnPage1_WTQBYHU: async function () {
        var oRouter = this.getOwnerComponent().getRouter();
        var oModel1 = this.getOwnerComponent().getModel();
        await oModel1.read("/RESOURCESSet('" + this.ID + "')", {
          success: function (oData) {
            if (oData.Users === "RESOURCE") {
              oRouter.navTo("RouteResourcePage", { id: this.ID });
            } else {
              oRouter.navTo("Supervisor", { id: this.ID });
            }
          }.bind(this),
          error: function () {
            MessageToast.show("User does not exist");
          }
        });
      },

      // Back button logic for navigating to previous screens
      onBackPressHUNumbersTable: function () {
        var oScrollContainer2 = this.byId("idPage2HUNumberTable_WTQBYHU");
        var oScrollContainer1 = this.byId("idPage1ScannerFormBox_WTQBYHU");
        oScrollContainer1.setVisible(true); // Show scanner form
        oScrollContainer2.setVisible(false); // Hide HU numbers table
      },

      onBackPressBtnWTDetails_WTQBYHU: function () {
        var oScrollContainer3 = this.byId("idPage3WTDetails_WTQBYHU");
        var oScrollContainer2 = this.byId("idPage2HUNumberTable_WTQBYHU");
        oScrollContainer2.setVisible(true); // Show WT details
        oScrollContainer3.setVisible(false); // Hide WT detail view
      },

      onBackPressBtnProductDetails_WTQBYHU: function () {
        var oScrollContainer4 = this.byId("idPage4ProductDescription_WTQBYHU");
        var oScrollContainer3 = this.byId("idPage3WTDetails_WTQBYHU");
        oScrollContainer3.setVisible(true); // Show WT details
        oScrollContainer4.setVisible(false); // Hide product details
      },

      // Submit action from the scanner form
      onSubmitPressPage1_WTQBYHU: async function () {
        var oHuValue = this.getView().byId("idInputWTQueryByHU_WTQBYHU").getValue();
        this.tableContentDisplay(oHuValue); // Display the corresponding table content
      },

      // Functions for handling different button presses to filter and display warehouse tasks
      onWtQBQueueOpenBtnPress: function () {
        var oHu = this.getView().byId("idHUNumberInput_WTQBYHU").getValue();
        this.tableContentDisplay(oHu, "Open");
      },

      onWtQBQueueConfBtnPress: function () {
        var oHu = this.getView().byId("idHUNumberInput_WTQBYHU").getValue();
        this.tableContentDisplay(oHu, "Conf");
      },

      onWtQBQueueAllBtnPress: function () {
        var oHu = this.getView().byId("idHUNumberInput_WTQBYHU").getValue();
        this.tableContentDisplay(oHu, "All");
      },

      // Function to display table content based on the handling unit value and status
      tableContentDisplay: async function (oHuValue, status) {
        var that = this;
        var oModel = this.getOwnerComponent().getModel();
        if(oHuValue){
        await oModel.read(`/HUWTHSet('${oHuValue}')`, {
          urlParameters: {
            "$expand": "HUtoWT",
            "$format": "json"
          },
          success: function (odata) {
            if(odata.HUtoWT.results.length>0){

            
            // If HU exists, populate the input field and filter tasks based on status
            that.getView().byId("idHUNumberInput_WTQBYHU").setValue(odata.Huident);
            let oDetails = odata.HUtoWT.results;
            if (status === "Open") {
              oDetails = oDetails.filter(item => item.Tostat === "");
            } else if (status === "Conf") {
              oDetails = oDetails.filter(item => item.Tostat === "C");
            }
            
            // Prepare an array for binding to the table
            var aProductDetails = [];
            for (var i = 0; i < oDetails.length; i++) {
              aProductDetails.push({
                WT: oDetails[i].Tanum,
                WTS: oDetails[i].Tostat
              });
            }
            that.getView().byId("idInputWTS_WTQBYHU").setValue(oDetails.length);
            // Create a JSON model with the product details array
            var oProductModel = new sap.ui.model.json.JSONModel({ products: aProductDetails });
            that.byId("idHUNumTable_WTQBYHU").setModel(oProductModel); // Set the model to the table

            // Show the HU number table
            that.byId("idPage1ScannerFormBox_WTQBYHU").setVisible(false);
            that.byId("idPage2HUNumberTable_WTQBYHU").setVisible(true);
          }
        },
          error: function (oError) {
            // Handle error if HU is not found
          }
        });}
      },

      // Show warehouse task details when the corresponding button is pressed
      onPressWTBtnPage2_WTQBYHU: function () {
        var oScrollContainer2 = this.byId("idPage2HUNumberTable_WTQBYHU");
        var oScrollContainer3 = this.byId("idPage3WTDetails_WTQBYHU");
        oScrollContainer2.setVisible(false); // Hide the HU number table
        oScrollContainer3.setVisible(true); // Show the WT details
      },

      // Show product details from the WT details view
      onBtnDetailPressPage3_WTQBYHU: function () {
        var oScrollContainer3 = this.byId("idPage3WTDetails_WTQBYHU");
        var oScrollContainer4 = this.byId("idPage4ProductDescription_WTQBYHU");
        oScrollContainer3.setVisible(false); // Hide the WT details
        oScrollContainer4.setVisible(true); // Show the product details
      },

      // Handle successful scan events
      onScanSuccess: function (oEvent) {
        var sScannedProduct = oEvent.getParameter("text"); // Get the scanned product value
        this.getView().byId("idInputWTQueryByHU_WTQBYHU").setValue(sScannedProduct); // Set the value in the input
        this.onSubmitPressPage1_WTQBYHU(); // Trigger submission
      },
    });
  }
);
