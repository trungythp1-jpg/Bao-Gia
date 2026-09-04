const $ = (id) =>
  document.getElementById(id);


/* =========================
   TÊN HIỂN THỊ
========================= */

const LABELS = {

  type: {
    "ho-xay": "Thang Hố xây",
    "khung-thep": "Thang Khung thép"
  },

  capacity: {
    350: "350 kg",
    450: "450 kg",
    630: "630 kg",
    750: "750 kg",
    1000: "1.000 kg"
  },

  cabin: {
    "inox-trang":
      "Cabin cơ bản – inox trắng",

    "kinh-inox-trang":
      "Cabin kính – inox trắng cơ bản",

    "inox-mau":
      "Cabin inox màu",

    "kinh-inox-mau":
      "Cabin kính inox màu"
  },

  door: {
    "inox-trang":
      "Cửa inox trắng",

    "kinh-inox-trang":
      "Kính inox trắng",

    "inox-mau":
      "Inox màu",

    "kinh-inox-mau":
      "Kính inox màu"
  },

  machine: {
    "torin":
      "Torin – China",

    "italy":
      "Máy Ý",

    "germany":
      "Máy Đức"
  }

};


/* =========================
   ĐỊNH DẠNG TIỀN
========================= */

function money(value) {

  return new Intl.NumberFormat(
    "vi-VN"
  ).format(value) + " đ";

}


/* =========================
   TÍNH GIÁ
========================= */

function calculatePrice() {

  const type =
    $("elevatorType").value;

  const capacity =
    Number($("capacity").value);

  const stop =
    Number($("stop").value);

  const cabin =
    $("cabin").value;

  const door =
    $("door").value;

  const machine =
    $("machine").value;


  /*
    Số cửa = Stop + 1
  */

  const doorCount =
    stop + 1;


  /*
    Tải trọng
  */

  const capacityPrice =
    PRICE_CONFIG.capacity[capacity] || 0;


  /*
    Stop
  */

  const stopPrice =
    Math.max(
      0,
      stop - PRICE_CONFIG.stop.base
    )
    *
    PRICE_CONFIG.stop.additional;


  /*
    Khung thép

    Chỉ tính khi chọn
    Thang Khung thép
  */

  let steelFramePrice = 0;

  if (type === "khung-thep") {

    steelFramePrice =
      PRICE_CONFIG.steelFrame.base
      +
      Math.max(
        0,
        stop - PRICE_CONFIG.stop.base
      )
      *
      PRICE_CONFIG.steelFrame.additional;

  }


  /*
    Cabin
  */

  const cabinPrice =
    PRICE_CONFIG.cabin[cabin] || 0;


  /*
    Cửa

    Giá x số cửa
  */

  const doorUnitPrice =
    PRICE_CONFIG.door[door] || 0;

  const doorPrice =
    doorCount * doorUnitPrice;


  /*
    Máy
  */

  const machinePrice =
    PRICE_CONFIG.machine[machine] || 0;


  /*
    Tổng
  */

  const total =
    PRICE_CONFIG.basePrice
    +
    capacityPrice
    +
    stopPrice
    +
    steelFramePrice
    +
    cabinPrice
    +
    doorPrice
    +
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
   HIỂN THỊ BÁO GIÁ
========================= */

function renderQuote() {

  const result =
    calculatePrice();


  /*
    Thông tin tự động
  */

  $("stopDisplay").textContent =
    `${result.stop} Stop`;

  $("doorCount").textContent =
    `${result.doorCount} cửa`;

  $("typeDisplay").textContent =
    LABELS.type[result.type];


  /*
    Các dòng báo giá
  */

  const rows = [

    [
      "Giá thang cơ bản",
      PRICE_CONFIG.basePrice,
      true
    ],

    [
      `Tải trọng – ${LABELS.capacity[result.capacity]}`,
      result.capacityPrice
    ],

    [
      `Điều chỉnh số Stop – ${result.stop} Stop`,
      result.stopPrice
    ],

    ...(result.type === "khung-thep"
      ? [
          [
            `Khung thép – ${result.stop} Stop`,
            result.steelFramePrice
          ]
        ]
      : []),

    [
      LABELS.cabin[result.cabin],
      result.cabinPrice
    ],

    [
      `${LABELS.door[result.door]} – ${result.doorCount} cửa × ${money(result.doorUnitPrice)}`,
      result.doorPrice
    ],

    [
      `Máy kéo – ${LABELS.machine[result.machine]}`,
      result.machinePrice
    ]

  ];


  /*
    Render
  */

  $("quoteDetails").innerHTML =
    rows.map(
      ([label, value, base]) => {

        const isZero =
          value === 0;

        return `

          <div class="quote-row">

            <span>
              ${label}
            </span>

            <strong
              class="${isZero ? "zero" : ""}"
            >

              ${
                base
                ? money(value)
                : isZero
                  ? "—"
                  : "+ " + money(value)
              }

            </strong>

          </div>

        `;

      }
    ).join("");


  /*
    Tổng
  */

  $("totalPrice").textContent =
    money(result.total);

}


/* =========================
   ĐẶT LẠI
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


  renderQuote();

}


/* =========================
   THEO DÕI THAY ĐỔI
========================= */

[
  "elevatorType",
  "capacity",
  "stop",
  "cabin",
  "door",
  "machine"

].forEach(
  id => {

    $(id).addEventListener(
      "change",
      renderQuote
    );

  }
);


/* =========================
   NÚT
========================= */

$("resetBtn")
  .addEventListener(
    "click",
    resetForm
  );


$("printBtn")
  .addEventListener(
    "click",
    () => window.print()
  );


/* =========================
   KHỞI ĐỘNG
========================= */

renderQuote();