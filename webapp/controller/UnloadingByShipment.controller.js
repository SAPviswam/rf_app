sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device",
	"sap/ui/model/json/JSONModel",
	"sap/m/Popover",
	"sap/m/Button",
	"sap/m/library"
],
function (Controller,Device,JSONModel,Popover,Button,library) {
    "use strict";

    return Controller.extend("com.app.rfapp.controller.UnloadingByShipment", {
        onInit: function () {
            const oTable = this.getView().byId("idTable_UBYSHP");
            oTable.attachBrowserEvent("dblclick", this.onRowDoubleClick.bind(this));
			const oRouter = this.getOwnerComponent().getRouter();

                oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);

        },
        onResourceDetailsLoad: async function (oEvent1) {

            const { id } = oEvent1.getParameter("arguments");

            this.ID = id;

        },
        onRowDoubleClick: function () {
            debugger
            var oSelected = this.byId("idTable_UBYSHP").getSelectedItem();
            // var ID = oSelected.getBindingContext().getObject()
            this.getView().byId("page1Shipment_UBYSHP").setVisible(false);
            this.getView().byId("page2Shipment_UBYSHP").setVisible(true);
        },
       
        Onpressback0: async function () {
            const oRouter = this.getOwnerComponent().getRouter();
     
            var oModel1 = this.getOwnerComponent().getModel();
     
            await oModel1.read("/RESOURCESSet('" + this.ID + "')", {
     
              success: function (oData) {
                let oUser=oData.Users.toLowerCase()
                if (oUser === "resource") {
     
                  oRouter.navTo("RouteResourcePage", { id: this.ID });
     
                }
     
                else {
     
                  oRouter.navTo("Supervisor", { id: this.ID });
                }
     
              }.bind(this),
     
              error: function () {
     
                sap.m.MessageToast.show("User does not exist");
     
              }
            });
        },
        Onpresssubmit: function () {

            this.getView().byId("page1Shipment_UBYSHP").setVisible(true);
            // this.getView().byId("page2Shipment_UBYSHP").setVisible(true);
            this.getView().byId("page2Shipment_UBYSHP").setVisible(false);
            this.getView().byId("idPanel_UBYSHP").setVisible(true);
            this.getView().byId("idNavBackButton0_UBYSHP").setVisible(false);
            this.getView().byId("idNavBackButton0_1_UBYSHP").setVisible(true);
           

        },
        OnpressbackToInput:function(){
            this.getView().byId("idPanel_UBYSHP").setVisible(false);
            this.getView().byId("idNavBackButton0_1_UBYSHP").setVisible(false);
            this.getView().byId("idNavBackButton0_UBYSHP").setVisible(true);



        },
        // onTableRowSelect: function (oEvent) {
        //     // Get the selected item
        //     var oTable = this.getView().byId("idHuIwsdfgnfoTable");
        //     var oSelectedItem = oTable.getSelectedItem();
            
        //     if (oSelectedItem) {
              
        //         this.getView().byId("page1Shipment_UBYSHP").setVisible(false);
        //         this.getView().byId("page2Shipment_UBYSHP").setVisible(true);
        
                
        //         var sSerialNo = oSelectedItem.getBindingContext().getProperty("serialNo");
        //         var sDelivery = oSelectedItem.getBindingContext().getProperty("Delivery");
                
              
        //         console.log("Selected Serial No:", sSerialNo);
        //         console.log("Selected Delivery:", sDelivery);
        //     }
        // },
        Onpressback1: function () {

            this.getView().byId("page1Shipment_UBYSHP").setVisible(true);
            this.getView().byId("page2Shipment_UBYSHP").setVisible(false);

        },
        onHUListPress:function () {

            this.getView().byId("page1Shipment_UBYSHP").setVisible(false);
            this.getView().byId("page2Shipment_UBYSHP").setVisible(false);
            this.getView().byId("page3Shipment_UBYSHP").setVisible(true);
           
         
        },
        Onpressback2:function(){
            
            this.getView().byId("page1Shipment_UBYSHP").setVisible(false);
            this.getView().byId("page2Shipment_UBYSHP").setVisible(true);
            this.getView().byId("page3Shipment_UBYSHP").setVisible(false);
           
            
            
        },
        onNewHUPress:function(){
            this.getView().byId("page1Shipment_UBYSHP").setVisible(false);
            this.getView().byId("page2Shipment_UBYSHP").setVisible(false);
            this.getView().byId("page3Shipment_UBYSHP").setVisible(false);
           
            this.getView().byId("page4Shipment_UBYSHP").setVisible(true);
            this.getView().byId("page5Shipment_UBYSHP").setVisible(false);

         
        },
        Onpressback3:function(){
            this.getView().byId("page1Shipment_UBYSHP").setVisible(false);
            this.getView().byId("page2Shipment_UBYSHP").setVisible(true);
            this.getView().byId("page4Shipment_UBYSHP").setVisible(false);
           
        },
        onNextEnterpress:function(){
            this.getView().byId("page5Shipment_UBYSHP").setVisible(true);
           
            this.getView().byId("page4Shipment_UBYSHP").setVisible(false);
           
            this.getView().byId("page1Shipment_UBYSHP").setVisible(false);
            this.getView().byId("page2Shipment_UBYSHP").setVisible(false);

            
        },
        Onpressback4:function(){
            this.getView().byId("page1Shipment_UBYSHP").setVisible(false);
            this.getView().byId("page5Shipment_UBYSHP").setVisible(false);
           
            this.getView().byId("page4Shipment_UBYSHP").setVisible(true);
            this.getView().byId("page3Shipment_UBYSHP").setVisible(false);

         
        
            this.getView().byId("page2Shipment_UBYSHP").setVisible(false);

            
        },
        onGRPress:function(){
            this.getView().byId("page6Shipment_UBYSHP").setVisible(true);
            this.getView().byId("page5Shipment_UBYSHP").setVisible(false);
            this.getView().byId("page4Shipment_UBYSHP").setVisible(false);
           

            this.getView().byId("page1Shipment_UBYSHP").setVisible(false);
            this.getView().byId("page2Shipment_UBYSHP").setVisible(false);


        },
        Onpressback5:function(){
            this.getView().byId("page1Shipment_UBYSHP").setVisible(false);
            this.getView().byId("page5Shipment_UBYSHP").setVisible(true);
            this.getView().byId("page6Shipment_UBYSHP").setVisible(false);
            
           
            this.getView().byId("page4Shipment_UBYSHP").setVisible(false);
          

        
            this.getView().byId("page2Shipment_UBYSHP").setVisible(false);

            
        },
        onUnloadPress:function(){
            this.getView().byId("page6Shipment_UBYSHP").setVisible(false);
            this.getView().byId("page5Shipment_UBYSHP").setVisible(false);
            this.getView().byId("page4Shipment_UBYSHP").setVisible(false);
            this.getView().byId("page7billofLading").setVisible(true);

           
            this.getView().byId("page1Shipment_UBYSHP").setVisible(false);
            this.getView().byId("page2Shipment_UBYSHP").setVisible(false);


        },

       
        // onUnloadPress1:function(){
        //     this.getView().byId("page6Shipment_UBYSHP").setVisible(false);
        //     this.getView().byId("page5Shipment_UBYSHP").setVisible(false);
        //     this.getView().byId("page4Shipment_UBYSHP").setVisible(false);
        //     this.getView().byId("page7billofLading").setVisible(true);

        //     this.getView().byId("_IDGenButton4444").setVisible(false); 
        //     this.getView().byId("_IDGenButton2222").setVisible(false);
        //     this.getView().byId("_IDGenButton3333").setVisible(false);  
        //     this.getView().byId("_IDGenButton1111").setVisible(false);
        //     this.getView().byId("_IDGenButton5555").setVisible(false);
        //     this.getView().byId("_IDGenButton6666").setVisible(false);
           


        //     this.getView().byId("page1Shipment_UBYSHP").setVisible(false);
        //     this.getView().byId("page2Shipment_UBYSHP").setVisible(false);


        // },
        Onpressback6:function(){
            this.getView().byId("page1Shipment_UBYSHP").setVisible(false);
            this.getView().byId("page5Shipment_UBYSHP").setVisible(true);
            this.getView().byId("icon7").setVisible(false);
            this.getView().byId("page6Shipment_UBYSHP").setVisible(false);
           
            this.getView().byId("page3Shipment_UBYSHP").setVisible(false);
         
            this.getView().byId("page4Shipment_UBYSHP").setVisible(false);

        
            this.getView().byId("page2Shipment_UBYSHP").setVisible(false);

            
        },
        // Onpressback7:function(){
        //     this.getView().byId("page1Shipment_UBYSHP").setVisible(false);
        //     this.getView().byId("page5Shipment_UBYSHP").setVisible(true);
        //     this.getView().byId("page6Shipment_UBYSHP").setVisible(false);
        //     this.getView().byId("page7billofLading").setVisible(false);

           
        //     this.getView().byId("page3Shipment_UBYSHP").setVisible(false);
        //     this.getView().byId("_IDGenButton4444").setVisible(false); 
        //     this.getView().byId("_IDGenButton2222").setVisible(false);
        //     this.getView().byId("_IDGenButton3333").setVisible(false);  
        //     this.getView().byId("_IDGenButton1111").setVisible(false);
        //     this.getView().byId("_IDGenButton5555").setVisible(false);
        //     this.getView().byId("_IDGenButton6666").setVisible(false);
      
        //     this.getView().byId("page4Shipment_UBYSHP").setVisible(false);

        
        //     this.getView().byId("page2Shipment_UBYSHP").setVisible(false);

            
        // },

    });
});