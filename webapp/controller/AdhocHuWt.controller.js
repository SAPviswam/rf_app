sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent",
    "sap/ui/Device"
],
    function (Controller,MessageToast,UIComponent,Device) {
        "use strict";

        return Controller.extend("com.app.rfapp.controller.AdhocHuWt", {
            onInit: function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
                if (Device.system.phone) {
                    this.getView().byId("idTitle_CAHU").addStyleClass("titleMobile");
                }
            },
            onResourceDetailsLoad: async function (oEvent1) {
                const { id,idI } = oEvent1.getParameter("arguments");
                this.ID = id;
                this.IDI=idI;
            },

            // onLiveChange: function () { 
            //     //   if(this.getView().byId("idHuInput_CAHU").getValue()=="800020"){
            //     this.getView().byId("idFirstSc_CAHU").setVisible(false)
            //     this.getView().byId("idsecondSc_CAHU").setVisible(true)
            //     var ohu = this.getView().byId("idHuInput_CAHU").getValue();
            //     this.getView().byId("idSecSCHuInput_CAHU").setValue(ohu)
            //     this.getView().byId("idSecSCHuInput_CAHU").setEditable(false);
            // },

            onPressSubmitbtn:async function () {
                debugger;

                var oView = this.getView();
                var sHunumber = oView.byId("idHuInput_CAHU").getValue();
                var sProcessType = oView.byId("idWPTInput1_CAHU").getValue();

            // Ensure both product number and serial number are provided
            if (!sHunumber || !sProcessType) {
                sap.m.MessageToast.show("Please enter both Hu and Process type");
                return;
 
            }
            // Call your backend service to fetch products based on the provided keys
            var oModel = this.getView().getModel();
            var that = this;

            var sRequestUrl = `/Adhoc_warehouse_taskSet(Huident='${sHunumber}',Procty='${sProcessType}',Reason='')`;

           await oModel.read(sRequestUrl, {
                success: (odata) => {
                    console.log(odata);

                        if (odata.Huident === sHunumber && odata.Procty === sProcessType) {

                            that.getView().byId("idSecSCHuInput_CAHU").setValue(sHunumber);
                            that.getView().byId("idWPTInput_CAHU").setValue(sProcessType);
                            that.getView().byId("idsrcBinInput_CAHU").setValue(odata.Vlpla);
                    }
       
                    this.getView().byId("idFirstSc_CAHU").setVisible(false)
                    this.getView().byId("idsecondSc_CAHU").setVisible(true)
                },
                error: function (oError) {
                   console.log(oError)
                    var oJson=JSON.parse(oError.responseText)
                    
                    sap.m.MessageToast.show(oJson.error.message.value   );  
                }
            });
            },

            onHuDetailsPress_CAHU: function () {

                
                    var oView=this.getView();
                    var sHu=oView.byId("idSecSCHuInput_CAHU").getValue();
                    var sWpt=oView.byId("idWPTInput_CAHU").getValue();
             
                    var oModel=this.getView().getModel();
                    var sRequestUrl=`/create_confirm_adhochuSet(Huident='${sHu}',Procty='${sWpt}')`
                    var that=this;
                    oModel.read(sRequestUrl,{
                      success: function(odata) {
                        console.log(odata);
                        if (odata.Huident === sHu && odata.Procty.toLowerCase() === sWpt.toLowerCase()) {
                             that.getView().byId("idDescInput_CAHU").setValue(odata.Maktx);
                             that.getView().byId("idThirdScHuInput_CAHU").setValue(odata.Huident);
                             that.getView().byId("idThirdScHuInput2_CAHU").setValue(odata.Letyp);
                             that.getView().byId("idThirdScProdInput_CAHU").setValue(odata.Matnr);
                             that.getView().byId("idThirdScAvlQtyInput_CAHU").setValue(odata.AvailQuan);
                             that.getView().byId("idThirdScUOMInput_CAHU").setValue(odata.Meins);
                             that.getView().byId("idThirdScBatchInput_CAHU").setValue(odata.Charg);
                             that.getView().byId("idThirdScHazardousSubstanceInput_CAHU").setValue(odata.HazmatInd);
                             that.getView().byId("idThirdScStockCategoryInput_CAHU").setValue(odata.StockDoccat);
             
                        }
                        that.getView().byId("idthirdSc_CAHU").setVisible(true);
                        that.getView().byId("idsecondSc_CAHU").setVisible(false);
             
                      },
                      error:function(oError){
                        sap.m.MessageToast.show("error occured")
                      }
                    })
             
             
                  },
            onAvatarPressedIn_AHWT: function (oEvent) {
                this.onPressAvatarEveryTileHelperFunction(oEvent);
              },
           
              onSignoutPressed:function(){
                var oRouter = this.getOwnerComponent().getRouter(this);
                oRouter.navTo("InitialScreen",{Userid:this.IDI});
              },
            onSecondBackBtnPress_CAHU: function () {
                this.getView().byId("idFirstSc_CAHU").setVisible(true);
                this.getView().byId("idsecondSc_CAHU").setVisible(false);

            },
            onThirdBackBtnPress_CAHU: function () {
                this.getView().byId("idsecondSc_CAHU").setVisible(true);

                this.getView().byId("idFirstSc_CAHU").setVisible(false);


            },
            onFirstBackBtnPress_CAHU: async function () {
                var oRouter = UIComponent.getRouterFor(this);
                var oModel1 = this.getOwnerComponent().getModel();
                var that=this;
                await oModel1.read("/RESOURCESSet('" + this.ID + "')", {
                    success: function (oData) {
                        let oUser = oData.Users.toLowerCase()
                        if (oUser === "resource") {
                            oRouter.navTo("RouteResourcePage", { id: this.ID,idI: that.IDI });
                        }
                        else {
                            oRouter.navTo("Supervisor", { id: this.ID,idI: that.IDI });
                        }
                    }.bind(this),
                    error: function () {
                        MessageToast.show("User does not exist");
                    }
                });
            },
            onPressCreate_CAHU:async function(){
                var oView=this.getView();
                var oModel=this.getView().getModel();
                var oHu=oView.byId("idSecSCHuInput_CAHU").getValue();
                var oProcesstype=oView.byId("idWPTInput_CAHU").getValue()
                var oSrcBin=oView.byId("idsrcBinInput_CAHU").getValue();
                var oDestbin=oView.byId("idDestBinInput_CAHU").getValue();
                var oobj={
                    Huident:oHu,
                    Procty:oProcesstype,
                    Reason:"",
                    Vlpla:oSrcBin,
                    Nlpla:oDestbin

                }
                
            // var oError=await this.createData(oModel,oobj,"/Adhoc_warehouse_taskSet")
            // console.log(oError)
            // var ojson = JSON.parse(oError.responseText)
            //     MessageToast.show(ojson)
            // }
            oModel.create("/Adhoc_warehouse_taskSet",oobj,{
                success:function(oSucces){
                    console.log(oSucces)
                    MessageToast.show(`Warehouse task is created succesfully with number ${oSucces.Tanum}`);
                },
                error:function(oError){
                    var ojson = JSON.parse(oError.responseText)
                    console.log(ojson)
                    MessageToast.show(ojson.error.message.value )
                }
            })
        },
        onScanSuccess__CAHU: function (oEvent) {
            // Get the scanned HU number from the event
            var sScannedHu = oEvent.getParameter("text");
            this.getView().byId("idHuInput_CAHU").setValue(sScannedHu);
            this.onPressSubmitbtn();
          },
          onDestBinBarcodeScanner_CAHU: function (oEvent) {
            var sScannedHu = oEvent.getParameter("text");
            this.getView().byId("idDestBinInput_CAHU").setValue(sScannedHu);
            this.onPressCreate_CAHU();
          }

        });
    }
);