package com.blogsphere.service.impl;

import com.blogsphere.dto.PostDTO;
import com.blogsphere.entity.Like;
import com.blogsphere.entity.Post;
import com.blogsphere.entity.User;
import com.blogsphere.exception.BlogAPIException;
import com.blogsphere.exception.ResourceNotFoundException;
import com.blogsphere.mapper.PostMapper;
import com.blogsphere.repository.LikeRepository;
import com.blogsphere.repository.PostRepository;
import com.blogsphere.repository.UserRepository;
import com.blogsphere.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PostServiceImpl implements PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private PostMapper postMapper;

    @Override
    public PostDTO createPost(PostDTO postDTO, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Post post = Post.builder()
                .title(postDTO.getTitle())
                .content(postDTO.getContent())
                .excerpt(postDTO.getExcerpt())
                .category(postDTO.getCategory())
                .imageUrl(postDTO.getImageUrl() != null ? postDTO.getImageUrl() : "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1200")
                .author(user)
                .build();

        Post savedPost = postRepository.save(post);
        return postMapper.toDTO(savedPost);
    }

    @Override
    public PostDTO updatePost(PostDTO postDTO, Long postId, Long userId, String userRole) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));

        // Authorize: Only Author or Administrator can update
        if (!post.getAuthor().getId().equals(userId) && !"ADMIN".equals(userRole)) {
            throw new BlogAPIException(HttpStatus.FORBIDDEN, "You are not authorized to edit this post");
        }

        post.setTitle(postDTO.getTitle());
        post.setContent(postDTO.getContent());
        if (postDTO.getExcerpt() != null) {
            post.setExcerpt(postDTO.getExcerpt());
        } else {
            post.setExcerpt(postDTO.getContent().length() > 150 ? postDTO.getContent().substring(0, 150) + "..." : postDTO.getContent());
        }
        if (postDTO.getImageUrl() != null) {
            post.setImageUrl(postDTO.getImageUrl());
        }
        post.setCategory(postDTO.getCategory());
        post.setUpdatedAt(LocalDateTime.now());

        Post updatedPost = postRepository.save(post);
        return postMapper.toDTO(updatedPost);
    }

    @Override
    public void deletePost(Long postId, Long userId, String userRole) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));

        // Authorize: Only Author or Administrator can delete
        if (!post.getAuthor().getId().equals(userId) && !"ADMIN".equals(userRole)) {
            throw new BlogAPIException(HttpStatus.FORBIDDEN, "You are not authorized to delete this post");
        }

        postRepository.delete(post);
    }

    @Override
    public PostDTO getPostById(Long postId, Long currentUserId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));

        PostDTO dto = postMapper.toDTO(post);
        if (currentUserId != null) {
            dto.setLikedByCurrentUser(likeRepository.existsByPostIdAndUserId(postId, currentUserId));
        }
        return dto;
    }

    @Override
    public Page<PostDTO> getAllPosts(String category, String search, Long authorId, Pageable pageable, Long currentUserId) {
        Page<Post> posts;

        if (category != null && !category.trim().isEmpty()) {
            posts = postRepository.findByCategoryIgnoreCase(category, pageable);
        } else if (search != null && !search.trim().isEmpty()) {
            posts = postRepository.searchPosts(search, pageable);
        } else if (authorId != null) {
            posts = postRepository.findByAuthorId(authorId, pageable);
        } else {
            posts = postRepository.findAll(pageable);
        }

        return posts.map(post -> {
            PostDTO dto = postMapper.toDTO(post);
            if (currentUserId != null) {
                dto.setLikedByCurrentUser(likeRepository.existsByPostIdAndUserId(post.getId(), currentUserId));
            }
            return dto;
        });
    }

    @Override
    public List<PostDTO> searchPostsFlat(String query) {
        List<Post> posts = postRepository.searchPostsFlat(query);
        return posts.stream().map(postMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public Long likePost(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (likeRepository.existsByPostIdAndUserId(postId, userId)) {
            throw new BlogAPIException(HttpStatus.BAD_REQUEST, "Post already liked");
        }

        Like like = Like.builder()
                .post(post)
                .user(user)
                .build();

        likeRepository.save(like);
        return likeRepository.countByPostId(postId);
    }

    @Override
    public Long unlikePost(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));

        Like like = likeRepository.findByPostIdAndUserId(postId, userId)
                .orElseThrow(() -> new BlogAPIException(HttpStatus.BAD_REQUEST, "Post has not been liked by this user"));

        likeRepository.delete(like);
        return likeRepository.countByPostId(postId);
    }

    @Override
    public Boolean getLikeStatus(Long postId, Long userId) {
        if (userId == null) return false;
        return likeRepository.existsByPostIdAndUserId(postId, userId);
    }

    @Override
    public List<Map<String, Object>> getCategories() {
        List<Object[]> results = postRepository.countPostsByCategory();
        List<Map<String, Object>> categoriesList = new ArrayList<>();
        
        for (Object[] row : results) {
            Map<String, Object> map = new HashMap<>();
            map.put("name", row[0]);
            map.put("count", row[1]);
            categoriesList.add(map);
        }
        return categoriesList;
    }

    @Override
    public List<Map<String, Object>> getTags() {
        // Mocking tags since tags table isn't needed for this simple setup,
        // but can extract tags from custom list or return generic categories.
        String[] mockTags = {"tech", "webdev", "architecture", "design", "cleancode", "springboot", "java", "travel", "nature"};
        List<Map<String, Object>> tagsList = new ArrayList<>();
        Random random = new Random();
        for (String tag : mockTags) {
            Map<String, Object> map = new HashMap<>();
            map.put("name", tag);
            map.put("count", random.nextInt(5) + 1);
            tagsList.add(map);
        }
        return tagsList;
    }
}
