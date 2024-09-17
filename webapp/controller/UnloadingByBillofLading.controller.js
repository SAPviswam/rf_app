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

    return Controller.extend("com.app.rfapp.controller.UnloadingByBillofLading", {
        onInit: function () {
            
			
        },
       
        Onpressback0: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("Supervisor");
        },
        Onpresssubmit: function () {

            this.getView().byId("page1billofLading").setVisible(false);
            this.getView().byId("page2billofLading").setVisible(true);
           

        },
        Onpressback1: function () {

            this.getView().byId("page1billofLading").setVisible(true);
            this.getView().byId("page2billofLading").setVisible(false);
          


            

        },
        onHUListPress:function () {

            this.getView().byId("page1billofLading").setVisible(false);
            this.getView().byId("page2billofLading").setVisible(false);
            this.getView().byId("page3billofLading").setVisible(true);
           
         
        },
        Onpressback2:function(){
            
            this.getView().byId("page1billofLading").setVisible(false);
            this.getView().byId("page2billofLading").setVisible(true);
            this.getView().byId("page3billofLading").setVisible(false);
           
            
            
        },
        onNewHUPress:function(){
            this.getView().byId("page1billofLading").setVisible(false);
            this.getView().byId("page2billofLading").setVisible(false);
            this.getView().byId("page3billofLading").setVisible(false);
           
            this.getView().byId("page4billofLading").setVisible(true);
            this.getView().byId("page5billofLading").setVisible(false);

         
        },
        Onpressback3:function(){
            this.getView().byId("page1billofLading").setVisible(false);
            this.getView().byId("page2billofLading").setVisible(true);
            this.getView().byId("page4billofLading").setVisible(false);
           
        },
        onNextEnterpress:function(){
            this.getView().byId("page5billofLading").setVisible(true);
           
            this.getView().byId("page4billofLading").setVisible(false);
           
            this.getView().byId("page1billofLading").setVisible(false);
            this.getView().byId("page2billofLading").setVisible(false);

            
        },
        Onpressback4:function(){
            this.getView().byId("page1billofLading").setVisible(false);
            this.getView().byId("page5billofLading").setVisible(false);
           
            this.getView().byId("page4billofLading").setVisible(true);
            this.getView().byId("page3billofLading").setVisible(false);

         
        
            this.getView().byId("page2billofLading").setVisible(false);

            
        },
        onGRPress:function(){
            this.getView().byId("page6billofLading").setVisible(true);
            this.getView().byId("page5billofLading").setVisible(false);
            this.getView().byId("page4billofLading").setVisible(false);
           

            this.getView().byId("page1billofLading").setVisible(false);
            this.getView().byId("page2billofLading").setVisible(false);


        },
        Onpressback5:function(){
            this.getView().byId("page1billofLading").setVisible(false);
            this.getView().byId("page5billofLading").setVisible(true);
            this.getView().byId("page6billofLading").setVisible(false);
            
           
            this.getView().byId("page4billofLading").setVisible(false);
          

        
            this.getView().byId("page2billofLading").setVisible(false);

            
        },
        onUnloadPress:function(){
            this.getView().byId("page6billofLading").setVisible(false);
            this.getView().byId("page5billofLading").setVisible(false);
            this.getView().byId("page4billofLading").setVisible(false);
            this.getView().byId("page7billofLading").setVisible(true);

           
            this.getView().byId("page1billofLading").setVisible(false);
            this.getView().byId("page2billofLading").setVisible(false);


        },

       
        // onUnloadPress1:function(){
        //     this.getView().byId("page6billofLading").setVisible(false);
        //     this.getView().byId("page5billofLading").setVisible(false);
        //     this.getView().byId("page4billofLading").setVisible(false);
        //     this.getView().byId("page7billofLading").setVisible(true);

        //     this.getView().byId("_IDGenButton4444").setVisible(false); 
        //     this.getView().byId("_IDGenButton2222").setVisible(false);
        //     this.getView().byId("_IDGenButton3333").setVisible(false);  
        //     this.getView().byId("_IDGenButton1111").setVisible(false);
        //     this.getView().byId("_IDGenButton5555").setVisible(false);
        //     this.getView().byId("_IDGenButton6666").setVisible(false);
           


        //     this.getView().byId("page1billofLading").setVisible(false);
        //     this.getView().byId("page2billofLading").setVisible(false);


        // },
        Onpressback6:function(){
            this.getView().byId("page1billofLading").setVisible(false);
            this.getView().byId("page5billofLading").setVisible(true);
            this.getView().byId("icon7").setVisible(false);
            this.getView().byId("page6billofLading").setVisible(false);
           
            this.getView().byId("page3billofLading").setVisible(false);
         
            this.getView().byId("page4billofLading").setVisible(false);

        
            this.getView().byId("page2billofLading").setVisible(false);

            
        },
        // Onpressback7:function(){
        //     this.getView().byId("page1billofLading").setVisible(false);
        //     this.getView().byId("page5billofLading").setVisible(true);
        //     this.getView().byId("page6billofLading").setVisible(false);
        //     this.getView().byId("page7billofLading").setVisible(false);

           
        //     this.getView().byId("page3billofLading").setVisible(false);
        //     this.getView().byId("_IDGenButton4444").setVisible(false); 
        //     this.getView().byId("_IDGenButton2222").setVisible(false);
        //     this.getView().byId("_IDGenButton3333").setVisible(false);  
        //     this.getView().byId("_IDGenButton1111").setVisible(false);
        //     this.getView().byId("_IDGenButton5555").setVisible(false);
        //     this.getView().byId("_IDGenButton6666").setVisible(false);
      
        //     this.getView().byId("page4billofLading").setVisible(false);

        
        //     this.getView().byId("page2billofLading").setVisible(false);

            
        // },

    });
});