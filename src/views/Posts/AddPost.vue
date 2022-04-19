<template>
  <v-container>
    <h1 class="text-center mt-5 mb-9 text-h3">ADD NEW POST</h1>
    <first-step-form
      v-if="step === 1"
      @files-changed="filesChangedHandler"
      @completed="firstStepCompletedHandler"
    ></first-step-form>
    <second-step-form
      v-if="step === 2"
      @completed="secondStepCompletedHandler"
      @previous="goPreviousHandler"
    ></second-step-form>
  </v-container>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import Post from "../../models/post";
import FirstStepForm from "../../components/Posts/FirstStepForm.vue";
import SecondStepForm from "../../components/Posts/SecondStepForm.vue";
export default {
  name: "AddPost",
  data() {
    return {
      step: 1,
      filesChanged: false,
    };
  },
  computed: {
    ...mapGetters(["postBeingAdded"]),
  },
  components: { FirstStepForm, SecondStepForm },
  methods: {
    ...mapActions([
      "setCurrentPost",
      "cacheCurrentPost",
      "getCachedPost",
      "storeCurrentPost",
      "manageCurrentPostVideos",
      "setMode",
      "showFlash",
    ]),
    goPreviousHandler() {
      this.filesChanged = false;
      this.step = 1;
    },
    filesChangedHandler() {
      this.filesChanged = true;
    },
    async firstStepCompletedHandler() {
      if (this.filesChanged) {
        await this.manageCurrentPostVideos();
      }
      await this.cacheCurrentPost();
      this.step = 2;
    },
    async secondStepCompletedHandler() {
      this.storeCurrentPost();
      this.showFlash({
        message: "Post added successfully",
        color: "success",
      });
      this.$router.push({ name: "Home" });
    },
  },
  beforeDestroy() {
    this.setCurrentPost(null);
  },
  async created() {
    this.setMode("add");
    await this.getCachedPost();
    if (this.postBeingAdded !== null) {
      this.showFlash({
        message: "Please submit this post before you can create another one",
        color: "warning",
      });
      this.step = 2;
    } else {
      this.setCurrentPost(new Post());
    }
  },
};
</script>
