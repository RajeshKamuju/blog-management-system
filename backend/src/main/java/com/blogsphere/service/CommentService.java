package com.blogsphere.service;

import com.blogsphere.dto.CommentDTO;
import java.util.List;

public interface CommentService {
    CommentDTO createComment(CommentDTO commentDTO, Long userId);
    CommentDTO updateComment(CommentDTO commentDTO, Long commentId, Long userId);
    void deleteComment(Long commentId, Long userId, String userRole);
    List<CommentDTO> getCommentsByPostId(Long postId);
}
