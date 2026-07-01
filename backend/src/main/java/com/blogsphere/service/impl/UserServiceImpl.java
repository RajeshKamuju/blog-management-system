package com.blogsphere.service.impl;

import com.blogsphere.dto.UserDTO;
import com.blogsphere.entity.User;
import com.blogsphere.exception.BlogAPIException;
import com.blogsphere.exception.ResourceNotFoundException;
import com.blogsphere.mapper.UserMapper;
import com.blogsphere.repository.UserRepository;
import com.blogsphere.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserMapper userMapper;

    @Override
    public UserDTO getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return userMapper.toDTO(user);
    }

    @Override
    public UserDTO updateUserProfile(UserDTO userDTO, String newPassword, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Check if username changed and is unique
        if (userDTO.getUsername() != null && !userDTO.getUsername().equalsIgnoreCase(user.getUsername())) {
            if (userRepository.existsByUsername(userDTO.getUsername())) {
                throw new BlogAPIException(HttpStatus.BAD_REQUEST, "Username already in use!");
            }
            user.setUsername(userDTO.getUsername());
        }

        if (userDTO.getName() != null) {
            user.setName(userDTO.getName());
        }
        if (userDTO.getProfileImage() != null) {
            user.setProfileImage(userDTO.getProfileImage());
        }
        if (newPassword != null && !newPassword.trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(newPassword));
        }

        User updatedUser = userRepository.save(user);
        return userMapper.toDTO(updatedUser);
    }
}
