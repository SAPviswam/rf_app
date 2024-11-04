sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageToast",
        "sap/ui/core/UIComponent",
        "sap/ui/model/json/JSONModel",
    ],
    function(BaseController,MessageToast,UIComponent,JSONModel) {
      "use strict";

  
      return BaseController.extend("com.app.rfapp.controller.SerialNumberLocation", {
        onInit: function() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
        },
        onResourceDetailsLoad:function(oEvent1){
            var that = this;
            const { id } = oEvent1.getParameter("arguments");
            this.ID = id;
            console.log(this.ID);
        },

         onSNLfirxtBackBtnPress:async function(){
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
        },

        onSubmitpress: function () {
            // Get the input values from the input fields
            var oView = this.getView();
            var sProductNumber = oView.byId("idSNLproductInput").getValue();
            var sSerialNumber = oView.byId("idSNLSerialNoInput").getValue();
       
            // Ensure both product number and serial number are provided
            if (!sProductNumber || !sSerialNumber) {
                sap.m.MessageToast.show("Please enter both Product and Serial Number");
                return;
 
            }
       
            // Call your backend service to fetch products based on the provided keys
            var oModel = this.getView().getModel();
            var that = this;
       
            // Construct the request URL using the provided format
            var sRequestUrl = `/SerialNoLocationSet(Matnr40='${sProductNumber}',Serid='${sSerialNumber}')`;
       
            // Perform the read operation
            oModel.read(sRequestUrl, {
                success: function (odata) {
                    console.log(odata);
                    that.getView().byId("idSNLFirstSC").setVisible(false);
                    that.getView().byId("idSNLthirdSC").setVisible(true);
                    // Set the values to the corresponding SimpleForm input fields
                    that.getView().byId("idProductInput_AIC1_").setValue(odata.Huident); 
                    that.getView().byId("input_").setValue(odata.HazmatInd); // Location
                    that.getView().byId("idProductInput__AIC1_").setValue(odata.Lgtyp);
                    that.getView().byId("input___").setValue(odata.Lgber);
                    that.getView().byId("inpufgt___").setValue(odata.Lgpla);
                    that.getView().byId("inpufsdfgt___").setValue(odata.LocType);
                    that.getView().byId("idProductdfghInput__AIC1_").setValue(odata.Nista);
                    that.getView().byId("inpudfgt___").setValue(odata.Altme);
                    that.getView().byId("inpudfghfgt___").setValue(odata.Cat);
                    that.getView().byId("idProdwertyuctInput_AIC1_").setValue(odata.Charg);
                    that.getView().byId("inpwerut_").setValue(odata.Brestr);
                    that.getView().byId("inputTsdftgop").setValue(odata.Owner);
                    that.getView().byId("inputftghyLwst").setValue(odata.Entitled);
                    that.getView().byId("inpurtyutMove").setValue(odata.Coo);
                    that.getView().byId("inputEfr1").setValue(odata.StockDoccatInd);
                    that.getView().byId("infputEr2").setValue(odata.StockDocno);
                    that.getView().byId("inpfutEr3").setValue(odata.StockItmno);

 
               // Additional fields can be mapped similarly
                },
                error: function () {
                    sap.m.MessageToast.show("Error fetching products.");
                }
            });
        },
        onSNLthirdBackBtnPress:function(){
            this.getView().byId("idSNLthirdSC").setVisible(false);
            this.getView().byId("idSNLFirstSC").setVisible(true);

        },
        onpresshudetails:function(){
            
             // Get the input value from the input field
             var oView = this.getView();
             var sHUNumber = oView.byId("idProductInput_AIC1_").getValue();
       
             sHUNumber = sHUNumber.toUpperCase();
             
             this.sHUNumber = sHUNumber;
       
             // Call your backend service to fetch products for this bin
             var oModel = this.getOwnerComponent().getModel(); // Assuming you have a model set up
             var that = this;
             var sRequestUrl = `/HandlingUnitNHSet('${sHUNumber}')`;
             oModel.read(sRequestUrl, {
               urlParameters: {
                 "$expand": "HUheadtoItems",
                 "$format": "json"
               },
       
               success: function (odata) {
                 console.log(odata)

                    that.getView().byId("idSNLfourthSC").setVisible(true);
                    that.getView().byId("idSNLthirdSC").setVisible(false);
 
                    let oDetails = odata.HUheadtoItems.results;

                    that.getView().byId("inputPrkmt").setValue(oDetails[0].Pmat);
                    that.getView().byId("inputHrtyp").setValue(oDetails[0].Letyp);
                    that.getView().byId("inputTortw1").setValue(oDetails[0].GWeight);
                    that.getView().byId("inputTrotw2").setValue(oDetails[0].UnitGw);
                    that.getView().byId("inputToutv1").setValue(oDetails[0].GVolume);
                    that.getView().byId("inpurtTotv2").setValue(oDetails[0].UnitGv);
                    that.getView().byId("inputrMaxW").setValue(oDetails[0].MaxWeight);
                    that.getView().byId("inputrMaxV").setValue(oDetails[0].MaxVolume);
                    that.getView().byId("inputTarrW").setValue(oDetails[0].TWeight);
                    that.getView().byId("inputTrarV").setValue(oDetails[0].TVolume);
                    that.getView().byId("inputrEr1").setValue(oDetails[0].Length);
                    that.getView().byId("inputEsr2").setValue(oDetails[0].Width);
                    that.getView().byId("inputEsr3").setValue(oDetails[0].Height);
                    that.getView().byId("inputsEr4").setValue(oDetails[0].UnitLwh);
                    that.getView().byId("inputTops").setValue(oDetails[0].Top);
                    that.getView().byId("inputsLwst").setValue(oDetails[0].Bottom);
                    that.getView().byId("inputsMove").setValue(oDetails[0].Flgmove);
                    that.getView().byId("inputSstat1").setValue(oDetails[0].Phystat);
                    that.getView().byId("inpustStat2").setValue(oDetails[0].HazmatInd);
                    that.getView().byId("inputsBin1").setValue(oDetails[0].Wsbin);
                    that.getView().byId("inputCsGrp").setValue(oDetails[0].Dstgrp);
                    
               },
               error: function () {
                 sap.m.MessageToast.show("Error fetching products.");
               }
             });
        },

        onSNLfourthBackBtnPress:function(){
            this.getView().byId("idSNLthirdSC").setVisible(true);
            this.getView().byId("idSNLfourthSC").setVisible(false);
        },
        onpressBindetails:function(){
            

            // Get the input value from the input field
            var oView = this.getView();
            var sBinNumber = oView.byId("inpufgt___").getValue();
      
            sBinNumber = sBinNumber.toUpperCase();
            
            this.sBinNumber = sBinNumber;
      
            // Call your backend service to fetch products for this bin
            var oModel = this.getOwnerComponent().getModel(); // Assuming you have a model set up
            var that = this;
            var sRequestUrl = `/BINQItemSet('${sBinNumber}')`;
            oModel.read(sRequestUrl, {
              urlParameters: {
                "$expand": "BINQHeadSet",
                "$format": "json"
              },
      
              success: function (odata) {
                console.log(odata)

                that.getView().byId("idSNLthirdSC").setVisible(false);
                that.getView().byId("idSNLFifthSC").setVisible(true);

                   let oDetails = odata.BINQHeadSet.results;

                   that.getView().byId("inputTsops").setValue(odata.Lgtyp);
                   that.getView().byId("inpustsLwst").setValue(odata.Lgber);
                   that.getView().byId("inputssMove").setValue(odata.Lptyp);
                   that.getView().byId("inputSsstat1").setValue(odata.Skzue);
                   that.getView().byId("inputTSsops").setValue(odata.Maxle);
                   that.getView().byId("inpusstsLwst").setValue(odata.Anzle);
                   that.getView().byId("inputdssMove").setValue(odata.Plauf);
                   that.getView().byId("inputWSsstat1").setValue(odata.Skzua);
                   that.getView().byId("inpuStrMaxW").setValue(odata.MaxWeight);
                   that.getView().byId("inpuStrMaxV").setValue(odata.Weight);
                   that.getView().byId("inpuSdtrMaxV").setValue(odata.UnitW);
                   that.getView().byId("inpuSStrMaxW").setValue(odata.MaxVolume);
                   that.getView().byId("inpucSdtrMaxV").setValue(odata.Volum);
                   that.getView().byId("inpuSddtrMaxV").setValue(odata.UnitV);
                   that.getView().byId("inpuSSstrMaxW").setValue(odata.MaxCapa);
                   that.getView().byId("inpucSsdtrMaxV").setValue(odata.Fcapa);
                   that.getView().byId("inpuStTortw1").setValue(odata.MovedDate);
                   that.getView().byId("inpuStTrotw2").setValue(odata.MovedTime);
                   that.getView().byId("inputToDutv1").setValue(odata.ClearedDate);
                   that.getView().byId("inpurtSToDtv2").setValue(odata.ClearedTime);
                   that.getView().byId("inpuStTDortw1").setValue(odata.IdatuD);
                   that.getView().byId("inpuStDTrotw2").setValue(odata.IdatuT);
                   that.getView().byId("inputToDDtv1").setValue(odata.Ivnum);
                   that.getView().byId("inpurtToDtv2").setValue(odata.IvPos);

                   function convertMillisecondsToTime(milliseconds) {
                    // Calculate total seconds
                    let totalSeconds = Math.floor(milliseconds / 1000);
        
                    // Calculate hours, minutes, and seconds
                    const hours = Math.floor(totalSeconds / 3600);
                    const minutes = Math.floor((totalSeconds % 3600) / 60);
                    const seconds = totalSeconds % 60;
        
                    // Format as HH:MM:SS
                    return (
                      String(hours).padStart(2, '0') + ':' +
                      String(minutes).padStart(2, '0') + ':' +
                      String(seconds).padStart(2, '0')
                    );
                  }
        
                  // Example usage
                  const milliseconds = odata.MovedTime.ms;
                  const milliseconds1 = odata.ClearedTime.ms;
                  const milliseconds2 = odata.IdatuT.ms;
                  oView.byId("inpuStTrotw2").setValue(convertMillisecondsToTime(milliseconds));
                  oView.byId("inpurtSToDtv2").setValue(convertMillisecondsToTime(milliseconds1));
                  oView.byId("inpuStDTrotw2").setValue(convertMillisecondsToTime(milliseconds2));
                   
              },
              error: function () {
                sap.m.MessageToast.show("Error fetching products.");
              }
            });
        },
        onSNLfifthBackBtnPress:function(){
            this.getView().byId("idSNLthirdSC").setVisible(true);
            this.getView().byId("idSNLFifthSC").setVisible(false);
        }
      });
    }
  );
  