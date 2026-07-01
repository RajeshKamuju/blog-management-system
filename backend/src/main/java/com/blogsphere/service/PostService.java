package com.blogsphere.service;

import com.blogsphere.dto.PostDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface PostService {
    PostDTO createPost(PostDTO postDTO, Long userId);
    PostDTO updatePost(PostDTO postDTO, Long postId, Long userId, String userRole);
    void deletePost(Long postId, Long userId, String userRole);
    PostDTO getPostById(Long postId, Long currentUserId);
    
    Page<PostDTO> getAllPosts(String category, String search, Long authorId, Pageable pageable, Long currentUserId);
    List<PostDTO> searchPostsFlat(String query);
    
    Long likePost(Long postId, Long userId);
    Long unlikePost(Long postId, Long userId);
    Boolean getLikeStatus(Long postId, Long userId);
    
    List<Map<String, Object>> getCategories();
    List<Map<String, Object>> getTags();
}
