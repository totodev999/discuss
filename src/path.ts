export const paths = {
  homePath() {
    return '/';
  },
  topicShow(topicSlug: string) {
    return `/topics/${topicSlug}`;
  },
  postShowPath(postSlug: string, postId: string) {
    return `/topics/${postSlug}/posts/${postId}`;
  },
  postCreatePath(topicSlug: string) {
    return `/topics/${topicSlug}/posts/new`;
  },
};
