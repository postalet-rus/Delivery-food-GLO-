"use strict"

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector(".button-auth");
const modalAuth = document.querySelector(".modal-auth");
const closeAuth = document.querySelector(".close-auth");
const loginForm = document.querySelector("#logInForm");
const loginInput = document.querySelector("#login");
const username = document.querySelector(".user-name");
const buttonOut = document.querySelector(".button-out");
const cardsRestaurants = document.querySelector(".cards-restaurants");
const containerPromo = document.querySelector(".container-promo");
const restaurants = document.querySelector(".restaurants");
const menu = document.querySelector(".menu");
const logo = document.querySelector(".logo");
const cardsMenu = document.querySelector(".cards-menu");

let login = localStorage.getItem("gloDelivery");

function toggleModal() {
  modal.classList.toggle("is-open");
}

function toggleModalAuth() {
  modalAuth.classList.toggle("is-open");
  if(!modalAuth.classList.contains("is-open")) {
    formClear();
    enableScroll();
  } else {
    disableScroll()
  }
}

function formClear() {
  loginInput.removeAttribute("placeholder", "Это поле обязательно*");
  logInForm.reset();
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

  
  username.textContent = login;
  
  buttonAuth.style.display = "none";
  username.style.display = "inline";
  buttonOut.style.display = "block";

  buttonOut.addEventListener("click", logOut);

}

function notAuthorized() {
  
  function logIn(event) {
    event.preventDefault();
    login = loginInput.value.trim();
    if(login.length === 0) {
      loginInput.value = "";
      loginInput.setAttribute("placeholder", "Это поле обязательно*");
      return;
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
  modalAuth.addEventListener("click", (e) => {
    if (e.target.classList.contains("is-open")) {
      toggleModalAuth();
    }
  })
}

function checkAuth() {
  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
}

function createCardRestaurant() {
  const card = `
    <a class="card card-restaurant">
          <img src="img/pizza-burger/preview.jpg" alt="image" class="card-image"/>
          <div class="card-text">
            <div class="card-heading">
              <h3 class="card-title">PizzaBurger</h3>
              <span class="card-tag tag">45 мин</span>
            </div>
            <div class="card-info">
              <div class="rating">
                4.5
              </div>
              <div class="price">От 700 ₽</div>
              <div class="category">Пицца</div>
            </div>
          </div>
    </a>`;
  cardsRestaurants.insertAdjacentHTML("beforeend", card);
}

function createCardGood() {
  const card = document.createElement("div");
  card.className = "card";

  card.insertAdjacentHTML("beforeend", `
          <img src="img/pizza-plus/pizza-vesuvius.jpg" alt="image" class="card-image"/>
          <div class="card-text">
            <div class="card-heading">
              <h3 class="card-title card-title-reg">Пицца Везувий</h3>
            </div>
            <div class="card-info">
              <div class="ingredients">Соус томатный, сыр «Моцарелла», ветчина, пепперони, перец
                «Халапенье», соус «Тобаско», томаты.
              </div>
            </div>
              <button class="button button-primary button-add-cart">
                <span class="button-card-text">В корзину</span>
                <span class="button-cart-svg"></span>
              </button>
              <strong class="card-price-bold">545 ₽</strong>
            </div>
          </div>
  `);

  cardsMenu.insertAdjacentElement("beforeend", card);

}

function openGoods(event) {


  const target = event.target;
  
  const restaurant = target.closest(".card-restaurant");

  if(restaurant) {
    cardsMenu.textContent = '';

    containerPromo.classList.add("hide");
    restaurants.classList.add("hide");
    menu.classList.remove("hide");


    createCardGood();
    createCardGood();
    createCardGood();
  }
}

(function () {
  checkAuth();

  createCardRestaurant();
  
  cardsRestaurants.addEventListener("click", openGoods);
  
  logo.addEventListener("click", function() {
    containerPromo.classList.remove("hide");
    restaurants.classList.remove("hide");
    menu.classList.add("hide");
  });
  
  cartButton.addEventListener("click", toggleModal);
  
  close.addEventListener("click", toggleModal);
})();