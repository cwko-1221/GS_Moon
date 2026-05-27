export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export const questions: Question[] = [
 {
    id: 1,
    question: "為什麼太空探索對人類很重要？\nWhy is space exploration important to humans?",
    options: [
      "為了尋找外星人 (To find aliens)",
      "為了在太空建遊樂園 (To build amusement parks in space)",
      "為了尋找其他可供人類居住的星體 (To find other celestial bodies for humans to live on)",
      "為了丟棄地球的垃圾 (To throw away Earth's garbage)"
    ],
    correctAnswerIndex: 2
  },
  {
    id: 2,
    question: "中國古代人使用什麼儀器來測量天體的位置？\nWhat instrument did ancient Chinese people use to measure the position of celestial bodies?",
    options: [
      "日晷 (Sundial)",
      "渾天儀 (Armillary sphere)",
      "指南針 (Compass)",
      "折射望遠鏡 (Refracting telescope)"
    ],
    correctAnswerIndex: 1
  },
  {
    id: 3,
    question: "哪位科學家根據光的反射原理，製造了便宜又輕巧的反射望遠鏡？\nWhich scientist made a cheap and light reflecting telescope based on the reflection of light?",
    options: [
      "伽利略 (Galileo)",
      "牛頓 (Newton)",
      "雷伯 (Reber)",
      "哈勃 (Hubble)"
    ],
    correctAnswerIndex: 1
  },
  {
    id: 4,
    question: "射電望遠鏡的主要特徵是什麼？\nWhat is the main feature of a radio telescope?",
    options: [
      "它使用透鏡來折射光線 (It uses lenses to bend light)",
      "它在地球大氣層外圍繞地球運行 (It orbits the Earth above the atmosphere)",
      "它的天線接收來自天體的無線電波 (Its antenna receives radio waves from celestial bodies)",
      "它只用來觀察太陽 (It only observes the Sun)"
    ],
    correctAnswerIndex: 2
  },
  {
    id: 5,
    question: "為什麼哈勃太空望遠鏡要放置在地球大氣層之上？\nWhy is the Hubble Space Telescope placed above the Earth's atmosphere?",
    options: [
      "為了更接近星星 (To be closer to the stars)",
      "為了拍攝清晰的天體影像 (To take clear images of celestial bodies)",
      "為了接收更多陽光 (To receive more sunlight)",
      "為了避開地球引力 (To avoid Earth's gravity)"
    ],
    correctAnswerIndex: 1
  },
  {
    id: 6,
    question: "2013年2月15日，什麼物體墜落俄羅斯造成嚴重破壞並導致多人受傷？\nWhat caused severe damage and injured many people in Russia on 15 February 2013?",
    options: [
      "返回地球的太空船 (A returning spacecraft)",
      "人造衛星 (An artificial satellite)",
      "隕石 (A meteorite)",
      "太空穿梭機 (A space shuttle)"
    ],
    correctAnswerIndex: 2
  },
  {
    id: 7,
    question: "火箭升空是基於什麼科學原理？\nWhat scientific principle explains how a rocket takes off?",
    options: [
      "作用力與反作用力 (Action and reaction)",
      "摩擦力 (Friction)",
      "磁力 (Magnetic force)",
      "空氣阻力 (Air resistance)"
    ],
    correctAnswerIndex: 0
  },
  {
    id: 8,
    question: "當火箭燃料燃燒時，大量氣體向哪個方向噴出以推動火箭向上？\nWhen a rocket's fuel burns, in which direction does the large amount of gas rush to push the rocket upwards?",
    options: [
      "向上 (Upwards)",
      "向下 (Downwards)",
      "向側面 (Sideways)",
      "向內 (Inwards)"
    ],
    correctAnswerIndex: 1
  },
  {
    id: 9,
    question: "火箭發射過程中，助推器燃料耗盡後會怎樣？\nWhat happens to the rocket boosters after they run out of fuel during a launch?",
    options: [
      "它們會爆炸 (They explode)",
      "它們會變成太陽能板 (They turn into solar panels)",
      "它們會被脫落/拋棄 (They are dropped)",
      "它們會降落在月球上 (They land on the Moon)"
    ],
    correctAnswerIndex: 2
  },
  {
    id: 10,
    question: "第二節火箭脫落後，太空船會展開什麼以便在太空中運作？\nWhat does a spacecraft spread out to operate in space after the second stage of the rocket is dropped?",
    options: [
      "降落傘 (Parachutes)",
      "天線 (Antennas)",
      "機翼 (Wings)",
      "太陽能板 (Solar panels)"
    ],
    correctAnswerIndex: 3
  },
  {
    id: 11,
    question: "太空船的返回艙如何安全降落在地球上？\nHow does the capsule of a spacecraft safely land on Earth?",
    options: [
      "它使用火箭助推器 (It uses rocket boosters)",
      "打開降落傘並使用制動系統 (Parachutes open and it uses a braking system)",
      "它像飛機一樣降落在跑道上 (It lands like an airplane on a runway)",
      "它在地面上彈跳 (It bounces on the ground)"
    ],
    correctAnswerIndex: 1
  },
  {
    id: 12,
    question: "哪個國家在1957年發射了全球第一枚人造衛星？\nWhich country launched the world's first artificial satellite in 1957?",
    options: [
      "美國 (The United States)",
      "前蘇聯 (The former Soviet Union)",
      "中國 (China)",
      "日本 (Japan)"
    ],
    correctAnswerIndex: 1
  },
  {
    id: 13,
    question: "兩位美國太空人是在哪一年成為首批登陸月球的人類？\nIn what year did two American astronauts become the first humans to walk on the Moon?",
    options: [
      "1957",
      "1961",
      "1969",
      "1981"
    ],
    correctAnswerIndex: 2
  },
  {
    id: 14,
    question: "1981年美國發射了世界上第一個什麼設備？\nWhat did the US launch in 1981 that was the world's first of its kind?",
    options: [
      "人造衛星 (Artificial satellite)",
      "太空實驗室 (Space laboratory)",
      "可重複使用的太空穿梭機 (Reusable space shuttle)",
      "月球車 (Lunar rover)"
    ],
    correctAnswerIndex: 2
  },
  {
    id: 15,
    question: "哪個由多國建造的設施於2000年開始運作，讓太空人能在太空中停留更長時間？\nWhat facility came into operation in 2000, built by a number of countries, allowing astronauts to stay in space longer?",
    options: [
      "國際太空站 (International Space Station)",
      "天文公園 (Astropark)",
      "太空實驗室 (Spacelab)",
      "歐洲太空總署 (European Space Agency)"
    ],
    correctAnswerIndex: 0
  },
  {
    id: 16,
    question: "中國在哪一年成功發射首艘載人太空船？\nWhen did China successfully launch its first manned spacecraft?",
    options: [
      "1970",
      "2000",
      "2003",
      "2013"
    ],
    correctAnswerIndex: 2
  },
  {
    id: 17,
    question: "2013年中國在太空探索方面取得了什麼重大成就？\nWhat major achievement did China accomplish in space exploration in 2013?",
    options: [
      "將第一個人類送入太空 (Sent the first human into space)",
      "首部月球車登陸月球 (First lunar rover landed on the Moon)",
      "發射首枚人造衛星 (Launched its first artificial satellite)",
      "太空船降落在小行星上 (Landed a spacecraft on an asteroid)"
    ],
    correctAnswerIndex: 1
  },
  {
    id: 18,
    question: "哪個國家的無人太空船在2014年成功進入火星軌道？\nWhich country's unmanned spacecraft was put into orbit around Mars in 2014?",
    options: [
      "印度 (India)",
      "日本 (Japan)",
      "中國 (China)",
      "美國 (The United States)"
    ],
    correctAnswerIndex: 0
  },
  {
    id: 19,
    question: "人造衛星如何幫助地球上的人類？\nWhat do artificial satellites do to help us on Earth?",
    options: [
      "它們為火箭提供燃料 (They provide fuel for rockets)",
      "它們監測北極海冰等變化 (They monitor changes like Arctic sea ice)",
      "它們運送人類去其他行星 (They carry humans to other planets)",
      "它們收集太空垃圾 (They collect space garbage)"
    ],
    correctAnswerIndex: 1
  },
  {
    id: 20,
    question: "根據教材，你可以和家人去香港的哪裡了解更多太空探索的知識？\nAccording to the textbook, where can you go with your family in Hong Kong to learn more about space exploration?",
    options: [
      "香港科學館 (Hong Kong Science Museum)",
      "香港太空館 (Hong Kong Space Museum)",
      "香港文化博物館 (Hong Kong Heritage Museum)",
      "天文公園 (Astropark)"
    ],
    correctAnswerIndex: 1
  }
];
