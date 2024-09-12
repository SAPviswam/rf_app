sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device"
], function (Controller, Device) {
    "use strict";

    return Controller.extend("com.app.rfapp.controller.InitialScreen", {
        onInit: function () {

        },
        onDevButtonPress:async function(){
        this.LoadSapLogon();
        },
        onsapCancelPress:function(){
            this.oConfigSap.close();
        },
        onProdButtonPress: function(){
            this.LoadSapLogon();
        },
        onEnvButtonPress: function(){
            this.LoadSapLogon();
        },
          LoadSapLogon: async function(){
            this.oConfigSap ??= await this.loadFragment({
                name: "com.app.rfapp.fragments.SapLogon"
            })
            this.oConfigSap.open();
        },
        handleLinksapPress: async function(){
            this.oConnetSap ??= await this.loadFragment({
                name: "com.app.rfapp.fragments.ConnecttoSAP"
            })
            this.oConnetSap.open();
        },
        onCloseconnectsap:function(){
            this.oConnetSap.close();
        },
        onsapsubmitPress: function () {
            var oU = this.getView().byId("idsaplogonUserId").getValue();
            var oP = this.getView().byId("idSapLogonPassword").getValue();
            if (oU === "111010" && oP === "ARTIHCUS") {
                this.getOwnerComponent().getRouter().navTo("Homepage", { id: oU })
            }
      
         this.onUserLogin();
       
        },
        onUserLogin: function () {
            this.getView().byId("idsaplogonUserId").setValue();
            this.getView().byId("idSapLogonPassword").setValue();
        },
        // clear btn in the configure SAP fragment.
        onClearconnectsapDialog:function () {
            this.getView().byId("idDescriptionInput").setValue();
            this.getView().byId("idSystemIdInput").setValue();
            this.getView().byId("idInstanceNumberInput").setValue();
            this.getView().byId("idApplicationServerInput").setValue(); 
            this.getView().byId("idClientInput").setValue();
            this.getView().byId("idServiceInput").setValue(); 
        }

       

    });


});