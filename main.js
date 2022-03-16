/**
 * Main Javascript for the interaction of restaurant
 * Carlos Figueredo - 201813445
 *
 */

const urlGithub =
  "https://gist.githubusercontent.com/josejbocanegra/9a28c356416badb8f9173daf36d1460b/raw/5ea84b9d43ff494fcbf5c5186544a18b42812f09/restaurant.json";

fetch(urlGithub)
  .then((res) => res.json())
  .then(restaurantFunction);
let a = [];

/**
 * Function for restaurant
 * @param {*} array
 */
function restaurantFunction(array) {
  let listCategories = document.getElementById("listCategories");

  array.forEach((foodCategories) => {
    let li = document.createElement("li");
    li.className = "nav-item ";
    let a = document.createElement("a");
    a.className = "nav-link";
    a.textContent = foodCategories.name;

    li.appendChild(a);
    listCategories.appendChild(li);
  });

  /**
   * Get elements by id
   */
  let productsElements = document.getElementById("products");
  let tableItems = document.getElementById("tableItems");
  let optionsItems = document.getElementById("optionsItems");

  let quantity = [];

  /**
   * Main treatments for the elements
   */
  document.querySelectorAll(".nav-link").forEach((itemNav) => {
    itemNav.addEventListener("click", (event) => {
      let category = event.target.text;

      let titleCategory = document.getElementById("titleCategory");
      titleCategory.textContent = category;

      let listCategory = array.find(
        (elementFood) => elementFood.name == category
      );

      while (productsElements.lastElementChild) {
        productsElements.removeChild(productsElements.lastElementChild);
      }

      listCategory.products.forEach((item) => {
        let divCard = document.createElement("div");
        divCard.className = "card cardItem";
        divCard.setAttribute("style", "width: 18rem;");
        let imgCard = document.createElement("img");
        imgCard.className = "card-img-top imgFood";
        imgCard.setAttribute("src", item.image);
        imgCard.setAttribute("alt", item.name);
        let divCardBody = document.createElement("div");
        divCardBody.className = "card-body";
        let h5 = document.createElement("h5");
        h5.className = "card-title";
        h5.textContent = item.name;
        let pDescription = document.createElement("p");
        pDescription.className = "card-text";
        pDescription.textContent = item.description;
        let pPrice = document.createElement("p");
        pPrice.className = "card-text";
        pPrice.setAttribute("id", "itemPrice");
        pPrice.textContent = "$" + item.price;
        let buttonAdd = document.createElement("a");
        buttonAdd.className = "btn btn-dark btn-item";
        buttonAdd.setAttribute("type", "button");
        buttonAdd.setAttribute("id", "button-" + category + "-" + item.name);
        buttonAdd.textContent = "Add to card";

        buttonAdd.addEventListener("click", function () {
          countItems(item, quantity);
        });
        buttonAdd.addEventListener("click", function () {
          addItems(item);
        });

        divCard.appendChild(imgCard);

        divCardBody.appendChild(h5);
        divCardBody.appendChild(pDescription);
        divCardBody.appendChild(pPrice);
        divCardBody.appendChild(buttonAdd);

        divCard.appendChild(divCardBody);

        productsElements.appendChild(divCard);
      });

      tableItems.innerHTML = "";
      optionsItems.innerHTML = "";
    });
  });

  let tableHead = false;

  document.getElementById("carItems").addEventListener("click", function () {
    tableItems.innerHTML = "";
    optionsItems.innerHTML = "";

    while (productsElements.lastElementChild) {
      productsElements.removeChild(productsElements.lastElementChild);
    }

    let title = document.getElementById("titleCategory");
    title.textContent = "Order detail";

    let table = document.createElement("table");
    table.className = "table table-striped";

    if (tableHead == false) {
      let tHead = document.createElement("thead");
      let trHead = document.createElement("tr");
      let nameColumns = [
        "Item",
        "Qty.",
        "Description",
        "Unit Price",
        "Amount",
        "Modify",
      ];

      for (let i = 0; i < nameColumns.length; i++) {
        let trHd = document.createElement("th");
        trHd.textContent = nameColumns[i];
        trHd.setAttribute("scope", "col");
        trHead.appendChild(trHd);
      }

      tHead.appendChild(trHead);
      table.appendChild(tHead);
      tableHead = true;
    }

    let tBody = document.createElement("tbody");
    let spanTotal;
    let index = 0;
    let total = 0;

    quantity.forEach((element) => {
      let tr = document.createElement("tr");
      let thIndex = document.createElement("th");
      thIndex.setAttribute("scope", "col");
      thIndex.textContent = index;
      let tdQty = document.createElement("td");
      tdQty.textContent = element.quantity;
      let tdDescription = document.createElement("td");
      tdDescription.textContent = element.food;
      let tdUnitPrice = document.createElement("td");
      tdUnitPrice.textContent = element.unitPrice;
      let tdAmount = document.createElement("td");
      tdAmount.textContent = element.amount;
      let tdButtons = document.createElement("td");

      let buttonAdd = document.createElement("a");
      buttonAdd.className = "btn btn-dark btn-row";
      buttonAdd.textContent = "+";

      buttonAdd.addEventListener("click", function () {
        tdQty.textContent = ++element.quantity;
        tdAmount.textContent = element.quantity * element.unitPrice;
        element.amount = element.quantity * element.unitPrice;
        spanTotal.textContent = "Total $" + recalTotalIncrease(quantity);
      });

      let buttonLess = document.createElement("a");
      buttonLess.className = "btn btn-dark btn-row";
      buttonLess.textContent = "-";

      buttonLess.addEventListener("click", function () {
        tdQty.textContent = --element.quantity;
        if (tdQty.textContent !== 0) {
          tdAmount.textContent = element.quantity * element.unitPrice;
          element.amount = element.quantity * element.unitPrice;
          spanTotal.textContent = "Total $" + recalTotalDecrease(quantity);
        }
        if (tdQty.textContent === "0") {
          tr.innerHTML = "";
          descountItems();
        }
      });

      tr.appendChild(thIndex);
      tr.appendChild(tdQty);
      tr.appendChild(tdDescription);
      tr.appendChild(tdUnitPrice);
      tr.appendChild(tdAmount);

      tdButtons.appendChild(buttonAdd);
      tdButtons.appendChild(buttonLess);

      tr.appendChild(tdButtons);
      tBody.appendChild(tr);
      total += element.amount;
      index++;
    });

    let divRow = document.createElement("div");
    divRow.className = "row";
    let divSpan = document.createElement("div");
    divSpan.className = "col";
    spanTotal = document.createElement("span");
    spanTotal.textContent = "Total: $" + total;
    spanTotal.setAttribute("id", "spanTotalItems");
    divSpan.appendChild(spanTotal);
    let divbuttons = document.createElement("div");
    divbuttons.className = "col d-flex justify-content-end";
    divbuttons.setAttribute("id", "divbuttons");
    let buttonCancel = document.createElement("button");
    buttonCancel.className = "btn btn-danger btn-order";
    buttonCancel.textContent = "Cancel";
    buttonCancel.setAttribute("data-target", "#cancelModal");
    buttonCancel.setAttribute("data-toggle", "modal");
    let buttonConfirm = document.createElement("a");
    buttonConfirm.className = "btn btn-success btn-order";
    buttonConfirm.textContent = "Confirm order";

    buttonConfirm.addEventListener("click", function () {
      let i = 1;
      let order = [];
      quantity.forEach((element) => {
        let objectOrder = {};
        objectOrder["item"] = i;
        objectOrder["quantity"] = element.quantity;
        objectOrder["description"] = element.food;
        objectOrder["unitPrice"] = element.unitPrice;
        order.push(objectOrder);
      });
      console.log(order);
    });

    divbuttons.appendChild(buttonCancel);
    divbuttons.appendChild(buttonConfirm);

    divRow.appendChild(divSpan);
    divRow.appendChild(divbuttons);

    table.appendChild(tBody);
    tableItems.appendChild(table);
    optionsItems.appendChild(divRow);

    document.getElementById("buttonYes").addEventListener("click", function () {
      tableItems.innerHTML = "";
      optionsItems.innerHTML = "";
      quantity = [];
      tableHead = false;
      clearShoppingCart();
    });
  });
}

