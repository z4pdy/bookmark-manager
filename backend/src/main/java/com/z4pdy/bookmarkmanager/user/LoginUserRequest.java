package com.z4pdy.bookmarkmanager.user;

import jakarta.validation.constraints.NotBlank;

public record LoginUserRequest(
    @NotBlank(message = "Login is required")
    String login,
    @NotBlank(message = "Password is required")
    String password
) {}
