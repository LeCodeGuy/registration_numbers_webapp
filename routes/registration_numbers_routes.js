import flash from "express-flash";

export default function registrationNumberApp (query){
    // Variables for use in app
    let regFormat = /^[a-zA-Z]{0,3}\s*\d{3}(?:[-\s]?\d{0,3})$/;
    let townName
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
            townName,
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
                    // clear townID before forEach loop
                    townID = '';

                    // Loops the towns and sets the townName and townID if it is supported
                    validTowns.forEach(town => {
                        if(regNumber.startsWith(town.registration_start.toUpperCase())){
                            townID = town.id;
                        }
                    });
                    //  If townID is returned add the registration number
                    if(townID != ''){
                        await query.addRegistration(regNumber,townID);
                        req.flash('success',regNumber+' successfully added');
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
        setTownName(req.body.towns);
        
        res.redirect('/');
    }

    // show a single registration number
    async function showOne(req,res){
        let regSelected = req.params.regSelected ;
        // Navigate to the page and pass the value onto handlebars
        res.render('single-registration', {
            regSelected,
            tabTitle: 'View - Registration App',
        })  
    }

    return {
        pageLoad,
        add,
        reset,
        showMany,
        showOne,       
    }
}