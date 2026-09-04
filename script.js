"use strict";


/* =========================================================
   GROVA HOLDINGS
   HỆ THỐNG BÁO GIÁ THANG MÁY
   ========================================================= */


/* =========================================================
   HÀM DOM
========================================================= */

function $(id) {
  return document.getElementById(id);
}


/* =========================================================
   ĐỊNH DẠNG TIỀN
========================================================= */

function money(value) {

  return new Intl.NumberFormat("vi-VN").format(value) + " đ";

}


/* =========================================================
   LOẠI THANG
========================================================= */

const ELEVATOR_TYPES = {

  "ho-xay":
    "Thang Hố xây",

  "khung-thep":
    "Thang Khung thép"

};


/* =========================================================
   SỐ BÁO GIÁ
   SỐ NÀY SẼ DO SUPABASE CẤP
========================================================= */

let QUOTE_NUMBER =
  "CHƯA LƯU";


/*
 * Lưu lại dữ liệu của báo giá cuối cùng đã gửi.
 *
 * Mục đích:
 * Nếu khách bấm nút PDF nhiều lần mà không
 * thay đổi thông tin thì không tạo nhiều bản ghi.
 */

let LAST_SAVED_SIGNATURE =
  null;


/* =========================================================
   TRẠNG THÁI ĐANG LƯU
========================================================= */

let IS_SAVING =
  false;


/* =========================================================
   LƯU THÔNG TIN TRÊN THIẾT BỊ
========================================================= */

const STORAGE_KEY =
  "grova_quote_form_v1";


const FORM_FIELDS = [

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


/* =========================================================
   LẤY DỮ LIỆU FORM
========================================================= */

function getFormData() {

  const data = {};


  FORM_FIELDS.forEach(function(id) {

    const element =
      $(id);


    if (!element) {
      return;
    }


    data[id] =
      element.value;

  });


  return data;

}


/* =========================================================
   TRẠNG THÁI TỰ LƯU
========================================================= */

function setSaveStatus(
  type,
  text
) {

  const status =
    $("saveStatus");

  const statusText =
    $("saveStatusText");


  if (
    !status ||
    !statusText
  ) {

    return;

  }


  status.classList.remove(
    "saving",
    "error"
  );


  if (type) {

    status.classList.add(
      type
    );

  }


  statusText.textContent =
    text;

}


/* =========================================================
   LƯU FORM VÀO TRÌNH DUYỆT
========================================================= */

function saveFormData() {

  try {

    setSaveStatus(
      "saving",
      "Đang lưu..."
    );


    const data =
      getFormData();


    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data)
    );


    setSaveStatus(
      "",
      "Đã lưu tự động"
    );

  }

  catch (error) {

    console.warn(
      "Không thể lưu dữ liệu:",
      error
    );


    setSaveStatus(
      "error",
      "Không thể lưu dữ liệu"
    );

  }

}


/* =========================================================
   KHÔI PHỤC FORM
========================================================= */

function loadFormData() {

  try {

    const saved =
      localStorage.getItem(
        STORAGE_KEY
      );


    if (!saved) {

      setSaveStatus(
        "",
        "Đang lưu tự động"
      );

      return;

    }


    const data =
      JSON.parse(saved);


    FORM_FIELDS.forEach(function(id) {

      const element =
        $(id);


      if (
        !element ||
        data[id] === undefined ||
        data[id] === null
      ) {

        return;

      }


      element.value =
        data[id];

    });


    setSaveStatus(
      "",
      "Đã khôi phục báo giá"
    );

  }

  catch (error) {

    console.warn(
      "Không thể khôi phục dữ liệu:",
      error
    );


    setSaveStatus(
      "error",
      "Không thể khôi phục dữ liệu"
    );

  }

}


/* =========================================================
   XÓA DỮ LIỆU ĐÃ LƯU
========================================================= */

