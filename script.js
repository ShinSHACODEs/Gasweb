// Vital Signs Data
let vitalSigns = [
  {
    title: "คาร์บอนไดออกไซด์",
    value: "428",
    unit: "ppm",
    description: "ระดับคาร์บอนไดออกไซด์ในชั้นบรรยากาศ (กำลังโหลดข้อมูล...)",
    trend: "เพิ่มขึ้น",
    icon: "🏭",
  },
  {
    title: "อุณหภูมิโลก",
    value: "+1.36",
    unit: "°C",
    description: "อุณหภูมิเฉลี่ยของโลกเพิ่มขึ้นเมื่อเทียบกับยุคก่อนอุตสาหกรรม",
    trend: "เพิ่มขึ้น",
    icon: "🌡️",
  },
  {
    title: "มีเทน",
    value: "1,935",
    unit: "ppb",
    description: "ระดับก๊าซมีเทนในชั้นบรรยากาศ (กำลังโหลดข้อมูล...)",
    trend: "เพิ่มขึ้น",
    icon: "💨",
  },
  {
    title: "น้ำแข็งขั้วโลกละลาย",
    value: "-150",
    unit: "พันล้านตัน/ปี",
    description: "อัตราการสูญเสียน้ำแข็งในแอนตาร์กติกา",
    trend: "ลดลง",
    icon: "🧊",
  },
  {
    title: "ระดับน้ำทะเลสูงขึ้น",
    value: "+101.2",
    unit: "มม.",
    description: "ระดับน้ำทะเลสูงขึ้นตั้งแต่ปี 1993",
    trend: "เพิ่มขึ้น",
    icon: "🌊",
  },
  {
    title: "มหาสมุทรดูดซับความร้อน",
    value: "+345",
    unit: "เซตตาจูล",
    description: "พลังงานความร้อนที่มหาสมุทรดูดซับตั้งแต่ปี 1955",
    trend: "เพิ่มขึ้น",
    icon: "🔥",
  },
  {
    title: "น้ำแข็งกรีนแลนด์ละลาย",
    value: "-270",
    unit: "พันล้านตัน/ปี",
    description: "อัตราการสูญเสียน้ำแข็งในกรีนแลนด์",
    trend: "ลดลง",
    icon: "❄️",
  },
  {
    title: "ความเป็นกรดของมหาสมุทร",
    value: "+30",
    unit: "%",
    description: "ความเป็นกรดของมหาสมุทรเพิ่มขึ้นตั้งแต่ยุคก่อนอุตสาหกรรม",
    trend: "เพิ่มขึ้น",
    icon: "🧪",
  },
]

let currentIndex = 0
let autoPlayInterval = null

// Loading Screen
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loading-screen").style.display = "none"
    document.getElementById("main-content").style.display = "block"
  }, 1500)
})

// Fetch Climate Data from APIs
async function fetchClimateData() {
  try {
    // Fetch CO2 data
    const co2Response = await fetch("https://global-warming.org/api/co2-api")
    const co2Data = await co2Response.json()
    if (co2Data.co2 && co2Data.co2.length > 0) {
      const latestCO2 = co2Data.co2[co2Data.co2.length - 1]
      const co2Value = Number.parseFloat(latestCO2.trend).toFixed(2)
      const co2Date = `${latestCO2.month}/${latestCO2.year}`

      vitalSigns = vitalSigns.map((sign) =>
        sign.icon === "🏭"
          ? { ...sign, value: co2Value, description: `ระดับคาร์บอนไดออกไซด์ในชั้นบรรยากาศ (${co2Date})` }
          : sign,
      )
    }

    // Fetch Methane data
    const methaneResponse = await fetch("https://global-warming.org/api/methane-api")
    const methaneData = await methaneResponse.json()
    if (methaneData.methane && methaneData.methane.length > 1) {
      const latestMethane = methaneData.methane[methaneData.methane.length - 1]
      const methaneValue = Number.parseFloat(latestMethane.average).toFixed(0)
      const methaneDate = latestMethane.date

      vitalSigns = vitalSigns.map((sign) =>
        sign.icon === "💨"
          ? { ...sign, value: methaneValue, description: `ระดับก๊าซมีเทนในชั้นบรรยากาศ (${methaneDate})` }
          : sign,
      )
    }

    // Fetch Temperature data
    const tempResponse = await fetch("https://global-warming.org/api/temperature-api")
    const tempData = await tempResponse.json()
    if (tempData.result && tempData.result.length > 0) {
      const latestTemp = tempData.result[tempData.result.length - 1]
      const tempValue = Number.parseFloat(latestTemp.land).toFixed(2)
      const tempDate = latestTemp.time

      vitalSigns = vitalSigns.map((sign) =>
        sign.icon === "🌡️"
          ? {
              ...sign,
              value: tempValue > 0 ? `+${tempValue}` : tempValue,
              description: `อุณหภูมิเฉลี่ยของโลกเพิ่มขึ้นเมื่อเทียบกับยุคก่อนอุตสาหกรรม (${tempDate})`,
            }
          : sign,
      )
    }

    console.log("✅ ดึงข้อมูลจาก NASA Climate APIs สำเร็จ")
    renderCarousel()
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการดึงข้อมูล:", error)
    renderCarousel()
  }
}

// Render Carousel
function renderCarousel() {
  const track = document.getElementById("carousel-track")
  const dots = document.getElementById("carousel-dots")

  track.innerHTML = ""
  dots.innerHTML = ""

  vitalSigns.forEach((sign, index) => {
    // Create card
    const card = document.createElement("div")
    card.className = "vital-card"
    card.innerHTML = `
            <div class="vital-card-content">
                <div class="vital-card-icon">${sign.icon}</div>
                <h3 class="vital-card-title">${sign.title}</h3>
                <div class="vital-card-value">
                    ${sign.value} <span class="vital-card-unit">${sign.unit}</span>
                </div>
                <p class="vital-card-description">${sign.description}</p>
                <div class="vital-card-trend ${sign.trend === "เพิ่มขึ้น" ? "trend-up" : "trend-down"}">
                    แนวโน้ม: ${sign.trend}
                </div>
            </div>
        `
    track.appendChild(card)

    // Create dot
    const dot = document.createElement("button")
    dot.className = `dot ${index === 0 ? "active" : ""}`
    dot.setAttribute("aria-label", `Go to slide ${index + 1}`)
    dot.addEventListener("click", () => updateCarousel(index))
    dots.appendChild(dot)
  })
}

// Update Carousel
function updateCarousel(index) {
  currentIndex = index
  const track = document.getElementById("carousel-track")
  track.style.transform = `translateX(-${currentIndex * 100}%)`

  // Update dots
  const dots = document.querySelectorAll(".dot")
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === currentIndex)
  })

  // Reset auto-play
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
    startAutoPlay()
  }
}

// Start Auto-play
function startAutoPlay() {
  autoPlayInterval = setInterval(() => {
    currentIndex = (currentIndex + 1) % vitalSigns.length
    updateCarousel(currentIndex)
  }, 5000)
}

// Navigation buttons
document.getElementById("prev-btn").addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + vitalSigns.length) % vitalSigns.length
  updateCarousel(currentIndex)
})

document.getElementById("next-btn").addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % vitalSigns.length
  updateCarousel(currentIndex)
})

// Initialize
fetchClimateData()
startAutoPlay()
