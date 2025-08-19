package com.test.webframework.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class CustomException extends RuntimeException {
    private final HttpStatus status;
    private final String code;

    public CustomException(String message, HttpStatus status) {
        super(message);
        this.status = status;
        this.code = status.name();
    }

    public CustomException(String message, HttpStatus status, String code) {
        super(message);
        this.status = status;
        this.code = code;
    }

    public CustomException(String message, Throwable cause, HttpStatus status) {
        super(message, cause);
        this.status = status;
        this.code = status.name();
    }
}
