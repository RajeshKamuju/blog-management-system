package com.blogsphere.controller;

import com.blogsphere.dto.PostDTO;
import com.blogsphere.entity.User;
import com.blogsphere.exception.BlogAPIException;
import com.blogsphere.repository.UserRepository;
import com.blogsphere.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null) return null;
        return userRepository.findByEmail(authentication.getName()).orElse(null);
    }

    // GET /api/posts - Fetch posts (paginated, sorted, optionally filtered by category, search, or author)
    @GetMapping
    public ResponseEntity<Page<PostDTO>> getAllPosts(
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "authorId", required = false) Long authorId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sortBy", defaultValue = "createdAt") String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "desc") String sortDir,
            Authentication authentication
    ) {
        User currentUser = getAuthenticatedUser(authentication);
        Long currentUserId = currentUser != null ? currentUser.getId() : null;

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<PostDTO> posts = postService.getAllPosts(category, search, authorId, pageable, currentUserId);
        return ResponseEntity.ok(posts);
    }

    // GET /api/posts/search - Search posts query
    @GetMapping("/search")
    public ResponseEntity<List<PostDTO>> searchPostsFlat(@RequestParam("q") String query) {
        List<PostDTO> results = postService.searchPostsFlat(query);
        return ResponseEntity.ok(results);
    }

    // GET /api/posts/{id} - Fetch single post
    @GetMapping("/{id}")
    public ResponseEntity<PostDTO> getPostById(@PathVariable("id") Long id, Authentication authentication) {
        User currentUser = getAuthenticatedUser(authentication);
        Long currentUserId = currentUser != null ? currentUser.getId() : null;
        PostDTO postDTO = postService.getPostById(id, currentUserId);
        return ResponseEntity.ok(postDTO);
    }

    // POST /api/posts - Create post
    @PostMapping
    public ResponseEntity<PostDTO> createPost(@RequestBody PostDTO postDTO, Authentication authentication) {
        User currentUser = getAuthenticatedUser(authentication);
        if (currentUser == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        PostDTO created = postService.createPost(postDTO, currentUser.getId());
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // PUT /api/posts/{id} - Edit post
    @PutMapping("/{id}")
    public ResponseEntity<PostDTO> updatePost(
            @PathVariable("id") Long id,
            @RequestBody PostDTO postDTO,
            Authentication authentication
    ) {
        User currentUser = getAuthenticatedUser(authentication);
        if (currentUser == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        PostDTO updated = postService.updatePost(postDTO, id, currentUser.getId(), currentUser.getRole());
        return ResponseEntity.ok(updated);
    }

    // DELETE /api/posts/{id} - Delete post
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deletePost(@PathVariable("id") Long id, Authentication authentication) {
        User currentUser = getAuthenticatedUser(authentication);
        if (currentUser == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        postService.deletePost(id, currentUser.getId(), currentUser.getRole());
        return ResponseEntity.ok(Map.of("message", "Post and its comments/likes deleted successfully"));
    }

    // POST /api/posts/{id}/like - Like post
    @PostMapping("/{id}/like")
    public ResponseEntity<Map<String, Object>> likePost(@PathVariable("id") Long id, Authentication authentication) {
        User currentUser = getAuthenticatedUser(authentication);
        if (currentUser == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        Long count = postService.likePost(id, currentUser.getId());
        return ResponseEntity.ok(Map.of("message", "Post liked successfully", "likesCount", count));
    }

    // DELETE /api/posts/{id}/unlike - Unlike post
    @DeleteMapping("/{id}/unlike")
    public ResponseEntity<Map<String, Object>> unlikePost(@PathVariable("id") Long id, Authentication authentication) {
        User currentUser = getAuthenticatedUser(authentication);
        if (currentUser == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        Long count = postService.unlikePost(id, currentUser.getId());
        return ResponseEntity.ok(Map.of("message", "Post unliked successfully", "likesCount", count));
    }

    // GET /api/posts/{id}/like-status - Check like status for currently logged-in user
    @GetMapping("/{id}/like-status")
    public ResponseEntity<Map<String, Boolean>> getLikeStatus(@PathVariable("id") Long id, Authentication authentication) {
        User currentUser = getAuthenticatedUser(authentication);
        Long currentUserId = currentUser != null ? currentUser.getId() : null;
        Boolean status = postService.getLikeStatus(id, currentUserId);
        return ResponseEntity.ok(Map.of("liked", status));
    }
}
