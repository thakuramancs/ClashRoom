package com.egame.backend.controllers;

import com.egame.backend.dto.AuthResponse;
import com.egame.backend.dto.ErrorResponse;
import com.egame.backend.dto.LoginRequest;
import com.egame.backend.dto.RegisterRequest;
import com.egame.backend.services.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.http.HttpStatus;
import com.egame.backend.models.Users;
import com.egame.backend.repositories.UserRepository;
import com.egame.backend.dto.MessageResponse;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    private final AuthService authService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            AuthResponse response = authService.registerUser(registerRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity
                .badRequest()
                .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity
                .badRequest()
                .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/register/admin")
    public ResponseEntity<?> registerAdmin(@RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.registerAdmin(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity
                .badRequest()
                .body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/check-ban")
    public ResponseEntity<?> checkBanStatus(@AuthenticationPrincipal UserDetails userDetails) {
        Users user = userRepository.findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));
            
        if (user.getBanned()) {
            String message = user.getBanExpiration() == null ? 
                "Your account has been permanently banned" :
                "Your account is banned until " + user.getBanExpiration();
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse(message));
        }
        
        return ResponseEntity.ok().build();
    }
} 