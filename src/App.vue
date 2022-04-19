<template>
  <v-app>
    <v-app-bar app fixed color="black" dark elevation="3">
      <v-app-bar-nav-icon
        @click="drawer = true"
        class="d-sm-none"
      ></v-app-bar-nav-icon>
      <v-toolbar-title>ABXR STUDIO BLOG</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            class="d-none d-sm-block"
            @click="$router.push({ name: 'AddPost' }).catch(() => {})"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>Add new post</span>
      </v-tooltip>
      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            class="d-none d-sm-block"
            @click="$router.push({ name: 'Home' }).catch(() => {})"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-home</v-icon>
          </v-btn>
        </template>
        <span>Home</span>
      </v-tooltip>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list nav dense>
        <v-list-item-group
          v-model="group"
          active-class="deep-purple--text text--accent-4"
        >
          <v-list-item @click="$router.push({ name: 'Home' }).catch(() => {})">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>

          <v-list-item
            @click="$router.push({ name: 'AddPost' }).catch(() => {})"
          >
            <v-list-item-icon>
              <v-icon>mdi-plus</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Add new post</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-main class="grey lighten-4">
      <router-view />
    </v-main>
    <v-fade-transition>
      <v-card
        elevation="3"
        :color="flash.color"
        v-if="flash.show"
        class="flash pa-5 text-center"
        dark
        @click="hideFlash"
      >
        {{ flash.message }}
      </v-card>
    </v-fade-transition>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "App",
  errorCaptured(error) {
    console.error(error);
    this.showFlash({
      message: "An error has occurred, please try again later",
      color: "error",
    });
    this.$router.push({ name: "Home" });
  },
  data() {
    return { drawer: false, group: null };
  },
  computed: {
    ...mapGetters(["flash"]),
  },
  methods: {
    ...mapActions(["showFlash", "hideFlash"]),
  },
};
</script>
<style scoped>
.flash {
  position: fixed;
  bottom: 12px;
  left: 12px;
  margin: 0;
  width: calc(100% - 24px);
  z-index: 5;
}
</style>
