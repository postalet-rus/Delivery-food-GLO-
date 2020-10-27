const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}


// day 1 


const buttonAuth = document.querySelector(".button-auth");
const modalAuth = document.querySelector(".modal-auth");
const closeAuth = document.querySelector(".close-auth");
const loginForm = document.querySelector("#logInForm");
const loginInput = document.querySelector("#login");
const username = document.querySelector(".user-name");
const buttonOut = document.querySelector(".button-out");

let login = localStorage.getItem("gloDelivery");

function toggleModalAuth() {
  modalAuth.classList.toggle("is-open");
  loginInput.removeAttribute("placeholder", "Это поле обязательно*");
}



function authorized() {


  function logOut() {
    login = "";
    checkAuth();
    username.textContent = "";
    buttonAuth.style.display = "";
    username.style.display = "";
    buttonOut.style.display = "";
    buttonOut.removeEventListener("click", logOut);
    localStorage.removeItem("gloDelivery");
  }


  console.log("Авторизован");
  
  username.textContent = login;
  
  buttonAuth.style.display = "none";
  username.style.display = "inline";
  buttonOut.style.display = "block";

  buttonOut.addEventListener("click", logOut)

}

function notAuthorized() {
  console.log("Не авторизован");
  
  function logIn(event) {
    event.preventDefault();
    login = loginInput.value;

    if(!login) {
      loginInput.setAttribute("placeholder", "Это поле обязательно*");
      return
    }

    toggleModalAuth();
    checkAuth();
    
    buttonAuth.removeEventListener("click", toggleModalAuth);
    closeAuth.removeEventListener("click", toggleModalAuth);
    loginForm.removeEventListener("submit", logIn);

    loginForm.reset();

    localStorage.setItem("gloDelivery", login);
  }
  
  buttonAuth.addEventListener("click", toggleModalAuth);
  closeAuth.addEventListener("click", toggleModalAuth);
  loginForm.addEventListener("submit", logIn);
}

function checkAuth() {
  if (login) {
    authorized();
  } else {
    notAuthorized()
  }
}

checkAuth()