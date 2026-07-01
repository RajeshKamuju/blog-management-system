package com.blogsphere.service;

import com.blogsphere.dto.AdminStatsDTO;
import com.blogsphere.dto.UserDTO;
import java.util.List;

public interface AdminService {
    List<UserDTO> getAllUsers();
    UserDTO updateUserRole(Long targetUserId, String newRole);
    void deleteUserAndCascade(Long targetUserId);
    AdminStatsDTO getDashboardStats();
}
