package com.blogsphere.mapper;

import com.blogsphere.entity.User;
import com.blogsphere.dto.UserDTO;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserDTO toDTO(User user) {
        if (user == null) return null;
        return UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .profileImage(user.getProfileImage())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public User toEntity(UserDTO dto) {
        if (dto == null) return null;
        return User.builder()
                .id(dto.getId())
                .name(dto.getName())
                .username(dto.getUsername())
                .email(dto.getEmail())
                .role(dto.getRole())
                .profileImage(dto.getProfileImage())
                .createdAt(dto.getCreatedAt())
                .build();
    }
}
