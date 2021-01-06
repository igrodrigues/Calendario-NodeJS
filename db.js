const mongoClient = require("mongodb").MongoClient;
mongoClient.connect("mongodb://localhost:27017",
                    {useUnifiedTopology: true})
            .then(connection => {
                global.connection = connection.db("calendario");
                console.log("Connected!");
            })
            .catch(error => console.log(error));

function addUser(username, password){
    global.connection.collection("users").insert({username: username, password: password, events:[]});
}

function findUser(username){
    return global.connection.collection("users").find({username: username}).toArray();
}

function updateUser(username, events){
    global.connection.collection("users").update({username: username}, {$set:{events: events}});
}

module.exports = {addUser, findUser, updateUser};
//>mongod --dbpath f:\projetos\mongodata  