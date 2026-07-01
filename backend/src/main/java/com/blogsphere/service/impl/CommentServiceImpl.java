package com.blogsphere.service.impl;

import com.blogsphere.dto.CommentDTO;
import com.blogsphere.entity.Comment;
import com.blogsphere.entity.Post;
import com.blogsphere.entity.User;
import com.blogsphere.exception.BlogAPIException;
import com.blogsphere.exception.ResourceNotFoundException;
import com.blogsphere.mapper.CommentMapper;
import com.blogsphere.repository.CommentRepository;
import com.blogsphere.repository.PostRepository;
import com.blogsphere.repository.UserRepository;
import com.blogsphere.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommentMapper commentMapper;

    @Override
    public CommentDTO createComment(CommentDTO commentDTO, Long userId) {
        Post post = postRepository.findById(commentDTO.getPostId())
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", commentDTO.getPostId()));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Comment comment = Comment.builder()
                .text(commentDTO.getText())
                .post(post)
                .user(user)
                .build();

        // If it is a nested reply to another comment
        if (commentDTO.getParentCommentId() != null) {
            Comment parent = commentRepository.findById(commentDTO.getParentCommentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentDTO.getParentCommentId()));
            comment.setParentComment(parent);
        }

        Comment savedComment = commentRepository.save(comment);
        return commentMapper.toDTO(savedComment);
    }

    @Override
    public CommentDTO updateComment(CommentDTO commentDTO, Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));

        // Authorize: Only Comment Owner can edit
        if (!comment.getUser().getId().equals(userId)) {
            throw new BlogAPIException(HttpStatus.FORBIDDEN, "You are not authorized to edit this comment");
        }

        comment.setText(commentDTO.getText());
        comment.setUpdatedAt(LocalDateTime.now());

        Comment updatedComment = commentRepository.save(comment);
        return commentMapper.toDTO(updatedComment);
    }

    @Override
    public void deleteComment(Long commentId, Long userId, String userRole) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));

        // Authorize: Only Owner or ADMIN can delete
        if (!comment.getUser().getId().equals(userId) && !"ADMIN".equals(userRole)) {
            throw new BlogAPIException(HttpStatus.FORBIDDEN, "You are not authorized to delete this comment");
        }

        commentRepository.delete(comment);
    }

    @Override
    public List<CommentDTO> getCommentsByPostId(Long postId) {
        // Double check post exists
        if (!postRepository.existsById(postId)) {
            throw new ResourceNotFoundException("Post", "id", postId);
        }

        List<Comment> comments = commentRepository.findByPostId(postId);
        return comments.stream()
                .map(commentMapper::toDTO)
                .collect(Collectors.toList());
    }
}
