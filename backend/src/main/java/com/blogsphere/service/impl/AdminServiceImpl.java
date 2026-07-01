package com.blogsphere.service.impl;

import com.blogsphere.dto.AdminStatsDTO;
import com.blogsphere.dto.UserDTO;
import com.blogsphere.entity.Post;
import com.blogsphere.entity.User;
import com.blogsphere.exception.BlogAPIException;
import com.blogsphere.exception.ResourceNotFoundException;
import com.blogsphere.mapper.UserMapper;
import com.blogsphere.repository.CommentRepository;
import com.blogsphere.repository.LikeRepository;
import com.blogsphere.repository.PostRepository;
import com.blogsphere.repository.UserRepository;
import com.blogsphere.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private UserMapper userMapper;

    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UserDTO updateUserRole(Long targetUserId, String newRole) {
        User user = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", targetUserId));

        if (!"USER".equals(newRole) && !"ADMIN".equals(newRole)) {
            throw new BlogAPIException(HttpStatus.BAD_REQUEST, "Invalid role. Must be USER or ADMIN.");
        }

        user.setRole(newRole);
        User updated = userRepository.save(user);
        return userMapper.toDTO(updated);
    }

    @Override
    public void deleteUserAndCascade(Long targetUserId) {
        User user = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", targetUserId));

        userRepository.delete(user);
    }

    @Override
    public AdminStatsDTO getDashboardStats() {
        long postsCount = postRepository.count();
        long usersCount = userRepository.count();
        long commentsCount = commentRepository.count();
        long likesCount = likeRepository.count();

        // 1. Calculate Likes per category
        Map<String, Long> categoryLikesMap = new HashMap<>();
        List<Post> allPosts = postRepository.findAll();
        for (Post post : allPosts) {
            long pLikes = post.getLikes() != null ? post.getLikes().size() : 0;
            categoryLikesMap.put(post.getCategory(), 
                categoryLikesMap.getOrDefault(post.getCategory(), 0L) + pLikes);
        }

        List<AdminStatsDTO.CategoryLikes> popularCategories = categoryLikesMap.entrySet().stream()
                .map(entry -> AdminStatsDTO.CategoryLikes.builder()
                        .name(entry.getKey())
                        .likes(entry.getValue())
                        .build())
                .collect(Collectors.toList());

        // 2. Post counts by author
        Map<String, Long> authorPostsMap = new HashMap<>();
        for (Post post : allPosts) {
            String authorName = post.getAuthor() != null ? post.getAuthor().getName() : "Anonymous";
            authorPostsMap.put(authorName, authorPostsMap.getOrDefault(authorName, 0L) + 1);
        }

        List<AdminStatsDTO.AuthorPosts> authorsStats = authorPostsMap.entrySet().stream()
                .map(entry -> AdminStatsDTO.AuthorPosts.builder()
                        .name(entry.getKey())
                        .posts(entry.getValue())
                        .build())
                .collect(Collectors.toList());

        return AdminStatsDTO.builder()
                .summary(AdminStatsDTO.Summary.builder()
                        .posts(postsCount)
                        .users(usersCount)
                        .comments(commentsCount)
                        .likes(likesCount)
                        .build())
                .popularCategories(popularCategories)
                .authorsStats(authorsStats)
                .build();
    }
}
