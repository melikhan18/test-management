package com.test.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for creating a new project.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateProjectRequest {
    
    private String name;
    private String description;
}
