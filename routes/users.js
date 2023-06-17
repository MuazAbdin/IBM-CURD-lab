const express = require('express');
const router = express.Router();


let users = [
    {
        firstName: "John",
        lastName: "wick",
        email:"johnwick@gamil.com",
        DOB:"22-01-1990",
    },
    {
        firstName: "John",
        lastName: "smith",
        email:"johnsmith@gamil.com",
        DOB:"21-07-1983",
    },
    {
        firstName: "Joyal",
        lastName: "white",
        email:"joyalwhite@gamil.com",
        DOB:"21-03-1989",
    },
];

const getDateFromString = (strDate) => {
  let [dd,mm,yyyy] = strDate.split('-');
  return new Date(yyyy+"/"+mm+"/"+dd);
}

// GET request: Retrieve all users
router.get("/",(req,res)=>{
  res.send(JSON.stringify({users},null,4));
});


router.get('/sort', (req, res) => {
  users.sort( (usr1, usr2) => getDateFromString(usr1.DOB) - getDateFromString(usr2.DOB) );
  res.send(JSON.stringify({users},null,4));
});

// GET by specific ID request: Retrieve a single user with email ID
router.get("/:email",(req,res)=>{
  res.send(users.filter( user => user.email===req.params.email ));
});

// curl localhost:5000/user/firstName/John
router.get("/firstName/:firstName", (req, res) => {
  res.send( users.filter( user => user.firstName === req.params.firstName) );
});


// POST request: Create a new user
router.post("/",(req,res)=>{
  users.push(
    {
      "firstName": req.query.firstName,
      "lastName": req.query.lastName,
      "email": req.query.email,
      "DOB": req.query.DOB
    }
  );
  res.send(`${req.query.firstName} ${req.query.lastName} has been added to users.`);
});


// PUT request: Update the details of a user by email ID
router.put("/:email", (req, res) => {
  const email = req.params.email;
  let filteredUsers = users.filter( user => user.email === email);
  if (filteredUsers.length > 0) {
    let filteredUser = filteredUsers[0];
    for (key in req.query) {
      attribute = req.query[key];
      if (attribute) { filteredUser[key] = attribute; }
    }
    users = users.filter((user) => user.email != email);
    users.push(filteredUser);
    res.send(`User with the email ${email} updated.`);
  } else {
    res.send("Unable to find user!");
  }
});


// DELETE request: Delete a user by email ID
router.delete("/:email", (req, res) => {
  users = users.filter( user => user.email != req.params.email );
  res.send(`User with email: ${req.params.email} is deleted, 
            ${users.length} users are remaining.
            Users: \n ${JSON.stringify({users},null,4)}`);
});

module.exports=router;
