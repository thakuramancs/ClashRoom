package com.egame.backend.controllers;

import com.egame.backend.models.Users;
import com.egame.backend.services.CustomUserDetailsService;
import com.egame.backend.dto.ErrorResponse;
import com.egame.backend.dto.BanRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    private final CustomUserDetailsService userDetailsService;

    public UserController(CustomUserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<Users> users = userDetailsService.findAll();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUser(@PathVariable String id) {
        try {
            return userDetailsService.findByUsername(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}/ban")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateBanStatus(
            @PathVariable Long id,
            @RequestBody BanRequest request) {
        try {
            System.out.println("Received ban request for user ID: " + id);
            System.out.println("Ban action: " + request.getAction());
            
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String adminUsername = auth.getName();
            System.out.println("Admin username: " + adminUsername);
            
            // Get the target user being banned
            Users targetUser = userDetailsService.findById(id)
                .orElseThrow(() -> new RuntimeException("Target user not found"));
            
            // Prevent admin from banning themselves
            if (targetUser.getUsername().equals(adminUsername)) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Cannot ban yourself"));
            }

            switch (request.getAction()) {
                case "PERMANENT_BAN":
                    userDetailsService.banUser(id, null);
                    break;
                case "TEMPORARY_BAN":
                    LocalDateTime expirationTime = LocalDateTime.now().plusHours(24);
                    userDetailsService.banUser(id, expirationTime);
                    break;
                case "UNBAN":
                    userDetailsService.unbanUser(id);
                    break;
                default:
                    return ResponseEntity.badRequest()
                        .body(new ErrorResponse("Invalid ban action"));
            }
            
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("Ban error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                .body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            return userDetailsService.findByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse(e.getMessage()));
        }
    }
}