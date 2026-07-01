package com.blogsphere.mapper;

import com.blogsphere.entity.Post;
import com.blogsphere.dto.PostDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class PostMapper {

    @Autowired
    private UserMapper userMapper;

    public PostDTO toDTO(Post post) {
        if (post == null) return null;
        return PostDTO.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .excerpt(post.getExcerpt())
                .category(post.getCategory())
                .imageUrl(post.getImageUrl())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .author(userMapper.toDTO(post.getAuthor()))
                .likesCount((long) (post.getLikes() != null ? post.getLikes().size() : 0))
                .likedByCurrentUser(false) // Settable in the service based on context
                .build();
    }
}
