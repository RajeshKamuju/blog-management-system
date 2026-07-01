package com.blogsphere.repository;

import com.blogsphere.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {
    Long countByPostId(Long postId);
    Optional<Like> findByPostIdAndUserId(Long postId, Long userId);
    Boolean existsByPostIdAndUserId(Long postId, Long userId);
}
