package com.test.backend.controller;

import com.test.backend.dto.AuthRequest;
import com.test.backend.dto.AuthResponse;
import com.test.backend.dto.RegisterRequest;
import com.test.backend.dto.UserDto;
import com.test.backend.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication controller for user login and registration.
 */
@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "User authentication endpoints")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Operation(
            summary = "User Login",
            description = "Authenticate user and return JWT token"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login successful"),
            @ApiResponse(responseCode = "401", description = "Invalid credentials"),
            @ApiResponse(responseCode = "400", description = "Bad request")
    })
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        AuthResponse response = authService.authenticate(request);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "User Registration",
            description = "Register a new user account"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Registration successful"),
            @ApiResponse(responseCode = "400", description = "User already exists or invalid data"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Refresh Token",
            description = "Refresh JWT token using refresh token"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Token refreshed successfully"),
            @ApiResponse(responseCode = "401", description = "Invalid refresh token")
    })
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestHeader("Authorization") String refreshToken) {
        String token = refreshToken.substring(7); // Remove "Bearer " prefix
        AuthResponse response = authService.refreshToken(token);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Get Current User",
            description = "Get current authenticated user information"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User information retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "User not authenticated")
    })
    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7); // Remove "Bearer " prefix
        UserDto user = authService.getCurrentUser(token);
        return ResponseEntity.ok(user);
    }
}
