// =====================================================
// GROVA HOLDINGS
// HỆ THỐNG BÁO GIÁ THANG MÁY
// =====================================================

const $ = (id) => document.getElementById(id);


// =====================================================
// TÊN LOẠI THANG
// =====================================================

const TYPE_NAME = {
  "ho-xay": "Thang Hố xây",
  "khung-thep": "Thang Khung thép"
};


// =====================================================
// FORMAT TIỀN
// =====================================================

function money(number) {
  return new Intl.NumberFormat("vi-VN").format(number) + " đ";
}


// =====================================================
// SỐ BÁO GIÁ
// =====================================================

function createQuoteNumber() {

  const now = new Date();

  const yyyy = now.getFullYear();

  const mm = String(
    now.getMonth() + 1
  ).padStart(2, "0");

  const dd = String(
    now.getDate()
  ).padStart(2, "0");

  const random = String(
    Math.floor(Math.random() * 10000)
  ).padStart(4, "0");

  return `BG-${yyyy}${mm}${dd}-${random}`;
}


// Tạo số báo giá một lần
const QUOTE_NUMBER = createQuoteNumber();


// =====================================================
// TÍNH GIÁ
// =====================================================

function calculatePrice() {

  const type = $("elevatorType").value;

  const capacity = Number(
    $("capacity").value
  );

  const stop = Number(
    $("stop").value
  );

  const cabin = $("cabin").value;

  const door = $("door").value;

  const machine = $("machine").value;


  // -----------------------------------------
  // SỐ CỬA = STOP + 1
  // -----------------------------------------

  const doorCount = stop + 1;


  // -----------------------------------------
  // TẢI TRỌNG
  // -----------------------------------------

  const capacityPrice =
    PRICE_CONFIG.capacity[capacity] || 0;


  // -----------------------------------------
  // STOP
  // -----------------------------------------

  const stopPrice =
    Math.max(
      0,
      stop - PRICE_CONFIG.stop.base
    ) *
    PRICE_CONFIG.stop.additional;


  // -----------------------------------------
  // KHUNG THÉP
  // Chỉ cộng khi chọn Thang Khung thép
  // -----------------------------------------

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


  // -----------------------------------------
  // CABIN
  // -----------------------------------------

  const cabinPrice =
    PRICE_CONFIG.cabin[cabin].price;


  // -----------------------------------------
  // CỬA
  // -----------------------------------------

  const doorUnitPrice =
    PRICE_CONFIG.door[door].price;

  const doorPrice =
    doorCount * doorUnitPrice;


  // -----------------------------------------
  // MÁY
  // -----------------------------------------

  const machinePrice =
    PRICE_CONFIG.machine[machine].price;


  // -----------------------------------------
  // TỔNG
  // -----------------------------------------

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


// =====================================================
// HIỂN THỊ GIÁ TRÊN WEBSITE
// =====================================================

function renderQuote() {

  const r = calculatePrice();


  // -----------------------------------------
  // THÔNG TIN TỰ ĐỘNG
  // -----------------------------------------

  $("typeDisplay").textContent =
    TYPE_NAME[r.type];

  $("stopDisplay").textContent =
    `${r.stop} Stop`;

  $("doorCount").textContent =
    `${r.doorCount} cửa`;


  // -----------------------------------------
  // CÁC DÒNG GIÁ
  // -----------------------------------------

  const rows = [];


  // Giá cơ bản

  rows.push({
    name: "Giá thang cơ bản",
    price: PRICE_CONFIG.basePrice,
    base: true
  });


  // Tải trọng

  rows.push({
    name: `Tải trọng – ${r.capacity} kg`,
    price: r.capacityPrice
  });


  // Stop

  rows.push({
    name: `Điều chỉnh số Stop – ${r.stop} Stop`,
    price: r.stopPrice
  });


  // Khung thép

  if (r.type === "khung-thep") {

    rows.push({
      name: `Khung thép – ${r.stop} Stop`,
      price: r.steelFramePrice
    });

  }


  // Cabin

  rows.push({
    name:
      PRICE_CONFIG.cabin[r.cabin].name,
    price: r.cabinPrice
  });


  // Cửa

  rows.push({
    name:
      `${PRICE_CONFIG.door[r.door].name} – ${r.doorCount} cửa × ${money(r.doorUnitPrice)}`,
    price: r.doorPrice
  });


  // Máy

  rows.push({
    name:
      `Máy kéo – ${PRICE_CONFIG.machine[r.machine].name}`,
    price: r.machinePrice
  });


  // -----------------------------------------
  // HIỂN THỊ
  // -----------------------------------------

  $("quoteDetails").innerHTML = rows.map(row => {

    let display;

    if (row.base) {

      display = money(row.price);

    } else if (row.price === 0) {

      display = "—";

    } else {

      display = "+ " + money(row.price);

    }

    return `
      <div class="quote-row">

        <span>
          ${row.name}
        </span>

        <strong class="${row.price === 0 ? "zero" : ""}">
          ${display}
        </strong>

      </div>
    `;

  }).join("");


  // -----------------------------------------
  // TỔNG
  // -----------------------------------------

  $("totalPrice").textContent =
    money(r.total);


  // -----------------------------------------
  // CẬP NHẬT BẢN IN
  // -----------------------------------------

  renderPrint(r);
}


// =====================================================
// RENDER BÁO GIÁ IN
// =====================================================

function renderPrint(r) {

  const now = new Date();


  const dd = String(
    now.getDate()
  ).padStart(2, "0");


  const mm = String(
    now.getMonth() + 1
  ).padStart(2, "0");


  const yyyy =
    now.getFullYear();


  // -----------------------------------------
  // SỐ BÁO GIÁ
  // -----------------------------------------

  $("printQuoteNo").textContent =
    QUOTE_NUMBER;


  // -----------------------------------------
  // NGÀY
  // -----------------------------------------

  $("printDate").textContent =
    `${dd}/${mm}/${yyyy}`;


  // -----------------------------------------
  // THÔNG TIN KHÁCH
  // -----------------------------------------

  $("printCustomer").textContent =
    $("customerName").value.trim() || "—";


  $("printPhone").textContent =
    $("customerPhone").value.trim() || "—";


  $("printAddress").textContent =
    $("projectAddress").value.trim() || "—";


  // -----------------------------------------
  // CẤU HÌNH
  // -----------------------------------------

  $("printType").textContent =
    TYPE_NAME[r.type];


  $("printCapacity").textContent =
    `${r.capacity} kg`;


  $("printStop").textContent =
    `${r.stop} Stop`;


  $("printDoors").textContent =
    `${r.doorCount} cửa`;


  $("printCabin").textContent =
    PRICE_CONFIG.cabin[r.cabin].name;


  $("printDoor").textContent =
    PRICE_CONFIG.door[r.door].name;


  $("printMachine").textContent =
    PRICE_CONFIG.machine[r.machine].name;


  // -----------------------------------------
  // BẢNG GIÁ
  // -----------------------------------------

  const rows = [

    [
      "Giá thang cơ bản",
      PRICE_CONFIG.basePrice
    ],

    [
      `Tải trọng – ${r.capacity} kg`,
      r.capacityPrice
    ],

    [
      `Điều chỉnh số Stop – ${r.stop} Stop`,
      r.stopPrice
    ]

  ];


  // Khung thép

  if (r.type === "khung-thep") {

    rows.push([
      `Khung thép – ${r.stop} Stop`,
      r.steelFramePrice
    ]);

  }


  // Cabin

  rows.push([
    PRICE_CONFIG.cabin[r.cabin].name,
    r.cabinPrice
  ]);


  // Cửa

  rows.push([
    `${PRICE_CONFIG.door[r.door].name} – ${r.doorCount} cửa × ${money(r.doorUnitPrice)}`,
    r.doorPrice
  ]);


  // Máy

  rows.push([
    `Máy kéo – ${PRICE_CONFIG.machine[r.machine].name}`,
    r.machinePrice
  ]);


  $("printPriceRows").innerHTML =
    rows.map(row => {

      const value =
        row[1] === 0
          ? "—"
          : "+ " + money(row[1]);

      return `
        <tr>

          <td>
            ${row[0]}
          </td>

          <td>
            ${value}
          </td>

        </tr>
      `;

    }).join("");


  // -----------------------------------------
  // TỔNG PDF
  // -----------------------------------------

  $("printTotal").textContent =
    money(r.total);


  // -----------------------------------------
  // QR
  // -----------------------------------------

  createQR();
}


// =====================================================
// QR
// =====================================================

function createQR() {

  const box = $("qrcode");

  if (!box) return;

  box.innerHTML = "";


  if (
    typeof QRCode === "undefined"
  ) {

    box.innerHTML = `
      <div style="
        width:150px;
        height:150px;
        display:flex;
        align-items:center;
        justify-content:center;
        border:1px solid #ddd;
        font-size:12px;
      ">
        QR đang tải...
      </div>
    `;

    return;
  }


  new QRCode(box, {

    text:
      "https://trungythp1-jpg.github.io/Bao-Gia/",

    width: 150,

    height: 150,

    correctLevel:
      QRCode.CorrectLevel.H

  });

}


// =====================================================
// RESET
// =====================================================

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


  renderQuote();
}


// =====================================================
// THEO DÕI FORM
// =====================================================

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


fields.forEach(id => {

  const element = $(id);

  if (!element) return;

  element.addEventListener(
    "input",
    renderQuote
  );

  element.addEventListener(
    "change",
    renderQuote
  );

});


// =====================================================
// NÚT ĐẶT LẠI
// =====================================================

$("resetBtn").addEventListener(
  "click",
  resetForm
);


// =====================================================
// NÚT TẠO BÁO GIÁ PDF
// =====================================================

$("printBtn").addEventListener(
  "click",
  function () {

    // Cập nhật lần cuối trước khi in
    renderQuote();


    // Đợi trình duyệt render PDF
    setTimeout(
      function () {

        window.print();

      },
      300
    );

  }
);


// =====================================================
// KHỞI ĐỘNG
// =====================================================

renderQuote();