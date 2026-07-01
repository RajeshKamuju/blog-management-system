package com.blogsphere.controller;

import com.blogsphere.dto.AuthResponseDTO;
import com.blogsphere.dto.UserLoginDTO;
import com.blogsphere.dto.UserRegistrationDTO;
import com.blogsphere.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody UserRegistrationDTO registrationDTO) {
        String response = authService.register(registrationDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody UserLoginDTO loginDTO) {
        AuthResponseDTO authResponseDTO = authService.login(loginDTO);
        return ResponseEntity.ok(authResponseDTO);
    }
}
