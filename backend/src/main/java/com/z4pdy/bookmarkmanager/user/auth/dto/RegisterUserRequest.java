package com.z4pdy.bookmarkmanager.user.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterUserRequest(
    @NotBlank(message = "Username is required")
    String username,
    @Email(message = "Invalid email address")
    @NotBlank(message = "Email is required")
    String email,
    @NotBlank(message = "Password is required")
    String password
) {}
