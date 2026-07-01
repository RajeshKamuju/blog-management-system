package com.blogsphere.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class UserDTO {
    private Long id;
    private String name;
    private String username;
    private String email;
    private String role;
    private String profileImage;
    private LocalDateTime createdAt;
}
