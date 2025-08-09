package com.test.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Health check controller for API status monitoring.
 */
@RestController
@RequestMapping("/api/v1/health")
@Tag(name = "Health Check", description = "API health monitoring endpoints")
public class HealthController {

    @Operation(
            summary = "Health Check",
            description = "Returns the current status and timestamp of the API"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "API is healthy and running"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", LocalDateTime.now());
        response.put("service", "Test Management System");
        response.put("version", "1.0.0");
        
        return ResponseEntity.ok(response);
    }
}
