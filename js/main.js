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
const sectionHeading = document.querySelector(".section-heading");
const modalBody = document.querySelector(".modal-body");
const modalPrice = document.querySelector(".modal-pricetag");
const buttonClearCart = document.querySelector(".clear-cart");

const cart = [];

let login = localStorage.getItem("gloDelivery");


const getData = async function(url) {

  const response =  await fetch(url);

  if(!response.ok) {
    throw new Error(`Error on ${url}, status: ${response.status}`)
  }
  
  return await response.json();

};

getData("./db/partners.json");

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
    cartButton.style.display = "";
    buttonOut.removeEventListener("click", logOut);
    localStorage.removeItem("gloDelivery");
  }

  
  username.textContent = login;
  
  buttonAuth.style.display = "none";
  username.style.display = "inline";
  buttonOut.style.display = "flex";
  cartButton.style.display = "flex";

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

function createCardRestaurant(restaurant) {

  const { 
      image,
      kitchen,
      name,
      price,
      stars,
      products,
      time_of_delivery: timeOfDelivery } = restaurant;

  const card = `
    <a class="card card-restaurant" data-products="${products}">
          <img src=${image} alt="image" class="card-image"/>
          <div class="card-text">
            <div class="card-heading">
              <h3 class="card-title">${name}</h3>
              <span class="card-tag tag">${timeOfDelivery}</span>
            </div>
            <div class="card-info">
              <div class="rating">
                ${stars}
              </div>
              <div class="price">От ${price}₽</div>
              <div class="category">${kitchen}</div>
            </div>
          </div>
    </a>`;
  cardsRestaurants.insertAdjacentHTML("beforeend", card);
}

function createSectionHeading() {
  const heading = `
    <h2 class="section-title">Рестораны</h2>
    <label class="search">
      <input type="text" class="input input-search" placeholder="Поиск блюд и ресторанов"/>
    </label>
  `
}

function createCardGood(goods) {

  const { id, name, description, price, image } = goods;

  const card = document.createElement("div");
  card.className = "card";
  card.id = id;

  card.insertAdjacentHTML("beforeend", `
          <img src="${image}" alt="image" class="card-image"/>
          <div class="card-text">
            <div class="card-heading">
              <h3 class="card-title card-title-reg">${name}</h3>
            </div>
            <div class="card-info">
              <div class="ingredients">${description}</div>
            </div>
              <button class="button button-primary button-add-cart">
                <span class="button-card-text">В корзину</span>
                <span class="button-cart-svg"></span>
              </button>
              <strong class="card-price card-price-bold">${price} ₽</strong>
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
    getData(`./db/${restaurant.dataset.products}`).then(function(data){
      data.forEach(createCardGood)
    });
  }
}

function addToCart(e) {
  const target = e.target;

  const buttonAddToCart = target.closest(".button-add-cart");

  if(buttonAddToCart) {
    const card  = target.closest(".card");
    const title = card.querySelector(".card-title-reg").textContent;
    const cost = card.querySelector(".card-price").textContent;
    const id = card.id;
    
    const food = cart.find(function(item) {
      return item.id === id;
    });
    
    if(food) {
      food.count += 1;
    } else {
      cart.push({
        id,
        title,
        cost,
        count: 1
      });
    }
  }
}

function renderCart() {
  modalBody.textContent = "";

  cart.forEach(function({ id, title, cost, count }) {
    const itemCart = `
      <div class="food-row">
        <span class="food-name">${title}</span>
        <strong class="food-price">${cost} ₽</strong>
        <div class="food-counter">
          <button class="counter-button counter-minus" data-id=${id}>-</button>
          <span class="counter">${count}</span>
          <button class="counter-button counter-plus" data-id=${id}>+</button>
        </div>
      </div>`;
     
    modalBody.insertAdjacentHTML("afterBegin", itemCart);

  });
  
  const totalPrice = cart.reduce(function(a, c) {
    return a + (parseFloat(c.cost)) * c.count;
  }, 0);

  modalPrice.textContent = totalPrice;

}

function changeCount(e) {
  const target = e.target;

  if(target.classList.contains("counter-button")) {
    const food = cart.find(function(item) {
      return item.id === target.dataset.id;
    });

    if(target.classList.contains("counter-minus")) {
      food.count--;
      if(food.count <= 0) {
        cart.splice(cart.indexOf(food), 1);
      }
    };
    
    if(target.classList.contains("counter-plus")) food.count++;
    renderCart()
  }
}

(function () {
  checkAuth();

  cardsMenu.addEventListener("click", addToCart);

  modalBody.addEventListener("click", changeCount);

  getData('./db/partners.json').then(function(data){
    data.forEach(createCardRestaurant)
  });
  
  cardsRestaurants.addEventListener("click", openGoods);
  
  logo.addEventListener("click", function() {
    containerPromo.classList.remove("hide");
    restaurants.classList.remove("hide");
    menu.classList.add("hide");
  });
  
  cartButton.addEventListener("click", function() {
    renderCart();
    toggleModal();
    
  });
  
  buttonClearCart.addEventListener("click", function() {
    cart.length = 0;
    renderCart();
  })
  
  close.addEventListener("click", toggleModal);
})();