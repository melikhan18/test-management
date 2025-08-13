package com.test.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for creating a new company.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateCompanyRequest {
    
    private String name;
}
