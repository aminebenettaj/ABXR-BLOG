<template>
  <v-card class="pa-5" elevation="3">
    <v-form v-model="valid" v-if="currentPost[mode] !== null">
      <v-text-field
        label="Title"
        :value="currentPost[mode].title"
        @input="postPropertyChangedHandler($event, 'title')"
        :rules="currentPost[mode].getValidationRules().title"
        rounded
        outlined
      ></v-text-field>
      <v-textarea
        label="Content"
        :value="currentPost[mode].content"
        @input="postPropertyChangedHandler($event, 'content')"
        :rules="currentPost[mode].getValidationRules().content"
        rounded
        outlined
      ></v-textarea>
      <v-file-input
        small-chips
        multiple
        label="Videos"
        counter
        show-size
        :value="currentPost[mode].files"
        @change="postPropertyChangedHandler($event, 'files')"
        :rules="currentPost[mode].getValidationRules().files(mode)"
        rounded
        outlined
      ></v-file-input>
      <v-row class="mt-0">
        <v-spacer></v-spacer>
        <v-col cols="auto">
          <v-btn
            :disabled="!valid || loading"
            :loading="loading"
            color="black"
            @click="validate"
            rounded
            class="white--text"
          >
            {{ mode === "add" ? "Next" : "Save" }}
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      valid: true,
      loading: false,
    };
  },
  computed: {
    ...mapGetters(["currentPost", "mode"]),
  },
  methods: {
    ...mapActions(["updateCurrentPost"]),
    postPropertyChangedHandler(event, prop) {
      if (prop === "files") {
        this.$emit("files-changed");
      }
      this.updateCurrentPost({
        prop,
        value: event,
      });
    },
    validate() {
      this.loading = true;
      this.$emit("completed");
    },
  },
};
</script>
