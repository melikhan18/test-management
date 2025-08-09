package com.test.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for authentication operations.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    
    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
    private Long expiresIn;
    private UserDto user;
    
    public AuthResponse(String accessToken, String refreshToken, Long expiresIn, UserDto user) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.expiresIn = expiresIn;
        this.user = user;
    }
}
