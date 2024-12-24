sap.ui.define(
  [
    "./BaseController",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent",
    "sap/ui/Device"
  ],
  function (BaseController, MessageToast, UIComponent, Device) {
    "use strict";

    return BaseController.extend("com.app.rfapp.controller.CreateConfirmAdhocHu", {
      onInit: function () {
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
        if (Device.system.phone) {
          this.getView().byId("idTitle_CCAHU").addStyleClass("titleMobile");
        }
      },
      onResourceDetailsLoad: async function (oEvent1) {
        const { id, idI } = oEvent1.getParameter("arguments");
        this.ID = id;
        this.IDI = idI;
      },

      onAvatarPressed_CCAHU: function (oEvent) {
        this.onPressAvatarEveryTileHelperFunction(oEvent);

      },
      onSignoutPressed: function () {
        var oRouter = this.getOwnerComponent().getRouter(this);
        oRouter.navTo("InitialScreen", { Userid: this.IDI });
      },

      //   onLiveChange:function(){
      //   //   if(this.getView().byId("idHuInput_CCAHU").getValue()=="800020"){
      //      this.getView().byId("idFirstSc_CCAHU").setVisible(false)
      //      this.getView().byId("idsecondSc_CCAHU").setVisible(true)
      //      var ohu=this.getView().byId("idHuInput_CCAHU").getValue();
      //      this.getView().byId("idSecSCHuInput_CCAHU").setValue(ohu)
      //      this.getView().byId("idSecSCHuInput_CCAHU").setEditable(false);


      //   //   }
      //   //   else{
      //   //       MessageToast.show("please enter valid HU Number")
      //   //   }
      // },

      // onHuDetailsPress_CCAHU: function () {
      //   this.getView().byId("idthirdSc_CCAHU").setVisible(true);
      //   this.getView().byId("idsecondSc_CCAHU").setVisible(false);

      // },

      // for second back button press
      onSecondBackBtnPress_CCAHU: function () {
        this.getView().byId("idFirstSc_CCAHU").setVisible(true);
        this.getView().byId("idsecondSc_CCAHU").setVisible(false);
        this.getView().byId("idSecSCHuInput_CCAHU").setValue();
        this.getView().byId("idWPTInput_CCAHU").setValue();
        this.getView().byId("idsrcBinInput_CCAHU").setValue();
        this.getView().byId("idDestBinInput_CCAHU").setValue();
        this.getView().byId("idDestHuInput_CCAHU").setValue();
      },

      // for third back button press
      onThirdBackBtnPress_CCAHU: function () {
        this.getView().byId("idsecondSc_CCAHU").setVisible(true);
        this.getView().byId("idFirstSc_CCAHU").setVisible(false);

      },

      // for first back button press

      onFirstBackBtnPress_CCAHU: async function () {
        var oRouter = UIComponent.getRouterFor(this);
        var oModel1 = this.getOwnerComponent().getModel();
        var that = this;
        await oModel1.read("/RESOURCESSet('" + this.ID + "')", {
          success: function (oData) {
            let oUser = oData.Users.toLowerCase()
            if (oUser === "resource") {
              oRouter.navTo("RouteResourcePage", { id: this.ID, idI: that.IDI });
            }
            else {
              oRouter.navTo("Supervisor", { id: this.ID, idI: that.IDI });
            }
          }.bind(this),
          error: function () {
            MessageToast.show("User does not exist");
          }

        });
        this.getView().byId("idWPT1Input_CCAHU").setValue();
        this.getView().byId("idHuInput_CCAHU").setValue();

      },

      // submit button in first screen
      onSubmitBtn_CCAHU: async function () {

        var oView = this.getView();
        var sHunumber = oView.byId("idHuInput_CCAHU").getValue();
        var sProcessType = oView.byId("idWPT1Input_CCAHU").getValue();

        // Ensure both hu number and process type are provided
        if (!sHunumber || !sProcessType) {
          sap.m.MessageToast.show("Please enter both Hu and Process type");
          return;

        }
        // Call your backend service to fetch hu's based on the provided keys
        var oModel = this.getView().getModel();
        var that = this;


        var sRequestUrl = `/create_confirm_adhochuSet(Huident='${sHunumber}',Procty='${sProcessType}')`;

        await oModel.read(sRequestUrl, {
          success: (odata) => {
            console.log(odata);

            if (odata.Huident === sHunumber && odata.Procty.toUpperCase() === sProcessType.toUpperCase()) {
              that.getView().byId("idSecSCHuInput_CCAHU").setValue(sHunumber);
              that.getView().byId("idWPTInput_CCAHU").setValue(sProcessType);
              that.getView().byId("idsrcBinInput_CCAHU").setValue(odata.Vlpla);

            }

            this.getView().byId("idFirstSc_CCAHU").setVisible(false)
            this.getView().byId("idsecondSc_CCAHU").setVisible(true)
          },
          error: function (oError) {
            var ojson = JSON.parse(oError.responseText)
            sap.m.MessageToast.show(ojson.error.message.value);
          }
        });
      },

      // for scanning the hu
      onHuBarcodeScanner_CCAHU: function (oEvent) {
        // Get the scanned bin number from the event
        var sScannedHu = oEvent.getParameter("text");
        this.getView().byId("idHuInput_CCAHU").setValue(sScannedHu);
        this.onSubmitBtn_CCAHU();
      },

      // for scanning the destination bin
      onDestBinBarcodeScanner_CCAHU: function (oEvent) {
        // Get the scanned bin number from the event
        var sScannedDestBin = oEvent.getParameter("text");
        this.getView().byId("idDestBinInput_CCAHU").setValue(sScannedDestBin);
        this.onCreateConfirmPress_CCAHU();
      },

      //for destination hu
      onCreateConfirmPress_CCAHU: async function () {
        var oView = this.getView();
        var sSrcBin = oView.byId("idsrcBinInput_CCAHU").getValue();
        var sDestBin = oView.byId("idDestBinInput_CCAHU").getValue();
        var sHunumber = oView.byId("idSecSCHuInput_CCAHU").getValue();
        var sProcessType = oView.byId("idWPTInput_CCAHU").getValue().toUpperCase();
        var sDestHu = oView.byId("idDestHuInput_CCAHU").getValue();
        if (sDestHu) {
          if (sDestHu != sHunumber) {
            sap.m.MessageBox.error("Source Hu and Destination Hu mismatch")
            return;
          }
        }
        // Ensure all required fields are filled in

        if (!sSrcBin || !sDestBin) {
          sap.m.MessageToast.show("Please enter all the required fields: Source Bin, Destination Bin.");
          return;
        }
        var oObj = {
          Huident: sHunumber,
          Procty: sProcessType,
          Vlpla: sSrcBin,
          Nlpla: sDestBin

        }

        // Call the backend service to update the data

        var oModel = this.getView().getModel();
        var that = this;


        try {
          oModel.create("/create_confirm_adhochuSet", oObj, {
            success: function (oSucces) {
              console.log(oSucces)
              MessageToast.show("Warehouse Task created and confirmed Successfully")
              let DestHuInput = this.getView().byId("idDestHuInput_CCAHU").getValue();
              if (!DestHuInput) {
                let DestHu = this.getView().byId("idHuInput_CCAHU").getValue();
                this.getView().byId("idDestHuInput_CCAHU").setValue(DestHu);
              }

            }.bind(this),
            error: function (oError) {
              var ojson = JSON.parse(oError.responseText)
              console.log(ojson)
              MessageToast.show(ojson.error.message.value)
            }
          })

        } catch (error) {
          sap.m.MessageToast.show("Unexpected error occurred. Please try again.");
          console.error(error);
        }

      },

      // for fetching the hu details from the backend service

      onHuDetailsPress_CCAHU: function () {
        var oView = this.getView();
        var sHu = oView.byId("idSecSCHuInput_CCAHU").getValue();
        var sWpt = oView.byId("idWPTInput_CCAHU").getValue();

        var oModel = this.getView().getModel();
        var sRequestUrl = `/create_confirm_adhochuSet(Huident='${sHu}',Procty='${sWpt}')`
        var that = this;
        oModel.read(sRequestUrl, {
          success: function (odata) {
            console.log(odata);
            if (odata.Huident === sHu && odata.Procty.toLowerCase() === sWpt.toLowerCase()) {
              that.getView().byId("idDescInput_CCAHU").setValue(odata.Maktx);
              that.getView().byId("idThirdScHuInput_CCAHU").setValue(odata.Huident);
              that.getView().byId("idThirdScHuInput2_CCAHU").setValue(odata.Letyp);
              that.getView().byId("idThirdScProdInput_CCAHU").setValue(odata.Matnr);
              that.getView().byId("idThirdScAvlQtyInput_CCAHU").setValue(odata.AvailQuan);
              that.getView().byId("idThirdScUOMInput_CCAHU").setValue(odata.Meins);
              that.getView().byId("idThirdScBatchInput_CCAHU").setValue(odata.Charg);
              that.getView().byId("idThirdScHazardousSubstanceInput_CCAHU").setValue(odata.HazmatInd);
              that.getView().byId("idThirdScStockCategoryInput_CCAHU").setValue(odata.StockDoccat);

            }
            that.getView().byId("idthirdSc_CCAHU").setVisible(true);
            that.getView().byId("idsecondSc_CCAHU").setVisible(false);

          },
          error: function (oError) {
            sap.m.MessageToast.show("error occured")
          }
        })


      },
    });
  }
);
