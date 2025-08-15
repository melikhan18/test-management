package com.test.backend.controller;

import com.test.backend.dto.UserDto;
import com.test.backend.entity.CompanyMember;
import com.test.backend.entity.User;
import com.test.backend.enums.UserRole;
import com.test.backend.repository.CompanyMemberRepository;
import com.test.backend.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * User management controller with role-based access control.
 */
@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "User Management", description = "User management endpoints with role-based access")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CompanyMemberRepository companyMemberRepository;

    @Operation(
            summary = "Get All Users",
            description = "Get list of all users (Admin and Moderator only)"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Users retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "401", description = "User not authenticated")
    })
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserDto> userDtos = users.stream()
                .map(user -> new UserDto(user.getId(), user.getUsername(), user.getSurname(), user.getEmail(), user.getRole()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(userDtos);
    }

    @Operation(
            summary = "Update User Role",
            description = "Update user role (Admin only)"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User role updated successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "401", description = "User not authenticated")
    })
    @PutMapping("/{userId}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> updateUserRole(@PathVariable Long userId, @RequestBody UserRole newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setRole(newRole);
        userRepository.save(user);
        
        UserDto userDto = new UserDto(user.getId(), user.getUsername(), user.getSurname(), user.getEmail(), user.getRole());
        return ResponseEntity.ok(userDto);
    }

    @Operation(
            summary = "Get My Company Memberships",
            description = "Get current user's company memberships for debugging"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Memberships retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "User not authenticated")
    })
    @GetMapping("/my-companies")
    public ResponseEntity<?> getMyCompanies(Authentication authentication) {
        String userEmail = authentication.getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<CompanyMember> memberships = companyMemberRepository.findByUser(user);
        
        List<Object> result = memberships.stream()
                .map(membership -> {
                    return new Object() {
                        public Long companyId = membership.getCompany().getId();
                        public String companyName = membership.getCompany().getName();
                        public String role = membership.getRole().toString();
                        public String joinedAt = membership.getJoinedAt().toString();
                    };
                })
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(result);
    }

    @Operation(
            summary = "Delete User",
            description = "Delete a user (Admin only)"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User deleted successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "401", description = "User not authenticated")
    })
    @DeleteMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found");
        }
        
        userRepository.deleteById(userId);
        return ResponseEntity.ok("User deleted successfully");
    }
}
