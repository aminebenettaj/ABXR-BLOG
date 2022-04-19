<template>
  <v-container>
    <h1 class="text-center mt-5 mb-9 text-h3">EDIT POST</h1>
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
import { mapActions } from "vuex";
import FirstStepForm from "../../components/Posts/FirstStepForm.vue";
import SecondStepForm from "../../components/Posts/SecondStepForm.vue";
export default {
  name: "EditPost",
  data() {
    return {
      step: 1,
      filesChanged: false,
    };
  },
  components: { FirstStepForm, SecondStepForm },
  methods: {
    ...mapActions([
      "setCurrentPost",
      "storeCurrentPost",
      "deleteCurrentPostOldVideos",
      "storeCurrentPostNewVideos",
      "setCurrentPostVideosUrls",
      "setPostToEdit",
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
        await this.deleteCurrentPostOldVideos();
        await this.storeCurrentPostNewVideos();
        await this.setCurrentPostVideosUrls();
      }
      this.step = 2;
    },
    async secondStepCompletedHandler() {
      this.storeCurrentPost();
      this.showFlash({
        message: "Post edited successfully",
        color: "success",
      });
      this.$router.push({ name: "Home" });
    },
  },
  beforeDestroy() {
    this.setCurrentPost(null);
  },
  created() {
    this.setMode("edit");
    this.setPostToEdit(this.$route.params.id);
  },
};
</script>
