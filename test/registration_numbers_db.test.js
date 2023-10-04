import assert from "assert";
import db from "../routes/database_connection.js";
import queries from "../services/registration_numbers_services.js";

const query= queries(db);

describe("Registration Numbers Web App testing", function(){
    this.timeout(6000);
    
    this.beforeEach(async function (){
        await query.resetData();
    });

    it("should allow adding registration numbers", async function (){
        await query.addRegistration("CF123456",2);

        let result = await query.getRegistrationForTown("All");

        assert.equal(1, result.length);
    });

    it("should allow adding multiple registration numbers", async function (){
        await query.addRegistration("CF123456",2);
        await query.addRegistration("CFM123-456",1);
        await query.addRegistration("CAW 123 456",3);

        let result = await query.getRegistrationForTown("All");

        assert.equal(3, result.length);
    });

    it("should return only items from a specific town", async function (){
        await query.addRegistration("CFM 456 789",1);
        await query.addRegistration("CF123456",2);
        await query.addRegistration("CAW 123 456",3);
        await query.addRegistration("CF 123-456",2);

        let result = await query.getRegistrationForTown("Brackenfell");
        let result2 = await query.getRegistrationForTown("George");

        assert.equal(2,result.length);
        assert.equal(1,result2.length);
    });

    it("should be able check if a registration number exists", async function (){
        let result = await query.checkRegistration("CFM 123-456");
        
        // registration number should not exist
        assert.equal(false,result);

        // add the registration number
        await query.addRegistration("CFM 123-456",1);

        result = await query.checkRegistration("CFM 123-456");
        
        // registration number should now exist
        assert.equal(true,result);


    });

    it("should be able to clear the registration data", async function(){
        await query.addRegistration("CFM 456 789",1);
        await query.addRegistration("CF123456",2);
        await query.addRegistration("CAW 123 456",3);

        await query.resetData();

        let result = await query.getRegistrationForTown("All");

        assert.equal(0,result.length);
    });

    this.afterAll(function () {
        db.$pool.end;
    });
})