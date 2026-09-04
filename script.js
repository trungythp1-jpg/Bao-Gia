"use strict";

function $(id) {
  return document.getElementById(id);
}

function money(value) {
  return new Intl.NumberFormat("vi-VN").format(value) + " đ";
}

const ELEVATOR_TYPES = {
  "ho-xay": "Thang Hố xây",
  "khung-thep": "Thang Khung thép"
};

function generateQuoteNumber() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, "0");

  return `BG-${year}${month}${day}-${random}`;
}

const QUOTE_NUMBER = generateQuoteNumber();


/* =========================
   TÍNH GIÁ
========================= */

function calculateQuote() {

  const type = $("elevatorType").value;
  const capacity = Number($("capacity").value);
  const stop = Number($("stop").value);
  const cabin = $("cabin").value;
  const door = $("door").value;
  const machine = $("machine").value;

  const doorCount = stop + 1;

  const capacityPrice =
    PRICE_CONFIG.capacity[capacity] || 0;

  const stopPrice =
    Math.max(
      0,
      stop - PRICE_CONFIG.stop.base
    ) *
    PRICE_CONFIG.stop.additional;

  let steelFramePrice = 0;

  if (type === "khung-thep") {

    steelFramePrice =
      PRICE_CONFIG.steelFrame.base +
      Math.max(
        0,
        stop - PRICE_CONFIG.stop.base
      ) *
      PRICE_CONFIG.steelFrame.additional;

  }

  const cabinPrice =
    PRICE_CONFIG.cabin[cabin].price;

  const doorUnitPrice =
    PRICE_CONFIG.door[door].price;

  const doorPrice =
    doorCount * doorUnitPrice;

  const machinePrice =
    PRICE_CONFIG.machine[machine].price;

  const total =
    PRICE_CONFIG.basePrice +
    capacityPrice +
    stopPrice +
    steelFramePrice +
    cabinPrice +
    doorPrice +
    machinePrice;

  return {
    type,
    capacity,
    stop,
    doorCount,
    cabin,
    door,
    machine,
    capacityPrice,
    stopPrice,
    steelFramePrice,
    cabinPrice,
    doorUnitPrice,
    doorPrice,
    machinePrice,
    total
  };
}


/* =========================
   DANH SÁCH HẠNG MỤC
========================= */

function buildPriceRows(quote) {

  const rows = [];

  rows.push({
    name: "Giá thang cơ bản",
    price: PRICE_CONFIG.basePrice
  });

  if (quote.capacityPrice > 0) {

    rows.push({
      name:
        `Tăng tải trọng – ${quote.capacity} kg`,
      price:
        quote.capacityPrice
    });

  }

  if (quote.stopPrice > 0) {

    rows.push({
      name:
        `Tăng số Stop – ${quote.stop} Stop`,
      price:
        quote.stopPrice
    });

  }

  if (quote.type === "khung-thep") {

    rows.push({
      name:
        `Khung thép – ${quote.stop} Stop`,
      price:
        quote.steelFramePrice
    });

  }

  if (quote.cabinPrice > 0) {

    rows.push({
      name:
        PRICE_CONFIG.cabin[
          quote.cabin
        ].name,
      price:
        quote.cabinPrice
    });

  }

  if (quote.doorPrice > 0) {

    rows.push({
      name:
        `${PRICE_CONFIG.door[
          quote.door
        ].name} – ${quote.doorCount} cửa × ${money(
          quote.doorUnitPrice
        )}`,
      price:
        quote.doorPrice
    });

  }

  if (quote.machinePrice > 0) {

    rows.push({
      name:
        PRICE_CONFIG.machine[
          quote.machine
        ].name,
      price:
        quote.machinePrice
    });

  }

  return rows;
}


/* =========================
   CẬP NHẬT WEBSITE
========================= */

