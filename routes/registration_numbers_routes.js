export default function registrationNumberApp (query){
    let errMessage
    let townSelected

    async function allTowns(){
        //console.log("Route - allTowns")
        let townData = await query.getTowns();

        return townData;
    }
    async function setTownSelected(selection){
        townSelected = selection;
    }
    async function allRegNums(){
        //console.log(townSelected);
        let regNumData = await query.getRegistrationForTown(townSelected);

        return regNumData;
    }

    async function addRecord(regNum){
        if(regNum.length===0){
            errMessage = "Please enter a registration number.";
        }else{
            const townObject = await allTowns();
            let townName = '';
            let townID = '';
            
            townObject.forEach(record => {
                if(regNum.startsWith(record.registration_start)){
                    townName = record.town_name;
                    townID = record.id;
                }
                else{
                    errMessage = '';// townName = '';
                    // townID = '';
                }
            });

            //check if the town was found in the DB
            if(townID.length == 0 || townName.length == 0){
                errMessage = "Invalid town, please see examples."
            }
            else{
                // Get all registration numbers for the town
                let regCheck = await allRegNums(townName);
                // If the array length is 0 i.e. there is no records for the town
                if(regCheck.length == 0){
                    // add the registration record
                    //console.log("Reg does not exist, please add");
                    query.addRegistration(regNum,townID)
                }
                else{
                    // check whether the exact registration number exists already
                    regCheck.forEach(registration =>{
                        if(regNum === registration.registration_number){
                            // update errMessage
                            errMessage = regNum + " already exists! Please enter a new registration number.";
                        }
                        else{
                            // add the registration record
                            //console.log("Reg does not exist, please add");
                            query.addRegistration(regNum,townID);
                        }
                    });
                }
            }
        }
    }
    
    async function reset(){
        await query.resetData();
        errMessage = '';
    }

    async function getError(){
        return errMessage;
    }

    return {
        allTowns,
        setTownSelected,
        allRegNums,
        addRecord,
        reset,
        getError,
    }
}