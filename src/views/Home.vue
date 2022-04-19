<template>
  <v-container>
    <v-tooltip left>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          fixed
          right
          bottom
          fab
          dark
          small
          color="black"
          @click="$router.push({ name: 'AddPost' })"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon dark>mdi-plus</v-icon>
        </v-btn>
      </template>
      <span>Add new post</span>
    </v-tooltip>
    <v-row>
      <v-col cols="12" v-if="Object.keys(posts).length === 0 && !loading">
        <div class="text-center text-h5">No post found !</div>
      </v-col>
      <v-col cols="12" v-if="loading">
        <div class="text-center">
          <v-progress-circular
            indeterminate
            color="black"
          ></v-progress-circular>
        </div>
      </v-col>
      <v-col
        v-for="(post, postId) in posts"
        :key="`post-${postId}`"
        cols="12"
        sm="6"
        md="4"
      >
        <post :post="post" :postId="postId" @delete="showDeleteDialog"></post>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          DELETE POST
        </v-card-title>
        <v-card-text class="pa-6 text-center">
          Are you sure you want to delete this post ?
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="black" text rounded @click="dialog = false"
            >Cancel</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            class="white--text"
            rounded
            @click="deletePostHandler"
            :disabled="deleteButtonLoading"
            :loading="deleteButtonLoading"
            >Delete</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Post from "../components/Posts/Post.vue";
export default {
  name: "Home",
  data() {
    return {
      loading: true,
      dialog: false,
      postToDelete: null,
      deleteButtonLoading: false,
    };
  },
  components: { Post },
  computed: {
    ...mapGetters(["posts"]),
  },
  methods: {
    ...mapActions(["getPosts", "deletePost", "showFlash"]),
    showDeleteDialog(postId) {
      this.postToDelete = postId;
      this.dialog = true;
    },
    async deletePostHandler() {
      this.deleteButtonLoading = true;
      await this.deletePost(this.postToDelete);
      this.showFlash({
        message: "Post deleted successfully",
        color: "success",
      });
      this.dialog = false;
      this.deleteButtonLoading = false;
    },
  },
  async created() {
    await this.getPosts();
    this.loading = false;
  },
};
</script>
