package com.blogsphere.controller;

import com.blogsphere.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class CategoryController {

    @Autowired
    private PostService postService;

    // GET /api/categories
    @GetMapping("/categories")
    public ResponseEntity<List<Map<String, Object>>> getCategories() {
        return ResponseEntity.ok(postService.getCategories());
    }

    // GET /api/tags
    @GetMapping("/tags")
    public ResponseEntity<List<Map<String, Object>>> getTags() {
        return ResponseEntity.ok(postService.getTags());
    }
}
