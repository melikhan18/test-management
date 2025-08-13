package com.test.backend.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Swagger/OpenAPI configuration for the Test Management System.
 * Provides API documentation and testing interface.
 */
@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI testManagementOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Test Management System API")
                        .description("API documentation for Test Management System - A comprehensive platform for managing test cases, projects, and company workflows")
                        .version("v1.0.0")
                        .contact(new Contact()
                                .name("Test Management Team")
                                .email("support@testmanagement.com")
                                .url("https://testmanagement.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .in(SecurityScheme.In.HEADER)
                                        .name("Authorization")));
    }
}
