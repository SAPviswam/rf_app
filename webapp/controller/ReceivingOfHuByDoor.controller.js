sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
        "sap/ui/core/UIComponent"
],
function (Controller,MessageToast,UIComponent) {
    "use strict";
 
    return Controller.extend("com.app.rfapp.controller.ReceivingOfHuByDoor", {
        onInit: function () {
            const oRouter = this.getOwnerComponent().getRouter();
          oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
        },
        onResourceDetailsLoad:function(oEvent1){
            var that = this;
            const { id } = oEvent1.getParameter("arguments");
            this.ID = id;
            console.log(this.ID);
        },
        onBeforeRendering : function () {
            this.getView().byId("idBackButtoninAdhocHuWtHuScanInHuByDoor").setVisible(true);
        },
        //when user press on submit button in the first screen
        PressOnSubmitbtn: function () {
 
            this.getView().byId("IdScanningDeliveryNo").setVisible(false);
            this.getView().byId("IdGRPage").setVisible(false);
            this.getView().byId("idROHDHUdetailsPage").setVisible(true);
            this.getView().byId("idDeliveryDetailsBackButtonInHuByDooor").setVisible(true);
            this.getView().byId("idAfterNextBackbuttonInHuByDooor").setVisible(false);
            this.getView().byId("idBackButtoninAdhocHuWtHuScanInHuByDoor").setVisible(false);
 
        },
        //Back Button in the next Screen After Scanning the Delivery Number
        OnDeliveryDetailsBackButton: function () {
 
            this.getView().byId("IdScanningDeliveryNo").setVisible(true);
            this.getView().byId("idROHDHUdetailsPage").setVisible(false);
            this.getView().byId("idROHDHUlistPage").setVisible(false);
            this.getView().byId("idROHDNewHUpage").setVisible(false);
            this.getView().byId("IdGRPage").setVisible(false);
            this.getView().byId("idDeliveryDetailsBackButtonInHuByDooor").setVisible(false);
            this.getView().byId("idHUlistBackbuttonInHuByDooor").setVisible(false);
            this.getView().byId("idNewHuBackbuttonInHuByDooor").setVisible(false);
            this.getView().byId("idAfterNextBackbuttonInHuByDooor").setVisible(false);
            this.getView().byId("idBackButtoninAdhocHuWtHuScanInHuByDoor").setVisible(true);
 
        },
        // When User Press on Back button in the Hu List Page
        OnpressHUlistBackbutton: function () {
 
            this.getView().byId("IdScanningDeliveryNo").setVisible(false);
            this.getView().byId("idROHDHUdetailsPage").setVisible(true);
            this.getView().byId("idROHDHUlistPage").setVisible(false);
            this.getView().byId("idROHDNewHUpage").setVisible(false);
            this.getView().byId("IdGRPage").setVisible(false);
            this.getView().byId("idDeliveryDetailsBackButtonInHuByDooor").setVisible(true);
            this.getView().byId("idHUlistBackbuttonInHuByDooor").setVisible(false);
            this.getView().byId("idNewHuBackbuttonInHuByDooor").setVisible(false);
            this.getView().byId("idAfterNextBackbuttonInHuByDooor").setVisible(false);
            this.getView().byId("idBackButtoninAdhocHuWtHuScanInHuByDoor").setVisible(false);
        },
       // When user press on the HU List in the Second Screen
        onHUListPress: function() {
            this.getView().byId("IdScanningDeliveryNo").setVisible(false);
            this.getView().byId("idROHDHUdetailsPage").setVisible(false);
            this.getView().byId("idROHDHUlistPage").setVisible(true);
            this.getView().byId("IdGRPage").setVisible(false);
            this.getView().byId("idHUlistBackbuttonInHuByDooor").setVisible(true);
            this.getView().byId("idDeliveryDetailsBackButtonInHuByDooor").setVisible(false);
            this.getView().byId("idNewHuBackbuttonInHuByDooor").setVisible(false);
            this.getView().byId("idAfterNextBackbuttonInHuByDooor").setVisible(false);
            this.getView().byId("idBackButtoninAdhocHuWtHuScanInHuByDoor").setVisible(false);
        },
       //When User Press On Back Button In New HU Page
        OnpressNewHuBackbutton: function () {
            this.getView().byId("IdScanningDeliveryNo").setVisible(false);
            this.getView().byId("idROHDHUdetailsPage").setVisible(true);
            this.getView().byId("idROHDHUlistPage").setVisible(false);
            this.getView().byId("idROHDNewHUpage").setVisible(false);
            this.getView().byId("IdGRPage").setVisible(false);
            this.getView().byId("idDeliveryDetailsBackButtonInHuByDooor").setVisible(true);
            this.getView().byId("idHUlistBackbuttonInHuByDooor").setVisible(false);
            this.getView().byId("idNewHuBackbuttonInHuByDooor").setVisible(false);
            this.getView().byId("idAfterNextBackbuttonInHuByDooor").setVisible(false);
            this.getView().byId("idBackButtoninAdhocHuWtHuScanInHuByDoor").setVisible(false);
           
 
        },
       // When User Press On New HU Button In the Second Screen
        onNewHUPress: function () {
            this.getView().byId("IdScanningDeliveryNo").setVisible(false);
            this.getView().byId("idROHDHUdetailsPage").setVisible(false);
            this.getView().byId("idROHDHUlistPage").setVisible(false);
            this.getView().byId("idROHDNewHUpage").setVisible(true);
            this.getView().byId("IdGRPage").setVisible(false);
            this.getView().byId("idDeliveryEnter").setVisible(false);
            this.getView().byId("idHUlistBackbuttonInHuByDooor").setVisible(false);
            this.getView().byId("idDeliveryDetailsBackButtonInHuByDooor").setVisible(false);
            this.getView().byId("idNewHuBackbuttonInHuByDooor").setVisible(true);
            this.getView().byId("idAfterNextBackbuttonInHuByDooor").setVisible(false);
            this.getView().byId("idBackButtoninAdhocHuWtHuScanInHuByDoor").setVisible(false);
 
        },
        //when user Press on NEXT OR ENTER button
        onPressEnter: function() {
 
            this.getView().byId("idDeliveryEnter").setVisible(true);
            this.getView().byId("IdScanningDeliveryNo").setVisible(false);
            this.getView().byId("idROHDHUdetailsPage").setVisible(false);
            this.getView().byId("idROHDHUlistPage").setVisible(false);
            this.getView().byId("idROHDNewHUpage").setVisible(false);
            this.getView().byId("IdGRPage").setVisible(false);
            this.getView().byId("idAfterNextBackbuttonInHuByDooor").setVisible(true);
            this.getView().byId("idHUlistBackbuttonInHuByDooor").setVisible(false);
            this.getView().byId("idDeliveryDetailsBackButtonInHuByDooor").setVisible(false);
            this.getView().byId("idNewHuBackbuttonInHuByDooor").setVisible(false);
            this.getView().byId("idBackButtoninAdhocHuWtHuScanInHuByDoor").setVisible(false);
 
 
        },
        //when user press on back button after entering next
        OnpressAfterNextBackbutton: function() {
 
            this.getView().byId("idDeliveryEnter").setVisible(false);
            this.getView().byId("IdScanningDeliveryNo").setVisible(false);
            this.getView().byId("idROHDHUdetailsPage").setVisible(false);
            this.getView().byId("idROHDHUlistPage").setVisible(false);
            this.getView().byId("idROHDNewHUpage").setVisible(true);
            this.getView().byId("IdGRPage").setVisible(false);
            this.getView().byId("idAfterNextBackbuttonInHuByDooor").setVisible(false);
            this.getView().byId("idHUlistBackbuttonInHuByDooor").setVisible(false);
            this.getView().byId("idDeliveryDetailsBackButtonInHuByDooor").setVisible(false);
            this.getView().byId("idNewHuBackbuttonInHuByDooor").setVisible(true);
            this.getView().byId("idGRBackbutton").setVisible(false);
            this.getView().byId("idBackButtoninAdhocHuWtHuScanInHuByDoor").setVisible(false);
        },
      // when user press on GR button
        onPressEnterGRButton: function() {
 
            this.getView().byId("IdGRPage").setVisible(true);
            this.getView().byId("idDeliveryEnter").setVisible(false);
            this.getView().byId("IdScanningDeliveryNo").setVisible(false);
            this.getView().byId("idROHDHUdetailsPage").setVisible(false);
            this.getView().byId("idROHDHUlistPage").setVisible(false);
            this.getView().byId("idROHDNewHUpage").setVisible(false);
            this.getView().byId("idGRBackbutton").setVisible(true);
            this.getView().byId("idAfterNextBackbuttonInHuByDooor").setVisible(false);
            this.getView().byId("idHUlistBackbuttonInHuByDooor").setVisible(false);
            this.getView().byId("idDeliveryDetailsBackButtonInHuByDooor").setVisible(false);
            this.getView().byId("idNewHuBackbuttonInHuByDooor").setVisible(false);
            this.getView().byId("idBackButtoninAdhocHuWtHuScanInHuByDoor").setVisible(false);
        },
        // when user press on Back button after pressing the Gr button
        OnpressGRBackbutton: function() {
            this.getView().byId("idDeliveryEnter").setVisible(true);
            this.getView().byId("IdScanningDeliveryNo").setVisible(false);
            this.getView().byId("idROHDHUdetailsPage").setVisible(false);
            this.getView().byId("idROHDHUlistPage").setVisible(false);
            this.getView().byId("idROHDNewHUpage").setVisible(false);
            this.getView().byId("IdGRPage").setVisible(false);
            this.getView().byId("idAfterNextBackbuttonInHuByDooor").setVisible(true);
            this.getView().byId("idHUlistBackbuttonInHuByDooor").setVisible(false);
            this.getView().byId("idDeliveryDetailsBackButtonInHuByDooor").setVisible(false);
            this.getView().byId("idNewHuBackbuttonInHuByDooor").setVisible(false);
            this.getView().byId("idGRBackbutton").setVisible(false);
            this.getView().byId("idBackButtoninAdhocHuWtHuScanInHuByDoor").setVisible(false);
        },
        onPressEnterUnloadButton: function() {
            this.getView().byId("idUnloadPage").setVisible(true);
            this.getView().byId("IdGRPage").setVisible(false);
            this.getView().byId("idDeliveryEnter").setVisible(false);
            this.getView().byId("IdScanningDeliveryNo").setVisible(false);
            this.getView().byId("idROHDHUdetailsPage").setVisible(false);
            this.getView().byId("idROHDHUlistPage").setVisible(false);
            this.getView().byId("idROHDNewHUpage").setVisible(false);
            this.getView().byId("idUnloadBackbutton").setVisible(true);
            this.getView().byId("idGRBackbutton").setVisible(false);
            this.getView().byId("idAfterNextBackbuttonInHuByDooor").setVisible(false);
            this.getView().byId("idHUlistBackbuttonInHuByDooor").setVisible(false);
            this.getView().byId("idDeliveryDetailsBackButtonInHuByDooor").setVisible(false);
            this.getView().byId("idNewHuBackbuttonInHuByDooor").setVisible(false);
            this.getView().byId("idBackButtoninAdhocHuWtHuScanInHuByDoor").setVisible(false);
        },
        OnpressUnloadBackbutton: function() {
           
            this.getView().byId("idDeliveryEnter").setVisible(true);
            this.getView().byId("IdScanningDeliveryNo").setVisible(false);
            this.getView().byId("idROHDHUdetailsPage").setVisible(false);
            this.getView().byId("idROHDHUlistPage").setVisible(false);
            this.getView().byId("idROHDNewHUpage").setVisible(false);
            this.getView().byId("IdGRPage").setVisible(false);
            this.getView().byId("idUnloadPage").setVisible(false);
            this.getView().byId("idAfterNextBackbuttonInHuByDooor").setVisible(true);
            this.getView().byId("idHUlistBackbuttonInHuByDooor").setVisible(false);
            this.getView().byId("idDeliveryDetailsBackButtonInHuByDooor").setVisible(false);
            this.getView().byId("idNewHuBackbuttonInHuByDooor").setVisible(false);
            this.getView().byId("idGRBackbutton").setVisible(false);
            this.getView().byId("idUnloadBackbutton").setVisible(false);
            this.getView().byId("idBackButtoninAdhocHuWtHuScanInHuByDoor").setVisible(false);
 
        },
        onPressBackButtoninAdhocHuWtHuScan : async function(){
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
        }
 
    });
});
 
 