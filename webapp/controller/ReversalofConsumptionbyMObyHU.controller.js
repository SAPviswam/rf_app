sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/Device",
  "sap/ui/model/json/JSONModel",
  "sap/m/Popover",
  "sap/m/Button",
  "sap/m/library"
],
  function (Controller, Device, JSONModel, Popover, Button, library) {
    "use strict";

    return Controller.extend("com.app.rfapp.controller.ReversalofConsumptionbyMObyHU", {
      onInit: function () {
        const oRouter = this.getOwnerComponent().getRouter();

        oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);

      },
      onResourceDetailsLoad: async function (oEvent1) {

        const { id } = oEvent1.getParameter("arguments");

        this.ID = id;

      },
      Onpressback0: async function () {
        const oRouter = this.getOwnerComponent().getRouter();

        var oModel1 = this.getOwnerComponent().getModel();

        await oModel1.read("/RESOURCESSet('" + this.ID + "')", {

          success: function (oData) {
            let oUser = oData.Users.toLowerCase()
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
      onenterpress: function () {
        var osmanfordInput = this.getView().byId("idCreationOfSingleHUinput_RCMHU");
        var smanford = osmanfordInput.getValue();
        if (smanford) {
          this.getView().byId("page1_RCMHU").setVisible(false);
          this.getView().byId("page2_RCMHU").setVisible(true);
        } else {
          sap.m.MessageToast.show("Please fill in all required fields");
        }
      },
      Onpressback1: function () {

        this.getView().byId("page1_RCMHU").setVisible(true);
        this.getView().byId("page2_RCMHU").setVisible(false);

      },
      onenter1press: function () {
        var oidHubyASNuomInpu__RCMHUInput = this.getView().byId("idHubyASNuomInpu__RCMHU");
        var soidHubyASNuomInpu__RCMHUInput = oidHubyASNuomInpu__RCMHUInput.getValue();
        if (soidHubyASNuomInpu__RCMHUInput) {
          this.getView().byId("page1_RCMHU").setVisible(false);
          this.getView().byId("page2_RCMHU").setVisible(false);
          this.getView().byId("page3_RCMHU").setVisible(true);
        } else {
          sap.m.MessageToast.show("Please fill in all required fields");
        }

      },
      Onpressback2: function () {

        this.getView().byId("page1_RCMHU").setVisible(false);
        this.getView().byId("page2_RCMHU").setVisible(true);
        this.getView().byId("page3_RCMHU").setVisible(false);

      },
      onenter2press: function () {
        var oidHuyASNuoInpu__RCMHU = this.getView().byId("idHuyASNuoInpu__RCMHU");
        var oidHubyASNomI1put_RCMHU2 = this.getView().byId("idHubyASNomI1put_RCMHU2");

        var sidHuyASNuoInpu__RCMHU = oidHuyASNuoInpu__RCMHU.getValue();
        var sidHubyASNomI1put_RCMHU2 = oidHubyASNomI1put_RCMHU2.getValue();

        if (sidHuyASNuoInpu__RCMHU && sidHubyASNomI1put_RCMHU2) {
          this.getView().byId("page1_RCMHU").setVisible(false);
          this.getView().byId("page2_RCMHU").setVisible(false);
          this.getView().byId("page3_RCMHU").setVisible(false);
          this.getView().byId("page4_RCMHU").setVisible(true);
        } else {
          sap.m.MessageToast.show("Please fill in all required fields");
        }



      },
      Onpressback3: function () {

        this.getView().byId("page1_RCMHU").setVisible(false);
        this.getView().byId("page2_RCMHU").setVisible(false);
        this.getView().byId("page3_RCMHU").setVisible(true);
        this.getView().byId("page4_RCMHU").setVisible(false);


      },
      onenter3press: function () {
        var oidHubyANqtyIput__RCMHU = this.getView().byId("idHubyANqtyIput__RCMHU");
        var sidHubyANqtyIput__RCMHU = oidHubyANqtyIput__RCMHU.getValue();
        if (sidHubyANqtyIput__RCMHU) {
          this.getView().byId("page1_RCMHU").setVisible(false);
          this.getView().byId("page2_RCMHU").setVisible(false);
          this.getView().byId("page3_RCMHU").setVisible(false);
          this.getView().byId("page4_RCMHU").setVisible(false);
          this.getView().byId("page5_RCMHU").setVisible(true);
        } else {
          sap.m.MessageToast.show("Please fill in all required fields");
        }
      },
      onenter4press: function () {
        var oidHubyAStyInpu_RCMHU = this.getView().byId("idHubyAStyInpu_RCMHU");
        var sidHubyAStyInpu_RCMHU = oidHubyAStyInpu_RCMHU.getValue();
        if (sidHubyAStyInpu_RCMHU) {
        this.getView().byId("page1_RCMHU").setVisible(false);
        this.getView().byId("page2_RCMHU").setVisible(true);
        this.getView().byId("page3_RCMHU").setVisible(false);
        this.getView().byId("page4_RCMHU").setVisible(false);
        this.getView().byId("page5_RCMHU").setVisible(false);
      } else {
        sap.m.MessageToast.show("Please fill in all required fields");
      }
      },
      Onpressback4: function () {

        this.getView().byId("page1_RCMHU").setVisible(false);
        this.getView().byId("page2_RCMHU").setVisible(false);
        this.getView().byId("page3_RCMHU").setVisible(false);
        this.getView().byId("page4_RCMHU").setVisible(true);
        this.getView().byId("page5_RCMHU").setVisible(false);



      },

    });
  });