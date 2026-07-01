package com.blogsphere.repository;

import com.blogsphere.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    
    Page<Post> findByCategoryIgnoreCase(String category, Pageable pageable);
    
    Page<Post> findByAuthorId(Long authorId, Pageable pageable);
    
    @Query("SELECT p FROM Post p WHERE " +
           "LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.content) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.excerpt) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Post> searchPosts(@Param("query") String query, Pageable pageable);
    
    @Query("SELECT p FROM Post p WHERE " +
           "LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.content) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.excerpt) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Post> searchPostsFlat(@Param("query") String query);

    @Query("SELECT p.category, COUNT(p) FROM Post p GROUP BY p.category")
    List<Object[]> countPostsByCategory();
}