let numItems = 0;
let itemCar = document.getElementById("itemsAdd");
/**
 * Clear shopping car
 */
function clearShoppingCart() {
  itemCar.textContent = 0 + " items";
  numItems = 0;
}

/**
 * Count items
 * @param {*} item
 * @param {*} quantity
 */
function countItems(item, quantity) {
  itemCar.textContent = numItems + 1 + " items";
  let encontrado = quantity.find(
    (elementFood) => elementFood.food == item.name
  );
  if (encontrado === undefined) {
    let event = {};
    event["food"] = item.name;
    event["quantity"] = 1;
    event["unitPrice"] = item.price;
    event["amount"] = item.price;
    quantity.push(event);
  } else {
    encontrado.quantity++;
    encontrado.amount = encontrado.quantity * encontrado.unitPrice;
  }
  numItems = numItems + 1;
}

/**
 * Descount of the items
 */
function descountItems() {
  itemCar.textContent = numItems - 1 + " items";
}

/**
 * Add items
 * @param {*} item
 */
function addItems(item) {
  a.push(item);
}

/**
 * Recalculate the total increasing
 * @param {*} quantity
 * @returns
 */
function recalTotalIncrease(quantity) {
  let total = 0;
  quantity.forEach((element) => {
    total += element.amount;
  });
  return total;
}

/**
 * Recalculate the total decreasing
 * @param {*} quantity
 * @returns
 */
function recalTotalDecrease(quantity) {
  let total = 0;
  quantity.forEach((element) => {
    total -= -element.amount;
  });
  return total;
}
