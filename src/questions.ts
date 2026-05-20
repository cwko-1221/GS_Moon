export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export const questions: Question[] = [
  {
    id: 1,
    question: "關於月球表面，下列哪項是正確的？\nWhich of the following is correct about the surface of the Moon?",
    options: [
      "平滑且充滿水 (Smooth and full of water)",
      "粗糙且充滿隕石坑 (Rough and full of craters)",
      "長滿植物 (Full of plants)",
      "能夠自己發光 (Gives off its own light)"
    ],
    correctAnswerIndex: 1
  },
  {
    id: 2,
    question: "月光是從哪裡來的？\nWhere does moonlight come from?",
    options: [
      "月球本身發出的光 (Light given off by the Moon itself)",
      "地球反射的光 (Light reflected from the Earth)",
      "太陽反射的光 (Light reflected from the Sun)",
      "星星的光 (Light from the stars)"
    ],
    correctAnswerIndex: 2
  },
  {
    id: 3,
    question: "月球自轉一圈大約需要多少天？\nHow long does it take for the Moon to make one rotation?",
    options: [
      "1 天 (1 day)",
      "15 天 (15 days)",
      "24 天 (24 days)",
      "27 天 (27 days)"
    ],
    correctAnswerIndex: 3
  },
  {
    id: 4,
    question: "月球繞地球公轉一圈大約需要多少天？\nHow long does it take for the Moon to complete one revolution around the Earth?",
    options: [
      "1 天 (1 day)",
      "27 天 (27 days)",
      "30 天 (30 days)",
      "365 天 (365 days)"
    ],
    correctAnswerIndex: 1
  },
  {
    id: 5,
    question: "為什麼我們總是看到月球的同一面？\nWhy do we always see the same side of the Moon?",
    options: [
      "因為月球不會自轉 (Because the Moon does not rotate)",
      "因為月球不會公轉 (Because the Moon does not revolve)",
      "因為月球自轉和公轉所需的時間相同 (Because the time for rotation and revolution is the same)",
      "因為地球的引力阻擋了月球轉動 (Because Earth's gravity stops it from spinning)"
    ],
    correctAnswerIndex: 2
  },
  {
    id: 6,
    question: "滿月通常出現在農曆的哪一天？\nOn which day of a lunar month does a full moon usually appear?",
    options: [
      "第 1 天 (The 1st day)",
      "第 7 天 (The 7th day)",
      "第 15 天 (The 15th day)",
      "第 30 天 (The 30th day)"
    ],
    correctAnswerIndex: 2
  },
  {
    id: 7,
    question: "一個月相週期大約持續多少天？\nHow long does a lunar cycle last?",
    options: [
      "約 7 天 (About 7 days)",
      "約 15 天 (About 15 days)",
      "約 27 天 (About 27 days)",
      "約 30 天 (About 30 days)"
    ],
    correctAnswerIndex: 3
  },
  {
    id: 8,
    question: "發生日食時，三個星體的排列順序是什麼？\nWhat is the alignment of the three celestial bodies during a solar eclipse?",
    options: [
      "太陽 - 地球 - 月球 (Sun - Earth - Moon)",
      "地球 - 太陽 - 月球 (Earth - Sun - Moon)",
      "太陽 - 月球 - 地球 (Sun - Moon - Earth)",
      "月球 - 地球 - 太陽 (Moon - Earth - Sun)"
    ],
    correctAnswerIndex: 2
  },
  {
    id: 9,
    question: "發生月食時，哪個星體位於中間？\nWhich celestial body is in the middle during a lunar eclipse?",
    options: [
      "太陽 (Sun)",
      "地球 (Earth)",
      "月球 (Moon)",
      "恆星 (A star)"
    ],
    correctAnswerIndex: 1
  },
  {
    id: 10,
    question: "觀看日食時，下列哪種方法是正確且安全的？\nWhich of the following is a correct and safe way to watch a solar eclipse?",
    options: [
      "戴太陽眼鏡 (Wearing sunglasses)",
      "使用望遠鏡直接觀看 (Watching directly through a telescope)",
      "使用雙筒望遠鏡 (Watching through binoculars)",
      "使用太陽濾波器 (Using a solar filter)"
    ],
    correctAnswerIndex: 3
  },
  {
    id: 11,
    question: "為什麼不能戴太陽眼鏡觀看日食？\nWhy shouldn't we wear sunglasses to watch a solar eclipse?",
    options: [
      "看不清楚 (We cannot see clearly)",
      "有些紫外線和紅外線仍會穿透並傷害眼睛 (Some ultraviolet and infrared rays can still pass through and hurt our eyes)",
      "太陽眼鏡會反光 (Sunglasses will reflect light)",
      "日食的顏色會改變 (The color of the eclipse will change)"
    ],
    correctAnswerIndex: 1
  },
  {
    id: 12,
    question: "農曆初一時，我們在地球上能看到月亮嗎？\nCan we see the Moon from the Earth on the first day of a lunar month?",
    options: [
      "能，看到滿月 (Yes, we see a full moon)",
      "能，看到半個月亮 (Yes, we see a half moon)",
      "不能，因為月球被地球的影子遮住了 (No, because it is blocked by Earth's shadow)",
      "不能，因為太陽光照在月球的背面 (No, because sunlight falls on the back of the Moon)"
    ],
    correctAnswerIndex: 3
  },
  {
    id: 13,
    question: "以下哪項特徵「不」屬於月球？\nWhich of the following features does NOT belong to the Moon?",
    options: [
      "表面粗糙 (Rough surface)",
      "有植物生長 (Has plants growing on it)",
      "充滿隕石坑 (Full of craters)",
      "沒有水 (Has no water)"
    ],
    correctAnswerIndex: 1
  },
  {
    id: 14,
    question: "在日全食期間，哪一部分的太陽光被月球完全遮擋？\nDuring a total solar eclipse, what is completely blocked by the Moon?",
    options: [
      "到達地球的月光 (Moonlight reaching the Earth)",
      "到達地球的太陽光 (Sunlight reaching the Earth)",
      "到達月球的太陽光 (Sunlight reaching the Moon)",
      "星星的光 (Starlight)"
    ],
    correctAnswerIndex: 1
  },
  {
    id: 15,
    question: "在月食期間，地球的影子會投射在哪裡？\nDuring a lunar eclipse, where does the shadow of the Earth fall?",
    options: [
      "太陽上 (On the Sun)",
      "雲層上 (On the clouds)",
      "月球上 (On the Moon)",
      "太空中 (In space)"
    ],
    correctAnswerIndex: 2
  },
  {
    id: 16,
    question: "使用望遠鏡觀看日食的安全方法是什麼？\nWhat is a safe way to use a telescope to watch a solar eclipse?",
    options: [
      "透過鏡片看 (Looking through the lens)",
      "加上墨鏡看 (Looking with sunglasses on)",
      "將影像投影在白色紙板上 (Projecting an image on a piece of white cardboard)",
      "在晚上的時候看 (Watching it at night)"
    ],
    correctAnswerIndex: 2
  },
  {
    id: 17,
    question: "月相變化的原因是什麼？\nWhat causes the phases of the Moon?",
    options: [
      "雲層遮擋了月球 (Clouds blocking the Moon)",
      "月球發光強度的變化 (Changes in the Moon's light brightness)",
      "月球繞地球公轉，導致我們看到的受光面改變 (The Moon revolves around the Earth, changing the lit part we can see)",
      "地球自轉造成的錯覺 (An illusion caused by Earth's rotation)"
    ],
    correctAnswerIndex: 2
  },
  {
    id: 18,
    question: "日食發生時，地球上的所有地方都能看到嗎？\nCan a solar eclipse be seen from everywhere on Earth?",
    options: [
      "可以，所有人都能看到 (Yes, everyone can see it)",
      "只有在月球陰影落下（投射）的特定區域才能看到 (No, only in specific areas where the Moon's shadow falls)",
      "只有在晚上才能看到 (No, only at night)",
      "只有在北半球能看到 (No, only in the Northern Hemisphere)"
    ],
    correctAnswerIndex: 1
  },
  {
    id: 19,
    question: "地球繞太陽公轉一圈需要多長時間？\nHow long does it take for the Earth to complete one revolution around the Sun?",
    options: [
      "24 小時 (24 hours)",
      "27 天 (27 days)",
      "30 天 (30 days)",
      "1 年 (1 year)"
    ],
    correctAnswerIndex: 3
  },
  {
    id: 20,
    question: "根據實驗，當光源（手電筒）關閉時，我們無法看到代表月球的乒乓球，這證明了什麼？\nIn the experiment, when the torch is switched off, we cannot see the table tennis ball representing the Moon. What does this prove?",
    options: [
      "乒乓球太小了 (The ball is too small)",
      "月球本身不會發光 (The Moon does not give off light)",
      "月球被地球擋住了 (The Moon is blocked by the Earth)",
      "月球表面是粗糙的 (The Moon's surface is rough)"
    ],
    correctAnswerIndex: 1
  }
];
