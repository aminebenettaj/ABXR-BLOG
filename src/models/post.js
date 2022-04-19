import Video from "./video";
export default class Post {
  constructor(
    id = null,
    title = "",
    content = "",
    files = [],
    videos = {},
    createdAt = null
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.files = files;
    this.videos = videos;
    this.createdAt = createdAt;
  }

  getValidationRules() {
    return {
      title: [(value) => !!value || "This field is required"],
      content: [(value) => !!value || "This field is required"],
      files: (mode) => {
        if (mode === "edit" || Object.keys(this.videos).length > 0) {
          return [
            (value) => {
              for (const file of value) {
                const ext = file.name.split(".").pop();
                if (!/^(mp4|avi|mpg|mpeg|amv|org|ogg)$/.test(ext)) {
                  return "Invalid file";
                }
              }
              return true;
            },
          ];
        } else {
          return [
            (value) => {
              if (value.length === 0) {
                return "Please upload some videos";
              }
              for (const file of value) {
                const ext = file.name.split(".").pop();
                if (!/^(mp4|avi|mpg|mpeg|amv|org|ogg)$/.test(ext)) {
                  return "Invalid file";
                }
              }
              return true;
            },
          ];
        }
      },
    };
  }

  initialize(data) {
    this.id = data.id ?? null;
    this.title = data.title;
    this.content = data.content;
    this.createdAt = data.createdAt;
    for (const videoId in data.videos) {
      this.videos[videoId] = new Video(
        data.videos[videoId].type,
        data.videos[videoId].url,
        data.videos[videoId].initialDuration,
        data.videos[videoId].customDuration,
        data.videos[videoId].start,
        data.videos[videoId].end
      );
    }
  }

  getDataToStore() {
    return {
      title: this.title,
      content: this.content,
      videos: this.videos,
      createdAt: this.createdAt !== null ? this.createdAt : Date.now(),
    };
  }

  copy() {
    return new Post(
      this.id,
      this.title,
      this.content,
      this.files,
      this.videos,
      this.createdAt
    );
  }
}
