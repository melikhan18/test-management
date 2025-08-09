package com.test.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for user information.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    
    private Long id;
    private String username;
    private String surname;
    private String email;
}
