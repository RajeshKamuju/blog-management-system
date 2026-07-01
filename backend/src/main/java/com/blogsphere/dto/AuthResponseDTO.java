package com.blogsphere.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponseDTO {
    private String token;
    private Long id;
    private String name;
    private String username;
    private String email;
    private String role;
    private String profileImage;
    private LocalDateTime createdAt;
}
