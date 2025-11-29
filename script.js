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
// Initialize
fetchClimateData()
startAutoPlay()
fetchNews()
fetchThaiNews()

// Scroll Progress Bar
window.addEventListener("scroll", () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
  const scrolled = (winScroll / height) * 100
  document.getElementById("scroll-progress").style.width = scrolled + "%"
})

// Fetch Global News (The Guardian)
async function fetchNews() {
  const newsContent = document.getElementById("news-content")
  const RSS_URL = "https://www.theguardian.com/environment/climate-crisis/rss"
  const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`

  try {
    const response = await fetch(API_URL)
    const data = await response.json()

    if (data.status === "ok" && data.items.length > 0) {
      newsContent.innerHTML = "" // Clear loading state

      data.items.slice(0, 10).forEach((item) => {
        const newsItem = document.createElement("a")
        newsItem.className = "news-item"
        newsItem.href = item.link
        newsItem.target = "_blank"
        newsItem.rel = "noopener noreferrer"

        // Try to extract image from content or enclosure
        let imageUrl = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80" // Fallback
        if (item.enclosure && item.enclosure.link) {
          imageUrl = item.enclosure.link
        } else if (item.thumbnail) {
          imageUrl = item.thumbnail
        }

        const date = new Date(item.pubDate).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })

        newsItem.innerHTML = `
          <img src="${imageUrl}" alt="${item.title}" loading="lazy">
          <h4>${item.title}</h4>
          <span class="news-item-date">📅 ${date}</span>
        `
        newsContent.appendChild(newsItem)
      })
    } else {
      throw new Error("No news items found")
    }
  } catch (error) {
    console.error("Failed to fetch global news:", error)
    newsContent.innerHTML = `
      <div class="news-loading">
        <p>Unable to load news.</p>
      </div>
    `
  }
}

// Fetch Thai News (Google News)
async function fetchThaiNews() {
  const newsContent = document.getElementById("thai-news-content")
  // Google News RSS for "Global Warming" in Thai
  const RSS_URL = "https://news.google.com/rss/search?q=โลกร้อน&hl=th&gl=TH&ceid=TH:th"
  const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`

  try {
    const response = await fetch(API_URL)
    const data = await response.json()

    if (data.status === "ok" && data.items.length > 0) {
      newsContent.innerHTML = "" // Clear loading state

      data.items.slice(0, 10).forEach((item) => {
        const newsItem = document.createElement("a")
        newsItem.className = "news-item"
        newsItem.href = item.link
        newsItem.target = "_blank"
        newsItem.rel = "noopener noreferrer"

        // Google News RSS doesn't usually provide images in a standard way that rss2json parses easily for thumbnails.
        // We'll use a generic environment placeholder or try to find one.
        // For now, let's use a random nature image from Unsplash to keep it looking good.
        const randomId = Math.floor(Math.random() * 1000)
        let imageUrl = `https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80&random=${randomId}`

        if (item.enclosure && item.enclosure.link) {
          imageUrl = item.enclosure.link
        }

        const date = new Date(item.pubDate).toLocaleDateString("th-TH", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })

        newsItem.innerHTML = `
          <img src="${imageUrl}" alt="${item.title}" loading="lazy">
          <h4>${item.title}</h4>
          <span class="news-item-date">📅 ${date}</span>
        `
        newsContent.appendChild(newsItem)
      })
    } else {
      throw new Error("No Thai news items found")
    }
  } catch (error) {
    console.error("Failed to fetch Thai news:", error)
    newsContent.innerHTML = `
      <div class="news-loading">
        <p>ไม่สามารถโหลดข่าวได้ในขณะนี้</p>
      </div>
    `
  }
}

// Intersection Observer for Fade-in Animations
const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
}

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1"
      entry.target.style.transform = "translateY(0)"
      observer.unobserve(entry.target)
    }
  })
}, observerOptions)

document.querySelectorAll("section").forEach((section) => {
  section.style.opacity = "0"
  section.style.transform = "translateY(20px)"
  section.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out"
  observer.observe(section)
})
