let addToy = false;
const toyCollection = document.querySelector("#toy-collection");
const toyform = document.querySelector(".add-toy-form");
const url = `http://localhost:3000/toys`

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const newToySubmit = document.querySelector(".add-toy-form");

  newToySubmit.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log(e.target.name.value);
    console.log(e.target.image.value);
  })

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  //Get all toys and populate page
  fetchALL();
  //add on form submit to toyform
  toyform.addEventListener('submit', onFormSubmit)
});

//fetch toys (GET)
const fetchALL = () => {
  fetch(url)
  .then((response) => response.json())
  .then((data) => {
    //ADD TOY CARD
    data.forEach(character => {
      addToyCard(character)
      
    });
  })
}
//Add Toy Card
const addToyCard = (character) => {
  //Create all elements
  let div = document.createElement("div");
  let h2 = document.createElement("h2");
  let img = document.createElement("img");
  let p = document.createElement("p");
  let button = document.createElement("button");
  
  //populate elements
  div.classList.add("card");
  h2.innerText = character.name;
  img.src = character.image;
  img.classList.add('toy-avatar')
  p.innerText = `${character.likes} Likes`
  button.innerText = "Like ❤️";
  button.id = `${character.id}`
  button.addEventListener('click', (e) => {
    onButtonClicked(e)
  })
  
  //put card/elements in dom
  div.appendChild(h2);
  div.appendChild(img);
  div.appendChild(p);
  div.appendChild(button);
  toyCollection.appendChild(div);
}

//on form submit
const onFormSubmit = (e) => {
  //get form information
    e.preventDefault();
    let formData = {
      name: e.target.name.value,
      image: e.target.image.value,
      likes: 0
    }

  //add a new toy (POST)
  fetch(`${url}`, {
    method: "POST",
    body: JSON.stringify(formData),
    headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
    })
    .then(res => res.json())
    .then(data => {
      //ADD toy card
      addToyCard(data)
    })
}

//On like button click
const onButtonClicked = (e) => {
  //get toy id
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