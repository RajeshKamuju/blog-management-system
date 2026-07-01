package com.blogsphere.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminStatsDTO {

    private Summary summary;
    private List<CategoryLikes> popularCategories;
    private List<AuthorPosts> authorsStats;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Summary {
        private Long posts;
        private Long users;
        private Long comments;
        private Long likes;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CategoryLikes {
        private String name;
        private Long likes;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AuthorPosts {
        private String name;
        private Long posts;
    }
}
