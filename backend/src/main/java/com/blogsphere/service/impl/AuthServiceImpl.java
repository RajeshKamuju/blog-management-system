package com.blogsphere.service.impl;

import com.blogsphere.dto.AuthResponseDTO;
import com.blogsphere.dto.UserLoginDTO;
import com.blogsphere.dto.UserRegistrationDTO;
import com.blogsphere.entity.User;
import com.blogsphere.exception.BlogAPIException;
import com.blogsphere.repository.UserRepository;
import com.blogsphere.security.JwtTokenProvider;
import com.blogsphere.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Override
    public String register(UserRegistrationDTO registrationDTO) {
        // Check if username already exists in database
        if (userRepository.existsByUsername(registrationDTO.getUsername())) {
            throw new BlogAPIException(HttpStatus.BAD_REQUEST, "Username already registered!");
        }

        // Check if email already exists in database
        if (userRepository.existsByEmail(registrationDTO.getEmail())) {
            throw new BlogAPIException(HttpStatus.BAD_REQUEST, "Email address already registered!");
        }

        // Create new User entity and encrypt password
        User user = User.builder()
                .name(registrationDTO.getName())
                .username(registrationDTO.getUsername())
                .email(registrationDTO.getEmail())
                .password(passwordEncoder.encode(registrationDTO.getPassword()))
                .role("USER") // Assign standard member role
                .profileImage("https://api.dicebear.com/7.x/adventurer/svg?seed=" + registrationDTO.getUsername())
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);
        return "User registered successfully!";
    }

    @Override
    public AuthResponseDTO login(UserLoginDTO loginDTO) {
        // Authenticate credentials using Spring Security
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginDTO.getEmail(), loginDTO.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Generate token and load profile details
        String token = jwtTokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> new BlogAPIException(HttpStatus.UNAUTHORIZED, "User profile not found."));

        return AuthResponseDTO.builder()
                .token(token)
                .id(user.getId())
                .name(user.getName())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .profileImage(user.getProfileImage())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
