<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" fixed app>
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
          :disabled="$store.state.overlayData.isOpen"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
      <v-spacer />
    </v-app-bar>
    <v-main>
      <v-container class="my-5">
        <v-overlay :value="$store.state.overlayData.isOpen">
          <v-card elevation="24" outlined light>
            <v-card-title v-if="$store.state.overlayData.title">
              {{ $store.state.overlayData.title }}
            </v-card-title>
            <v-card-text v-if="$store.state.overlayData.text">{{
              $store.state.overlayData.text
            }}</v-card-text>
          </v-card>
        </v-overlay>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "DefaultLayout",
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: "mdi-clock",
          title: "จับเวลา",
          to: "/",
        },
        {
          icon: "mdi-reload",
          title: "สุ่มผู้เล่น",
          to: "/random",
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "⏰ จับเวลาเล่นเกม",
      overlayData: {
        onDisplay: false,
        message: "",
      },
    }
  },
  methods: {},
}
</script>
