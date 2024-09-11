sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device"
],
    function (Controller, Device) {
        "use strict";

        return Controller.extend("com.app.rfapp.controller.ReceivingofHUbyASN", {
            onInit: function () {
    
            },
            Onpressback0: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("Supervisor");
            },
            Onpresssubmit: function () {
    
                this.getView().byId("page1ReceiveHUbyASN_RHUASN").setVisible(false);
                this.getView().byId("page2ReceiveHUbyASN_RHUASN").setVisible(true);
               
    
            },
            Onpressback1: function () {
    
                this.getView().byId("page1ReceiveHUbyASN_RHUASN").setVisible(true);
                this.getView().byId("page2ReceiveHUbyASN_RHUASN").setVisible(false);
              
    
    
                
    
            },
            onHUListPress:function () {
    
                this.getView().byId("page1ReceiveHUbyASN_RHUASN").setVisible(false);
                this.getView().byId("page2ReceiveHUbyASN_RHUASN").setVisible(false);
                this.getView().byId("page3ReceiveHUbyASN_RHUASN").setVisible(true);
               
             
            },
            Onpressback2:function(){
                
                this.getView().byId("page1ReceiveHUbyASN_RHUASN").setVisible(false);
                this.getView().byId("page2ReceiveHUbyASN_RHUASN").setVisible(true);
                this.getView().byId("page3ReceiveHUbyASN_RHUASN").setVisible(false);
               
                
                
            },
            onNewHUPress:function(){
                this.getView().byId("page1ReceiveHUbyASN_RHUASN").setVisible(false);
                this.getView().byId("page2ReceiveHUbyASN_RHUASN").setVisible(false);
                this.getView().byId("page3ReceiveHUbyASN_RHUASN").setVisible(false);
               
                this.getView().byId("page4ReceiveHUbyASN_RHUASN").setVisible(true);
                this.getView().byId("page5ReceiveHUbyASN_RHUASN").setVisible(false);
    
             
            },
            Onpressback3:function(){
                this.getView().byId("page1ReceiveHUbyASN_RHUASN").setVisible(false);
                this.getView().byId("page2ReceiveHUbyASN_RHUASN").setVisible(true);
                this.getView().byId("page4ReceiveHUbyASN_RHUASN").setVisible(false);
               
            },
            onNextEnterpress:function(){
                this.getView().byId("page5ReceiveHUbyASN_RHUASN").setVisible(true);
               
                this.getView().byId("page4ReceiveHUbyASN_RHUASN").setVisible(false);
               
                this.getView().byId("page1ReceiveHUbyASN_RHUASN").setVisible(false);
                this.getView().byId("page2ReceiveHUbyASN_RHUASN").setVisible(false);
    
                
            },
            Onpressback4:function(){
                this.getView().byId("page1ReceiveHUbyASN_RHUASN").setVisible(false);
                this.getView().byId("page5ReceiveHUbyASN_RHUASN").setVisible(false);
               
                this.getView().byId("page4ReceiveHUbyASN_RHUASN").setVisible(true);
                this.getView().byId("page3ReceiveHUbyASN_RHUASN").setVisible(false);
    
             
            
                this.getView().byId("page2ReceiveHUbyASN_RHUASN").setVisible(false);
    
                
            },
            onGRPress:function(){
                this.getView().byId("page6ReceiveHUbyASN_RHUASN").setVisible(true);
                this.getView().byId("page5ReceiveHUbyASN_RHUASN").setVisible(false);
                this.getView().byId("page4ReceiveHUbyASN_RHUASN").setVisible(false);
               
    
                this.getView().byId("page1ReceiveHUbyASN_RHUASN").setVisible(false);
                this.getView().byId("page2ReceiveHUbyASN_RHUASN").setVisible(false);
    
    
            },
            Onpressback5:function(){
                this.getView().byId("page1ReceiveHUbyASN_RHUASN").setVisible(false);
                this.getView().byId("page5ReceiveHUbyASN_RHUASN").setVisible(true);
                this.getView().byId("page6ReceiveHUbyASN_RHUASN").setVisible(false);
                
               
                this.getView().byId("page4ReceiveHUbyASN_RHUASN").setVisible(false);
              
    
            
                this.getView().byId("page2ReceiveHUbyASN_RHUASN").setVisible(false);
    
                
            },
            onUnloadPress:function(){
                this.getView().byId("page6ReceiveHUbyASN_RHUASN").setVisible(false);
                this.getView().byId("page5ReceiveHUbyASN_RHUASN").setVisible(false);
                this.getView().byId("page4ReceiveHUbyASN_RHUASN").setVisible(false);
                this.getView().byId("page7ReceiveHUbyASN_RHUASN").setVisible(true);
    
               
                this.getView().byId("page1ReceiveHUbyASN_RHUASN").setVisible(false);
                this.getView().byId("page2ReceiveHUbyASN_RHUASN").setVisible(false);
    
    
            },
    
           
            // onUnloadPress1:function(){
            //     this.getView().byId("page6ReceiveHUbyASN_RHUASN").setVisible(false);
            //     this.getView().byId("page5ReceiveHUbyASN_RHUASN").setVisible(false);
            //     this.getView().byId("page4ReceiveHUbyASN_RHUASN").setVisible(false);
            //     this.getView().byId("page7ReceiveHUbyASN_RHUASN").setVisible(true);
    
            //     this.getView().byId("_IDGenButton4444").setVisible(false); 
            //     this.getView().byId("_IDGenButton2222").setVisible(false);
            //     this.getView().byId("_IDGenButton3333").setVisible(false);  
            //     this.getView().byId("_IDGenButton1111").setVisible(false);
            //     this.getView().byId("_IDGenButton5555").setVisible(false);
            //     this.getView().byId("_IDGenButton6666").setVisible(false);
               
    
    
            //     this.getView().byId("page1ReceiveHUbyASN_RHUASN").setVisible(false);
            //     this.getView().byId("page2ReceiveHUbyASN_RHUASN").setVisible(false);
    
    
            // },
            Onpressback6:function(){
                this.getView().byId("page1ReceiveHUbyASN_RHUASN").setVisible(false);
                this.getView().byId("page5ReceiveHUbyASN_RHUASN").setVisible(true);
                this.getView().byId("page7ReceiveHUbyASN_RHUASN").setVisible(false);
                this.getView().byId("page6ReceiveHUbyASN_RHUASN").setVisible(false);
               
                this.getView().byId("page3ReceiveHUbyASN_RHUASN").setVisible(false);
             
                this.getView().byId("page4ReceiveHUbyASN_RHUASN").setVisible(false);
    
            
                this.getView().byId("page2ReceiveHUbyASN_RHUASN").setVisible(false);
    
                
            },
            // Onpressback7:function(){
            //     this.getView().byId("page1ReceiveHUbyASN_RHUASN").setVisible(false);
            //     this.getView().byId("page5ReceiveHUbyASN_RHUASN").setVisible(true);
            //     this.getView().byId("page6ReceiveHUbyASN_RHUASN").setVisible(false);
            //     this.getView().byId("page7ReceiveHUbyASN_RHUASN").setVisible(false);
    
               
            //     this.getView().byId("page3ReceiveHUbyASN_RHUASN").setVisible(false);
            //     this.getView().byId("_IDGenButton4444").setVisible(false); 
            //     this.getView().byId("_IDGenButton2222").setVisible(false);
            //     this.getView().byId("_IDGenButton3333").setVisible(false);  
            //     this.getView().byId("_IDGenButton1111").setVisible(false);
            //     this.getView().byId("_IDGenButton5555").setVisible(false);
            //     this.getView().byId("_IDGenButton6666").setVisible(false);
          
            //     this.getView().byId("page4ReceiveHUbyASN_RHUASN").setVisible(false);
    
            
            //     this.getView().byId("page2ReceiveHUbyASN_RHUASN").setVisible(false);
    
                
            // },
        });
    });
