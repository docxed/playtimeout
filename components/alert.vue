<template>
  <div>
    <v-snackbar v-model="alertData.onDisplay" :color="alertData.color" right :timeout="2000">
      {{ alertData.message }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="alertData.onDisplay = false">
          <v-icon dense>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
export default {
  props: {
    alertData: {
      type: Object,
      required: true,
    },
  },
  data: () => ({}),
}
</script>
