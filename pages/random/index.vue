<template>
  <v-row justify="center" align="center">
    <v-overlay :value="overlay">
      <v-card elevation="24" loading outlined light>
        <v-card-text> กำลังเชื่อมต่อ... </v-card-text>
      </v-card>
    </v-overlay>
    <alert :alertData.sync="alertData" />
    <v-col sm="12" md="7" lg="7">
      <div class="text-h4 mb-5">🍀 สุ่มผู้เล่น</div>
      <div class="box text-center mb-5" style="background-color: #ffffff">
        <div class="black--text" style="font-size: 3rem" v-if="$vuetify.breakpoint.xs">
          {{ player ? `🎉 ${player} 🎉` : effect }}
        </div>
        <div class="black--text" style="font-size: 5rem" v-else>
          {{ player ? `🎉 ${player} 🎉` : effect }}
        </div>
        <div class="mb-3">
          <div>
            <v-btn color="warning" x-large @click="randomPlayer()" :loading="loading">สุ่ม</v-btn>
          </div>
        </div>
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
  head() {
    return {
      title: this.player ? `🎉 ${this.player} 🎉` : this.effect,
      meta: [
        {
          name: "description",
          content: "จับเวลาเล่นเกม",
        },
      ],
    }
  },
  data: () => ({
    player: "",
    effect: "🍀",
    players: ["องศา", "น้องอัญ"],
    loading: false,
    overlay: false,
    alertData: {
      onDisplay: false,
      message: "",
      color: null,
    },
    emojis: [
      "องศา",
      "น้องอัญ",
      "😂",
      "😝",
      "😁",
      "😱",
      "👉",
      "🙌",
      "🍻",
      "🔥",
      "🌈",
      "🎈",
      "🌹",
      "💄",
      "🎀",
      "⚽",
      "🎾",
      "🏁",
      "😡",
      "👿",
      "🐻",
      "🐶",
      "🐬",
      "🐟",
      "🍀",
      "👀",
      "🚗",
      "🍎",
      "💝",
      "💙",
      "👌",
      "😍",
      "😉",
      "😓",
      "😳",
      "💪",
      "💩",
      "🍸",
      "🔑",
      "💖",
      "🌟",
      "🎉",
      "🌺",
      "🎶",
      "👠",
      "🏈",
      "⚾",
      "🏆",
      "👽",
      "💀",
      "🐵",
      "🐮",
      "🐩",
      "🐎",
      "💣",
      "👃",
      "👂",
      "🍓",
      "💘",
      "💜",
      "👊",
      "💋",
      "😘",
      "😜",
      "😵",
      "🙏",
      "👋",
      "🚽",
      "💃",
      "💎",
      "🚀",
      "🌙",
      "🎁",
      "⛄",
      "🌊",
      "⛵",
      "🏀",
      "🎱",
      "💰",
      "👶",
      "👸",
      "🐰",
      "🐷",
      "🐍",
      "🐫",
      "🔫",
      "👄",
      "🚲",
      "🍉",
      "💛",
      "💚",
    ],
  }),
  methods: {
    randomPlayer() {
      this.loading = true
      this.player = ""
      let playEffect
      playEffect = setInterval(() => {
        this.effect = this.emojis[Math.floor(Math.random() * this.emojis.length)]
      }, 100)
      setTimeout(() => {
        this.player = this.players[Math.floor(Math.random() * this.players.length)]
        clearInterval(playEffect)
        this.loading = false
        this.notify()
      }, 10 * 1000)
    },
    notify() {
      this.overlay = true
      const prefix = `${moment().format("LT")}  น. |`
      let message = ""
      let stickerPackageId = ""
      let stickerId = ""
      message = `${prefix} 🎉 ${this.player} ชนะ ในการสุ่มครั้งนี้ 🎉`
      axios
        .post(`${url}/notify`, {
          message: message,
          stickerPackageId: stickerPackageId,
          stickerId: stickerId,
        })
        .then(() => {
          this.overlay = false
          this.alertData = {
            onDisplay: true,
            message: "ส่งการแจ้งเตือน LINE สำเร็จ",
            color: "green",
          }
        })
        .catch(() => {
          this.overlay = false
          this.alertData = {
            onDisplay: true,
            message: "ส่งการแจ้งเตือน LINE ล้มเหลว",
            color: "red",
          }
        })
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