function clearSavedFormData() {

  try {

    localStorage.removeItem(
      STORAGE_KEY
    );

  }

  catch (error) {

    console.warn(
      "Không thể xóa dữ liệu đã lưu:",
      error
    );

  }

}


/* =========================================================
   CHUẨN HÓA SỐ ĐIỆN THOẠI VIỆT NAM
========================================================= */

function normalizeVietnamPhone(value) {

  let phone =
    String(value || "")
      .trim()
      .replace(/[^\d+]/g, "");


  /*
   * +84xxxxxxxxx
   * chuyển thành
   * 0xxxxxxxxx
   */

  if (
    phone.startsWith("+84")
  ) {

    phone =
      "0" +
      phone.slice(3);

  }


  /*
   * 84xxxxxxxxx
   * chuyển thành
   * 0xxxxxxxxx
   */

  else if (
    phone.startsWith("84")
  ) {

    phone =
      "0" +
      phone.slice(2);

  }


  return phone;

}


/* =========================================================
   KIỂM TRA SỐ ĐIỆN THOẠI
========================================================= */

function isValidVietnamPhone(phone) {

  return /^0(3|5|7|8|9)[0-9]{8}$/.test(
    phone
  );

}


/* =========================================================
   KIỂM TRA THÔNG TIN KHÁCH HÀNG
========================================================= */

function validateCustomer() {

  const name =
    $("customerName")
      .value
      .trim();


  const phone =
    normalizeVietnamPhone(
      $("customerPhone").value
    );


  const address =
    $("projectAddress")
      .value
      .trim();


  /*
   * TÊN
   */

  if (name.length < 2) {

    alert(
      "Vui lòng nhập tên khách hàng."
    );


    $("customerName").focus();


    return null;

  }


  /*
   * SỐ ĐIỆN THOẠI
   */

  if (!isValidVietnamPhone(phone)) {

    alert(
      "Số điện thoại không hợp lệ.\n\n" +
      "Vui lòng nhập số điện thoại di động Việt Nam 10 số."
    );


    $("customerPhone").focus();


    return null;

  }


  /*
   * Cập nhật số đã chuẩn hóa
   */

  $("customerPhone").value =
    phone;


  /*
   * ĐỊA CHỈ
   */

  if (address.length < 5) {

    alert(
      "Vui lòng nhập đầy đủ địa chỉ công trình."
    );


    $("projectAddress").focus();


    return null;

  }


  return {

    name,
    phone,
    address

  };

}


/* =========================================================
   TÍNH GIÁ
========================================================= */

