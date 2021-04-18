//This is a covid -19 information tracker
    // List of all the commands:
    //1. Check for RT PCR testing centers nearby.
    // 2. Check for all the clinics in the nearby area.
    // 3. Check for all the oxygen cylinder providers nearby. 
    // 4. Compare price of the medicines available online
    // Note: Specifically write the area you want search into followed by city name,
    // or search by use "me" followed by option(1/2/3) similarly "medicine name" followed by 4
    // eg node main.js "me" 1 or
    // node main.js "inditel" 4
let input = process.argv.slice(2);
let {testingCentersFn}=require("./testing");
let {getPriceFromFn}=require("./medicinePriceCompare");
let option =input.pop();
switch(option){
    case "1": input ="rtpcr testing center near "+input;
             testingCentersFn(input,"Testing Centers");
             break;
    case "2":  input ="doctors near "+input;
             testingCentersFn(input,"Clinics");
             break;
    case "3":  input="oxygen cylinder near "+input;
             testingCentersFn(input,"Oxygen Cylinders");
             break;
    case "4": getPriceFromFn(input);
              break;
    default: console.log("Wrong choice");

}



