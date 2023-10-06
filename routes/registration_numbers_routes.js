import flash from "express-flash";

export default function registrationNumberApp (query){
    // Variables for use in app
    let regFormat = /^[a-zA-Z]{0,3}\s*\d{3}(?:[-\s]?\d{0,3})$/;
    let townName = 'All'
    let townID = ''
    
    // * Helper Methods
    // test the registration format
    function checkRegFormat(reg){
        return regFormat.test(reg);
    }

    function setTownName(town){
        townName = town;
    }

    // * Routes
    // Page load
    async function pageLoad(req, res){
        let townData = await query.getTowns();
        let regNumData = await query.getRegistrationForTown(townName);
        
        res.render('home', {
            // variables to be passed to handlebars
            tabTitle: 'Home - Registration App',
            townData,
            regNumData,
            noRegData: (regNumData.length == 0),
        });
    }

    // Add registration function
    async function add(req, res){
        let regNumber = req.body.txtRegNum.toUpperCase();
        let validTowns = await query.getTowns();
        
        // Registration was entered
        if(regNumber){
            // Registration format is valid                                                              
            if(checkRegFormat(regNumber)){                                          
                // Check whether registration exists in the DB
                if(await query.checkRegistration(regNumber) === false){
                    // Loops the towns and sets the townName and townID if it is supported
                    validTowns.forEach(town => {
                        if(regNumber.startsWith(town.registration_start.toUpperCase())){
                            townID = town.id;
                        }
                    });
                    //  If townID is returned add the registration number
                    if(townID != ''){
                        await query.addRegistration(regNumber,townID);
                        req.flash('success','Registration successfully added');
                    }
                    //  Display message
                    else{
                        req.flash('error','Unsupported registration number! Please see examples')
                    }                    
                }
                else{
                    req.flash('error',regNumber + ' already exists! Please enter a new registration number.');
                }
            }
            // Registration format is invalid
            else{
                req.flash('error','Invalid registration format! Please see examples');
            }
        }
        // No registration entered
        else{
            req.flash('error','Please enter a registration number');
        }

        res.redirect('/');
    }
    
    // Reset app data
    async function reset(req, res){
        await query.resetData();

        res.redirect('/');
    }

    // show multiple registration numbers
    async function showMany(req,res){
        //console.log(req.body.towns)
        setTownName(req.body.towns);
        //await query.getRegistrationForTown(townName);
        res.redirect('/');
    }

    // show a single registration number
    async function showOne(req,res){
        let regSelected = req.params.regSelected ;
        res.render('single-registration', {regSelected})
    }
    
    // async function setRegistrationVariables(regNum){
    //     regNumEntered = regNum.toUpperCase()
        
    //     townData.forEach(town => {
    //         if(regNumEntered.startsWith(town.registration_start.toUpperCase())){
    //             townName = town.town_name;
    //             townID = town.id;
    //         }
    //     });
    // }

    // async function allRegNums(){
    //     let regNumData = await query.getRegistrationForTown(townSelected);

    //     return regNumData;
    // }

    // async function addRecord(regNum){
    //     if(regNum.length===0){
    //         errMessage = "Please enter a registration number.";
    //     }else{
    //         await setRegistrationVariables(regNum);
            
    //         // TODO check registration number validity
    //         // TODO 

    //         //check if the town was found in the DB
    //         if(townID.length == 0 || townName.length == 0){
    //             errMessage = "Invalid town, please see examples."
    //         }
    //         else{
    //             // Get all registration numbers for the town
    //             let regCheck = await allRegNums(townName);

    //             // check whether the exact registration number exists already
    //             regCheck.forEach(registration =>{
    //                 if(regNum.toUpperCase() === registration.registration_number){
    //                     // update errMessage
    //                     errMessage = regNum + " already exists! Please enter a new registration number.";
    //                 }
    //                 else{
    //                     // add the registration record
    //                     console.log("Reg does not exist, please add");
    //                     query.addRegistration(regNum,townID);
    //                 }
    //             });
    //         }
    //     }
    // }
    
    

    return {
        pageLoad,
        add,
        reset,
        showMany,
        showOne,
        // allRegNums,
        // addRecord,        
    }
}