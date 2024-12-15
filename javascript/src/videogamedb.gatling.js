import{atOnceUsers, scenario, simulation, pause, jmesPath, csv, feed, rampUsers} from "@gatling.io/core";
import{http, status} from "@gatling.io/http";

export default simulation((setUp) => {
    //HTTP protocol
    const httpProtocol = http
    .baseUrl("https://videogamedb.uk/api/v2")
    .acceptHeader("application/json")
    .contentTypeHeader("application/json");

    //Feeder for the test data
     const feeder = csv("videogames.csv").random();


    //Scenario
    const myScenario = scenario('My Scenario').exec(
     http("Get all games").get("/videogame")        //Scenari http first call name is  "Get all Games" get data from "/videogame" endpoint
    .check(status().is(200))                        // the respnse status code should be 200
    .check(jmesPath("[0].id").saveAs("firstGameId")), // grab the id from first object ("[0].id") ans save in to a pramter called ("firstGameId")
     pause(5),                                      // pause 5 sec test
     http("Get single game").get("/videogame/#{firstGameId}") // Second Scenari http  call name is  "Get single game" 
     //get data from "/videogame/#{firstGameId}" endpoint
     .check(status().is(200))                        //the respnse status code should be 200
     .check(jmesPath("name").is("Resident Evil 4")), // make use name of the object is "Resident Evil 4"
     pause(2),
     feed(feeder), //feed is imported, and colled feeder// when this test runs it gets the data from feeder "videogames.csv"
     http("Get Game: #{gameName}").get("videogame/#{gameId}") //http transaction name is Get Game and spesific parameter name is (gameName) 
     //we make get call to "videogame/#{gameId} endpoint
     .check(jmesPath("name").isEL("#{gameName}")) //isEL is gatling expretion language, gatling prameter.


    );


    //Simulation
   //setUp(myScenario.injectOpen(atOnceUsers(1)).protocols(httpProtocol)) // this test run for one user

    setUp(myScenario.injectOpen(  
         atOnceUsers(5),           // firsyt runs for 5 users
         rampUsers(10).during(10)  // then  after 10 seconds rumpups 10 more user total 15 users.
    ).protocols(httpProtocol));

});