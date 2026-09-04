const PRICE_CONFIG = {

  // ==============================
  // GIÁ THANG CƠ BẢN
  // ==============================

  basePrice: 285000000,


  // ==============================
  // TẢI TRỌNG
  // Giá cộng tịnh tiến so với 350kg
  // ==============================

  capacity: {
    350: 0,
    450: 0,
    630: 15000000,
    750: 35000000,
    1000: 60000000
  },


  // ==============================
  // SỐ STOP
  // ==============================

  stop: {
    base: 4,
    additional: 15000000
  },


  // ==============================
  // KHUNG THÉP
  // 4 Stop = 55 triệu
  // Mỗi Stop thêm = 13 triệu
  // ==============================

  steelFrame: {
    base: 55000000,
    additional: 13000000
  },


  // ==============================
  // CABIN
  // ==============================

  cabin: {

    "inox-trang": {
      name: "Cabin cơ bản – inox trắng",
      price: 0
    },

    "kinh-inox-trang": {
      name: "Cabin kính – inox trắng cơ bản",
      price: 10000000
    },

    "inox-mau": {
      name: "Cabin inox màu",
      price: 20000000
    },

    "kinh-inox-mau": {
      name: "Cabin kính inox màu",
      price: 20000000
    }

  },


  // ==============================
  // CỬA TẦNG
  // 2 CÁNH MỞ TIM
  // ==============================

  door: {

    "inox-trang": {
      name: "Cửa inox trắng",
      price: 0
    },

    "kinh-inox-trang": {
      name: "Kính inox trắng",
      price: 4000000
    },

    "inox-mau": {
      name: "Inox màu",
      price: 4000000
    },

    "kinh-inox-mau": {
      name: "Kính inox màu",
      price: 6500000
    }

  },


  // ==============================
  // MÁY KÉO
  // ==============================

  machine: {

    "torin": {
      name: "Torin – China",
      price: 0
    },

    "italy": {
      name: "Máy Ý",
      price: 55000000
    },

    "germany": {
      name: "Máy Đức",
      price: 60000000
    }

  }

};