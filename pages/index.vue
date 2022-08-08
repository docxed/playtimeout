<template>
  <v-row justify="center" align="center">
    <v-overlay :value="overlay">
      <v-card elevation="24" loading outlined light>
        <v-card-text> กำลังเชื่อมต่อ... </v-card-text>
      </v-card>
    </v-overlay>
    <alert :alertData.sync="alertData" />
    <v-col sm="12" md="7" lg="7">
      <div class="text-h4 mb-5">⏰ จับเวลาเล่นเกม</div>
      <div class="box text-center mb-5" style="background-color: #ffffff">
        <div class="black--text" style="font-size: 5rem">{{ timeConvert(millisecond) }}</div>

        <div class="mb-3">
          <div v-if="stage === null">
            <v-btn color="dark" x-large @click="startTimer()">เริ่ม</v-btn>
          </div>
          <div v-else-if="stage === 'start'">
            <v-btn color="error" x-large @click="stopTimer()">หยุด</v-btn>
          </div>
          <div v-else-if="stage === 'stop'">
            <v-btn color="info" x-large @click="startTimer()">ดำเนินการต่อ</v-btn>
          </div>
        </div>
      </div>
      <div class="mb-2">
        <v-select
          v-model="player"
          prepend-icon="mdi-account"
          :items="['องศา', 'น้องอัญ']"
          filled
          @change="changePlayer()"
          label="ผู้เล่น"
        ></v-select>
      </div>
      <div class="mb-2">
        <v-row>
          <v-col sm="3">
            <v-text-field
              v-model="setHour"
              type="number"
              min="1"
              max="23"
              label="จำนวนชั่วโมง"
              filled
              dense
            ></v-text-field>
          </v-col>
          <v-col class="">
            <v-btn class="mb-1" color="primary" @click="increaseTimer({ type: 'hour' })"
              >บวกชั่วโมง</v-btn
            >
            <v-btn class="mb-1" color="error" @click="decreaseTimer({ type: 'hour' })"
              >ลบชั่วโมง</v-btn
            >
          </v-col>
        </v-row>
      </div>
      <div class="mb-2">
        <v-row>
          <v-col sm="3">
            <v-text-field
              v-model="setMinute"
              type="number"
              min="1"
              max="59"
              label="จำนวนนาที"
              filled
              dense
            ></v-text-field>
          </v-col>
          <v-col class="">
            <v-btn class="mb-1" color="primary" @click="increaseTimer({ type: 'minute' })"
              >บวกนาที</v-btn
            >
            <v-btn class="mb-1" color="error" @click="decreaseTimer({ type: 'minute' })"
              >ลบนาที</v-btn
            >
          </v-col>
        </v-row>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import moment from "moment"
import axios from "axios"
const url = process.env.NUXT_ENV_PLAYTIMEOUT_ENDPOINT

