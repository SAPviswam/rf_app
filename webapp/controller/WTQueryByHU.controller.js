sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
  ],
  function (BaseController,JSONModel) {
    "use strict";
 
    return BaseController.extend("com.app.rfapp.controller.WTQueryByHU", {
      onInit: function () {
        // const oTable = this.getView().byId("idHUNumTable_WTQBYHU");
        // oTable.attachBrowserEvent("dblclick", this.onRowDoubleClick.bind(this));
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
        const oLocalModel = new JSONModel({
 
          WarehouseTask: {
            WT:"",
            WTIt:"",
            WTs:"",
            Sts:"",
            Ptyp:"",
            Spro:"",
            Acty:"",
            ActyEmI:"",
            Pro:"",
            ProEmI:"",
            Sbin:"",
            SbinEmI:"",
            Dbin:"",
            DbinEmI:"",
            Cdat:"",
            CdatEmI:"",
            Cusr:"",
            WO:"",
            ESTP:"",
            SQTY:"",
            SQTYEmI:"",
            Batch:"",
            Owner:"",
            PEnt:"",
            HUWT:"",
            H_Type:"",
            Wh_HU:"",
          },
         
 
      });
      this.getView().setModel(oLocalModel, "localModel");
 
      },
      onPressBackButtonSecondSC:function(){
        this.getView().byId("idPage1ScannerFormBox_WTQBYHU").setVisible(true);
        this.getView().byId("idPage2HUNumberTable_WTQBYHU").setVisible(false)
      },
      onResourceDetailsLoad: async function (oEvent1) {
        const { id } = oEvent1.getParameter("arguments");
        this.ID = id;
      },
      onSelectParticularWT:async function (oEvent) {
        const oHu=this.getView().byId("idHUNumberInput_WTQBYHU").getValue();
        const {WT} = oEvent.getSource().getSelectedItem().getBindingContext().getObject();
        console.log(WT)
        var oModel = this.getOwnerComponent().getModel();
        const oPayload = this.getView().getModel("localModel").getProperty("/"); 

 

// // bind the data to the view 
      

// this.getView().getModel("newProductModel").setData(oPayload); 
        console.log(oPayload)
        var that=this;
        await oModel.read(`/HUWTHSet('${oHu}')`, {
          urlParameters: {
            "$expand": "HUtoWT",
            "$format": "json"
          },
          success: function (odata) {
            // If HU exists, show icon2 and hide icon1
            odata.HUtoWT.results.forEach(element => {
              if(element.Tanum===WT){
                oPayload.WarehouseTask.WT=element.Tanum;
                oPayload.WarehouseTask.WTIt=element.Tapos;
                oPayload.WarehouseTask.WTs=element.Numwt;
                oPayload.WarehouseTask.Sts=element.Tostat;
                oPayload.WarehouseTask.Ptyp=element.Procty;
                oPayload.WarehouseTask.Spro=element.Prces;
                oPayload.WarehouseTask.Acty=element.ActType;
                //oPayload.WarehouseTask.ActyEmI=element.Tanum;
                oPayload.WarehouseTask.Pro=element.Matnr;
                oPayload.WarehouseTask.ProEmI=element.HazmatInd;
                oPayload.WarehouseTask.Sbin=element.Vlpla;
                oPayload.WarehouseTask.SbinEmI=element.Vlenr;
                oPayload.WarehouseTask.Dbin=element.Nlpla;
                oPayload.WarehouseTask.DbinEmI=element.Nlenr;
                oPayload.WarehouseTask.Cdat=element.ConfD;
                //oPayload.WarehouseTask.CdatEmI=element.ConfT.ms;
                oPayload.WarehouseTask.Cusr=element.ConfBy;
                oPayload.WarehouseTask.WO=element.Who;
                oPayload.WarehouseTask.ESTP=element.Procs;
                oPayload.WarehouseTask.SQTY=element.Vsola;
                oPayload.WarehouseTask.SQTYEmI=element.Tostat
                // oPayload.WarehouseTask.Batch=element.Tanum;
                oPayload.WarehouseTask.Owner=element.Owner;
                oPayload.WarehouseTask.PEnt=element.Entitled;
                //oPayload.WarehouseTask.HUWT=element.Tanum;
                oPayload.WarehouseTask.H_Type=element.Letyp;
                oPayload.WarehouseTask.Wh_HU=element.Vlenr;
                

              
                that.getView().getModel("localModel").setData(oPayload);
                that.getView().byId("idPage2HUNumberTable_WTQBYHU").setVisible(false);
        that.getView().byId("idPage3WTDetails_WTQBYHU").setVisible(true);
               
              }
            });
           console.log(odata)
           
 
          },
          error: function (oError) {
            // Show error message if HU is not found
          }
        });

        
       
    },
      // onRowDoubleClick: function () {
      //   var oSelected = this.getView().byId("idHUNumTable_WTQBYHU").getSelectedItem();
      //   console.log(oSelected.getBindingContext().getObject());
      //   var oObj = oSelected.getBindingContext().getObject();
      //   //this.onSelectRow(oObj.HUI);
      // },
      //Back Btn from 1st ScrollContainer Page 1 =>idPage1ScannerFormBox_WTQBYHU
      onPressBackBtnPage1_WTQBYHU: async function () {
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
 
      //Back Btn from ScrollContainer Page 2 =>idPage2HUNumberTable_WTQBYHU
      onBackPressHUNumbersTable: function () {
        var oScrollContainer2 = this.byId("idPage2HUNumberTable_WTQBYHU");
        var oScrollContainer1 = this.byId("idPage1ScannerFormBox_WTQBYHU");
 
        // show the Scanner form VBox
        oScrollContainer1.setVisible(true);
 
        //Hide the HUNumbers Table scroll container
        oScrollContainer2.setVisible(false);
      },
 
      //Back Btn from ScrollContainer Page 3 =>idPage3WTDetails_WTQBYHU
      onBackPressBtnWTDetails_WTQBYHU: function () {
        var oScrollContainer3 = this.byId("idPage3WTDetails_WTQBYHU");
        var oScrollContainer2 = this.byId("idPage2HUNumberTable_WTQBYHU");
 
        // show the Table Contents
        oScrollContainer2.setVisible(true);
 
        //Hide the HUContents scroll container
        oScrollContainer3.setVisible(false);
      },
      //Back Btn from ScrollContainer Page 4 =>idPage4ProductDescription_WTQBYHU
      onBackPressBtnProductDetails_WTQBYHU: function () {
        var oScrollContainer4 = this.byId("idPage4ProductDescription_WTQBYHU");
        var oScrollContainer3 = this.byId("idPage3WTDetails_WTQBYHU");
 
        // show the WT Details Contents
        oScrollContainer3.setVisible(true);
 
        //Hide the Product Details scroll container
        oScrollContainer4.setVisible(false);
      },
 
 
 
      //Submit Btn from ScrollContainer Page 1=> idPage1ScannerFormBox_WTQBYHU..
      onSubmitPressPage1_WTQBYHU:async function () {
 
        var oHuValue = this.getView().byId("idInputWTQueryByHU_WTQBYHU").getValue();
        this.tableContentDisplay(oHuValue)
       
 
      },

      onWtQBQueueOpenBtnPress:function(){
        var oHu = this.getView().byId("idHUNumberInput_WTQBYHU").getValue();
        this.tableContentDisplay(oHu,"Open")
      },
      onWtQBQueueConfBtnPress:function(){
        var oHu = this.getView().byId("idHUNumberInput_WTQBYHU").getValue();
        this.tableContentDisplay(oHu,"Conf")
      },
      onWtQBQueueAllBtnPress:function(){
        var oHu = this.getView().byId("idHUNumberInput_WTQBYHU").getValue();
        this.tableContentDisplay(oHu,"All")
      },

      tableContentDisplay: async function (oHuValue,status) {
        var that=this;
        var oModel = this.getOwnerComponent().getModel();
        await oModel.read(`/HUWTHSet('${oHuValue}')`, {
          urlParameters: {
 
            "$expand": "HUtoWT",
            "$format": "json"
          },
          success: function (odata) {
            // If HU exists, show icon2 and hide icon1
           
            that.getView().byId("idHUNumberInput_WTQBYHU").setValue(odata.Huident);
            let oDetails = odata.HUtoWT.results;
            if(status==="Open"){
              oDetails=oDetails.filter(item =>  item.Tostat=== "");
            }
            else if(status==="Conf"){
              oDetails=oDetails.filter(item =>  item.Tostat=== "C");
            }
            
            
            console.log(oDetails);
 
            // Prepare an array for binding
            var aProductDetails = [];
 
            // Loop through the results and push them into the array
            for (var i = 0; i < oDetails.length; i++) {
              
              aProductDetails.push({
                WT: oDetails[i].Tanum,
                WTS:oDetails[i].Tostat
              });
            }
            that.getView().byId("idInputWTS_WTQBYHU").setValue(oDetails.length);
          console.log(aProductDetails);
            // Create a JSON model with the product details array
            var oProductModel = new sap.ui.model.json.JSONModel({ products: aProductDetails });
       
            // Set the model to the table
            that.byId("idHUNumTable_WTQBYHU").setModel(oProductModel);
            var oScrollContainer1 = that.byId("idPage1ScannerFormBox_WTQBYHU");
            var oScrollContainer2 = that.byId("idPage2HUNumberTable_WTQBYHU");
            oScrollContainer1.setVisible(false);
 
            // Show the HUNumber Table scroll container
            oScrollContainer2.setVisible(true);
 
          },
          error: function (oError) {
            // Show error message if HU is not found
          }
        });
        
      },



 
      //WT Btn from ScrollContainer Page 2=> idPage2HUNumberTable_WTQBYHU..
      onPressWTBtnPage2_WTQBYHU: function () {
        var oScrollContainer2 = this.byId("idPage2HUNumberTable_WTQBYHU");
        var oScrollContainer3 = this.byId("idPage3WTDetails_WTQBYHU");
 
        // Hide the HUNumber Table...
        oScrollContainer2.setVisible(false);
 
        // Show the Wt Details...
        oScrollContainer3.setVisible(true);
      },
 
      //Detail Btn from ScrollContainer Page 3=> idPage3WTDetails_WTQBYHU..
      onBtnDetailPressPage3_WTQBYHU: function () {
        var oScrollContainer3 = this.byId("idPage3WTDetails_WTQBYHU");
        var oScrollContainer4 = this.byId("idPage4ProductDescription_WTQBYHU");
 
        // Hide the WT Details...
        oScrollContainer3.setVisible(false);
 
        // Show the Product Details...
        oScrollContainer4.setVisible(true);
      },
    });
  }
);
 
 