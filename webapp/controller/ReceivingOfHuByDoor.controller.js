sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";
 
    return Controller.extend("com.app.rfapp.controller.ReceivingOfHuByDoor", {
        onInit: function () {
 
        },
        //when user press on submit button in the first screen
        PressOnSubmitbtn: function () {
 
            this.getView().byId("IdScanningDeliveryNo").setVisible(false);
            this.getView().byId("IdGRPage").setVisible(false);
            this.getView().byId("idROHDHUdetailsPage").setVisible(true);
            this.getView().byId("idDeliveryDetailsBackButton").setVisible(true);
            this.getView().byId("idAfterNextBackbutton").setVisible(false);
 
        },
        //Back Button in the next Screen After Scanning the Delivery Number
        OnDeliveryDetailsBackButton: function () {
 
            this.getView().byId("IdScanningDeliveryNo").setVisible(true);
            this.getView().byId("idROHDHUdetailsPage").setVisible(false);
            this.getView().byId("idROHDHUlistPage").setVisible(false);
            this.getView().byId("idROHDNewHUpage").setVisible(false);
            this.getView().byId("IdGRPage").setVisible(false);
            this.getView().byId("idDeliveryDetailsBackButton").setVisible(false);
            this.getView().byId("idHUlistBackbutton").setVisible(false);
            this.getView().byId("idNewHuBackbutton").setVisible(false);
            this.getView().byId("idAfterNextBackbutton").setVisible(false);
 
        },
        // When User Press on Back button in the Hu List Page
        OnpressHUlistBackbutton: function () {
 
            this.getView().byId("IdScanningDeliveryNo").setVisible(false);
            this.getView().byId("idROHDHUdetailsPage").setVisible(true);
            this.getView().byId("idROHDHUlistPage").setVisible(false);
            this.getView().byId("idROHDNewHUpage").setVisible(false);
            this.getView().byId("IdGRPage").setVisible(false);
            this.getView().byId("idDeliveryDetailsBackButton").setVisible(true);
            this.getView().byId("idHUlistBackbutton").setVisible(false);
            this.getView().byId("idNewHuBackbutton").setVisible(false);
            this.getView().byId("idAfterNextBackbutton").setVisible(false);
        },
       // When user press on the HU List in the Second Screen
        onHUListPress: function() {
            this.getView().byId("IdScanningDeliveryNo").setVisible(false);
            this.getView().byId("idROHDHUdetailsPage").setVisible(false);
            this.getView().byId("idROHDHUlistPage").setVisible(true);
            this.getView().byId("IdGRPage").setVisible(false);
            this.getView().byId("idHUlistBackbutton").setVisible(true);
            this.getView().byId("idDeliveryDetailsBackButton").setVisible(false);
            this.getView().byId("idNewHuBackbutton").setVisible(false);
            this.getView().byId("idAfterNextBackbutton").setVisible(false);
        },
       //When User Press On Back Button In New HU Page
        OnpressNewHuBackbutton: function () {
            this.getView().byId("IdScanningDeliveryNo").setVisible(false);
            this.getView().byId("idROHDHUdetailsPage").setVisible(true);
            this.getView().byId("idROHDHUlistPage").setVisible(false);
            this.getView().byId("idROHDNewHUpage").setVisible(false);
            this.getView().byId("IdGRPage").setVisible(false);
            this.getView().byId("idDeliveryDetailsBackButton").setVisible(true);
            this.getView().byId("idHUlistBackbutton").setVisible(false);
            this.getView().byId("idNewHuBackbutton").setVisible(false);
            this.getView().byId("idAfterNextBackbutton").setVisible(false);
           
 
        },
       // When User Press On New HU Button In the Second Screen
        onNewHUPress: function () {
            this.getView().byId("IdScanningDeliveryNo").setVisible(false);
            this.getView().byId("idROHDHUdetailsPage").setVisible(false);
            this.getView().byId("idROHDHUlistPage").setVisible(false);
            this.getView().byId("idROHDNewHUpage").setVisible(true);
            this.getView().byId("IdGRPage").setVisible(false);
            this.getView().byId("idDeliveryEnter").setVisible(false);
            this.getView().byId("idHUlistBackbutton").setVisible(false);
            this.getView().byId("idDeliveryDetailsBackButton").setVisible(false);
            this.getView().byId("idNewHuBackbutton").setVisible(true);
            this.getView().byId("idAfterNextBackbutton").setVisible(false);
 
        },
        //when user Press on NEXT OR ENTER button
        onPressEnter: function() {
 
            this.getView().byId("idDeliveryEnter").setVisible(true);
            this.getView().byId("IdScanningDeliveryNo").setVisible(false);
            this.getView().byId("idROHDHUdetailsPage").setVisible(false);
            this.getView().byId("idROHDHUlistPage").setVisible(false);
            this.getView().byId("idROHDNewHUpage").setVisible(false);
            this.getView().byId("IdGRPage").setVisible(false);
            this.getView().byId("idAfterNextBackbutton").setVisible(true);
            this.getView().byId("idHUlistBackbutton").setVisible(false);
            this.getView().byId("idDeliveryDetailsBackButton").setVisible(false);
            this.getView().byId("idNewHuBackbutton").setVisible(false);
 
 
        },
        //when user press on back button after entering next
        OnpressAfterNextBackbutton: function() {
 
            this.getView().byId("idDeliveryEnter").setVisible(false);
            this.getView().byId("IdScanningDeliveryNo").setVisible(false);
            this.getView().byId("idROHDHUdetailsPage").setVisible(false);
            this.getView().byId("idROHDHUlistPage").setVisible(false);
            this.getView().byId("idROHDNewHUpage").setVisible(true);
            this.getView().byId("IdGRPage").setVisible(false);
            this.getView().byId("idAfterNextBackbutton").setVisible(false);
            this.getView().byId("idHUlistBackbutton").setVisible(false);
            this.getView().byId("idDeliveryDetailsBackButton").setVisible(false);
            this.getView().byId("idNewHuBackbutton").setVisible(true);
            this.getView().byId("idGRBackbutton").setVisible(false);
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
            this.getView().byId("idAfterNextBackbutton").setVisible(false);
            this.getView().byId("idHUlistBackbutton").setVisible(false);
            this.getView().byId("idDeliveryDetailsBackButton").setVisible(false);
            this.getView().byId("idNewHuBackbutton").setVisible(false);
        },
        // when user press on Back button after pressing the Gr button
        OnpressGRBackbutton: function() {
            this.getView().byId("idDeliveryEnter").setVisible(true);
            this.getView().byId("IdScanningDeliveryNo").setVisible(false);
            this.getView().byId("idROHDHUdetailsPage").setVisible(false);
            this.getView().byId("idROHDHUlistPage").setVisible(false);
            this.getView().byId("idROHDNewHUpage").setVisible(false);
            this.getView().byId("IdGRPage").setVisible(false);
            this.getView().byId("idAfterNextBackbutton").setVisible(true);
            this.getView().byId("idHUlistBackbutton").setVisible(false);
            this.getView().byId("idDeliveryDetailsBackButton").setVisible(false);
            this.getView().byId("idNewHuBackbutton").setVisible(false);
            this.getView().byId("idGRBackbutton").setVisible(false);
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
            this.getView().byId("idAfterNextBackbutton").setVisible(false);
            this.getView().byId("idHUlistBackbutton").setVisible(false);
            this.getView().byId("idDeliveryDetailsBackButton").setVisible(false);
            this.getView().byId("idNewHuBackbutton").setVisible(false);
        },
        OnpressUnloadBackbutton: function() {
           
            this.getView().byId("idDeliveryEnter").setVisible(true);
            this.getView().byId("IdScanningDeliveryNo").setVisible(false);
            this.getView().byId("idROHDHUdetailsPage").setVisible(false);
            this.getView().byId("idROHDHUlistPage").setVisible(false);
            this.getView().byId("idROHDNewHUpage").setVisible(false);
            this.getView().byId("IdGRPage").setVisible(false);
            this.getView().byId("idUnloadPage").setVisible(false);
            this.getView().byId("idAfterNextBackbutton").setVisible(true);
            this.getView().byId("idHUlistBackbutton").setVisible(false);
            this.getView().byId("idDeliveryDetailsBackButton").setVisible(false);
            this.getView().byId("idNewHuBackbutton").setVisible(false);
            this.getView().byId("idGRBackbutton").setVisible(false);
            this.getView().byId("idUnloadBackbutton").setVisible(false);
 
        }
 
    });
});
 
 