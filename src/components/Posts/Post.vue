<template>
  <v-card class="pa-5" elevation="3">
    <v-card-title>{{ post.title }}</v-card-title>
    <v-card-subtitle>
      <small>{{ post.createdAt | moment("dddd, MMMM Do YYYY") }}</small>
    </v-card-subtitle>
    <v-card-text>{{ post.content }}</v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="mr-2"
            fab
            dark
            x-small
            color="blue"
            @click="$router.push({ name: 'EditPost', params: { id: postId } })"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon dark>mdi-pencil</v-icon>
          </v-btn>
        </template>
        <span>Edit post</span>
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            fab
            dark
            x-small
            color="red"
            @click="deleteHandler()"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon dark>mdi-delete</v-icon>
          </v-btn>
        </template>
        <span>Delete post</span>
      </v-tooltip>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  props: {
    postId: String,
    post: Object,
  },
  methods: {
    deleteHandler() {
      this.$emit("delete", this.postId);
    },
  },
};
</script>
