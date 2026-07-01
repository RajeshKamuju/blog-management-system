package com.blogsphere.controller;

import com.blogsphere.dto.CommentDTO;
import com.blogsphere.entity.User;
import com.blogsphere.repository.UserRepository;
import com.blogsphere.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null) return null;
        return userRepository.findByEmail(authentication.getName()).orElse(null);
    }

    // GET /api/comments/post/{postId} - Fetch comments for a specific blog post
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByPostId(@PathVariable("postId") Long postId) {
        List<CommentDTO> comments = commentService.getCommentsByPostId(postId);
        return ResponseEntity.ok(comments);
    }

    // POST /api/comments - Add a new comment (or reply)
    @PostMapping
    public ResponseEntity<CommentDTO> createComment(@RequestBody CommentDTO commentDTO, Authentication authentication) {
        User currentUser = getAuthenticatedUser(authentication);
        if (currentUser == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        CommentDTO created = commentService.createComment(commentDTO, currentUser.getId());
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // PUT /api/comments/{id} - Edit comment text
    @PutMapping("/{id}")
    public ResponseEntity<CommentDTO> updateComment(
            @PathVariable("id") Long id,
            @RequestBody CommentDTO commentDTO,
            Authentication authentication
    ) {
        User currentUser = getAuthenticatedUser(authentication);
        if (currentUser == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        CommentDTO updated = commentService.updateComment(commentDTO, id, currentUser.getId());
        return ResponseEntity.ok(updated);
    }

    // DELETE /api/comments/{id} - Delete a comment
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteComment(@PathVariable("id") Long id, Authentication authentication) {
        User currentUser = getAuthenticatedUser(authentication);
        if (currentUser == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        commentService.deleteComment(id, currentUser.getId(), currentUser.getRole());
        return ResponseEntity.ok(Map.of("message", "Comment and its replies deleted successfully"));
    }
}
