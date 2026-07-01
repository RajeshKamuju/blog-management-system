package com.blogsphere.service;

import com.blogsphere.dto.UserDTO;

public interface UserService {
    UserDTO getUserProfile(Long userId);
    UserDTO updateUserProfile(UserDTO userDTO, String newPassword, Long userId);
}
