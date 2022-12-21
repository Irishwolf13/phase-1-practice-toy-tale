let addToy = false;
const toyCollection = document.querySelector("#toy-collection");    // Selects HTML item by ID
const toyForm = document.querySelector(".add-toy-form");            // Selects HTML item by class
const url = `http://localhost:3000/toys`                            // Creates variable for URL

document.addEventListener("DOMContentLoaded", () => {               // Causes things to wait for DOM to load
  const addBtn = document.querySelector("#new-toy-btn");            // Selects button by ID
  const toyFormContainer = document.querySelector(".container");    // selects container by class
  const newToySubmit = document.querySelector(".add-toy-form");     // selects submit button by class

  addBtn.addEventListener("click", () => {        // hide & seek with the form provided by Flatiron
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });                                             // END CODE hide & seek with the form provided by Flatiron
  
  fetchALL();                                         //Get all toys and populate page
  toyForm.addEventListener('submit', onFormSubmit)    //add on form submit to toyform
});

const fetchALL = () => {  //fetch toys (GET)
  fetch(url)                              // Fetch from http://localhost:3000/toys
  .then((response) => response.json())    // Turns the resonse from previous line into an object
  .then((data) => {                       // Passes the object from previous line as 'data' so we can use it
    data.forEach(character => {           // Loop through each toy
      addToyCard(character)               // Adds a card for every character
    });
  })
}

const addToyCard = (character) => { //Add Toy Card
  let div = document.createElement("div");          //Create all elements
  let h2 = document.createElement("h2");            //Create all elements
  let img = document.createElement("img");          //Create all elements
  let p = document.createElement("p");              //Create all elements
  let button = document.createElement("button");    //Create all elements
  
  
  div.classList.add("card");              // Adds the class 'card' to the div
  h2.innerText = character.name;          // Sets H2 inner Text to character name passed into from fetchALL()
  img.src = character.image;              // Sets Image src to character image passed into from fetchALL()
  img.classList.add('toy-avatar')         // Adds the class 'toy-avatar' to the img
  p.innerText = `${character.likes} Likes`     // Sets p inner Text to character likes passed into from fetchALL()
  button.innerText = "Like ❤️";               // Sets button inner Text to 'Like ❤️'
  button.id = `${character.id}`               // Sets button id to character id passed into from fetchALL()
  
  button.addEventListener('click', (e) => {   // add event listener for each new Card
    onLikedButtonClicked(e)                        // Passes the event to onButtonClicked()
  })
  
  div.appendChild(h2);              //put element in dom
  div.appendChild(img);             //put element in dom
  div.appendChild(p);               //put element in dom
  div.appendChild(button);          //put element in dom
  toyCollection.appendChild(div);   //put element in dom
}

const onFormSubmit = (e) => { //on form submit
  e.preventDefault();                 // prevents default form submit behaviour
  let formData = {                    // creates formData object (keys/values)
    name: e.target.name.value,        // name value(from input)
    image: e.target.image.value,      // image value(from input)
    likes: 0                          // Sets likes to base value of 0
  }

  
  fetch(`${url}`, {   //add a new toy (POST)
    method: "POST",                         // The method is set to POST
    headers: {                              // Creates the headers
      "Content-Type": "application/json",   // I guess you need this for JSONS
      "Accept": "application/json"          // I guess you need this for JSONS
    },                                      
    body: JSON.stringify(formData)          // The body is what we want to add when using POST
  })
  .then(res => res.json())                  // Returns newly updated JSON and converts it to an object
  .then(data => {                           // Passes in object from line above
    addToyCard(data)                        // Adds the new toy to the DOM (this is the pesimistic way)
  })
}

const onLikedButtonClicked = (e) => {  //On liked button click
  let id = e.target.id
  let likesText = e.target.previousElementSibling
  let numLikes = parseInt(likesText.innerText.split(" ")[0]) + 1
  
  //Patch request
  fetch(`${url}/${id}`, {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      likes: numLikes
    })
  })
  .then(res => res.json())
  .then(data => likesText.innerText = `${numLikes} Likes`)
}