<template>
  <v-card class="pa-5" elevation="3">
    <v-form ref="form" v-model="valid" v-if="currentPost[mode] !== null">
      <template v-for="(video, key, index) in currentPost[mode].videos">
        <template v-if="video.url">
          <v-row :key="`video-${key}`" justify="center">
            <v-col cols="12" sm="4">
              <video
                controls
                width="100%"
                @loadedmetadata="getVideoDuration($event, key)"
              >
                <source :src="video.url" :type="video.type" />
              </video>
            </v-col>
          </v-row>
          <v-row :key="`inputs-${key}`">
            <v-col cols="4">
              <v-text-field
                label="Video duration"
                :value="video.customDuration"
                @input="
                  videoPropertyChangedHandler($event, key, 'CustomDuration')
                "
                :rules="video.getValidationRules().customDuration"
                rounded
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                label="Start"
                :value="video.start"
                @input="videoPropertyChangedHandler($event, key, 'Start')"
                :rules="video.getValidationRules().start"
                rounded
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                label="End"
                :value="video.end"
                @input="videoPropertyChangedHandler($event, key, 'End')"
                :rules="video.getValidationRules().end"
                rounded
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
          <v-divider
            class="mb-7"
            :key="`divider-${key}`"
            v-if="Object.keys(currentPost[mode].videos).length - 1 !== index"
          ></v-divider>
        </template>
      </template>
      <v-row class="mt-0">
        <v-col cols="auto">
          <v-btn color="black" dark outlined rounded @click="previous">
            Previous
          </v-btn>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="auto">
          <v-btn
            :disabled="!valid || loading"
            :loading="loading"
            color="black"
            rounded
            @click="submit"
            class="white--text"
            >Submit</v-btn
          >
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      videos: [],
      valid: false,
      loading: false,
    };
  },
  computed: {
    ...mapState(["currentPost", "mode"]),
  },
  methods: {
    ...mapActions([
      "setCurrentPost",
      "updateCurrentPostVideo",
      "setCurrentPostVideosUrls",
      "initializeCurrentPostVideoDuration",
    ]),
    videoPropertyChangedHandler(event, videoId, prop) {
      this.updateCurrentPostVideo({
        videoId,
        prop,
        value: event,
      });
    },
    previous() {
      this.$emit("previous");
    },
    submit() {
      this.loading = true;
      this.$emit("completed");
    },
    getVideoDuration(event, videoId) {
      if (!this.currentPost[this.mode].videos[videoId].initialDuration) {
        this.initializeCurrentPostVideoDuration({
          videoId,
          duration: event.target.duration,
        });
      }
    },
  },
};
</script>
