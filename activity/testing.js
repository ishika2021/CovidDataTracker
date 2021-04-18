let fs=require("fs");
let puppeteer=require("puppeteer");
let path = require("path");
let xlsx = require("xlsx");

function testingCentersFn(location,option){
    (async function(){
        let browserInstance=await puppeteer.launch({
            headless:false,
            defaultViewport:null,
            args:["--start-maximized",]
        });
        try{
            let newTab=await browserInstance.newPage();
            await newTab.goto("https://www.google.com");
            await newTab.type(".gLFyf.gsfi",location,{delay:200});
            await newTab.keyboard.press("Enter");
            await waitAndClick(".MXl0lf.mtqGb.EhIML",newTab);
            let pathologyList=await getPathalogyList(newTab);
            makeExcelFile(pathologyList,option);
        }catch(err){
            console.log(err);
        }finally {
            await browserInstance.close();
        }
    })();

    async function getPathalogyList(newTab){
        try{
            await newTab.waitForSelector(".cXedhc",{visible:true});
            await waitAndClick(".rllt__details.lqhpac",newTab);
            await newTab.waitForSelector(".SPZz6b",{visible:true});

            async function getDetails(nameSelector,addressSelector,numSelector){
                try{
                    let nameArr=document.querySelectorAll(".cXedhc");
                    let details=[];
                    function delay(time) {
                        return new Promise(function(resolve) { 
                            setTimeout(resolve, time)
                        });
                     }
                    for(let i=0;i<nameArr.length;i++){
                        nameArr[i].click();
                        await delay(1000);
                        let name=document.querySelector(nameSelector);
                        let address=document.querySelector(addressSelector);
                        let number=document.querySelector(numSelector);
                        if(name){
                            name=name.innerText;
                        }
                        if(address){
                            address=address.innerText;
                        }
                        if(number){
                           number= number.innerText;
                        }
                        details.push({
                            name,address,number
                        });
                    }
                    return details;
                }catch(err){
                    console.log(err);
                }
            }
            return await newTab.evaluate(getDetails,".SPZz6b",".LrzXr",".LrzXr.zdqRlf.kno-fv");
        }catch(err){
            console.log(err);
        }
    }

    async function waitAndClick(selector,newTab){
        try{
            await newTab.waitForSelector(selector,{visible:true});
            let selectorisClickedPromise=newTab.click(selector);
            return selectorisClickedPromise;
        }catch(err){
            console.log(err);
        }
    }
    function makeExcelFile(dataobj,option){
        let folderPath=path.join(__dirname,"Covid-Data");
        dirCreator(folderPath);
        let name=option; 
        let filepath=path.join(folderPath,name+".xlsx");
        excelWriter(filepath,dataobj,name);
    }
    function dirCreator(folderPath){
        if (fs.existsSync(folderPath) == false) {
            fs.mkdirSync(folderPath);
        }
    }
   
    function excelWriter(filepath,json,name){
        let newWB=xlsx.utils.book_new();
        let newWS=xlsx.utils.json_to_sheet(json);
        xlsx.utils.book_append_sheet(newWB,newWS,name);
        xlsx.writeFile(newWB,filepath);
    }
       
}

module.exports={
    testingCentersFn:testingCentersFn
}