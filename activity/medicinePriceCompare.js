let puppeteer=require("puppeteer");
let fs=require("fs");
let path = require("path");
let xlsx = require("xlsx");
let links=["https://www.netmeds.com","https://www.medlife.com","https://pharmeasy.in"];

function getPriceFromFn(medName){
   console.log(medName);
    (async function(){
        let browserInstance=await puppeteer.launch({
            headless:false,
            defaultViewport:null,
            args:["--start-maximized",]
        });
        try{
          let netMedArr=await getPriceFromNetmed(links[0],browserInstance,medName);
          let Medliferr=await getPricingFromMedlife(links[1],browserInstance,medName);
          let pharmeasyArr=await getPricingFromPharmeasy(links[2],browserInstance,medName);
          makeExcelFile(netMedArr,Medliferr,pharmeasyArr);
        }
        catch(err){
            console.log(err);
        }finally{
            await browserInstance.close();
        }
    })();
    
    async function getPriceFromNetmed(link,browserInstance,medName){
        try{
            let newTab=await browserInstance.newPage();
            await newTab.goto(link);
            await newTab.click("div.auto-search");
            await newTab.type("div.auto-search",medName,{delay:200});
            await newTab.keyboard.press("Enter");
            await newTab.waitForSelector(".ais-InfiniteHits-item",{visible:true});
            await newTab.waitForSelector(".info",{visible:true});
            await newTab.waitForSelector(".final-price",{visible:true});
            await newTab.waitForSelector(".drug-manu",{visible:true});
            return newTab.evaluate(consoleFn,link,".info",".final-price",".drug-manu");
        }catch(err){
            console.log(err);
        }
        
    }

    async function getPricingFromMedlife(link,browserInstance,medName){
        try{
            let newTab=await browserInstance.newPage();
            await newTab.goto(link);
            await newTab.click("input[type='search']");
            await newTab.type("input[type='search']",medName,{delay:200});
            await newTab.keyboard.press("Enter");
            await newTab.waitForSelector(".skucard-wrapper",{visible:true});
            await newTab.waitForSelector(".product-name",{visible:true});
            await newTab.waitForSelector(".item-price",{visible:true});
            return newTab.evaluate(consoleFn,link,".product-name",".item-price");
        }catch(err){
            console.log(err);
        }  
    }

    async function getPricingFromPharmeasy(link,browserInstance,medName){
        try{
            let newTab=await browserInstance.newPage();
            await newTab.goto(link);
            await newTab.click("._3lNKn._37CeV");
            await newTab.type("._3lNKn._37CeV",medName,{delay:200});
            await newTab.keyboard.press("Enter");

            await newTab.waitForSelector("._8a3x3",{visible:true});
            await newTab.waitForSelector(".ooufh",{visible:true});
            await newTab.waitForSelector("._1_yM9",{visible:true});
            await newTab.waitForSelector("._3JVGI",{visible:true});
            return newTab.evaluate(consoleFn,link,".ooufh","._1_yM9","._3JVGI");
        }catch(err){
            console.log(err);
        }
        
    }

    function consoleFn(website,nameSelector,priceSelector,manuSelector){
        let nameArr=document.querySelectorAll(nameSelector);
        let priceArr=document.querySelectorAll(priceSelector);
        let manuArr=document.querySelectorAll(manuSelector);
        let details=[];
        for(let i=0;i<3;i++){
            let name=nameArr[i].innerText;
            let price=priceArr[i].innerText;
            let manufacture=manuArr[i];
            if(manufacture){
                manufacture=manufacture.innerText;
            }else{
                manufacture="Not Defined";
            }
            details.push({
                name,price,manufacture,website
            });
        }
        return details;
    }

    function makeExcelFile(dataobj1,dataobj2,dataobj3){
        let folderPath=path.join(__dirname,"Covid-Data");
        dirCreator(folderPath);
        let name="priceCompare"; 
        let filepath=path.join(folderPath,name+".xlsx");
        Array.prototype.push.apply(dataobj2,dataobj3);
        Array.prototype.push.apply(dataobj1,dataobj2)
        excelWriter(filepath,dataobj1,name);
    }
    function dirCreator(folderPath){
        if (fs.existsSync(folderPath) == false) {
            fs.mkdirSync(folderPath);
        }
    }
   
    function excelWriter(filepath,json,name){
        let newWB=xlsx.utils.book_new();
        //console.log(json);
        let newWS=xlsx.utils.json_to_sheet(json);
        xlsx.utils.book_append_sheet(newWB,newWS,name);
        xlsx.writeFile(newWB,filepath);
    }
    
}


module.exports={
    getPriceFromFn:getPriceFromFn
}