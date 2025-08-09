package com.test.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for user registration.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    
    private String username;
    private String surname;
    private String email;
    private String password;
}
