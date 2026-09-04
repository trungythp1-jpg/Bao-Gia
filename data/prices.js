const PRICE_CONFIG = {
  // Giá cơ bản:
  // 350kg - 4 Stop - Cabin inox trắng - Torin China - Step China
  basePrice: 285000000,

  // Tải trọng - giá cộng tịnh tiến
  capacity: {
    350: 0,
    450: 0,
    630: 15000000,
    750: 35000000,
    1000: 60000000
  },

  // Số Stop
  stop: {
    base: 4,
    additional: 15000000
  },

  // Khung thép
  // 4 Stop = 55 triệu
  // Mỗi Stop tăng thêm = 13 triệu
  steelFrame: {
    base: 55000000,
    additional: 13000000
  },

  // Cabin
  cabin: {
    "inox-trang": 0,
    "kinh-inox-trang": 10000000,
    "inox-mau": 20000000,
    "kinh-inox-mau": 20000000
  },

  // Cửa tầng - 2 cánh mở tim
  // Giá tính theo từng cửa
  door: {
    "inox-trang": 0,
    "kinh-inox-trang": 4000000,
    "inox-mau": 4000000,
    "kinh-inox-mau": 6500000
  },

  // Máy kéo
  machine: {
    "torin": 0,
    "italy": 55000000,
    "germany": 60000000
  }
};