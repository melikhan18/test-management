package com.test.webframework.controller;

import com.test.webframework.exception.CustomException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1")
@Tag(name = "Test Controller", description = "Test endpoints for demonstrating exception handling and Swagger")
public class TestController {

    @Operation(summary = "Health check endpoint", description = "Returns the health status of the application")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Application is healthy"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", LocalDateTime.now());
        response.put("service", "webframework");
        response.put("version", "1.0.0");
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Echo message", description = "Returns the provided message")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Message echoed successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/echo")
    public ResponseEntity<EchoResponse> echo(
            @Valid @RequestBody EchoRequest request) {
        
        log.info("Echo request received: {}", request.getMessage());
        
        EchoResponse response = new EchoResponse();
        response.setOriginalMessage(request.getMessage());
        response.setEchoMessage("Echo: " + request.getMessage());
        response.setTimestamp(LocalDateTime.now());
        
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Test custom exception", description = "Throws a custom exception for testing error handling")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "404", description = "Resource not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/test-error")
    public ResponseEntity<String> testError(
            @Parameter(description = "Error type to simulate", example = "NOT_FOUND")
            @RequestParam(defaultValue = "NOT_FOUND") String errorType) {
        
        switch (errorType.toUpperCase()) {
            case "NOT_FOUND":
                throw new CustomException("Resource not found", HttpStatus.NOT_FOUND);
            case "BAD_REQUEST":
                throw new CustomException("Invalid request", HttpStatus.BAD_REQUEST, "INVALID_REQUEST");
            case "UNAUTHORIZED":
                throw new CustomException("Unauthorized access", HttpStatus.UNAUTHORIZED);
            default:
                throw new RuntimeException("Unexpected error occurred");
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EchoRequest {
        @NotBlank(message = "Message cannot be blank")
        @Size(min = 1, max = 255, message = "Message must be between 1 and 255 characters")
        private String message;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EchoResponse {
        private String originalMessage;
        private String echoMessage;
        private LocalDateTime timestamp;
    }
}
