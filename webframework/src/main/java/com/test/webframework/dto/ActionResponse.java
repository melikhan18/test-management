package com.test.webframework.dto;

import java.time.LocalDateTime;

import com.test.webframework.enums.ActionResultEnum;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ActionResponse {
    private ActionResultEnum result;
    private String message;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}