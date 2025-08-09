package com.test.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for user authentication.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthRequest {
    
    private String email;
    private String password;
}
