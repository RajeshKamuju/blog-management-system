package com.blogsphere.service;

import com.blogsphere.dto.AuthResponseDTO;
import com.blogsphere.dto.UserLoginDTO;
import com.blogsphere.dto.UserRegistrationDTO;

public interface AuthService {
    String register(UserRegistrationDTO registrationDTO);
    AuthResponseDTO login(UserLoginDTO loginDTO);
}
