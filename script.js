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
    title: "ไนตรัสออกไซด์",
    value: "...",
    unit: "ppb",
    description: "ระดับก๊าซไนตรัสออกไซด์ในชั้นบรรยากาศ (กำลังโหลดข้อมูล...)",
    trend: "เพิ่มขึ้น",
    icon: "🌬️",
  },
  {
    title: "น้ำแข็งขั้วโลกละลาย",
    value: "-135",
    unit: "พันล้านตัน/ปี",
    description: "อัตราการสูญเสียน้ำแข็งในแอนตาร์กติกาจาก Nasa",
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
    title: "มหาสมุทรดูดซับความร้อนปีละ",
    value: "+16 ± 8",
    unit: "ZJ(Zettajoule)",
    description: "พลังงานความร้อนที่มหาสมุทรดูดซับตั้งแต่ปี 1955",
    trend: "เพิ่มขึ้น",
    icon: "🌏",
  },
  {
    title: "ความเป็นกรดของมหาสมุทร",
    value: "8.1",
    unit: "ph",
    description: "คาดการณ์ว่าค่า pH จะลดลงไปอีก 0.2-0.3 หน่วย ซึ่งอาจส่งผลกระทบอย่างร้ายแรงต่อระบบนิเวศทางทะเล",
    trend: "ลดลง",
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

// Fetch Climate Data
async function fetchClimateData() {
  try {
    // CO2
    const co2Response = await fetch("https://global-warming.org/api/co2-api")
    const co2Data = await co2Response.json()
    if (co2Data.co2 && co2Data.co2.length > 0) {
      const latest = co2Data.co2.at(-1)
      const value = Number.parseFloat(latest.trend).toFixed(2)
      vitalSigns = vitalSigns.map((s) =>
        s.icon === "🏭" ? { ...s, value, description: "ระดับคาร์บอนไดออกไซด์ในชั้นบรรยากาศ" } : s
      )
    }

    // Methane
    const methaneResponse = await fetch("https://global-warming.org/api/methane-api")
    const methaneData = await methaneResponse.json()
    if (methaneData.methane && methaneData.methane.length > 1) {
      const latest = methaneData.methane.at(-1)
      const value = Number.parseFloat(latest.average).toFixed(0)
      vitalSigns = vitalSigns.map((s) =>
        s.icon === "💨" ? { ...s, value, description: "ระดับก๊าซมีเทนในชั้นบรรยากาศ" } : s
      )
    }

    // Temperature
    const tempResponse = await fetch("https://global-warming.org/api/temperature-api")
    const tempData = await tempResponse.json()
    if (tempData.result && tempData.result.length > 0) {
      const latest = tempData.result.at(-1)
      const value = Number.parseFloat(latest.land).toFixed(2)
      vitalSigns = vitalSigns.map((s) =>
        s.icon === "🌡️"
          ? { ...s, value: value > 0 ? `+${value}` : value, description: "อุณหภูมิเฉลี่ยของโลกเพิ่มขึ้นเมื่อเทียบกับยุคก่อนอุตสาหกรรม" }
          : s
      )
    }

    // Nitrous Oxide
    const n2oResponse = await fetch("https://global-warming.org/api/nitrous-oxide-api")
    const n2oData = await n2oResponse.json()
    if (n2oData.nitrous && n2oData.nitrous.length > 0) {
      const latest = n2oData.nitrous.at(-1)
      const value = Number.parseFloat(latest.average).toFixed(0)
      vitalSigns = vitalSigns.map((s) =>
        s.icon === "🌬️" ? { ...s, value, description: "ระดับก๊าซไนตรัสออกไซด์ในชั้นบรรยากาศ" } : s
      )
    }

    // Ocean Warming
    const oceanResponse = await fetch("https://global-warming.org/api/ocean-warming-api")
    const oceanData = await oceanResponse.json()
    if (oceanData.result && oceanData.result.length > 0) {
      const latest = oceanData.result.at(-1)
      const value = Number.parseFloat(latest.heat).toFixed(0)
      vitalSigns = vitalSigns.map((s) =>
        s.icon === "🌏" ? { ...s, value, description: "พลังงานความร้อนที่มหาสมุทรสะสมเพิ่มขึ้น" } : s
      )
    }
    
    console.log("✅ อัปเดตข้อมูล Climate APIs ครบทั้งหมดแล้ว")
    renderCarousel()

  } catch (error) {
    console.error("❌ ดึงข้อมูลล้มเหลว:", error)
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
      </div>`
    track.appendChild(card)

    const dot = document.createElement("button")
    dot.className = `dot ${index === 0 ? "active" : ""}`
    dot.addEventListener("click", () => updateCarousel(index))
    dots.appendChild(dot)
  })
}

// Update Carousel
function updateCarousel(index) {
  currentIndex = index
  const track = document.getElementById("carousel-track")
  track.style.transform = `translateX(-${currentIndex * 100}%)`

  document.querySelectorAll(".dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === currentIndex)
  })

  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
    startAutoPlay()
  }
}

// Auto-play
function startAutoPlay() {
  autoPlayInterval = setInterval(() => {
    currentIndex = (currentIndex + 1) % vitalSigns.length
    updateCarousel(currentIndex)
  }, 5000)
}

// Navigation
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