moment.locale("th")
export default {
  name: "IndexPage",
  head() {
    return {
      title: `${this.timeConvert(this.millisecond)}`,
      meta: [
        {
          name: "description",
          content: "จับเวลาเล่นเกม",
        },
      ],
    }
  },
  mounted() {
    const player = localStorage.getItem("player")
    if (player) this.player = player
    this.helloBackend()
  },
  data: () => ({
    setHour: 3,
    setMinute: 5,
    millisecond: 3 * 60 * 60 * 1000,
    stage: null,
    player: "องศา",
    alertSuccess: false,
    alertData: {
      onDisplay: false,
      message: "",
      color: null,
    },
    overlay: false,
    startLoader: false,
  }),
  methods: {
    timeConvert(millisecond) {
      // milliseconds to hours, minutes and seconds
      return moment.utc(millisecond).format("HH:mm:ss")
    },
    startTimer() {
      this.stage = "start"
      this.timer = setInterval(() => {
        this.millisecond -= 1000
      }, 1000)
    },
    stopTimer() {
      this.stage = "stop"
      clearInterval(this.timer)
    },
    timeUp() {
      this.stage = null
      this.millisecond = 10 * 1000
      clearInterval(this.timer)
    },
    changePlayer() {
      localStorage.setItem("player", this.player)
    },
    increaseTimer(value) {
      this.overlay = true
      const { type } = value
      let word = ""
      let stickerPackageId = ""
      let stickerId = ""
      if (type === "hour") {
        this.millisecond += this.setHour * 60 * 60 * 1000
        word = "ชั่วโมง"
      } else if (type === "minute") {
        this.millisecond += this.setMinute * 60 * 1000
        word = "นาที"
      }

      const prefix = `${moment().format("LT")} น. |`
      let message = `${prefix} ➕ ${this.player} ได้ทำการบวก${word}เล่นเกม ${
        type === "hour" ? this.setHour : this.setMinute
      } ${word} เหลือเวลาเล่น ${moment.utc(this.millisecond).format("H:mm:ss")} ชั่วโมง`
      axios
        .post(`${url}/notify`, {
          message: message,
          stickerPackageId: stickerPackageId,
          stickerId: stickerId,
        })
        .then(() => {
          this.alertData = {
            onDisplay: true,
            message: "ส่งการแจ้งเตือน LINE สำเร็จ",
            color: "green",
          }
          this.overlay = false
        })
        .catch(() => {
          this.alertData = {
            onDisplay: true,
            message: "ส่งการแจ้งเตือน LINE ล้มเหลว",
            color: "red",
          }
          this.overlay = false
        })
    },
    decreaseTimer(value) {
      this.overlay = true
      const { type } = value
      let word = ""
      let stickerPackageId = ""
      let stickerId = ""
      if (type === "hour") {
        this.millisecond -= this.setHour * 60 * 60 * 1000
        word = "ชั่วโมง"
      } else if (type === "minute") {
        this.millisecond -= this.setMinute * 60 * 1000
        word = "นาที"
      }
      const prefix = `${moment().format("LT")} น. |`
      let message = `${prefix} ➖ ${this.player} ได้ทำการลบ${word}เล่นเกม ${
        type === "hour" ? this.setHour : this.setMinute
      } ${word} เหลือเวลาเล่น ${moment.utc(this.millisecond).format("H:mm:ss")} ชั่วโมง`
      axios
        .post(`${url}/notify`, {
          message: message,
          stickerPackageId: stickerPackageId,
          stickerId: stickerId,
        })
        .then(() => {
          this.alertData = {
            onDisplay: true,
            message: "ส่งการแจ้งเตือน LINE สำเร็จ",
            color: "green",
          }
          this.overlay = false
        })
        .catch(() => {
          this.alertData = {
            onDisplay: true,
            message: "ส่งการแจ้งเตือน LINE ล้มเหลว",
            color: "red",
          }
          this.overlay = false
        })
    },
    notifyTimer(value) {
      this.overlay = true
      const { type, time } = value
      const prefix = `${moment().format("LT")} น. |`
      let message = ""
      let stickerPackageId = ""
      let stickerId = ""

      if (type === "start timer") {
        let timeStart = new Date()
        let timeOut = timeStart.setSeconds(timeStart.getSeconds() + time / 1000)
        message = `${prefix} 🤣 ${this.player} เริ่มจับเวลาเล่นเกม ${moment
          .utc(time)
          .format("H:mm:ss")} ชั่วโมง และจะหมดเวลาเล่นใน ${moment(timeOut).format("LT")} น.`
        stickerPackageId = `446`
        stickerId = `1992`
      } else if (type === "pause timer") {
        message = `${prefix} ⏸️ ${this.player} หยุดจับเวลา และเหลือเวลาเล่นอีก ${moment
          .utc(time)
          .format("H:mm:ss")} ชั่วโมง`
      } else if (type === "resume timer") {
        message = `${prefix} ▶️ ${this.player} จับเวลาต่อ`
      } else if (type === "time up") {
        message = `${prefix} 🥲 ${this.player} หมดเวลาเล่นเกมแล้ว`
        stickerPackageId = `446`
        stickerId = `2007`
      }

      axios
        .post(`${url}/notify`, {
          message: message,
          stickerPackageId: stickerPackageId,
          stickerId: stickerId,
        })
        .then(() => {
          this.alertData = {
            onDisplay: true,
            message: "ส่งการแจ้งเตือน LINE สำเร็จ",
            color: "green",
          }
          this.overlay = false
        })
        .catch(() => {
          this.alertData = {
            onDisplay: true,
            message: "ส่งการแจ้งเตือน LINE ล้มเหลว",
            color: "red",
          }
          this.overlay = false
        })
    },
    helloBackend() {
      this.overlay = true
      axios
        .get(`${url}`)
        .then(() => {
          this.overlay = false
          this.alertData = {
            onDisplay: true,
            message: "เชื่อมต่อเซิร์ฟเวอร์สำเร็จ",
            color: "green",
          }
        })
        .catch(() => {
          this.overlay = false
          this.alertData = {
            onDisplay: true,
            message: "เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ",
            color: "red",
          }
        })
    },
  },
  watch: {
    millisecond(value) {
      if (value <= 0) this.timeUp()
    },
    stage(newValue, oldValue) {
      if (newValue === "start" && oldValue === null) {
        // start timer
        this.notifyTimer({ type: "start timer", time: this.millisecond })
      } else if (newValue === null) {
        // time up
        this.notifyTimer({ type: "time up", time: this.millisecond })
      } else if (newValue === "start") {
        // resume timer
        this.notifyTimer({ type: "resume timer", time: this.millisecond })
      } else if (newValue === "stop") {
        // pause timer
        this.notifyTimer({ type: "pause timer", time: this.millisecond })
      }
    },
  },
}
</script>

<style scoped>
body {
  font-family: "Kanit", sans-serif;
}
.box {
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.14);
  padding: 1rem;
  opacity: 1;
}
</style>
