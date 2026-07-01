package com.blogsphere.controller;

import com.blogsphere.dto.UserDTO;
import com.blogsphere.entity.User;
import com.blogsphere.repository.UserRepository;
import com.blogsphere.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null) return null;
        return userRepository.findByEmail(authentication.getName()).orElse(null);
    }

    // GET /api/users/profile - Get profile for the currently logged-in user
    @GetMapping("/profile")
    public ResponseEntity<UserDTO> getUserProfile(Authentication authentication) {
        User currentUser = getAuthenticatedUser(authentication);
        if (currentUser == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        UserDTO profile = userService.getUserProfile(currentUser.getId());
        return ResponseEntity.ok(profile);
    }

    // PUT /api/users/profile - Update profile details
    @PutMapping("/profile")
    public ResponseEntity<Map<String, Object>> updateUserProfile(
            @RequestBody Map<String, Object> requestPayload,
            Authentication authentication
    ) {
        User currentUser = getAuthenticatedUser(authentication);
        if (currentUser == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        // Extract values from request
        String name = (String) requestPayload.get("name");
        String username = (String) requestPayload.get("username");
        String profileImage = (String) requestPayload.get("profileImage");
        String password = (String) requestPayload.get("password");

        UserDTO updateDTO = UserDTO.builder()
                .name(name)
                .username(username)
                .profileImage(profileImage)
                .build();

        UserDTO updated = userService.updateUserProfile(updateDTO, password, currentUser.getId());
        return ResponseEntity.ok(Map.of("message", "Profile updated successfully", "user", updated));
    }
}
