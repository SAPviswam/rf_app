sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device"
],
    function (Controller, Device) {
        "use strict";

        return Controller.extend("com.app.rfapp.controller.ReceivingofHUbyASN", {
            onInit: function () {
    
            },
            //Back function 
            onPressASNdetailsBackButton: function () {
                this.getView().byId("IdpageScanning1").setVisible(true);
                this.getView().byId("icon2ReceivehubyASn").setVisible(false);
                this.getView().byId("idASNdetailsBackButton").setVisible(false);
                this.getView().byId("Icon6receivinghuByASN").setVisible(false);
                this.getView().byId("idBackMainButton").setVisible(true);

            },

            Onpresssubmit: function () {

                this.getView().byId("IdpageScanning1").setVisible(false);
                this.getView().byId("icon2ReceivehubyASn").setVisible(true);
                this.getView().byId("idASNdetailsBackButton").setVisible(true);
                this.getView().byId("idAsnGRBackButton").setVisible(false);
                this.getView().byId("Icon6receivinghuByASN").setVisible(false);
                this.getView().byId("idBackMainButton").setVisible(false);

            },

            onHUListPresshubyASN: function () {
                this.getView().byId("icon3hubyASN").setVisible(true);
                this.getView().byId("idAsnHuListBackButton").setVisible(true);
                this.getView().byId("icon2ReceivehubyASn").setVisible(false);
                this.getView().byId("idASNdetailsBackButton").setVisible(false);
               

            },
            //Back function 
            OnpressAsnHuListBackButton: function () {
                this.getView().byId("icon2ReceivehubyASn").setVisible(true);
                this.getView().byId("icon3hubyASN").setVisible(false);
                this.getView().byId("idASNdetailsBackButton").setVisible(true);
                this.getView().byId("idAsnHuListBackButton").setVisible(false);
                this.getView().byId("IdpageScanning1").setVisible(false);
                
            },

            onNewHUPresshubyASN:function(){
                this.getView().byId("icon4hubyASN").setVisible(true);
                this.getView().byId("idAsnNewhuBackButton").setVisible(true);
                this.getView().byId("icon2ReceivehubyASn").setVisible(false);
                this.getView().byId("icon3hubyASN").setVisible(false);
                this.getView().byId("idASNdetailsBackButton").setVisible(false);
                this.getView().byId("idAsnHuListBackButton").setVisible(false);
                this.getView().byId("IdpageScanning1").setVisible(false);
                
            },
            //Back Functio
            OnpressAsnNewHUBackButton:function(){
                this.getView().byId("icon3hubyASN").setVisible(false);
                this.getView().byId("idAsnHuListBackButton").setVisible(false);
                this.getView().byId("icon4hubyASN").setVisible(false);
                this.getView().byId("idAsnNewhuBackButton").setVisible(false);
                this.getView().byId("icon2ReceivehubyASn").setVisible(true);
                this.getView().byId("idASNdetailsBackButton").setVisible(true);
                this.getView().byId("IdpageScanning1").setVisible(false);
                

            },
            onPressEnter:function(){
                this.getView().byId("icon5IreceivinghuByASN").setVisible(true);
                this.getView().byId("idAsnDetailsBackButton").setVisible(true);
                this.getView().byId("icon3hubyASN").setVisible(false);
                this.getView().byId("idAsnHuListBackButton").setVisible(false);
                this.getView().byId("icon4hubyASN").setVisible(false);
                this.getView().byId("idAsnNewhuBackButton").setVisible(false);
                this.getView().byId("icon2ReceivehubyASn").setVisible(false);
                this.getView().byId("idASNdetailsBackButton").setVisible(false);
                this.getView().byId("IdpageScanning1").setVisible(false);
                
            },
            //Backfunction
            OnpressAsnDetailsBackButton:function(){
                this.getView().byId("icon4hubyASN").setVisible(true);
                this.getView().byId("idAsnNewhuBackButton").setVisible(true);
                this.getView().byId("icon2ReceivehubyASn").setVisible(false);
                this.getView().byId("icon3hubyASN").setVisible(false);
                this.getView().byId("idASNdetailsBackButton").setVisible(false);
                this.getView().byId("idAsnHuListBackButton").setVisible(false);
                this.getView().byId("IdpageScanning1").setVisible(false);
                this.getView().byId("icon5IreceivinghuByASN").setVisible(false);
                this.getView().byId("idAsnDetailsBackButton").setVisible(false);
                

            },
            onGRPress:function(){
                this.getView().byId("idAsnGRBackButton").setVisible(true);
                this.getView().byId("Icon6receivinghuByASN").setVisible(true);
                this.getView().byId("icon4hubyASN").setVisible(false);
                this.getView().byId("idAsnNewhuBackButton").setVisible(false);
                this.getView().byId("icon2ReceivehubyASn").setVisible(false);
                this.getView().byId("icon3hubyASN").setVisible(false);
                this.getView().byId("idASNdetailsBackButton").setVisible(false);
                this.getView().byId("idAsnHuListBackButton").setVisible(false);
                this.getView().byId("IdpageScanning1").setVisible(false);
                this.getView().byId("icon5IreceivinghuByASN").setVisible(false);
                this.getView().byId("idAsnDetailsBackButton").setVisible(false);
                

            },
            OnpressGRBackButton:function(){
                this.getView().byId("icon5IreceivinghuByASN").setVisible(true);
                this.getView().byId("idAsnDetailsBackButton").setVisible(true);
                this.getView().byId("idAsnGRBackButton").setVisible(false);
                this.getView().byId("Icon6receivinghuByASN").setVisible(false);
                this.getView().byId("icon4hubyASN").setVisible(false);
                this.getView().byId("idAsnNewhuBackButton").setVisible(false);
                this.getView().byId("icon2ReceivehubyASn").setVisible(false);
                this.getView().byId("icon3hubyASN").setVisible(false);
                this.getView().byId("idASNdetailsBackButton").setVisible(false);
                this.getView().byId("idAsnHuListBackButton").setVisible(false);
                this.getView().byId("IdpageScanning1").setVisible(false);
                
    
            },
            onunloadPress:function(){
                this.getView().byId("icon7receivinghuByASN").setVisible(true);
                this.getView().byId("idAsnunloadBackButton").setVisible(true);
                this.getView().byId("icon4hubyASN").setVisible(false);
                this.getView().byId("idAsnNewhuBackButton").setVisible(false);
                this.getView().byId("icon2ReceivehubyASn").setVisible(false);
                this.getView().byId("icon3hubyASN").setVisible(false);
                this.getView().byId("idASNdetailsBackButton").setVisible(false);
                this.getView().byId("idAsnHuListBackButton").setVisible(false);
                this.getView().byId("IdpageScanning1").setVisible(false);
                this.getView().byId("icon5IreceivinghuByASN").setVisible(false);
                this.getView().byId("idAsnDetailsBackButton").setVisible(false);
                

            },

            //backbutton
            OnpressunloadBackButton:function(){
                this.getView().byId("icon5IreceivinghuByASN").setVisible(true);
                this.getView().byId("idAsnDetailsBackButton").setVisible(true);
                this.getView().byId("idAsnGRBackButton").setVisible(false);
                this.getView().byId("Icon6receivinghuByASN").setVisible(false);
                this.getView().byId("icon4hubyASN").setVisible(false);
                this.getView().byId("idAsnNewhuBackButton").setVisible(false);
                this.getView().byId("icon2ReceivehubyASn").setVisible(false);
                this.getView().byId("icon3hubyASN").setVisible(false);
                this.getView().byId("idASNdetailsBackButton").setVisible(false);
                this.getView().byId("idAsnHuListBackButton").setVisible(false);
                this.getView().byId("IdpageScanning1").setVisible(false);
                this.getView().byId("icon7receivinghuByASN").setVisible(false);
                this.getView().byId("idAsnunloadBackButton").setVisible(false);
                
            },

            OnpressbackMainn1:function(){
                this.getOwnerComponent().getRouter().navTo("Supervisor");
                
              },
        });
    });
