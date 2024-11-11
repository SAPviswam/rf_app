sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/UIComponent"
    ],
    function (BaseController, UIComponent) {
        "use strict";

        return BaseController.extend("com.app.rfapp.controller.WTQueryByWT", {
            onInit: function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
            },
            onResourceDetailsLoad: async function (oEvent1) {
                const { id } = oEvent1.getParameter("arguments");
                this.ID = id;
            },
            onPressFirstBackButton: async function () {
                var oRouter = UIComponent.getRouterFor(this);
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
                        MessageToast.show("User does not exist");
                    }
                });

            },
            onWtQBWtWhLiveChange: function (oEvent) {
                var oInput = oEvent.getSource();
                var oHuValue = oInput.getValue().trim();

                if (oHuValue) {
                    // Call OData service to validate the HU value
                    var oModel = this.getOwnerComponent().getModel();
                    var that = this;

                    oModel.read(`/WarehouseTaskNewSet('${oHuValue}')`, {

                        success: function (odata) {
                            // If HU exists, show icon2 and hide icon1
                            that.getView().byId("idWtQBWtFirstSC_WTQueryByWT").setVisible(false);
                            that.getView().byId("idWtQBWtWhSecondsc_WTQueryByWT").setVisible(true);
                            // that.getView().byId("idWtQBWtfirstbackbtn").setVisible(false);
                            // that.getView().byId("idWtQBWtSecondbackbtn").setVisible(true);
                            // Optionally, you can also populate fields here based on the result
                            that.getView().byId("idWtQBWtwtInput_WTQueryByWT").setValue(odata.Tanum);
                            that.getView().byId("idWtQBWtWTitInput_WTQueryByWT").setValue(odata.Tapos);
                            that.getView().byId("idWtQBWtwtsInput_WTQueryByWT").setValue(odata.Numwt);
                            that.getView().byId("idWtQBWtStsInput_WTQueryByWT").setValue(odata.Tostat);
                            that.getView().byId("idWtQBWtPtypInput_WTQueryByWT").setValue(odata.Procty);
                            that.getView().byId("idWtQBWtSproInput_WTQueryByWT").setValue(odata.Prces);
                            that.getView().byId("idWtQBWtActyInput_WTQueryByWT").setValue(odata.ActType);
                            that.getView().byId("idWtQBWtProInput_WTQueryByWT").setValue(odata.Matnr);
                            that.getView().byId("idWtQBWtProEmpInput_WTQueryByWT").setValue(odata.HazmatInd);
                            that.getView().byId("idWtQBWtSbinInput_WTQueryByWT").setValue(odata.Vlpla);
                            that.getView().byId("idWtQBWtSbinEmpInput_WTQueryByWT").setValue(odata.Vlenr);
                            that.getView().byId("idWtQBWtDbinInput_WTQueryByWT").setValue(odata.Nlpla);
                            that.getView().byId("idWtQBWtDbinEmpInput_WTQueryByWT").setValue(odata.Nlenr);

                            let dateStr = odata.ConfD;

                            // Extract the year, month, and day
                            let year = dateStr.slice(0, 4);
                            let month = dateStr.slice(4, 6);
                            let day = dateStr.slice(6, 8);

                            // Format the date as "yyyy-mm-dd"
                            let formattedDate = `${year}-${month}-${day}`;

                            that.getView().byId("idWtQBWtCdatInput_WTQueryByWT").setValue(formattedDate);
                            let milliseconds = odata.ConfT.ms;

                            // Calculate hours, minutes, and seconds
                            let hours = Math.floor(milliseconds / (1000 * 60 * 60));
                            let minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
                            let seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

                            // Format the result
                            let timeFormatted = `${hours}:${minutes}:${seconds}`;

                            

                            that.getView().byId("idWtQBWtCdatnput_WTQueryByWT").setValue(timeFormatted );
                            that.getView().byId("idWtQBWtCusrInput_WTQueryByWT").setValue(odata.ConfBy);

                        },
                        error: function (oError) {
                            // Show error message if HU is not found 
                        }
                    });
                } else {


                }
                this.getView().byId("idWtQBWtFirstSC_WTQueryByWT").setVisible(false);
                this.getView().byId("idWtQBWtWhSecondsc_WTQueryByWT").setVisible(true);
                // this.getView().byId("idWtQBWtfirstbackbtn").setVisible(false);
                // this.getView().byId("idWtQBWtSecondbackbtn").setVisible(true);

            },
            onPressSecondBackButton: function () {
                this.getView().byId("idWtQBWtWhSecondsc_WTQueryByWT").setVisible(false);
                this.getView().byId("idWtQBWtFirstSC_WTQueryByWT").setVisible(true);
                // this.getView().byId("idWtQBWtSecondbackbtn").setVisible(false);
                // this.getView().byId("idWtQBWtfirstbackbtn").setVisible(true);

            },
            onWtQBWtDetailBtnPress: function () {

                var oHuValue = this.getView().byId("idWtQBWtwtInput_WTQueryByWT").getValue()

                if (oHuValue) {
                    // Call OData service to validate the HU value
                    var oModel = this.getOwnerComponent().getModel();
                    var that = this;

                    oModel.read(`/WarehouseTaskNewSet('${oHuValue}')`, {

                        success: function (odata) {
                            // If HU exists, show icon2 and hide icon1
                            that.getView().byId("idWtQBWtWhSecondsc_WTQueryByWT").setVisible(false);
                            that.getView().byId("idWtQBWtWhThirdsc_WTQueryByWT").setVisible(true);
                            // that.getView().byId("idWtQBWtSecondbackbtn").setVisible(false);
                            // that.getView().byId("idWtQBWtThirdbackbtn").setVisible(true);
                            // Optionally, you can also populate fields here based on the result
                            that.getView().byId("idWtQBWtProductDiscriptioInput_WTQueryByWT").setValue(odata.Maktx);
                            that.getView().byId("idWtQBWtwoInput_WTQueryByWT").setValue(odata.Who);
                            that.getView().byId("idWtQBWtOwnerInput_WTQueryByWT").setValue(odata.Owner);
                            that.getView().byId("idWtQBWtPEntInput_WTQueryByWT").setValue(odata.Entitled);
                            that.getView().byId("idWtQBWtHTypeInput_WTQueryByWT").setValue(odata.Letyp);
                            that.getView().byId("idWtQBWtWhHuInput_WTQueryByWT").setValue(odata.Vlenr);
                            that.getView().byId("idWtQBWtEstpInput_WTQueryByWT").setValue(odata.Procs);
                            that.getView().byId("idWtQBWtSqtyInput_WTQueryByWT").setValue(odata.Vsola);
                            that.getView().byId("idWtQBWtPcInput_WTQueryByWT").setValue(odata.Altme)
                            that.getView().byId("idWtQBWtHuWtInput_WTQueryByWT").setValue(odata.Flghuto)

                        },
                        error: function (oError) {
                            // Show error message if HU is not found 
                        }
                    });
                } else {


                }
                this.getView().byId("idWtQBWtWhSecondsc_WTQueryByWT").setVisible(false);
                this.getView().byId("idWtQBWtWhThirdsc_WTQueryByWT").setVisible(true);
                // this.getView().byId("idWtQBWtSecondbackbtn").setVisible(false);
                // this.getView().byId("idWtQBWtThirdbackbtn").setVisible(true);

            },
            onPressThirdBackButton: function () {
                this.getView().byId("idWtQBWtWhSecondsc_WTQueryByWT").setVisible(true);
                this.getView().byId("idWtQBWtWhThirdsc_WTQueryByWT").setVisible(false);
                // this.getView().byId("idWtQBWtSecondbackbtn").setVisible(true);
                // this.getView().byId("idWtQBWtThirdbackbtn").setVisible(false);

            },


        });
    }
);

