import React, { useReducer, useCallback } from "react";
import toast from "react-hot-toast";
import PostContext from "./postContextInstance";
import { postService, categoryService } from "../services/api";

const postReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_POSTS":
      return {
        ...state,
        posts: action.payload.posts,
        pagination: action.payload.pagination,
        loading: false,
      };
    case "SET_CURRENT_POST":
      return { ...state, currentPost: action.payload, loading: false };
    case "SET_CATEGORIES":
      return { ...state, categories: action.payload };
    case "ADD_POST":
      return { ...state, posts: [action.payload, ...state.posts] };
    case "UPDATE_POST":
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === action.payload._id ? action.payload : post
        ),
        currentPost:
          state.currentPost?._id === action.payload._id
            ? action.payload
            : state.currentPost,
      };
    case "DELETE_POST":
      return {
        ...state,
        posts: state.posts.filter((post) => post._id !== action.payload),
      };
    case "ADD_COMMENT":
      return {
        ...state,
        currentPost:
          state.currentPost?._id === action.payload.postId
            ? {
                ...state.currentPost,
                comments: [
                  ...state.currentPost.comments,
                  action.payload.comment,
                ],
              }
            : state.currentPost,
      };
    default:
      return state;
  }
};

const initialState = {
  posts: [],
  currentPost: null,
  categories: [],
  loading: false,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
    hasNext: false,
    hasPrev: false,
  },
};

export const PostProvider = ({ children }) => {
  const [state, dispatch] = useReducer(postReducer, initialState);

  // ✅ Memoize fetchPosts to prevent infinite loop
  const fetchPosts = useCallback(async (params = {}) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const data = await postService.getAllPosts(params.page, params.limit);
      dispatch({
        type: "SET_POSTS",
        payload: {
          posts: data.posts,
          pagination: data.pagination,
        },
      });
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
      toast.error("Failed to fetch posts");
    }
  }, []);

  const fetchPost = async (slug) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const data = await postService.getPost(slug);
      dispatch({ type: "SET_CURRENT_POST", payload: data.post });
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
      toast.error("Failed to fetch post");
    }
  };

  const createPost = async (postData) => {
    try {
      const data = await postService.createPost(postData);
      dispatch({ type: "ADD_POST", payload: data.post });
      toast.success("Post created successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create post");
      throw error;
    }
  };

  const updatePost = async (id, postData) => {
    try {
      const data = await postService.updatePost(id, postData);
      dispatch({ type: "UPDATE_POST", payload: data.post });
      toast.success("Post updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update post");
      throw error;
    }
  };

  const deletePost = async (id) => {
    try {
      await postService.deletePost(id);
      dispatch({ type: "DELETE_POST", payload: id });
      toast.success("Post deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete post");
      throw error;
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      dispatch({ type: "SET_CATEGORIES", payload: data.categories });
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  const addComment = async (postId, content) => {
    try {
      const data = await postService.addComment(postId, { content });
      dispatch({
        type: "ADD_COMMENT",
        payload: { postId, comment: data.comment },
      });
      toast.success("Comment added successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add comment");
      throw error;
    }
  };

  const searchPosts = async (query) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const data = await postService.searchPosts(query);
      dispatch({
        type: "SET_POSTS",
        payload: {
          posts: data.posts,
          pagination: data.pagination,
        },
      });
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
      toast.error("Search failed");
    }
  };

  return (
    <PostContext.Provider
      value={{
        ...state,
        fetchPosts,
        fetchPost,
        createPost,
        updatePost,
        deletePost,
        fetchCategories,
        addComment,
        searchPosts,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