function calculateQuote() {

  const type =
    $("elevatorType").value;


  const capacity =
    Number(
      $("capacity").value
    );


  const stop =
    Number(
      $("stop").value
    );


  const cabin =
    $("cabin").value;


  const door =
    $("door").value;


  const machine =
    $("machine").value;


  const doorCount =
    stop + 1;


  /*
   * TẢI TRỌNG
   */

  const capacityPrice =
    PRICE_CONFIG.capacity[
      capacity
    ] || 0;


  /*
   * STOP
   */

  const stopPrice =
    Math.max(
      0,
      stop -
      PRICE_CONFIG.stop.base
    ) *
    PRICE_CONFIG.stop.additional;


  /*
   * KHUNG THÉP
   */

  let steelFramePrice =
    0;


  if (
    type === "khung-thep"
  ) {

    steelFramePrice =
      PRICE_CONFIG.steelFrame.base +
      Math.max(
        0,
        stop -
        PRICE_CONFIG.stop.base
      ) *
      PRICE_CONFIG.steelFrame.additional;

  }


  /*
   * CABIN
   */

  const cabinPrice =
    PRICE_CONFIG.cabin[
      cabin
    ].price;


  /*
   * CỬA
   */

  const doorUnitPrice =
    PRICE_CONFIG.door[
      door
    ].price;


  const doorPrice =
    doorCount *
    doorUnitPrice;


  /*
   * MÁY KÉO
   */

  const machinePrice =
    PRICE_CONFIG.machine[
      machine
    ].price;


  /*
   * TỔNG
   */

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


/* =========================================================
   DANH SÁCH HẠNG MỤC
========================================================= */

function buildPriceRows(quote) {

  const rows = [];


  /*
   * GIÁ CƠ BẢN
   */

  rows.push({

    name:
      "Giá thang cơ bản",

    price:
      PRICE_CONFIG.basePrice

  });


  /*
   * TẢI TRỌNG
   */

  if (
    quote.capacityPrice > 0
  ) {

    rows.push({

      name:
        `Tăng tải trọng – ${quote.capacity} kg`,

      price:
        quote.capacityPrice

    });

  }


  /*
   * STOP
   */

  if (
    quote.stopPrice > 0
  ) {

    rows.push({

      name:
        `Tăng số Stop – ${quote.stop} Stop`,

      price:
        quote.stopPrice

    });

  }


  /*
   * KHUNG THÉP
   */

  if (
    quote.type === "khung-thep"
  ) {

    rows.push({

      name:
        `Khung thép – ${quote.stop} Stop`,

      price:
        quote.steelFramePrice

    });

  }


  /*
   * CABIN
   */

  if (
    quote.cabinPrice > 0
  ) {

    rows.push({

      name:
        PRICE_CONFIG.cabin[
          quote.cabin
        ].name,

      price:
        quote.cabinPrice

    });

  }


  /*
   * CỬA
   */

  if (
    quote.doorPrice > 0
  ) {

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


  /*
   * MÁY KÉO
   */

  if (
    quote.machinePrice > 0
  ) {

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


/* =========================================================
   CẬP NHẬT WEBSITE
========================================================= */

function updateWebsite() {

  const quote =
    calculateQuote();


  /*
   * TÓM TẮT
   */

  $("typeDisplay").textContent =
    ELEVATOR_TYPES[
      quote.type
    ];


  $("stopDisplay").textContent =
    `${quote.stop} Stop`;


  $("doorCount").textContent =
    `${quote.doorCount} cửa`;


  /*
   * CHI TIẾT GIÁ
   */

  const rows =
    buildPriceRows(
      quote
    );


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


  /*
   * TỔNG
   */

  $("totalPrice").textContent =
    money(
      quote.total
    );


  /*
   * PDF
   */

  updatePrintQuote(
    quote
  );

}


/* =========================================================
   CẬP NHẬT PDF
========================================================= */

function updatePrintQuote(
  quote
) {

  const now =
    new Date();


  const day =
    String(
      now.getDate()
    ).padStart(
      2,
      "0"
    );


  const month =
    String(
      now.getMonth() + 1
    ).padStart(
      2,
      "0"
    );


  const year =
    now.getFullYear();


  /*
   * SỐ BÁO GIÁ
   */

  $("printQuoteNo").textContent =
    QUOTE_NUMBER;


  /*
   * NGÀY
   */

  $("printDate").textContent =
    `${day}/${month}/${year}`;


  /*
   * KHÁCH HÀNG
   */

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


  /*
   * CẤU HÌNH
   */

  $("printType").textContent =
    ELEVATOR_TYPES[
      quote.type
    ];


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


  /*
   * Không lặp "2 cánh mở tim"
   */

  $("printDoor").textContent =
    PRICE_CONFIG.door[
      quote.door
    ].name;


  $("printMachine").textContent =
    PRICE_CONFIG.machine[
      quote.machine
    ].name;


  /*
   * CHI TIẾT GIÁ
   */

  const rows =
    buildPriceRows(
      quote
    );


  $("printPriceRows").innerHTML =
    rows.map(function(
      row,
      index
    ) {

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


  /*
   * TỔNG
   */

  $("printTotal").textContent =
    money(
      quote.total
    );

}


/* =========================================================
   TẠO "DẤU VÂN TAY" CHO BÁO GIÁ
   =========================================================
   
   Dùng để phát hiện:
   - khách đã lưu chưa
   - cấu hình có thay đổi không
   ========================================================= */

function createQuoteSignature(
  customer,
  quote
) {

  return JSON.stringify({

    customerName:
      customer.name,

    customerPhone:
      customer.phone,

    projectAddress:
      customer.address,

    elevatorType:
      quote.type,

    capacity:
      quote.capacity,

    stop:
      quote.stop,

    cabin:
      quote.cabin,

    door:
      quote.door,

    machine:
      quote.machine,

    doorCount:
      quote.doorCount,

    totalPrice:
      quote.total

  });

}


/* =========================================================
   GỬI BÁO GIÁ LÊN SUPABASE
========================================================= */

async function saveQuoteToSupabase() {

  /*
   * Kiểm tra Supabase
   */

  if (
    typeof grovaSupabase ===
    "undefined"
  ) {

    alert(
      "Hệ thống Supabase chưa được kết nối.\n\n" +
      "Vui lòng kiểm tra Publishable Key trong index.html."
    );


    return false;

  }


  /*
   * Kiểm tra khách hàng
   */

  const customer =
    validateCustomer();


  if (!customer) {

    return false;

  }


  /*
   * Tính giá
   */

  const quote =
    calculateQuote();


  /*
   * Tạo chữ ký
   */

  const signature =
    createQuoteSignature(
      customer,
      quote
    );


  /*
   * Nếu dữ liệu chưa thay đổi
   * thì dùng lại báo giá cũ.
   */

  if (
    LAST_SAVED_SIGNATURE ===
    signature &&
    QUOTE_NUMBER !==
    "CHƯA LƯU"
  ) {

    console.log(
      "GROVA: Báo giá không thay đổi, sử dụng số cũ:",
      QUOTE_NUMBER
    );


    return true;

  }


  /*
   * Không cho bấm liên tục
   */

  if (IS_SAVING) {

    return false;

  }


  IS_SAVING =
    true;


  /*
   * Đổi trạng thái
   */

  setSaveStatus(
    "saving",
    "Đang lưu báo giá..."
  );


  const button =
    $("printBtn");


  if (button) {

    button.disabled =
      true;

  }


  try {

    /*
     * Gọi hàm submit_quote
     * đã tạo trong Supabase.
     */

    const result =
      await grovaSupabase.rpc(
        "submit_quote",
        {

          p_customer_name:
            customer.name,

          p_customer_phone:
            customer.phone,

          p_project_address:
            customer.address,

          p_elevator_type:
            quote.type,

          p_capacity:
            quote.capacity,

          p_stop:
            quote.stop,

          p_cabin:
            quote.cabin,

          p_door:
            quote.door,

          p_machine:
            quote.machine,

          p_door_count:
            quote.doorCount,

          p_total_price:
            quote.total

        }
      );


    /*
     * Có lỗi
     */

    if (
      result.error
    ) {

      console.error(
        "GROVA Supabase Error:",
        result.error
      );


      throw new Error(
        result.error.message ||
        "Không thể lưu báo giá."
      );

    }


    /*
     * Supabase trả về
     * số báo giá.
     */

    let returnedQuoteNumber =
      result.data;


    /*
     * Một số trường hợp API
     * có thể trả về mảng.
     */

    if (
      Array.isArray(
        returnedQuoteNumber
      )
    ) {

      returnedQuoteNumber =
        returnedQuoteNumber[0];

    }


    /*
     * Kiểm tra kết quả
     */

    if (
      !returnedQuoteNumber ||
      typeof returnedQuoteNumber !==
      "string"
    ) {

      throw new Error(
        "Supabase không trả về số báo giá."
      );

    }


    /*
     * Lưu số báo giá
     */

    QUOTE_NUMBER =
      returnedQuoteNumber;


    /*
     * Lưu chữ ký
     */

    LAST_SAVED_SIGNATURE =
      signature;


    /*
     * Cập nhật PDF
     */

    updatePrintQuote(
      quote
    );


    /*
     * Trạng thái
     */

    setSaveStatus(
      "",
      "Đã lưu báo giá " +
      QUOTE_NUMBER
    );


    console.log(
      "GROVA: Đã lưu báo giá:",
      QUOTE_NUMBER
    );


    return true;

  }

  catch (error) {

    console.error(
      "GROVA: Không thể lưu báo giá:",
      error
    );


    setSaveStatus(
      "error",
      "Không thể lưu báo giá"
    );


    alert(

      "Không thể lưu báo giá.\n\n" +

      "Vui lòng kiểm tra kết nối mạng " +
      "hoặc thử lại.\n\n" +

      "Chi tiết: " +
      error.message

    );


    return false;

  }

  finally {

    IS_SAVING =
      false;


    if (button) {

      button.disabled =
        false;

    }

  }

}


/* =========================================================
   TẠO PDF
========================================================= */

async function createPDF() {

  /*
   * Cập nhật giao diện trước
   */

  updateWebsite();


  /*
   * Lưu báo giá lên Supabase
   */

  const saved =
    await saveQuoteToSupabase();


  /*
   * Không lưu được
   * thì không tạo PDF.
   */

  if (!saved) {

    return;

  }


  /*
   * Cập nhật lại PDF
   * với số báo giá thật.
   */

  updatePrintQuote(
    calculateQuote()
  );


  /*
   * Chờ trình duyệt cập nhật
   * rồi mới mở cửa sổ in.
   */

  setTimeout(
    function() {

      window.print();

    },
    250
  );

}


/* =========================================================
   RESET
========================================================= */

function resetForm() {

  $("customerName").value =
    "";


  $("customerPhone").value =
    "";


  $("projectAddress").value =
    "";


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


  /*
   * Xóa localStorage
   */

  clearSavedFormData();


  /*
   * Xóa trạng thái báo giá
   */

  QUOTE_NUMBER =
    "CHƯA LƯU";


  LAST_SAVED_SIGNATURE =
    null;


  setSaveStatus(
    "",
    "Đã xóa dữ liệu lưu"
  );


  updateWebsite();

}


/* =========================================================
   KHỞI TẠO
========================================================= */

function init() {

  /*
   * Khôi phục dữ liệu
   */

  loadFormData();


  /*
   * Các trường form
   */

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


  /*
   * Theo dõi thay đổi
   */

  fields.forEach(function(id) {

    const element =
      $(id);


    if (!element) {

      return;

    }


    /*
     * INPUT
     */

    element.addEventListener(
      "input",
      function() {

        /*
         * Nếu khách sửa dữ liệu
         * thì báo giá cũ không còn
         * được xem là bản hiện tại.
         */

        LAST_SAVED_SIGNATURE =
          null;


        QUOTE_NUMBER =
          "CHƯA LƯU";


        updateWebsite();


        saveFormData();

      }
    );


    /*
     * CHANGE
     */

    element.addEventListener(
      "change",
      function() {

        LAST_SAVED_SIGNATURE =
          null;


        QUOTE_NUMBER =
          "CHƯA LƯU";


        updateWebsite();


        saveFormData();

      }
    );

  });


  /*
   * NÚT ĐẶT LẠI
   */

  const resetButton =
    $("resetBtn");


  if (resetButton) {

    resetButton.addEventListener(
      "click",
      resetForm
    );

  }


  /*
   * NÚT LẤY BÁO GIÁ + PDF
   */

  const printButton =
    $("printBtn");


  if (printButton) {

    printButton.addEventListener(
      "click",
      createPDF
    );

  }


  /*
   * Hiển thị ban đầu
   */

  updateWebsite();

}


/* =========================================================
   CHẠY ỨNG DỤNG
========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    init
  );

}

else {

  init();

}