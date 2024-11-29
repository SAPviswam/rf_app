sap.ui.define(
  [
    //"sap/ui/core/mvc/Controller",
    "./BaseController",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
  ],
  function (BaseController, Device, JSONModel, MessageToast) {
    "use strict";

    return BaseController.extend("com.app.rfapp.controller.WTQueryByHU", {
      // Initialization function
      onInit: function () {
        if (Device.system.phone) {
          this.getView().byId("idPage3WTDetails_WTQBYHU").setWidth("150%");
          this.getView().byId("idSimpleForm4_WTQBYHU").setWidth("150%");
          this.getView().byId("idPage4ProductDescription_WTQBYHU").setWidth("140%");
          this.getView().byId("idSimpleFormPage4PD_WTQBYHU").setWidth("140%");
          this.getView().byId("idTitle_WtQueryByHu").addStyleClass("titleMobile");
      }
      else if(Device.system.tablet){
        this.getView().byId("idHUNumTable_WTQBYHU").addStyleClass("tableScrollTab");

    }
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
            Trart: "",
            PEnt: "",
            HUWT: "",
            H_Type: "",
            Wh_HU: ""
          },

        });

        // Set the local model to the view
        this.getView().setModel(oLocalModel, "localModel");
        this.onPressBackButtonSecondSC();
      },
      //Avata Press function with Helper function...
      onPressAvatarWTQBYHU: function (oEvent) {
        this.onPressAvatarEveryTileHelperFunction(oEvent);
      },

      onSignoutPressed:function(){
				var oRouter = this.getOwnerComponent().getRouter(this);
				oRouter.navTo("InitialScreen"); 
			},
     
      onBeforeRendering:function(){
        this.onPressBackButtonSecondSC();
      },


      // Load resource details based on the router event
      onResourceDetailsLoad: async function (oEvent1) {
        const { id } = oEvent1.getParameter("arguments");
        this.ID = id; // Store the resource ID for later use
        //Profile image updating(from BaseController)...
        this.applyStoredProfileImage();
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
                oPayload.WarehouseTask.WTs = odata.HUtoWT.results.length;
                let smallToast=element.Tostat.toLowerCase();
                let oStatus=smallToast===""?"Open":(smallToast==="a"?"Canceled":(smallToast==="b"?"Waiting":"Confirmed"))
                oPayload.WarehouseTask.Sts = oStatus;

                oPayload.WarehouseTask.Ptyp = element.Procty;
                oPayload.WarehouseTask.Spro = element.Prces;
                oPayload.WarehouseTask.Acty = element.ActType;
                oPayload.WarehouseTask.ActyEmI = element.idplate;

                oPayload.WarehouseTask.Pro = element.Matnr;
                oPayload.WarehouseTask.ProEmI = element.Hazmat_Ind;
                oPayload.WarehouseTask.Sbin = element.Vlpla;
                oPayload.WarehouseTask.SbinEmI = element.Vlenr;
                oPayload.WarehouseTask.Dbin = element.Nlpla;
                oPayload.WarehouseTask.DbinEmI = element.Nlenr;
                oPayload.WarehouseTask.Trart = element.Trart;

                // Format the confirmation date and time
                let dateStr = element.ConfD;
                let formattedDate = `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
                let milliseconds = element.ConfT.ms; // Assuming element.ConfT holds the milliseconds

                // Calculate hours, minutes, and seconds
                let hours = Math.floor(milliseconds / (1000 * 60 * 60));
                let minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
                let seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

                // Format time to ensure two digits for minutes and seconds
                let timeFormatted = `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

                console.log(timeFormatted);
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
                oPayload.WarehouseTask.Batch = element.Charg;


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
        this.clear();
      },

      // back button logic in screen 2 Navigate back to the scanner form
      onPressBackButtonSecondSC: function () {
        this.getView().byId("idPage1ScannerFormBox_WTQBYHU").setVisible(true);
        this.getView().byId("idPage2HUNumberTable_WTQBYHU").setVisible(false);
        this.clear();
      },

      // back button logic in screen 3.
      onBackPressBtnWTDetails_WTQBYHU: function () {
        this.getView().byId("idPage2HUNumberTable_WTQBYHU").setVisible(true);
        this.getView().byId("idPage3WTDetails_WTQBYHU").setVisible(false);
      },


      // Screen 4 Back button logic for navigating to previous screens
      onBackPressBtnProductDetails_WTQBYHU: function () {
        this.getView().byId("idPage4ProductDescription_WTQBYHU").setVisible(false);
        this.getView().byId("idPage3WTDetails_WTQBYHU").setVisible(true);
      },

      onLiveChange: async function () {
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
        if (oHuValue) {
          await oModel.read(`/HUWTHSet('${oHuValue}')`, {
            urlParameters: {
              "$expand": "HUtoWT",
              "$format": "json"
            },
            success: function (odata) {
              if (odata.HUtoWT.results.length > 0) {


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
                    WTS:oDetails[i].Tostat.toLowerCase()===""?"Open":(oDetails[i].Tostat.toLowerCase()==="a"?"Canceled":(oDetails[i].Tostat.toLowerCase()==="b"?"Waiting":"Confirmed"))
                   
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
              else {
                MessageToast.show("Please enter correct Hu")
              }
            },
            error: function (oError) {
              // Handle error if HU is not found
              MessageToast.show("Please enter correct Hu")
            }
          });
        }
        else {
          MessageToast.show("Please enter correct Hu");
        }
      },


      // Show product details from the WT details view
      onBtnDetailPressPage3_WTQBYHU: function () {
  
        this.byId("idPage3WTDetails_WTQBYHU").setVisible(false);
        this.byId("idPage4ProductDescription_WTQBYHU").setVisible(true);
      },

      // Handle successful scan events
      onScanSuccess: function (oEvent) {
        var sScannedProduct = oEvent.getParameter("text"); // Get the scanned product value
        this.getView().byId("idInputWTQueryByHU_WTQBYHU").setValue(sScannedProduct); // Set the value in the input
        this.onLiveChange();
      },

      clear: function () {
        this.getView().byId("idInputWTQueryByHU_WTQBYHU").setValue();
      }
    });
  }
);