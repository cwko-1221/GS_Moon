export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export const questions: Question[] = [
  {
    id: 1,
    question: "我們的太陽系位於哪一個星系中？\nIn which galaxy is our Solar System located?",
    options: [
      "仙女座星系 (Andromeda Galaxy)",
      "銀河系 (Milky Way Galaxy)",
      "大麥哲倫星系 (Large Magellanic Cloud)",
      "黑眼星系 (Black Eye Galaxy)"
    ],
    correctAnswerIndex: 1
  },
  {
    id: 2,
    question: "下列哪一種星體會自行發光發熱？\nWhich type of celestial body gives off heat and light?",
    options: [
      "行星 (Planet)",
      "衛星 (Satellite)",
      "恆星 (Star)",
      "小行星 (Asteroid)"
    ],
    correctAnswerIndex: 2
  },
  {
    id: 3,
    question: "太陽系中，哪一個是最小的行星？\nWhich is the smallest planet in the Solar System?",
    options: [
      "火星 (Mars)",
      "水星 (Mercury)",
      "金星 (Venus)",
      "地球 (Earth)"
    ],
    correctAnswerIndex: 1
  },
  {
    id: 4,
    question: "木星和火星之間主要分佈著什麼天體？\nWhat celestial bodies are mostly found between Mars and Jupiter?",
    options: [
      "彗星 (Comets)",
      "小行星 (Asteroids)",
      "衛星 (Satellites)",
      "恆星 (Stars)"
    ],
    correctAnswerIndex: 1
  },
  {
    id: 5,
    question: "哪一顆行星表面呈現紅色，且到處都是沙丘？\nWhich planet has a reddish surface and sand dunes everywhere?",
    options: [
      "火星 (Mars)",
      "木星 (Jupiter)",
      "土星 (Saturn)",
      "金星 (Venus)"
    ],
    correctAnswerIndex: 0
  },
  {
    id: 6,
    question: "地球的衛星是下列哪一個？\nWhich of the following is the satellite of the Earth?",
    options: [
      "太陽 (Sun)",
      "火星 (Mars)",
      "月球 (Moon)",
      "哈雷彗星 (Halley's Comet)"
    ],
    correctAnswerIndex: 2
  },
  {
    id: 7,
    question: "下列關於行星的描述，哪一項是正確的？\nWhich of the following sentences about planets is correct?",
    options: [
      "它們會自己發光 (They give off light.)",
      "它們圍繞恆星公轉 (They revolve around stars.)",
      "它們圍繞衛星公轉 (They revolve around satellites.)",
      "它們由冰塊組成 (They are made of ice.)"
    ],
    correctAnswerIndex: 1
  },
  {
    id: 8,
    question: "哪一顆行星擁有寬闊且明亮的星環？\nWhich planet has wide and bright rings?",
    options: [
      "天王星 (Uranus)",
      "木星 (Jupiter)",
      "土星 (Saturn)",
      "海王星 (Neptune)"
    ],
    correctAnswerIndex: 2
  },
  {
    id: 9,
    question: "太陽系八大行星中，哪一顆距離太陽最遠？\nWhich of the eight planets in the Solar System is the farthest from the Sun?",
    options: [
      "海王星 (Neptune)",
      "天王星 (Uranus)",
      "木星 (Jupiter)",
      "土星 (Saturn)"
    ],
    correctAnswerIndex: 0
  },
  {
    id: 10,
    question: "彗星接近太陽時會發生什麼事？\nWhat happens when a comet gets close to the Sun?",
    options: [
      "它會結冰 (It freezes.)",
      "它會變成恆星 (It turns into a star.)",
      "它會受熱並拖著發光的長尾巴 (It heats up and shows a long glowing tail.)",
      "它會停止移動 (It stops moving.)"
    ],
    correctAnswerIndex: 2
  },
  {
    id: 11,
    question: "地球大氣層主要由哪三種氣體組成？\nEarth's atmosphere is mainly made up of which three gases?",
    options: [
      "氫氣、氧氣、二氧化碳 (Hydrogen, oxygen, carbon dioxide)",
      "氮氣、氧氣、二氧化碳 (Nitrogen, oxygen, carbon dioxide)",
      "氦氣、氮氣、氧氣 (Helium, nitrogen, oxygen)",
      "甲烷、氧氣、二氧化碳 (Methane, oxygen, carbon dioxide)"
    ],
    correctAnswerIndex: 1
  },
  {
    id: 12,
    question: "哪一顆行星擁有最高的表面溫度？\nWhich planet has the highest surface temperature?",
    options: [
      "水星 (Mercury)",
      "金星 (Venus)",
      "火星 (Mars)",
      "木星 (Jupiter)"
    ],
    correctAnswerIndex: 1
  },
  {
    id: 13,
    question: "太陽系八大行星中，哪一顆的體積最大且自轉最快？\nWhich is the largest planet and has the fastest rotation in the Solar System?",
    options: [
      "土星 (Saturn)",
      "木星 (Jupiter)",
      "天王星 (Uranus)",
      "地球 (Earth)"
    ],
    correctAnswerIndex: 1
  },
  {
    id: 14,
    question: "彗星是由什麼物質組成的？\nWhat is a comet made of?",
    options: [
      "完全由金屬組成 (Only metal)",
      "只有氣體 (Only gas)",
      "冰、岩石和塵埃的混合物 (A chunk of ice, rock and dust)",
      "液態水和泥土 (Liquid water and soil)"
    ],
    correctAnswerIndex: 2
  },
  {
    id: 15,
    question: "哪一顆行星表面大部分被海洋覆蓋，且有生物居住？\nWhich planet is mostly covered with oceans and has living things?",
    options: [
      "金星 (Venus)",
      "地球 (Earth)",
      "火星 (Mars)",
      "木星 (Jupiter)"
    ],
    correctAnswerIndex: 1
  },
  {
    id: 16,
    question: "衛星 (Satellites) 會圍繞什麼天體公轉？\nWhat celestial bodies do satellites revolve around?",
    options: [
      "行星 (Planets)",
      "恆星 (Stars)",
      "小行星 (Asteroids)",
      "彗星 (Comets)"
    ],
    correctAnswerIndex: 0
  },
  {
    id: 17,
    question: "下列哪一個組合構成了「太陽系 (Solar System)」？\nWhat makes up the Solar System?",
    options: [
      "只有太陽和地球 (Only the Sun and the Earth)",
      "所有宇宙中的星系 (All galaxies in the universe)",
      "太陽、八大行星及其衛星 (The Sun, the eight planets and their satellites)",
      "只有恆星和彗星 (Only stars and comets)"
    ],
    correctAnswerIndex: 2
  },
  {
    id: 18,
    question: "最著名的彗星之一叫做什麼名字？\nWhat is one of the most famous comets called?",
    options: [
      "安德羅美達彗星 (Andromeda Comet)",
      "哈雷彗星 (Halley's Comet)",
      "阿波羅彗星 (Apollo Comet)",
      "伽利略彗星 (Galileo Comet)"
    ],
    correctAnswerIndex: 1
  },
  {
    id: 19,
    question: "小行星 (Asteroids) 又被稱為什麼？\nWhat are asteroids also called?",
    options: [
      "小恆星 (Minor stars)",
      "小行星 (Minor planets)",
      "流星 (Meteors)",
      "小衛星 (Minor satellites)"
    ],
    correctAnswerIndex: 1
  },
  {
    id: 20,
    question: "太陽系八大行星中，距離太陽由近到遠排列，第三顆是哪一顆？\nWhich is the 3rd planet from the Sun in the Solar System?",
    options: [
      "金星 (Venus)",
      "火星 (Mars)",
      "地球 (Earth)",
      "木星 (Jupiter)"
    ],
    correctAnswerIndex: 2
  }
];
