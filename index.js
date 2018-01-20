const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'buda';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    const db = client.db(dbName);

    recordsCollection = db.collection('Records');
    summaryCollection = db.collection('summary');

    recordsCollection.find({}).forEach(function (obj) {
        let count = 0;

        function countValues(obj){
            //console.log(`Evaluando ${typeof obj}`);

            if (typeof obj === 'object'){
                if (Array.isArray(obj)){
                    countValues(obj[0]);
                    /*for (let i=0; i < obj.length; i++){
                        //console.log('i ->'+i);
                        countValues(obj[i]);
                    }*/

                } else {

                    for (let prop in obj){
                        if (obj.hasOwnProperty(prop)) {
                            countValues(obj[prop]);
                        }else {
                            console.log(`Invalid prop: ${prop}`);
                        }
                    }
                }

            } else {
                count++;
            }
        }

        if (obj.releases.length > 1) {
            countValues(obj.compiledRelease);
            let s = {
                ocid: obj.ocid,
                release_count: obj.releases.length,
                prop_count: count
            };
            //console.log(s);
            summaryCollection.insertOne(s);
        }

    }, function (error) {
        if (error !== null){
            console.log(error);
        }
        console.log("Hecho!");
        client.close();
    });

});