export default function queries(db){
    // Get all records in the Towns table
    async function getTowns(){
        
        let towns = await db.any("SELECT * FROM Towns ORDER BY town_name ASC");
        
        return towns;
    }

    // Checks if registration number already exists
    async function checkRegistration(regNum){
        let regExist = false;

        if(await db.oneOrNone("SELECT * FROM Registration_Numbers WHERE registration_number = $1",[regNum])){
            regExist = true;
        }
        else{
            regExist = false;
        }
        return regExist;
    }

    // Add a registration record
    async function addRegistration(regNum,townID){
        await db.none("INSERT INTO Registration_Numbers (Registration_Number,FK_Town_ID) VALUES ($1,$2)",[regNum,townID]);
    }    

    // Retrieve registration records for towns
    async function getRegistrationForTown(townSelected){
        if(townSelected === undefined || townSelected === 'All'){
            // return all registration records
            return await db.manyOrNone("SELECT * FROM Registration_Numbers");
        }
        else{
            // return records for the specified town
            return await db.manyOrNone("SELECT rn.id,rn.registration_number FROM Registration_Numbers AS rn JOIN Towns AS t ON rn.FK_Town_ID = t.id WHERE t.town_name =$1",[townSelected])
        }         
    }
    
    // clear the registration_numbers table
    async function resetData(){
        await db.none("TRUNCATE TABLE Registration_Numbers RESTART IDENTITY CASCADE");
    }    

    return {
        getTowns,
        checkRegistration,
        addRegistration,        
        getRegistrationForTown,
        resetData,
    }
}