package com.blogsphere.controller;

import com.blogsphere.dto.AdminStatsDTO;
import com.blogsphere.dto.UserDTO;
import com.blogsphere.entity.User;
import com.blogsphere.repository.UserRepository;
import com.blogsphere.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null) return null;
        return userRepository.findByEmail(authentication.getName()).orElse(null);
    }

    // GET /api/admin/users - Get registered accounts list
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // PUT /api/admin/users/{id}/role - Change user permission role
    @PutMapping("/users/{id}/role")
    public ResponseEntity<Map<String, Object>> updateUserRole(
            @PathVariable("id") Long targetUserId,
            @RequestBody Map<String, String> rolePayload,
            Authentication authentication
    ) {
        User currentUser = getAuthenticatedUser(authentication);
        if (currentUser != null && currentUser.getId().equals(targetUserId)) {
            return new ResponseEntity<>(Map.of("error", "You cannot revoke your own admin permissions"), HttpStatus.BAD_REQUEST);
        }

        String role = rolePayload.get("role");
        UserDTO updated = adminService.updateUserRole(targetUserId, role);
        return ResponseEntity.ok(Map.of("message", "User role updated successfully", "user", updated));
    }

    // DELETE /api/admin/users/{id} - Delete user account and cascade delete their materials
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(
            @PathVariable("id") Long targetUserId,
            Authentication authentication
    ) {
        User currentUser = getAuthenticatedUser(authentication);
        if (currentUser != null && currentUser.getId().equals(targetUserId)) {
            return new ResponseEntity<>(Map.of("error", "You cannot delete your own admin account"), HttpStatus.BAD_REQUEST);
        }

        adminService.deleteUserAndCascade(targetUserId);
        return ResponseEntity.ok(Map.of("message", "User and their related data deleted successfully"));
    }

    // GET /api/admin/stats - Admin Dashboard stats
    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDTO> getAdminStats() {
        AdminStatsDTO stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }
}
