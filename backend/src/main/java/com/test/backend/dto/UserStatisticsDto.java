package com.test.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for user statistics.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserStatisticsDto {
    private long total;
    private long admins;
    private long moderators;
    private long users;
}