function updateWebsite() {

  const quote =
    calculateQuote();

  $("typeDisplay").textContent =
    ELEVATOR_TYPES[quote.type];

  $("stopDisplay").textContent =
    `${quote.stop} Stop`;

  $("doorCount").textContent =
    `${quote.doorCount} cửa`;

  const rows =
    buildPriceRows(quote);

  $("quoteDetails").innerHTML =
    rows.map(function(row) {

      return `
        <div class="quote-row">

          <span>
            ${row.name}
          </span>

          <strong>
            ${
              row.price === 0
                ? "—"
                : "+ " + money(row.price)
            }
          </strong>

        </div>
      `;

    }).join("");

  $("totalPrice").textContent =
    money(quote.total);

  updatePrintQuote(quote);
}


/* =========================
   CẬP NHẬT PDF
========================= */

function updatePrintQuote(quote) {

  const now =
    new Date();

  const day =
    String(
      now.getDate()
    ).padStart(2, "0");

  const month =
    String(
      now.getMonth() + 1
    ).padStart(2, "0");

  const year =
    now.getFullYear();


  $("printQuoteNo").textContent =
    QUOTE_NUMBER;

  $("printDate").textContent =
    `${day}/${month}/${year}`;


  $("printCustomer").textContent =
    $("customerName")
      .value
      .trim() || "—";

  $("printPhone").textContent =
    $("customerPhone")
      .value
      .trim() || "—";

  $("printAddress").textContent =
    $("projectAddress")
      .value
      .trim() || "—";


  $("printType").textContent =
    ELEVATOR_TYPES[quote.type];

  $("printCapacity").textContent =
    `${quote.capacity} kg`;

  $("printStop").textContent =
    `${quote.stop} Stop`;

  $("printDoors").textContent =
    `${quote.doorCount} cửa`;

  $("printCabin").textContent =
    PRICE_CONFIG.cabin[
      quote.cabin
    ].name;


  /* SỬA LỖI LẶP 2 CÁNH MỞ TIM */

  $("printDoor").textContent =
    PRICE_CONFIG.door[
      quote.door
    ].name;


  $("printMachine").textContent =
    PRICE_CONFIG.machine[
      quote.machine
    ].name;


  const rows =
    buildPriceRows(quote);


  $("printPriceRows").innerHTML =
    rows.map(function(row, index) {

      return `
        <tr>

          <td>
            ${index + 1}
          </td>

          <td>
            ${row.name}
          </td>

          <td>
            ${
              row.price === 0
                ? "—"
                : money(row.price)
            }
          </td>

        </tr>
      `;

    }).join("");


  $("printTotal").textContent =
    money(quote.total);
}


/* =========================
   RESET
========================= */

function resetForm() {

  $("customerName").value = "";
  $("customerPhone").value = "";
  $("projectAddress").value = "";

  $("elevatorType").value =
    "ho-xay";

  $("capacity").value =
    "350";

  $("stop").value =
    "4";

  $("cabin").value =
    "inox-trang";

  $("door").value =
    "inox-trang";

  $("machine").value =
    "torin";

  updateWebsite();
}


/* =========================
   TẠO PDF
========================= */

function createPDF() {

  updateWebsite();

  setTimeout(function() {

    window.print();

  }, 200);

}


/* =========================
   KHỞI TẠO
========================= */

function init() {

  const fields = [
    "customerName",
    "customerPhone",
    "projectAddress",
    "elevatorType",
    "capacity",
    "stop",
    "cabin",
    "door",
    "machine"
  ];


  fields.forEach(function(id) {

    const element = $(id);

    if (!element) {
      return;
    }

    element.addEventListener(
      "input",
      updateWebsite
    );

    element.addEventListener(
      "change",
      updateWebsite
    );

  });


  $("resetBtn").addEventListener(
    "click",
    resetForm
  );


  $("printBtn").addEventListener(
    "click",
    createPDF
  );


  updateWebsite();
}


if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    init
  );

} else {

  init();

}