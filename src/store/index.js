import Vue from "vue";
import Vuex from "vuex";
import Video from "../models/video";
import { v4 as uuidv4 } from "uuid";
import * as firebaseDB from "firebase/database";
import * as firebaseStorage from "firebase/storage";
import { db, storage } from "../firebase";
import Post from "../models/post";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    currentPost: {
      add: null,
      edit: null,
    },
    mode: null,
    flash: {
      color: "",
      message: "",
      show: false,
    },
  },
  getters: {
    flash(state) {
      return state.flash;
    },
    posts(state) {
      return state.posts;
    },
    currentPost(state) {
      return state.currentPost;
    },
    postBeingAdded(state) {
      return state.currentPost.add;
    },
    postBeingEdited(state) {
      return state.currentPost.edit;
    },
    mode(state) {
      return state.mode;
    },
  },
  mutations: {
    SHOW_FLASH(state, payload) {
      state.flash = { ...payload, show: true };
    },
    HIDE_FLASH(state) {
      state.flash.show = false;
    },
    SET_MODE(state, mode) {
      state.mode = mode;
    },
    SET_POSTS(state, posts) {
      state.posts = posts;
    },
    SET_POST_BEING_ADDED(state, post) {
      state.currentPost.add = post;
    },
    SET_CURRENT_POST(state, post) {
      state.currentPost[state.mode] = post;
    },
    UPDATE_CURRENT_POST(state, { prop, value }) {
      state.currentPost[state.mode][prop] = value;
    },
    REMOVE_POST(state, postId) {
      delete state.posts[postId];
      state.posts = { ...state.posts };
    },
    UPDATE_CURRENT_POST_VIDEO(state, { videoId, prop, value }) {
      state.currentPost[state.mode].videos[videoId][`set${prop}`](value);
    },
    INITIALIZE_CURRENT_POST_VIDEO_DURATION(state, { videoId, duration }) {
      state.currentPost[state.mode].videos[videoId].setInitialDuration(
        duration
      );
    },
    DELETE_CURRENT_POST_VIDEO(state, videoId) {
      delete state.currentPost[state.mode].videos[videoId];
    },
    ADD_VIDEO_TO_CURRENT_POST(state, { videoId, type, url }) {
      state.currentPost[state.mode].videos = {
        ...state.currentPost[state.mode].videos,
        [videoId]: new Video(type, url),
      };
    },
  },
  actions: {
    showFlash({ commit }, payload) {
      commit("SHOW_FLASH", payload);
      setTimeout(() => {
        commit("HIDE_FLASH");
      }, 5000);
    },
    hideFlash({ commit }) {
      commit("HIDE_FLASH");
    },
    async getPosts({ commit }) {
      const dbRef = firebaseDB.ref(db);
      const snapshot = await firebaseDB.get(firebaseDB.child(dbRef, "posts"));
      if (snapshot.exists()) {
        commit("SET_POSTS", snapshot.val());
      }
    },
    async cacheCurrentPost({ state }) {
      await firebaseDB.update(
        firebaseDB.ref(db, `postsCache`),
        state.currentPost.add.getDataToStore()
      );
    },
    async getCachedPost({ commit }) {
      const dbRef = firebaseDB.ref(db);
      const snapshot = await firebaseDB.get(
        firebaseDB.child(dbRef, "postsCache")
      );
      if (snapshot.exists()) {
        const post = new Post();
        const data = snapshot.val();
        post.initialize({ ...data });
        commit("SET_POST_BEING_ADDED", post);
      } else {
        commit("SET_POST_BEING_ADDED", null);
      }
    },
    async storeCurrentPost({ state }) {
      const postId =
        state.mode === "add" ? uuidv4() : state.currentPost.edit.id;
      await firebaseDB.update(
        firebaseDB.ref(db, `posts/${postId}`),
        state.currentPost[state.mode].getDataToStore()
      );
      await firebaseDB.remove(firebaseDB.ref(db, `postsCache`));
    },
    async manageCurrentPostVideos({ commit, state }) {
      const oldVideos = { ...state.currentPost[state.mode].videos };
      //Store new videos
      for (const file of state.currentPost[state.mode].files) {
        const videoId = uuidv4();
        const storageRef = firebaseStorage.ref(storage, `videos/${videoId}`);
        await firebaseStorage.uploadBytes(storageRef, file);
        // Get new videos urls
        const url = await firebaseStorage.getDownloadURL(
          firebaseStorage.ref(storage, `videos/${videoId}`)
        );
        commit("ADD_VIDEO_TO_CURRENT_POST", { videoId, type: file.type, url });
      }
      //Delete old videos
      for (const videoId in oldVideos) {
        const desertRef = firebaseStorage.ref(storage, `videos/${videoId}`);
        await firebaseStorage.deleteObject(desertRef);
        commit("DELETE_CURRENT_POST_VIDEO", videoId);
      }
    },
    async setPostToEdit({ commit }, postId) {
      const dbRef = firebaseDB.ref(db);
      const snapshot = await firebaseDB.get(
        firebaseDB.child(dbRef, `posts/${postId}`)
      );
      if (snapshot.exists()) {
        const post = new Post();
        post.initialize({ ...snapshot.val(), id: postId });
        commit("SET_CURRENT_POST", post);
      }
    },
    async deletePost({ commit, state }, postId) {
      const post = state.posts[postId];
      await Promise.all(
        Object.keys(post.videos).map(async (videoId) => {
          const desertRef = firebaseStorage.ref(storage, `videos/${videoId}`);
          await firebaseStorage.deleteObject(desertRef);
        })
      );
      await firebaseDB.remove(firebaseDB.ref(db, `posts/${postId}`));
      commit("REMOVE_POST", postId);
    },
    initializeCurrentPostVideoDuration({ commit }, payload) {
      commit("INITIALIZE_CURRENT_POST_VIDEO_DURATION", payload);
    },
    setCurrentPost({ commit }, postId) {
      commit("SET_CURRENT_POST", postId);
    },
    updateCurrentPost({ commit }, payload) {
      commit("UPDATE_CURRENT_POST", payload);
    },
    updateCurrentPostVideo({ commit }, payload) {
      commit("UPDATE_CURRENT_POST_VIDEO", payload);
    },
    setMode({ commit }, mode) {
      commit("SET_MODE", mode);
    },
  },
});
