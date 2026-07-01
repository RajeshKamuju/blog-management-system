package com.blogsphere.mapper;

import com.blogsphere.entity.Comment;
import com.blogsphere.dto.CommentDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CommentMapper {

    @Autowired
    private UserMapper userMapper;

    public CommentDTO toDTO(Comment comment) {
        if (comment == null) return null;
        return CommentDTO.builder()
                .id(comment.getId())
                .text(comment.getText())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .userId(comment.getUser() != null ? comment.getUser().getId() : null)
                .postId(comment.getPost() != null ? comment.getPost().getId() : null)
                .parentCommentId(comment.getParentComment() != null ? comment.getParentComment().getId() : null)
                .user(userMapper.toDTO(comment.getUser()))
                .build();
    }
}
