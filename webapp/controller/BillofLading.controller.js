sap.ui.define([
    "sap/ui/core/mvc/Controller",
], function (Controller) {
    "use strict";

    return Controller.extend("com.app.rfapp.controller.BillofLading", {
        onInit: function () {
        },
        OnpressBOLsubmit: function () {
            this.getView().byId("scrollContainer1").setVisible(false);
            this.getView().byId("_IDGenbackButton1").setVisible(false);
            this.getView().byId("scrollContainer2").setVisible(true);
            this.getView().byId("_IDGenbackButton2").setVisible(true);
        },
        onHUListPress: function () {
            this.getView().byId("scrollContainer3").setVisible(true);
            this.getView().byId("_IDGenbackButton3").setVisible(true);
            this.getView().byId("_IDGenbackButton2").setVisible(false);
            this.getView().byId("scrollContainer2").setVisible(false);
        },
        onNewhuPress: function () {
            this.getView().byId("_IDGenbackButton2").setVisible(false);
            this.getView().byId("scrollContainer2").setVisible(false);
            this.getView().byId("scrollContainer4").setVisible(true);
            this.getView().byId("_IDGenbackButton4").setVisible(true);
        },
        oneEnterPress: function () {
            this.getView().byId("_IDGenbackButton4").setVisible(false);
            this.getView().byId("scrollContainer4").setVisible(false);
            this.getView().byId("scrollContainer5").setVisible(true);
            this.getView().byId("_IDGenbackButton5").setVisible(true);
        },
        onGRPress: function () {
            this.getView().byId("_IDGenbackButton5").setVisible(false);
            this.getView().byId("scrollContainer5").setVisible(false);
            this.getView().byId("scrollContainer6").setVisible(true);
            this.getView().byId("_IDGenbackButton6").setVisible(true);
        },

        onunloadPress: function () {
            this.getView().byId("scrollContainer7").setVisible(true);
            this.getView().byId("_IDGenbackButton7").setVisible(true);
            this.getView().byId("_IDGenbackButton5").setVisible(false);
            this.getView().byId("scrollContainer5").setVisible(false);
        },
        Onpressbackbol3: function () {
            this.getView().byId("scrollContainer2").setVisible(true);
            this.getView().byId("_IDGenbackButton2").setVisible(true);
            this.getView().byId("_IDGenbackButton3").setVisible(false);
            this.getView().byId("scrollContainer3").setVisible(false);
        },
        Onpressbackbol5: function () {
            this.getView().byId("scrollContainer4").setVisible(true);
            this.getView().byId("_IDGenbackButton4").setVisible(true);
            this.getView().byId("_IDGenbackButton5").setVisible(false);
            this.getView().byId("scrollContainer5").setVisible(false);
        },
        Onpressbackbol6: function () {
            this.getView().byId("scrollContainer5").setVisible(true);
            this.getView().byId("_IDGenbackButton5").setVisible(true);
            this.getView().byId("_IDGenbackButton6").setVisible(false);
            this.getView().byId("scrollContainer6").setVisible(false);
        },
        Onpressbackbol4: function () {
            this.getView().byId("scrollContainer2").setVisible(true);
            this.getView().byId("_IDGenbackButton2").setVisible(true);
            this.getView().byId("_IDGenbackButton4").setVisible(false);
            this.getView().byId("scrollContainer4").setVisible(false);
        },
        Onpressbackbol2: function () {
            this.getView().byId("scrollContainer1").setVisible(true);
            this.getView().byId("_IDGenbackButton2").setVisible(false);
            this.getView().byId("scrollContainer2").setVisible(false);
            this.getView().byId("_IDGenbackButton1").setVisible(true);
        },
        Onpressbackbol7: function () {
            this.getView().byId("scrollContainer5").setVisible(true);
            this.getView().byId("_IDGenbackButton5").setVisible(true);
            this.getView().byId("_IDGenbackButton7").setVisible(false);
            this.getView().byId("scrollContainer7").setVisible(false);
        },
        Onpressbackbol1:function(){
          this.getOwnerComponent().getRouter().navTo("Supervisor");
        },

    });
});